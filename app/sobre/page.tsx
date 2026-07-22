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
          <h1 className="text-4xl font-semibold mt-4 mb-2">Sobre a Estante Materialista</h1>
          <p className="text-brown-700">Um espaço para encontrar documentos e textos compartilhados pelo Prof. João Carvalho.</p>
        </header>

        <article className="prose prose-lg max-w-none mb-12 space-y-8 text-brown-900">
          <section>
            <h2 className="text-2xl font-semibold mb-4">O que é</h2>
          <p>
            A Estante Materialista reúne documentos e textos compartilhados pelo Prof. João Carvalho em um único lugar. Você pode buscar por título, autor ou tema, e o site mostra os resultados em ordem clara.
          </p>
          <p>
            Cada registro recebe um pequeno resumo e etiquetas de tema. Isso ajuda você a ver rapidamente se o conteúdo interessa antes de abrir o documento.
          </p>
          <p>
            Por trás disso, o site usa mineração de texto para ler os conteúdos e identificar palavras-chave e temas principais. Isso não é só um índice de títulos: o sistema busca trechos importantes e entende do que cada documento trata.
          </p>
          <p>
            Uma API de IA também é usada para gerar resumos e sugerir etiquetas. Assim, quando você pesquisa, o sistema pode encontrar textos com termos parecidos, mesmo que não estejam exatamente iguais na busca.
          </p>
          <p>
            O resultado é um acervo pesquisável com filtros por tags, listagem de texto e destaque de temas relevantes. É um jeito mais rápido de navegar entre documentos e achar o que interessa.
          </p>
        </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Quem organiza</h2>
            <p>
              Prof. João Rafael Chió Serra Carvalho é doutorando em História Social da Cultura pela Universidade Federal de Minas Gerais (UFMG). Formado em História pela UFMG, concluiu mestrado em História Social pela Universidade de São Paulo (USP/FFLCH).
            </p>
            <p>
              Suas pesquisas envolvem história do marxismo, história da África e Ásia, colonialismo e obra de Frantz Fanon. Também trabalha com História Medieval, Antiga e religiões.
            </p>
            <p>
              Os dados sobre o Prof. foram atualizados em 20 de julho de 2026 com base no seu currículo Lattes.
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
              Este site não foi criado ou desenvolvido pelo Prof. João Rafael Chió Serra Carvalho. A responsabilidade técnica e de desenvolvimento é de @StatViva (Lucas Santos). Para questões relacionadas a erros, segurança, dúvidas ou suporte técnico, escreva para <a href="mailto:hello.statviva@gmail.com" className="text-brown-700 hover:underline">hello.statviva@gmail.com</a>.
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
