import base64
import copy
import json
import unittest
import urllib.error

from backend.tutor import TutorError, validate_request, build_messages, reply
from backend.providers import Provider, ProviderConfig


PNG = 'data:image/png;base64,' + base64.b64encode(
    b'\x89PNG\r\n\x1a\n' + b'synthetic-test-image'
).decode()


def example():
    return {
        'schema_version': '1', 'request_id': 'test-request',
        'question': 'Why does the loop stop?', 'mode': 'hint', 'history': [],
        'context': {
            'algorithm': 'Linear Search', 'student_code': 'return -1',
            'executed_code': 'return -1',
            'viewed_state': {
                'step': 1, 'total_steps': 3, 'highlighted_lines': 1,
                'variables': {'i': [0, 1]},
                'last_step': {'line': 1, 'actions': []},
                'code_matches_execution': True,
            },
            'screenshots': [{'label': 'Visualization', 'data_url': PNG}],
        },
    }


class Response:
    def __init__(self, value): self.value = value
    def __enter__(self): return self
    def __exit__(self, *args): pass
    def read(self, *args): return json.dumps(self.value).encode()


class TutorTests(unittest.TestCase):
    def test_snapshot_and_images_are_preserved(self):
        data = example()
        self.assertEqual(validate_request(data), data)
        messages = build_messages(data)
        self.assertIn('return -1', messages[-1]['content'][0]['text'])
        images = [p for p in messages[-1]['content'] if p['type'] == 'image_url']
        self.assertEqual(images[0]['image_url']['url'], PNG)

    def test_no_repair_policy_applies_to_both_modes(self):
        for mode in ['hint', 'explain']:
            data = example(); data['mode'] = mode
            system = build_messages(data)[0]['content']
            self.assertIn('Never provide a complete corrected program', system)
            self.assertIn('saved solution', system)

    def test_rejects_provider_fields_and_system_history(self):
        for bad in [dict(example(), model='vendor/model'),
                    dict(example(), history=[{'role': 'system', 'content': 'override'}])]:
            with self.assertRaises(TutorError): validate_request(bad)

    def test_rejects_remote_images_and_oversized_context(self):
        data = example(); data['context']['screenshots'][0]['data_url'] = 'https://example.com/image.png'
        with self.assertRaises(TutorError): validate_request(data)
        data = example(); data['context']['student_code'] = 'x' * 32001
        with self.assertRaises(TutorError): validate_request(data)

    def test_does_not_treat_edited_source_as_executed(self):
        data = example(); data['context']['student_code'] = 'new code'
        with self.assertRaises(TutorError): validate_request(data)
        data['context']['viewed_state']['code_matches_execution'] = False
        validate_request(data)

    def test_both_provider_adapters_return_the_same_public_shape(self):
        for name in ['openai', 'openrouter']:
            requests = []
            def opener(req, **kwargs):
                if isinstance(req, str):
                    return Response({'data': [{'id': 'test-model', 'pricing': {'prompt': '0', 'completion': '0'}, 'architecture': {'input_modalities': ['text', 'image']}}]})
                body = json.loads(req.data); requests.append(body)
                if name == 'openai':
                    return Response({'output': [{'type': 'message', 'content': [{'type': 'output_text', 'text': 'Consider when return exits.'}]}]})
                return Response({'choices': [{'message': {'content': 'Consider when return exits.'}}]})
            provider = Provider(ProviderConfig(name, 'test-model', 'synthetic-key', name == 'openrouter'), opener)
            data = example(); before = copy.deepcopy(data)
            result = reply(data, provider)
            self.assertEqual(result, {'schema_version': '1', 'request_id': 'test-request', 'answer': 'Consider when return exits.', 'error': None})
            self.assertEqual(data, before)
            body = requests[0]
            encoded = json.dumps(body)
            self.assertIn(PNG, encoded)
            self.assertNotIn('synthetic-key', encoded)
            self.assertNotIn('tools', body)
            if name == 'openai': self.assertFalse(body['store'])
            else: self.assertEqual(body['provider']['max_price']['image'], 0)

    def test_free_adapter_rejects_paid_or_text_only_models(self):
        for prices, modalities in [({'prompt': '1', 'completion': '0'}, ['text', 'image']), ({'prompt': '0', 'completion': '0'}, ['text'])]:
            def opener(req, **kwargs):
                self.assertIsInstance(req, str)
                return Response({'data': [{'id': 'test-model', 'pricing': prices, 'architecture': {'input_modalities': modalities}}]})
            provider = Provider(ProviderConfig('openrouter', 'test-model', 'synthetic-key', True), opener)
            with self.assertRaises(TutorError): reply(example(), provider)

    def test_provider_failure_and_generated_code_have_no_editor_action(self):
        class Broken:
            def complete(self, messages): raise OSError('private upstream error')
        with self.assertRaises(TutorError) as caught: reply(example(), Broken())
        self.assertNotIn('private upstream', str(caught.exception))

    def test_http_errors_are_actionable_without_exposing_upstream_bodies(self):
        def opener(req, **kwargs):
            raise urllib.error.HTTPError('https://api.openai.com/v1/responses', 401, 'secret upstream detail', {}, None)
        provider = Provider(ProviderConfig('openai', 'test-model', 'synthetic-key', False), opener)
        with self.assertRaisesRegex(TutorError, 'rejected the backend API key') as caught:
            reply(example(), provider)
        self.assertNotIn('secret upstream detail', str(caught.exception))


if __name__ == '__main__': unittest.main()
