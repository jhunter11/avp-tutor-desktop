import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch
from backend.presentation import make_server
from backend.rag_server import make_server as make_api


class PresentationTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.root = Path(self.directory.name)
        (self.root/'index.html').write_text('<h1>Presentation</h1>')
        (self.root/'media').mkdir()
        (self.root/'media/clip.mp4').write_bytes(b'video-test')
        self.api = make_api(0)
        self.web = make_server(self.root, port=0, api_port=self.api.server_port)
        for server in (self.api, self.web):
            threading.Thread(target=server.serve_forever, daemon=True).start()

    def tearDown(self):
        for server in (self.web, self.api):
            server.shutdown(); server.server_close()
        self.directory.cleanup()

    def request(self, path, data=None, headers=None):
        request = urllib.request.Request(f'http://127.0.0.1:{self.web.server_port}{path}', data=data, headers=headers or {})
        try:
            with urllib.request.urlopen(request, timeout=5) as response:
                return response.status, response.read(), response.headers
        except urllib.error.HTTPError as response:
            return response.code, response.read(), response.headers

    def test_page_and_versioned_video_are_served(self):
        self.assertIn(b'Presentation', self.request('/')[1])
        code, body, headers = self.request('/media/clip.mp4?v=abc')
        self.assertEqual((code, body), (200, b'video-test'))
        self.assertEqual(headers['Content-Type'], 'video/mp4')

    def test_api_reaches_retrieval_and_preserves_client_guard(self):
        with patch('backend.rag_server.ask', return_value={'answer':'source text'}) as ask:
            payload = json.dumps({'question':'How does AVP return?'}).encode()
            headers = {'Content-Type':'application/json', 'X-RAG-Client':'demo-v1'}
            code, body, _ = self.request('/api/rag/query', payload, headers)
            self.assertEqual(code, 200)
            self.assertEqual(json.loads(body)['answer'], 'source text')
            ask.assert_called_once_with('How does AVP return?')
            self.assertEqual(self.request('/api/rag/query', payload, {'Content-Type':'application/json'})[0], 403)

    def test_no_directory_listing_unknown_api_or_traversal(self):
        for path in ('/media/', '/api/tutor', '/%2e%2e/secret.txt'):
            self.assertEqual(self.request(path)[0], 404)

    def test_unavailable_api_returns_clear_failure(self):
        with patch('backend.presentation.urllib.request.urlopen', side_effect=OSError('offline')):
            # Use a separate HTTP client so only the proxy's outgoing call is patched.
            import http.client
            client = http.client.HTTPConnection('127.0.0.1', self.web.server_port, timeout=5)
            client.request('GET', '/health')
            response = client.getresponse()
            self.assertEqual(response.status, 503)
            self.assertIn('unavailable', json.loads(response.read())['error'])
            client.close()
