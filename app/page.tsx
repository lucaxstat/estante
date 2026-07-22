'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function BuscaPage() {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  return (
    <main className="relative min-h-screen pb-28 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Coleção de Textos</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Acervo de Documentos Inteligente</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">Documentos e textos compartilhados pelo Prof. João Carvalho. Buscável, bem organizado, sem complicações.</p>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm">
              <a href="/sobre" className="rounded-md border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 transition hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-red-500">Sobre</a>
              <a href="/admin" className="rounded-md border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 transition hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-red-500">Painel</a>
            </nav>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] mb-6">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque por título, autor ou assunto..."
            className="w-full rounded-md border border-slate-300 bg-white px-5 py-4 text-slate-900 shadow-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-red-500 dark:focus:ring-red-500/20"
            disabled={carregando}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-red-700 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={carregando}
          >
            {carregando ? <><span className="spinner" />Buscando...</> : 'Buscar'}
          </button>
        </form>

        <section className="grid gap-4 lg:grid-cols-2">
          {carregando ? (
            <div className="col-span-full text-center text-gray-500">Buscando na biblioteca...</div>
          ) : resultados.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">Nenhum documento encontrado.</div>
          ) : (
            resultados.map((doc) => (
              <a
                key={doc.id}
                href={doc.drive_url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="text-xl font-semibold text-slate-900 transition group-hover:text-red-700 dark:text-slate-100 dark:group-hover:text-red-400">{doc.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3 dark:text-slate-400">{doc.conteudo_snippet}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(doc.tags || []).map((t: string) => (
                    <span key={t} className="inline-flex items-center rounded-full border border-red-700/10 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">#{t}</span>
                  ))}
                </div>
              </a>
            ))
          )}
        </section>

      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 text-center text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 StatViva. Plataforma desenvolvida por @StatViva.</p>
          <p><a href="mailto:hello.statviva@gmail.com" className="font-medium text-red-700 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Contato</a>: hello.statviva@gmail.com</p>
        </div>
      </footer>
    </main>
  );
}