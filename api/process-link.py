import json
import re
import os
import requests
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # 1. Lê a URL
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data)
            url_do_drive = dados.get('url', '')

            # 2. Extrai a ID do documento
            match = re.search(r"/d/([a-zA-Z0-9-_]+)", url_do_drive)
            if not match:
                raise Exception("Link inválido. Cole a URL de um documento do Google Docs.")
            doc_id = match.group(1)

            # 3. Baixa o texto puro
            export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=txt"
            req_doc = requests.get(export_url)
            if req_doc.status_code != 200:
                raise Exception("O documento está trancado. Altere o compartilhamento para 'Qualquer pessoa com o link'.")
            
            texto_documento = req_doc.text

            # 4. VERIFICAÇÃO DETETIVE (Checando as Chaves)
            api_key = os.environ.get('GEMINI_API_KEY')
            drive_key = os.environ.get('GOOGLE_DRIVE_API_KEY')
            
            if not api_key:
                raise Exception("A chave GEMINI_API_KEY não foi encontrada na Vercel.")
            if api_key == drive_key:
                raise Exception("🕵️ DETETIVE: A sua chave do Gemini está IDÊNTICA à do Drive! Vá na Vercel, apague a GEMINI_API_KEY e cole a chave correta gerada no AI Studio.")

            # 5. O Comando (Prompt)
            prompt = f"""
            Você é um assistente acadêmico. Analise o texto abaixo e extraia as informações no exato formato JSON.
            Não escreva mais nada.
            Formato obrigatório:
            {{
                "titulo": "Título principal do documento",
                "snippet": "Um resumo de no máximo 2 frases do que se trata o texto",
                "tags": ["Tag1", "Tag2", "Tag3"]
            }}
            Texto a ser analisado:
            {texto_documento[:30000]}
            """

            # 6. Comunicação com a IA
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            req_ia = requests.post(gemini_url, headers={"Content-Type": "application/json"}, json=payload)
            dados_ia = req_ia.json()

            # 7. O Raio-X do Erro
            if "error" in dados_ia:
                # Se der erro, o código vai tentar descobrir quais IAs estão liberadas para você
                list_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
                try:
                    req_list = requests.get(list_url).json()
                    modelos = [m['name'].replace('models/', '') for m in req_list.get('models', [])]
                    msg_modelos = f"Modelos permitidos: {', '.join(modelos[:3])}..." if modelos else "NENHUM modelo de IA encontrado para esta chave!"
                except:
                    msg_modelos = "A chave foi totalmente bloqueada."
                
                raise Exception(f"Erro na IA: {dados_ia['error'].get('message', '')} | 🔎 {msg_modelos}")

            # 8. Extrai a resposta limpa
            texto_resposta = dados_ia['candidates'][0]['content']['parts'][0]['text']
            texto_limpo = texto_resposta.replace("```json", "").replace("```", "").strip()
            
            resultado_json = json.loads(texto_limpo)
            resultado_json["sucesso"] = True

            # 9. Devolve para o site
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(resultado_json).encode('utf-8'))
            
        except Exception as e:
            erro_resposta = {"sucesso": False, "erro": str(e)}
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(erro_resposta).encode('utf-8'))