'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SobrePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition mb-3 inline-block">
              ← Voltar
            </Link>
            <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">Sobre</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
            aria-label="Alternar tema"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Conteúdo principal */}
        <article className="space-y-10 mb-16">
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">O que é</h2>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                A Estante Acadêmica reúne documentos e textos compartilhados pelo Prof. João Carvalho em um único lugar. Você pode buscar por título, autor ou tema, e o site mostra os resultados de forma clara e organizada.
              </p>
              <p>
                Cada registro recebe um pequeno resumo e etiquetas de tema. Isso ajuda você a ver rapidamente se o conteúdo é de seu interesse antes de abrir o documento.
              </p>
              <p>
                Por trás disso, o site usa processamento de texto para ler os conteúdos e identificar palavras-chave e temas principais. Não é apenas um índice de títulos: o sistema busca trechos importantes e entende do que cada documento trata.
              </p>
              <p>
                Uma API de IA também é usada para gerar resumos e sugerir etiquetas. Assim, quando você pesquisa, o sistema pode encontrar textos com termos parecidos, mesmo que não estejam exatamente iguais na sua busca.
              </p>
              <p>
                O resultado é um acervo pesquisável com filtros por tags, listagem de conteúdo e destaque de temas relevantes. É um jeito mais rápido e prático de navegar entre documentos e achar o que interessa.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Quem organiza</h2>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Prof. João Rafael Chió Serra Carvalho é doutorando em História Social da Cultura pela Universidade Federal de Minas Gerais (UFMG). Formado em História pela UFMG, concluiu mestrado em História Social pela Universidade de São Paulo (USP/FFLCH).
              </p>
              <p>
                Suas pesquisas envolvem história do marxismo, história da África e Ásia, colonialismo e a obra de Frantz Fanon. Também trabalha com História Medieval, História Antiga e religiões.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Dados atualizados em 20 de julho de 2026 com base no currículo Lattes.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Canais e links</h2>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="https://apoia.se/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">apoia.se/assimdisseojoao</a></li>
              <li><a href="https://youtube.com/assimdisseojoao/join" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">YouTube — torne-se membro</a></li>
              <li><a href="https://instagram.com/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">Instagram</a></li>
              <li><a href="https://twitter.com/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">Twitter / X</a></li>
              <li><a href="https://twitch.tv/assimdisseojoao" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">Twitch</a></li>
              <li><a href="https://youtube.com/@assimdisseojoao" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">Canal no YouTube</a></li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Informação relevante</h2>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Este site não foi criado ou desenvolvido pelo Prof. João Rafael Chió Serra Carvalho. A responsabilidade técnica e de desenvolvimento é de <strong className="text-zinc-700 dark:text-zinc-300">@StatViva</strong> (Lucas Santos). Para questões relacionadas a erros, segurança, dúvidas ou suporte técnico, escreva para <a href="mailto:hello.statviva@gmail.com" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">hello.statviva@gmail.com</a>.
              </p>
              <p>
                O Prof. João Carvalho responde apenas pelo conteúdo e pela curadoria científica disponibilizada na plataforma. A manutenção da infraestrutura e do processamento de dados é realizada pela equipe técnica responsável.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Contato e suporte</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Para reportar problemas, solicitar esclarecimentos ou sugerir melhorias, entre em contato pelo e-mail <a href="mailto:hello.statviva@gmail.com" className="hover:text-zinc-900 dark:hover:text-zinc-100 underline">hello.statviva@gmail.com</a>.
            </p>
          </section>
        </article>

        {/* Navegação final */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            ← Voltar à busca
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-500 space-y-1">
          <p>© 2026 StatViva. Plataforma desenvolvida por @StatViva.</p>
          <p>Contato: <a href="mailto:hello.statviva@gmail.com" className="text-zinc-700 dark:text-zinc-300 hover:underline">hello.statviva@gmail.com</a></p>
        </footer>
      </div>
    </main>
  );
}
