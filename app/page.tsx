'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function BuscaPage() {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const fazerBusca = async (q = busca) => {
    setCarregando(true);
    try {
      if (!q) {
        const { data } = await supabase.from('documentos').select('*').order('created_at', { ascending: false }).limit(12);
        setResultados(data || []);
      } else {
        const { data } = await supabase
          .from('documentos')
          .select('*')
          .ilike('titulo', `%${q}%`)
          .limit(50);
        setResultados(data || []);
      }
    } catch (e) {
      setResultados([]);
    }
    setCarregando(false);
  };

  useEffect(() => { fazerBusca(); }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fazerBusca(busca);
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <main className="relative min-h-screen pb-24 bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto flex min-h-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho minimalista */}
        <header className="mb-12 flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">Acervo Acadêmico</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Documentos do Prof. João Carvalho</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/sobre" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition">Sobre</a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
              aria-label="Alternar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Formulário de busca discreto */}
        <form onSubmit={handleSubmit} className="mb-10 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, autor ou assunto..."
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none transition focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
            disabled={carregando}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={carregando}
          >
            {carregando ? <>Buscando...</> : 'Buscar'}
          </button>
        </form>

        {/* Grid de documentos */}
        <section className="grid gap-4 lg:grid-cols-2">
          {carregando ? (
            <div className="col-span-full text-center text-zinc-500 dark:text-zinc-400 py-8">Buscando...</div>
          ) : resultados.length === 0 ? (
            <div className="col-span-full text-center text-zinc-500 dark:text-zinc-400 py-8">Nenhum documento encontrado.</div>
          ) : (
            resultados.map((doc) => (
              <a
                key={doc.id}
                href={doc.drive_url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5 transition hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
              >
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-snug">{doc.titulo}</h3>
                <p className="mt-2.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400 line-clamp-3">{doc.conteudo_snippet}</p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {(doc.tags || []).map((t: string) => (
                    <span key={t} className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">#{t}</span>
                  ))}
                </div>
              </a>
            ))
          )}
        </section>
      </div>

      {/* Footer discreto */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto max-w-4xl flex flex-col gap-1 text-center text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 StatViva • Desenvolvido por @StatViva</p>
          <p><a href="mailto:hello.statviva@gmail.com" className="text-zinc-700 dark:text-zinc-300 hover:underline">hello.statviva@gmail.com</a></p>
        </div>
      </footer>
    </main>
  );
}