import json
import os
import time
import jwt
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def _send_json(self, code, payload):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body or b'{}')

            senha = data.get('password')
            admin_senha = os.environ.get('ADMIN_PASSWORD')
            jwt_secret = os.environ.get('ADMIN_JWT_SECRET')

            if not admin_senha or not jwt_secret:
                return self._send_json(500, {'success': False, 'error': 'Server not configured'})

            if senha != admin_senha:
                return self._send_json(401, {'success': False, 'error': 'Senha incorreta'})

            payload = {
                'role': 'admin',
                'iat': int(time.time()),
                'exp': int(time.time()) + 3600
            }
            token = jwt.encode(payload, jwt_secret, algorithm='HS256')

            # Set HttpOnly cookie
            cookie = f"admin_token={token}; HttpOnly; Path=/; SameSite=Strict"
            # If running on HTTPS, recommend adding Secure
            if os.environ.get('VERCEL') or os.environ.get('ENV') == 'production':
                cookie += '; Secure'

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Set-Cookie', cookie)
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode('utf-8'))

        except Exception as e:
            self._send_json(500, {'success': False, 'error': str(e)})
