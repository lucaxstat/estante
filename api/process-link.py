import json
import re
import os
import requests
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # 1. Lê a URL enviada pelo site
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data)
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

            # 5. Comunicação com a API da Groq (Llama 3 - Gratuita e ultrarrápida)
            api_key = os.environ.get('GROQ_API_KEY')
            if not api_key:
                raise Exception("A chave GROQ_API_KEY não foi encontrada na Vercel.")

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

            req_ia = requests.post(groq_url, headers=headers, json=payload)
            dados_ia = req_ia.json()

            if "error" in dados_ia:
                raise Exception(f"Erro na Groq: {dados_ia['error'].get('message', 'Erro desconhecido')}")

            # 6. Extrai e limpa a resposta
            texto_resposta = dados_ia['choices'][0]['message']['content']
            texto_limpo = texto_resposta.replace("```json", "").replace("```", "").strip()
            
            resultado_json = json.loads(texto_limpo)
            resultado_json["sucesso"] = True

            # 7. Devolve o resultado em JSON para o site
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