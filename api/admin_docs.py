import json
import os
from http.server import BaseHTTPRequestHandler
import jwt
from supabase import create_client
from urllib.parse import urlparse, parse_qs


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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        # List documents with optional pagination, search and tag filter
        ok, info = self._verify()
        if not ok:
            return self._send_json(401, {'success': False, 'error': info})

        try:
            # parse query params
            parsed = urlparse(self.path)
            qs = parse_qs(parsed.query)
            page = int(qs.get('page', ['1'])[0])
            per_page = int(qs.get('per_page', ['10'])[0])
            tag = qs.get('tag', [None])[0]
            search = qs.get('search', [None])[0]
            distinct_tags = qs.get('distinct_tags', ['0'])[0] in ('1', 'true', 'True')

            url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            if not url or not key:
                return self._send_json(500, {'success': False, 'error': 'Supabase not configured'})

            supabase = create_client(url, key)

            if distinct_tags:
                # return list of distinct tags
                resp = supabase.table('documentos').select('tags').execute()
                rows = resp.data if hasattr(resp, 'data') else resp[0]
                tags = set()
                for r in rows:
                    t = r.get('tags') or []
                    for it in t:
                        tags.add(it)
                return self._send_json(200, {'success': True, 'tags': sorted(list(tags))})

            start = max((page - 1) * per_page, 0)
            end = start + per_page - 1

            query = supabase.table('documentos').select('*').order('created_at', desc=True)
            if tag:
                # filter by tag contained in tags array
                try:
                    query = query.contains('tags', [tag])
                except Exception:
                    # best-effort: fallback to fetch all and filter in Python
                    pass
            if search:
                try:
                    query = query.ilike('titulo', f'%{search}%')
                except Exception:
                    pass

            resp = query.range(start, end).execute()
            data = resp.data if hasattr(resp, 'data') else resp[0]
            has_more = False
            if isinstance(data, list) and len(data) >= per_page:
                has_more = True

            return self._send_json(200, {'success': True, 'documents': data, 'page': page, 'per_page': per_page, 'has_more': has_more})

        except Exception as e:
            return self._send_json(500, {'success': False, 'error': str(e)})

    def do_PUT(self):
        # Update document
        ok, info = self._verify()
        if not ok:
            return self._send_json(401, {'success': False, 'error': info})

        try:
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            data = json.loads(body or b'{}')
            doc_id = data.get('id')
            updates = {}
            if 'titulo' in data:
                updates['titulo'] = data['titulo']
            if 'conteudo_snippet' in data:
                updates['conteudo_snippet'] = data['conteudo_snippet']
            if 'tags' in data:
                updates['tags'] = data['tags']

            if not doc_id or not updates:
                return self._send_json(400, {'success': False, 'error': 'Missing id or update fields'})

            url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            supabase = create_client(url, key)
            resp = supabase.table('documentos').update(updates).eq('id', doc_id).execute()
            data = resp.data if hasattr(resp, 'data') else resp[0]
            return self._send_json(200, {'success': True, 'updated': data})

        except Exception as e:
            return self._send_json(500, {'success': False, 'error': str(e)})

    def do_DELETE(self):
        ok, info = self._verify()
        if not ok:
            return self._send_json(401, {'success': False, 'error': info})

        try:
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            data = json.loads(body or b'{}')
            doc_id = data.get('id')
            if not doc_id:
                return self._send_json(400, {'success': False, 'error': 'Missing id'})

            url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            supabase = create_client(url, key)
            resp = supabase.table('documentos').delete().eq('id', doc_id).execute()
            return self._send_json(200, {'success': True})

        except Exception as e:
            return self._send_json(500, {'success': False, 'error': str(e)})
