"""Vendor adapters. No model/provider setting is accepted from the browser."""

import json
import os
import urllib.request
import urllib.error
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from pathlib import Path

from .errors import TutorError


@dataclass
class ProviderConfig:
    name: str
    model: str
    key: str
    free_only: bool = True

    @classmethod
    def from_environment(cls):
        name = os.environ.get('TUTOR_PROVIDER', 'openrouter')
        if name not in ('openrouter', 'openai'):
            raise TutorError('Unsupported backend provider configuration.', 503, 'configuration_error')
        free_only = os.environ.get('TUTOR_ALLOW_PAID') != '1'
        if name != 'openrouter' and free_only:
            raise TutorError('This provider requires explicit paid-provider configuration.', 503, 'configuration_error')
        model = os.environ.get('TUTOR_MODEL', 'nvidia/nemotron-3.5-super-vl:free' if name == 'openrouter' else '')
        key = os.environ.get('OPENROUTER_API_KEY' if name == 'openrouter' else 'OPENAI_API_KEY', '')
        key_file = os.environ.get('TUTOR_API_KEY_FILE')
        if not key and key_file:
            try:
                key = Path(key_file).read_text().strip()
            except OSError:
                pass
        if not model or not key or 'paste' in key.lower() or any(c.isspace() for c in key):
            raise TutorError('Configure the tutor model and API key on the backend.', 503, 'configuration_error')
        return cls(name, model, key, free_only)


class Provider:
    def __init__(self, config, opener=urllib.request.urlopen):
        self.config, self.opener = config, opener

    def check_openrouter(self, has_images):
        with self.opener('https://openrouter.ai/api/v1/models', timeout=20) as response:
            rows = json.loads(response.read(5_000_000))['data']
        entry = next((row for row in rows if row['id'] == self.config.model), None)
        if not entry:
            raise TutorError('The configured model is unavailable.', 503, 'configuration_error')
        prices = entry.get('pricing', {})
        if self.config.free_only and (not {'prompt', 'completion'} <= prices.keys() or any(
            not Decimal(str(v)).is_finite() or Decimal(str(v)) != 0 for v in prices.values()
        )):
            raise TutorError('Free-only mode rejected a model with a listed price.', 503, 'configuration_error')
        if has_images and 'image' not in entry.get('architecture', {}).get('input_modalities', []):
            raise TutorError('The configured model cannot receive screenshots. Choose a vision model.', 503, 'configuration_error')

    def complete(self, messages):
        cfg = self.config
        if cfg.key in json.dumps(messages):
            raise TutorError('Remove credentials from the submitted context.', 422, 'invalid_request')
        try:
            if cfg.name == 'openrouter':
                self.check_openrouter(any(isinstance(m['content'], list) for m in messages))
                endpoint = 'https://openrouter.ai/api/v1/chat/completions'
                body = {'model': cfg.model, 'messages': messages, 'max_tokens': 4096,
                        'provider': {'allow_fallbacks': False, 'require_parameters': True}}
                if cfg.free_only:
                    body['provider']['max_price'] = {k: 0 for k in ['prompt', 'completion', 'request', 'image', 'audio']}
            elif cfg.name == 'openai':
                if cfg.free_only:
                    raise TutorError('Paid-provider configuration is required.', 503, 'configuration_error')
                endpoint = 'https://api.openai.com/v1/responses'
                turns = []
                for m in messages[1:]:
                    content = m['content']
                    if isinstance(content, list):
                        content = [({'type': 'input_text', 'text': p['text']} if p['type'] == 'text'
                                    else {'type': 'input_image', 'image_url': p['image_url']['url']}) for p in content]
                    turns.append({'role': m['role'], 'content': content})
                body = {'model': cfg.model, 'instructions': messages[0]['content'], 'input': turns,
                        'max_output_tokens': 4096, 'store': False}
            else:
                raise TutorError('Unsupported backend provider.', 503, 'configuration_error')
            req = urllib.request.Request(endpoint, data=json.dumps(body).encode(), headers={
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.key,
            })
            with self.opener(req, timeout=120) as response:
                raw = json.loads(response.read(2_000_000))
            if cfg.name == 'openai':
                answer = '\n'.join(p['text'] for item in raw.get('output', []) if item.get('type') == 'message'
                                   for p in item.get('content', []) if p.get('type') == 'output_text')
            else:
                if cfg.free_only and (raw.get('usage') or {}).get('cost') is not None and Decimal(str(raw['usage']['cost'])) != 0:
                    raise TutorError('The provider reported a cost in free-only mode.', 502, 'provider_error')
                answer = raw['choices'][0]['message']['content']
            if not isinstance(answer, str) or cfg.key in answer:
                raise TutorError('The tutor returned an invalid reply.', 502, 'provider_error')
            return answer
        except TutorError:
            raise
        except urllib.error.HTTPError as error:
            messages = {
                401: 'The model service rejected the backend API key.',
                403: 'The backend account cannot access the configured model.',
                404: 'The configured model or provider endpoint is unavailable.',
                429: 'The free model service is rate limited. Please retry later.',
            }
            raise TutorError(messages.get(error.code, f'The model service returned HTTP {error.code}. Please retry.'),
                             502, 'provider_error') from None
        except (OSError, ValueError, KeyError, TypeError, IndexError, InvalidOperation):
            raise TutorError('The model service is unavailable or returned an invalid reply. Please retry.', 502, 'provider_error') from None
