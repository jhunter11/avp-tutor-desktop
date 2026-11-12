"""Serve the built presentation and proxy only its local RAG endpoints."""
import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import urllib.error
import urllib.parse
import urllib.request
from .rag_server import make_server as make_api


def make_server(site, port=5192, api_port=8783):
    root = Path(site).resolve()
    if not (root/'index.html').is_file():
        raise ValueError('Built page missing. Use the presentation ZIP or run npm run build.')

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(root), **kwargs)

        def log_message(self, *args):
            pass

        def list_directory(self, path):
            self.send_error(404)
            return None

        def failure(self, code, message):
            body = json.dumps({'error':message}).encode()
            self.send_response(code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def proxy(self):
            data = None
            if self.command == 'POST':
                try:
                    length = int(self.headers.get('Content-Length', '0'))
                except ValueError:
                    return self.failure(422, 'Invalid request length.')
                if not 0 < length <= 6000:
                    return self.failure(413, 'Question request is too large or empty.')
                data = self.rfile.read(length)
            headers = {key:self.headers[key] for key in ('Content-Type','X-RAG-Client','Origin') if key in self.headers}
            request = urllib.request.Request(f'http://127.0.0.1:{api_port}{self.path}', data=data, headers=headers)
            try:
                try:
                    response = urllib.request.urlopen(request, timeout=30)
                except urllib.error.HTTPError as error:
                    response = error
                with response:
                    body = response.read()
                    self.send_response(response.code)
                    self.send_header('Content-Type', response.headers.get('Content-Type', 'application/json'))
                    self.send_header('Content-Length', str(len(body)))
                    self.send_header('Cache-Control', 'no-store')
                    self.end_headers()
                    self.wfile.write(body)
            except OSError:
                self.failure(503, 'The local RAG API is unavailable. Restart the presentation.')

        def do_GET(self):
            path = urllib.parse.urlsplit(self.path).path
            if path in ('/health', '/api/rag/status'):
                return self.proxy()
            if path.startswith('/api/'):
                return self.failure(404, 'Unknown endpoint.')
            candidate = Path(self.translate_path(self.path)).resolve()
            if not candidate.is_relative_to(root):
                return self.failure(404, 'Unknown file.')
            return super().do_GET()

        def do_POST(self):
            if self.path != '/api/rag/query':
                return self.failure(404, 'Unknown endpoint.')
            return self.proxy()

    return ThreadingHTTPServer(('127.0.0.1', port), Handler)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--site', default='dist')
    args = parser.parse_args()
    api = make_api(8783)
    try:
        web = make_server(args.site)
    except Exception:
        api.server_close()
        raise
    threading.Thread(target=api.serve_forever, daemon=True).start()
    print('AVP RAG presentation: http://127.0.0.1:5192/\nPress Ctrl+C to stop.', flush=True)
    try:
        web.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        web.server_close()
        api.shutdown()
        api.server_close()


if __name__ == '__main__':
    main()
