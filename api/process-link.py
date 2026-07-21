import json
import re
import os
import requests
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

    def do_POST(self):
        try:
            # Authenticate requester
            ok, info = self._verify()
            if not ok:
                return self._send_json(401, {'sucesso': False, 'erro': 'Unauthorized: ' + str(info)})

            # 1. Lê a URL enviada pelo site
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data or b'{}')
            url_do_drive = dados.get('url', '')

            # 2. Extrai a ID do documento do Google Docs
            match = re.search(r"/d/([a-zA-Z0-9-_]+)", url_do_drive)
            if not match:
                raise Exception("Link inválido. Cole a URL de um documento do Google Docs.")
            doc_id = match.group(1)

            # 3. Baixa o texto puro do documento
            export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=txt"
            req_doc = requests.get(export_url)
            if req_doc.status_code != 200:
                raise Exception("O documento está trancado. Altere o compartilhamento para 'Qualquer pessoa com o link'.")
            
            texto_documento = req_doc.text

            # 4. Configura o Prompt para a IA
            prompt = f"""
            Você é um assistente acadêmico. Analise o texto abaixo e extraia as informações no exato formato JSON.
            Não escreva mais nada, apenas o JSON puro, sem crases de formatação.
            Formato obrigatório:
            {{
                "titulo": "Título principal do documento",
                "snippet": "Um resumo de no máximo 2 frases do que se trata o texto",
                "tags": ["Tag1", "Tag2", "Tag3"]
            }}
            Texto a ser analisado:
            {texto_documento[:20000]}
            """

            # 5. Escolhe a chave GROQ: verifica se existe uma chave salva na tabela 'settings'
            api_key = os.environ.get('GROQ_API_KEY')
            # Try to fetch override from Supabase settings if service role exists
            supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            if supabase_url and supabase_key:
                try:
                    sb = create_client(supabase_url, supabase_key)
                    resp = sb.table('settings').select('value').eq('key', 'groq_api_key').execute()
                    data = resp.data if hasattr(resp, 'data') else resp[0]
                    if data and len(data) > 0:
                        api_key = data[0].get('value') or api_key
                except Exception:
                    # non-fatal: keep using env var
                    pass

            if not api_key:
                raise Exception("A chave GROQ_API_KEY não foi encontrada no servidor.")

            groq_url = "https://api.groq.com/openai/v1/chat/completions"
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3
            }
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            req_ia = requests.post(groq_url, headers=headers, json=payload, timeout=60)
            dados_ia = req_ia.json()

            if "error" in dados_ia:
                raise Exception(f"Erro na Groq: {dados_ia['error'].get('message', 'Erro desconhecido')}")

            # 6. Extrai e limpa a resposta
            texto_resposta = dados_ia['choices'][0]['message']['content']
            texto_limpo = texto_resposta.replace("```json", "").replace("```", "").strip()
            resultado_json = json.loads(texto_limpo)

            # 7. Insere no Supabase usando service role (mais seguro)
            if supabase_url and supabase_key:
                try:
                    sb = create_client(supabase_url, supabase_key)
                    insert_payload = {
                        'drive_url': url_do_drive,
                        'titulo': resultado_json.get('titulo'),
                        'conteudo_snippet': resultado_json.get('snippet'),
                        'tags': resultado_json.get('tags')
                    }
                    sb.table('documentos').insert([insert_payload]).execute()
                except Exception as e:
                    # If DB insert fails, return success with warning
                    return self._send_json(500, {'sucesso': False, 'erro': 'Falha ao salvar no banco: ' + str(e)})

            resultado_json["sucesso"] = True

            # 8. Devolve o resultado em JSON para o site
            self._send_json(200, resultado_json)
            
        except Exception as e:
            erro_resposta = {"sucesso": False, "erro": str(e)}
            self._send_json(500, erro_resposta)