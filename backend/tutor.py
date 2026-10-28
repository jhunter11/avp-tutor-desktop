"""Fixed v1 contract. State and images are supplied evidence, not execution proof."""

import base64
import binascii
import json
from pathlib import Path

from .errors import TutorError

ROOT = Path(__file__).resolve().parent
MAX_BODY = 6_000_000


def fields(value, names, label):
    if not isinstance(value, dict) or set(value) != set(names):
        raise TutorError(f'Invalid {label} fields.')


def text(value, maximum, label, empty=True):
    if not isinstance(value, str) or len(value) > maximum or (not empty and not value.strip()):
        raise TutorError(f'Invalid {label}.')


def validate_request(data):
    fields(data, ['schema_version', 'request_id', 'question', 'mode', 'history', 'context'], 'request')
    if data['schema_version'] != '1' or data['mode'] not in ('hint', 'explain'):
        raise TutorError('Use schema version 1 and Hint or Explain mode.')
    text(data['request_id'], 100, 'request ID', False)
    text(data['question'], 4000, 'question', False)
    history = data['history']
    if not isinstance(history, list) or len(history) > 12:
        raise TutorError('Send at most 12 conversation messages.')
    for turn in history:
        fields(turn, ['role', 'content'], 'history')
        if turn['role'] not in ('user', 'assistant'):
            raise TutorError('History may contain only user and assistant messages.')
        text(turn['content'], 16000, 'history message')
    if sum(len(t['content']) for t in history) > 24000:
        raise TutorError('Start a new conversation; the recent history is too long.')
    ctx = data['context']
    fields(ctx, ['algorithm', 'student_code', 'executed_code', 'viewed_state', 'screenshots'], 'context')
    text(ctx['algorithm'], 500, 'algorithm')
    for key in ['student_code', 'executed_code']:
        text(ctx[key], 32000, key)
    state = ctx['viewed_state']
    fields(state, ['step', 'total_steps', 'highlighted_lines', 'variables', 'last_step', 'code_matches_execution'], 'viewed state')
    if any(type(state[k]) is not int or not 0 <= state[k] <= 1_000_000 for k in ['step', 'total_steps']) or state['step'] > state['total_steps']:
        raise TutorError('Invalid viewed step.')
    if not isinstance(state['variables'], dict) or not isinstance(state['last_step'], dict):
        raise TutorError('Invalid variables or step data.')
    lines = state['highlighted_lines']
    if lines is not None and not (type(lines) is int and lines > 0) and not (
        isinstance(lines, list) and len(lines) == 2 and all(type(n) is int and n > 0 for n in lines)
    ):
        raise TutorError('Invalid highlighted lines.')
    if type(state['code_matches_execution']) is not bool or state['code_matches_execution'] != (ctx['student_code'] == ctx['executed_code']):
        raise TutorError('The code/execution relationship is inconsistent.')
    try:
        if len(json.dumps(state, allow_nan=False)) > 100000:
            raise TutorError('The viewed state is too large.')
    except (ValueError, TypeError, RecursionError):
        raise TutorError('Invalid JSON state.') from None
    images = ctx['screenshots']
    if not isinstance(images, list) or not 1 <= len(images) <= 4:
        raise TutorError('Include 1 to 4 screenshots of the viewed context.')
    for image in images:
        fields(image, ['label', 'data_url'], 'screenshot')
        text(image['label'], 100, 'screenshot label', False)
        url = image['data_url']
        text(url, 1_500_000, 'screenshot')
        prefix = 'data:image/png;base64,'
        if not url.startswith(prefix):
            raise TutorError('Screenshots must be PNG data URLs; remote URLs are not fetched.')
        try:
            raw = base64.b64decode(url[len(prefix):], validate=True)
        except (ValueError, binascii.Error):
            raise TutorError('Invalid screenshot encoding.') from None
        if not raw.startswith(b'\x89PNG\r\n\x1a\n'):
            raise TutorError('Invalid PNG screenshot.')
    return data


def build_messages(data):
    instructions = (ROOT / 'skills/tutor.md').read_text()
    if data['mode'] == 'hint':
        instructions += '\n' + (ROOT / 'skills/hint.md').read_text()
    else:
        instructions += '\nExplain the concept and cause; leave the next implementation step to the student.'
    ctx = {k: v for k, v in data['context'].items() if k != 'screenshots'}
    prompt = json.dumps({'student_question': data['question'], 'help_mode': data['mode'], 'supplied_context': ctx}, ensure_ascii=False)
    content = [{'type': 'text', 'text': prompt}]
    for image in data['context']['screenshots']:
        content.extend([{'type': 'text', 'text': 'Screenshot: ' + image['label']},
                        {'type': 'image_url', 'image_url': {'url': image['data_url']}}])
    return [{'role': 'system', 'content': instructions}, *data['history'], {'role': 'user', 'content': content}]


def envelope(request_id, answer=None, error=None):
    return {'schema_version': '1', 'request_id': request_id, 'answer': answer, 'error': error}


def reply(data, provider):
    validate_request(data)
    try:
        answer = provider.complete(build_messages(data))
    except TutorError:
        raise
    except Exception:
        raise TutorError('The tutor could not respond. Please retry.', 502, 'provider_error') from None
    if not isinstance(answer, str) or not answer.strip() or len(answer) > 16000:
        raise TutorError('The tutor returned an invalid text reply. Please retry.', 502, 'provider_error')
    # The public response has no patch, generated_code, action or tool field.
    return envelope(data['request_id'], answer.strip())
