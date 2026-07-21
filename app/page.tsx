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
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Acervo Acadêmico Inteligente</h1>
          <p className="mt-2 text-gray-600">Organize, busque e acesse documentos acadêmicos com ajuda de IA.</p>
          <div className="mt-4">
            <a href="/sobre" className="text-blue-600 hover:text-blue-800 text-sm hover:underline">Sobre esta plataforma →</a>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque por título, autor ou assunto..."
            className="input-field flex-1"
            disabled={carregando}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={carregando}
          >
            {carregando ? <><span className="spinner" />Buscando...</> : 'Buscar'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {carregando ? (
            <div className="col-span-full text-center text-gray-500">Buscando na biblioteca...</div>
          ) : resultados.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">Nenhum documento encontrado.</div>
          ) : (
            resultados.map((doc) => (
              <a key={doc.id} href={doc.drive_url} target="_blank" rel="noreferrer" className="block p-5 rounded-xl card">
                <h3 className="text-lg font-semibold">{doc.titulo}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{doc.conteudo_snippet}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(doc.tags || []).map((t: string) => <span key={t} className="tag">#{t}</span>)}
                </div>
              </a>
            ))
          )}
        </div>

        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 StatViva. Plataforma desenvolvida por @StatViva.</p>
          <p className="mt-2">Contato: <a href="mailto:hello.statviva@gmail.com" className="text-blue-600 hover:underline">hello.statviva@gmail.com</a></p>
        </footer>
      </div>
    </main>
  );
}