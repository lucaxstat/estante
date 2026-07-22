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
    <main className="min-h-screen pb-24 bg-[#f8f9fa] text-[#202122]">
      <div className="mx-auto max-w-4xl flex flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho minimalista */}
        <header className="mb-12 flex items-center justify-between pb-6 border-b border-[#a2a9b1]">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-[#202122]">Acervo Acadêmico</h1>
            <p className="mt-1 text-sm text-[#54595d]">Documentos do Prof. João Carvalho</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/sobre" className="text-sm text-[#54595d] hover:text-[#202122]">Sobre</a>
          </div>
        </header>

        {/* Formulário de busca discreto */}
        <form onSubmit={handleSubmit} className="mb-10 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, autor ou assunto..."
            className="w-full rounded-sm border border-[#a2a9b1] bg-white px-4 py-2.5 text-[#202122] placeholder-[#54595d] outline-none focus:ring-1 focus:ring-[#3366cc]"
            disabled={carregando}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-sm bg-[#3366cc] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#2a52a0] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={carregando}
          >
            {carregando ? <>Buscando...</> : 'Buscar'}
          </button>
        </form>

        {/* Grid de documentos */}
        <section className="grid gap-4 lg:grid-cols-2">
          {carregando ? (
            <div className="col-span-full text-center text-[#54595d] py-8">Buscando...</div>
          ) : resultados.length === 0 ? (
            <div className="col-span-full text-center text-[#54595d] py-8">Nenhum documento encontrado.</div>
          ) : (
            resultados.map((doc) => (
              <a
                key={doc.id}
                href={doc.drive_url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-sm border border-[#a2a9b1] bg-white p-5 hover:border-[#3366cc]"
              >
                <h3 className="text-lg font-medium text-[#202122] leading-snug">{doc.titulo}</h3>
                <p className="mt-2.5 text-sm leading-6 text-[#54595d] line-clamp-3">{doc.conteudo_snippet}</p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {(doc.tags || []).map((t: string) => (
                    <span key={t} className="inline-flex items-center rounded-sm border border-[#a2a9b1] bg-white px-2.5 py-0.5 text-xs font-medium text-[#54595d]">#{t}</span>
                  ))}
                </div>
              </a>
            ))
          )}
        </section>
      </div>

      {/* Footer discreto */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-[#a2a9b1] bg-[#f8f9fa] px-4 py-3">
        <div className="mx-auto max-w-4xl flex flex-col gap-1 text-center text-xs text-[#54595d] sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 StatViva • Desenvolvido por @StatViva</p>
          <p><a href="mailto:hello.statviva@gmail.com" className="text-[#3366cc] hover:underline">hello.statviva@gmail.com</a></p>
        </div>
      </footer>
    </main>
  );
}