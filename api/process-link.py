import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # 1. Lê os dados que o site (React) enviou
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data)
            
            url_do_drive = dados.get('url', '')

            # 2. ESPAÇO RESERVADO PARA A IA E GOOGLE DRIVE
            # Por enquanto, vamos simular que a IA leu o texto e gerou essas tags.
            # Isso garante que a conexão com o frontend e o Supabase está funcionando antes de complicarmos.
            
            resposta = {
                "sucesso": True,
                "titulo": "Documento Teste Python",
                "snippet": f"Este é um texto simulado extraído do link: {url_do_drive}",
                "tags": ["Automação", "Python", "Vercel"]
            }

            # 3. Empacota a resposta em JSON e devolve para o site
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(resposta).encode('utf-8'))
            
        except Exception as e:
            # Se algo der errado no servidor, devolvemos a mensagem de erro
            erro_resposta = {
                "sucesso": False,
                "erro": str(e)
            }
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(erro_resposta).encode('utf-8'))