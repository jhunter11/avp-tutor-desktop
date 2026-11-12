"""Standalone, offline RAG inspection API. Separate from the fixed team tutor API."""
import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from .errors import TutorError
from .vector_rag import ask, status


def make_server(port=8783):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*args):pass
        def send_json(self,code,data):
            raw=json.dumps(data,allow_nan=False).encode()
            self.send_response(code)
            self.send_header('Content-Type','application/json')
            self.send_header('Content-Length',str(len(raw)))
            self.send_header('Cache-Control','no-store')
            self.end_headers()
            try:self.wfile.write(raw)
            except (BrokenPipeError,ConnectionResetError):pass
        def do_GET(self):
            try:
                if self.path not in ['/health','/api/rag/status']:
                    self.send_json(404,{'error':'Unknown endpoint.'});return
                self.send_json(200,{'status':'ok',**status()})
            except TutorError as error:self.send_json(error.status,{'error':str(error)})
            except Exception:self.send_json(503,{'error':'The local source index is unavailable. Rebuild it before retrying.'})
        def do_POST(self):
            try:
                if self.path!='/api/rag/query':
                    self.send_json(404,{'error':'Unknown endpoint.'});return
                if self.headers.get_content_type()!='application/json' or self.headers.get('X-RAG-Client')!='demo-v1':
                    raise TutorError('Use the RAG JSON client.',403)
                origin=self.headers.get('Origin')
                if origin and origin not in ['http://127.0.0.1:5192','http://localhost:5192']:
                    raise TutorError('Unrecognized frontend origin.',403)
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<=6000:raise TutorError('Question request is too large or empty.',413)
                data=json.loads(self.rfile.read(length))
                if not isinstance(data,dict) or set(data)!={'question'}:raise TutorError('Send one question field.')
                self.send_json(200,ask(data['question']))
            except TutorError as error:self.send_json(error.status,{'error':str(error)})
            except (ValueError,TypeError):self.send_json(422,{'error':'Invalid question request.'})
            except Exception:self.send_json(503,{'error':'Local retrieval is unavailable. Check the model environment and source index.'})
    return ThreadingHTTPServer(('127.0.0.1',port),Handler)


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8783)
    server=make_server(parser.parse_args().port)
    print(f'Offline RAG API: http://127.0.0.1:{server.server_port}/api/rag/query',flush=True)
    server.serve_forever()
