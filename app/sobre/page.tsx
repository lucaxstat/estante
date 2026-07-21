'use client';

import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <Link href="/" className="text-gray-700 hover:underline mb-4 inline-block">
            Voltar à busca
          </Link>
          <h1 className="text-4xl font-semibold mt-4 mb-2">Sobre Estante Acadêmica</h1>
          <p className="text-gray-700">Plataforma dedicada ao acesso e organização de materiais acadêmicos.</p>
        </header>

        <article className="prose prose-lg max-w-none mb-12 space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Visão geral</h2>
            <p>
              Estante Acadêmica disponibiliza um repositório de documentos acadêmicos com organização por etiquetas temáticas e
              metadados. A interface de busca permite localizar registros por título, autor ou assunto e aplicar filtros temáticos.
              Os registos exibem metadados resumidos com o objetivo de facilitar a avaliação inicial do material.
            </p>
            <p>
              A plataforma foi concebida para simplificar o acesso a referências e materiais de leitura, apoiando atividades de
              ensino e pesquisa por meio de um índice pesquisável e de uma apresentação clara dos resultados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Sobre o gestor</h2>
            <p>
              Prof. João Rafael Chió Serra Carvalho, do canal @assimdisseojoao, possui graduação em História pela Universidade
              Federal de Minas Gerais (2005), com formação complementar em Letras Clássicas, e Mestrado em História Social pela
              Universidade de São Paulo (USP - FFLCH, 2009). Atualmente, encontra-se cursando Doutorado em História Social da
              Cultura na Universidade Federal de Minas Gerais (UFMG).
            </p>
            <p>
              Suas linhas de pesquisa incluem História do Marxismo; História da África e da Ásia, com ênfase em anticolonialismo,
              nacionalismo e na obra de Frantz Fanon. Ademais, possui experiência em História Antiga, História Medieval e História
              Religiosa. Informações citadas aqui foram extraídas do currículo Lattes em 20/07/2026.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Links úteis</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="https://apoia.se/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">apoia.se/assimdisseojoao</a></li>
              <li><a href="https://youtube.com/assimdisseojoao/join" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">YouTube - torne-se membro</a></li>
              <li><a href="https://instagram.com/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Instagram</a></li>
              <li><a href="https://twitter.com/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter/X</a></li>
              <li><a href="https://twitch.tv/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitch</a></li>
              <li><a href="https://youtube.com/@assimdisseojoao" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Canal no YouTube</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Informação relevante</h2>
            <p>
              O sítio não foi concebido nem desenvolvido pelo Prof. João Rafael Chió Serra Carvalho. A responsabilidade técnica e de
              desenvolvimento pertence ao responsável identificado publicamente como @StatViva (Luca Santos). Para notificações relativas a erros,
              segurança, dúvidas ou solicitações de suporte técnico, favor contatar o responsável através do correio eletrónico:
              <a href="mailto:hello.statviva@gmail.com" className="text-blue-600 hover:underline"> hello.statviva@gmail.com</a>.
              O Prof. João Carvalho é responsável exclusivamente pelo conteúdo e pela curadoria científica disponibilizada na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contato</h2>
            <p>Para reportar problemas, solicitar esclarecimentos ou propor melhorias, contacte: <a href="mailto:hello.statviva@gmail.com" className="text-blue-600 hover:underline">hello.statviva@gmail.com</a>.</p>
          </section>
        </article>

        <div className="flex justify-center mt-12">
          <Link href="/" className="text-gray-700 hover:underline">Voltar à busca</Link>
        </div>

        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 StatViva. Plataforma desenvolvida por @StatViva.</p>
          <p className="mt-2">Contato: <a href="mailto:hello.statviva@gmail.com" className="text-blue-600 hover:underline">hello.statviva@gmail.com</a></p>
        </footer>
      </div>
    </main>
  );
}
