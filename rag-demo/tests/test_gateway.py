import copy,json,unittest,threading,urllib.request
from pathlib import Path
from backend.tutor import build_messages,reply
class FakeProvider:
 def __init__(self):self.messages=None
 def complete(self,messages):self.messages=messages;return 'Which final index is permitted by that bound?'
def fixture():
 return json.loads(Path('tests/tutor-request.json').read_text())
class GatewayTests(unittest.TestCase):
 def test_retrieved_notes_and_pacing_in_prompt(self):
  d=fixture();d['context']['algorithm']='linear_search';d['question']='last index loop bounds'
  prompt=build_messages(d)
  self.assertIn('reference_notes',prompt[-1]['content'][0]['text'])
  self.assertIn('pointed_question',prompt[-1]['content'][0]['text'])
 def test_fixed_envelope_and_unchanged_input(self):
  d=fixture();before=copy.deepcopy(d);p=FakeProvider();result=reply(d,p)
  self.assertEqual(d,before)
  self.assertEqual(set(result),{'schema_version','request_id','answer','error'})
  self.assertIn('References supplied',result['answer'])
 def test_live_provider_receives_images(self):
  d=fixture();p=FakeProvider();reply(d,p)
  self.assertTrue(any(x['type']=='image_url' for x in p.messages[-1]['content']))
 def test_http_request(self):
  from backend.server import make_server
  server=make_server(0,lambda:FakeProvider());worker=threading.Thread(target=server.serve_forever,daemon=True);worker.start()
  try:
   d=fixture();r=urllib.request.Request(f'http://127.0.0.1:{server.server_port}/api/tutor',data=json.dumps(d).encode(),headers={'Content-Type':'application/json','X-Tutor-Client':'web-v1'})
   with urllib.request.urlopen(r,timeout=5) as response:result=json.load(response)
   self.assertEqual(result['request_id'],d['request_id'])
   self.assertIsNone(result['error'])
  finally:server.shutdown();server.server_close()
