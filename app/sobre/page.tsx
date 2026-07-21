'use client';

import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-yellow-50 to-orange-50 text-brown-900">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <Link href="/" className="text-brown-700 hover:underline mb-4 inline-block">
            Voltar à busca
          </Link>
          <h1 className="text-4xl font-semibold mt-4 mb-2">Sobre Estante Acadêmica</h1>
          <p className="text-brown-700">Um site pensado para tornar mais acessíveis pesquisas, referências e materiais de estudo.</p>
        </header>

        <article className="prose prose-lg max-w-none mb-12 space-y-8 text-brown-900">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Visão geral</h2>
            <p>
              Estante Acadêmica é um site que combina mineração de dados, estatística computacional e APIs de inteligência artificial para organizar e recuperar materiais acadêmicos com mais precisão.
            </p>
            <p>
              A plataforma indexa os documentos disponíveis, extrai metadados e faz análise de texto para gerar uma representação estruturada de cada registro. Em vez de apenas armazenar títulos, o sistema identifica temas, palavras-chave e relações semânticas usando mineração de texto e modelagem estatística.
            </p>
            <p>
              Na prática, cada documento passa por etapas de processamento: extração de conteúdo relevante, normalização de termos, vetorização de frases e comparação de similaridade. Esses procedimentos são baseados em técnicas de estatística computacional, como análise de frequência, coocorrência e cálculo de distâncias em espaços vetoriais.
            </p>
            <p>
              Para tornar a busca mais eficaz, o site usa uma API de IA para enriquecer os resumos e identificar o contexto dos trechos. A IA auxilia no reconhecimento de tópicos, na geração de pequenos resumos e na seleção de etiquetas temáticas que ajudam a filtrar resultados por área de interesse.
            </p>
            <p>
              O resultado é uma experiência de pesquisa que se aproxima da leitura de um catálogo bem organizado: o usuário faz consultas por título, autor ou assunto, e o sistema devolve materiais relevantes com descrição clara e filtros que facilitam a exploração do acervo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Sobre o gestor</h2>
            <p>
              Prof. João Rafael Chió Serra Carvalho é articulista e doutorando em História Social da Cultura pela Universidade Federal de Minas Gerais (UFMG). Formado em História pela UFMG, concluiu mestrado em História Social pela Faculdade de Filosofia, Letras e Ciências Humanas da Universidade de São Paulo (USP/FFLCH).
            </p>
            <p>
              Sua pesquisa faz interface entre história do marxismo, história da África e da Ásia, com foco em questões coloniais, anticoloniais e na obra de Frantz Fanon. Trabalha também com História Medieval, História Antiga e História das religiões.
            </p>
            <p>
              Os dados biográficos e acadêmicos aqui descritos foram consultados a partir do currículo Lattes em 20 de julho de 2026 para fornecer contexto sobre a autoria e a curadoria do conteúdo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Links do Tio</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="https://apoia.se/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:underline">apoia.se/assimdisseojoao</a></li>
              <li><a href="https://youtube.com/assimdisseojoao/join" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:underline">YouTube - torne-se membro</a></li>
              <li><a href="https://instagram.com/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:underline">Instagram</a></li>
              <li><a href="https://twitter.com/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:underline">Twitter/X</a></li>
              <li><a href="https://twitch.tv/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:underline">Twitch</a></li>
              <li><a href="https://youtube.com/@assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:underline">Canal no YouTube</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Informação relevante</h2>
            <p>
              Este site não foi criado ou desenvolvido pelo Prof. João Rafael Chió Serra Carvalho. A responsabilidade técnica e de desenvolvimento é de @StatViva (Luca Santos). Para questões relacionadas a erros, segurança, dúvidas ou suporte técnico, escreva para <a href="mailto:hello.statviva@gmail.com" className="text-brown-700 hover:underline">hello.statviva@gmail.com</a>.
            </p>
            <p>
              O Prof. João Carvalho responde apenas pelo conteúdo e pela curadoria científica disponibilizada na plataforma, enquanto a manutenção da infraestrutura e do processamento de dados é realizada pela equipe técnica responsável.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contato</h2>
            <p>Para reportar problemas, solicitar esclarecimentos ou sugerir melhorias, entre em contato pelo e-mail <a href="mailto:hello.statviva@gmail.com" className="text-brown-700 hover:underline">hello.statviva@gmail.com</a>.</p>
          </section>
        </article>

        <div className="flex justify-center mt-12">
          <Link href="/" className="text-brown-700 hover:underline">Voltar à busca</Link>
        </div>

        <footer className="mt-16 border-t border-brown-200 pt-8 text-center text-sm text-brown-700">
          <p>© 2026 StatViva. Plataforma desenvolvida por @StatViva.</p>
          <p className="mt-2">Contato: <a href="mailto:hello.statviva@gmail.com" className="text-brown-700 hover:underline">hello.statviva@gmail.com</a></p>
        </footer>
      </div>
    </main>
  );
}
