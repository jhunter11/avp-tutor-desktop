import json
import threading
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch
from backend.rag_server import make_server


class RagHttpTests(unittest.TestCase):
    def setUp(self):
        self.server=make_server(0)
        self.worker=threading.Thread(target=self.server.serve_forever,daemon=True)
        self.worker.start()
    def tearDown(self):
        self.server.shutdown();self.server.server_close()
    def request(self,data,headers=None,path='/api/rag/query'):
        req=urllib.request.Request(f'http://127.0.0.1:{self.server.server_port}'+path,
            data=json.dumps(data).encode(),headers=headers or {'Content-Type':'application/json','X-RAG-Client':'demo-v1'})
        try:
            with urllib.request.urlopen(req,timeout=5) as r:return r.status,json.load(r)
        except urllib.error.HTTPError as r:return r.code,json.load(r)
    def test_json_question_reaches_retrieval(self):
        with patch('backend.rag_server.ask',return_value={'answer':'source text','mode':'offline_source_extract'}) as ask:
            code,body=self.request({'question':'Why sorted?'})
            self.assertEqual(code,200);self.assertEqual(body['mode'],'offline_source_extract')
            ask.assert_called_once_with('Why sorted?')
    def test_no_tutor_contract_change(self):
        code,_=self.request({'question':'hi'},path='/api/tutor')
        self.assertEqual(code,404)
    def test_missing_client_header(self):
        with patch('backend.rag_server.ask') as ask:
            code,_=self.request({'question':'hi'},{'Content-Type':'application/json'})
            self.assertEqual(code,403);ask.assert_not_called()
    def test_extra_fields_rejected(self):
        with patch('backend.rag_server.ask') as ask:
            code,_=self.request({'question':'hi','api_key':'not-a-real-key'})
            self.assertEqual(code,422);ask.assert_not_called()
    def test_foreign_origin_rejected(self):
        with patch('backend.rag_server.ask') as ask:
            code,_=self.request({'question':'hi'},{'Content-Type':'application/json','X-RAG-Client':'demo-v1','Origin':'https://example.org'})
            self.assertEqual(code,403);ask.assert_not_called()
