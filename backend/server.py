"""Run locally with python3 -m backend.server. No learner data is logged."""

import argparse
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from .errors import TutorError
from .providers import Provider, ProviderConfig
from .tutor import MAX_BODY, envelope, reply


def make_server(port=8781, provider_factory=lambda: Provider(ProviderConfig.from_environment())):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def send_json(self, status, body):
            raw = json.dumps(body).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(raw)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(raw)

        def do_GET(self):
            if self.path == '/health':
                self.send_json(200, {'status': 'ok', 'schema_version': '1'})
            else:
                self.send_json(404, envelope('', error={'code': 'not_found', 'message': 'Unknown endpoint.'}))

        def do_POST(self):
            request_id = ''
            try:
                if self.path != '/api/tutor':
                    raise TutorError('Unknown endpoint.', 404, 'not_found')
                if self.headers.get('X-Tutor-Client') != 'web-v1' or self.headers.get_content_type() != 'application/json':
                    raise TutorError('Use the tutoring JSON client.', 403, 'forbidden')
                allowed = os.environ.get('TUTOR_ALLOWED_ORIGIN', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
                if self.headers.get('Origin') and self.headers['Origin'] not in allowed:
                    raise TutorError('Unrecognized frontend origin.', 403, 'forbidden')
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= MAX_BODY:
                    raise TutorError('The submitted context is too large or empty.', 413, 'invalid_request')
                data = json.loads(self.rfile.read(length), parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))
                if isinstance(data, dict) and isinstance(data.get('request_id'), str) and len(data['request_id']) <= 100:
                    request_id = data['request_id']
                # Validate before resolving credentials or making any provider request.
                from .tutor import validate_request
                validate_request(data)
                self.send_json(200, reply(data, provider_factory()))
            except TutorError as error:
                self.send_json(error.status, envelope(request_id, error={'code': error.code, 'message': str(error)}))
            except (ValueError, TypeError, RecursionError):
                self.send_json(422, envelope(request_id, error={'code': 'invalid_request', 'message': 'Invalid JSON request.'}))
            except Exception:
                self.send_json(502, envelope(request_id, error={'code': 'provider_error', 'message': 'The tutor could not respond. Please retry.'}))

    return ThreadingHTTPServer(('127.0.0.1', port), Handler)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8781)
    args = parser.parse_args()
    server = make_server(args.port)
    print(f'Tutor API: http://127.0.0.1:{server.server_port}/api/tutor', flush=True)
    server.serve_forever()
