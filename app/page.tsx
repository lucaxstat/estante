'use client'; 
import { useState, useEffect } from 'react';
// Aqui importamos a conexão que você já criou na pasta lib!
import { supabase } from '../lib/supabaseClient';

export default function BuscaPage() {
  // O <any[]> avisa ao TypeScript que essa lista pode receber qualquer tipo de dado
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const fazerBusca = async () => {
    setCarregando(true);
    
    if (busca === '') {
      // Busca os 10 documentos mais recentes se a barra estiver vazia
      const { data } = await supabase.from('documentos').select('*').order('criado_em', { ascending: false }).limit(10);
      setResultados(data || []);
    } else {
      // Faz a busca estatística inteligente
      const { data } = await supabase
        .from('documentos')
        .select('*')
        .textSearch('search_vector', busca, { config: 'portuguese' });
      setResultados(data || []);
    }
    
    setCarregando(false);
  };

  useEffect(() => {
    fazerBusca();
  }, [busca]);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Acervo Acadêmico Inteligente</h1>
        
        <input 
          type="text"
          placeholder="Busque por disciplinas, livros ou assuntos..."
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl mb-8 shadow-sm focus:border-blue-500 outline-none"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="space-y-4">
          {carregando ? (
            <p className="text-center text-gray-500">Buscando na biblioteca...</p>
          ) : resultados.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum documento encontrado para esta busca.</p>
          ) : (
            resultados.map((doc) => (
              <a key={doc.id} href={doc.drive_url} target="_blank" rel="noreferrer" className="block bg-white p-6 rounded-xl border hover:shadow-md transition">
                <h2 className="text-xl font-bold text-gray-800">{doc.titulo}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">{doc.conteudo_snippet}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {doc.tags?.map((tag: string) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </main>
  );
}