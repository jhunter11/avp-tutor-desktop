import json
import threading
import unittest
import urllib.error
import urllib.request

from backend.server import make_server
from backend.test_tutor import example


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class FakeProvider:
            def complete(self, messages): return 'Think about the loop condition.'
        cls.server = make_server(0, FakeProvider)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f'http://127.0.0.1:{cls.server.server_port}/api/tutor'

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown(); cls.server.server_close(); cls.thread.join()

    def post(self, body, origin='http://localhost:5173', client='web-v1'):
        request = urllib.request.Request(self.url, data=json.dumps(body).encode(), headers={
            'Content-Type': 'application/json', 'X-Tutor-Client': client, 'Origin': origin,
        })
        try: response = urllib.request.urlopen(request, timeout=3)
        except urllib.error.HTTPError as error: response = error
        with response:
            return response.status, json.load(response)

    def test_success_response_has_only_the_fixed_text_envelope(self):
        status, result = self.post(example())
        self.assertEqual(status, 200)
        self.assertEqual(result, {'schema_version': '1', 'request_id': 'test-request',
                                 'answer': 'Think about the loop condition.', 'error': None})

    def test_invalid_payload_is_rejected_in_the_same_envelope(self):
        status, result = self.post(dict(example(), provider='openai'))
        self.assertEqual(status, 422)
        self.assertEqual(set(result), {'schema_version', 'request_id', 'answer', 'error'})
        self.assertIsNone(result['answer'])

    def test_foreign_origin_or_missing_client_header_is_rejected(self):
        self.assertEqual(self.post(example(), origin='https://other.example')[0], 403)
        self.assertEqual(self.post(example(), client='')[0], 403)
