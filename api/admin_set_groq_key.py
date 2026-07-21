import json
import os
from http.server import BaseHTTPRequestHandler
import jwt
from supabase import create_client


def _get_token_from_headers_or_cookies(headers):
    auth = headers.get('Authorization')
    if auth and auth.startswith('Bearer '):
        return auth.split(' ', 1)[1]
    cookie = headers.get('Cookie', '')
    for part in cookie.split(';'):
        if '=' in part:
            k, v = part.strip().split('=', 1)
            if k == 'admin_token':
                return v
    return None


class handler(BaseHTTPRequestHandler):
    def _send_json(self, code, payload):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def _verify(self):
        token = _get_token_from_headers_or_cookies(self.headers)
        secret = os.environ.get('ADMIN_JWT_SECRET')
        if not token or not secret:
            return False, 'Missing auth token or server secret'
        try:
            decoded = jwt.decode(token, secret, algorithms=['HS256'])
            if decoded.get('role') == 'admin':
                return True, decoded
            return False, 'Invalid role'
        except Exception as e:
            return False, str(e)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        ok, info = self._verify()
        if not ok:
            return self._send_json(401, {'success': False, 'error': info})

        try:
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            data = json.loads(body or b'{}')
            new_key = data.get('groq_api_key')
            if not new_key:
                return self._send_json(400, {'success': False, 'error': 'Missing groq_api_key'})

            url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            if not url or not key:
                return self._send_json(500, {'success': False, 'error': 'Supabase not configured'})

            supabase = create_client(url, key)

            # Upsert into a simple settings table with key 'groq_api_key'
            existing = supabase.table('settings').select('*').eq('key', 'groq_api_key').execute()
            data_resp = existing.data if hasattr(existing, 'data') else existing[0]
            if data_resp and len(data_resp) > 0:
                supabase.table('settings').update({'value': new_key}).eq('key', 'groq_api_key').execute()
            else:
                supabase.table('settings').insert([{'key': 'groq_api_key', 'value': new_key}]).execute()

            return self._send_json(200, {'success': True})

        except Exception as e:
            return self._send_json(500, {'success': False, 'error': str(e)})
