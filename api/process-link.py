import json
import re
import os
import requests
import google.generativeai as genai
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # 1. Lê a URL enviada pelo seu site
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data)
            url_do_drive = dados.get('url', '')

            # 2. Extrai a ID do documento (Ex: docs.google.com/document/d/ESTA-ID-AQUI/edit)
            match = re.search(r"/d/([a-zA-Z0-9-_]+)", url_do_drive)
            if not match:
                raise Exception("Link inválido. Cole a URL de um documento do Google Docs.")
            doc_id = match.group(1)

            # 3. Baixa o texto puro do documento (O link no Drive deve estar como "Qualquer pessoa com o link pode ver")
            export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=txt"
            req_doc = requests.get(export_url)
            if req_doc.status_code != 200:
                raise Exception("O documento está trancado. Altere o compartilhamento no Google Drive para 'Qualquer pessoa com o link'.")
            
            texto_documento = req_doc.text

            # 4. Acorda a Inteligência Artificial do Gemini
            genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-1.5-flash') 

            # 5. O Comando (Prompt) que enviamos para a IA
            prompt = f"""
            Você é um assistente acadêmico. Analise o texto abaixo e extraia as seguintes informações no exato formato JSON.
            Não escreva mais nada, apenas o JSON puro, sem crases de formatação.
            Formato obrigatório:
            {{
                "titulo": "Título principal do documento",
                "snippet": "Um resumo de no máximo 2 frases do que se trata o texto",
                "tags": ["Tag1", "Tag2", "Tag3"]
            }}

            Texto a ser analisado:
            {texto_documento[:30000]}
            """

            # 6. Pede para a IA gerar a resposta
            resposta_ia = model.generate_content(prompt)
            
            # 7. Limpa a resposta (caso a IA coloque formatação de código) e transforma em JSON real
            texto_limpo = resposta_ia.text.replace("```json", "").replace("```", "").strip()
            resultado_json = json.loads(texto_limpo)
            resultado_json["sucesso"] = True

            # 8. Devolve as tags reais para o seu site!
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