'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Admin() {
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  // Verifica a senha usando a variável de ambiente segura
  const tentarLogin = (e) => {
    e.preventDefault();
    const senhaCorreta = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (senha === senhaCorreta) {
      setAutenticado(true);
    } else {
      alert('Senha Incorreta!');
    }
  };

  // Função que chama o Python e depois salva no Supabase
  const enviarLink = async (e) => {
    e.preventDefault();
    setStatus('🧠 Analisando link com Inteligência Artificial...');

    try {
      // 1. Chama nosso backend em Python (Serverless)
      const req = await fetch('/api/process-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const res = await req.json();

      if (!res.sucesso) throw new Error(res.erro);

      setStatus(`✅ Texto analisado! Tags geradas: ${res.tags.join(', ')}. Salvando no banco...`);

      // 2. Salva o resultado no banco de dados (Supabase)
      const { error } = await supabase.from('documentos').insert([{
        drive_url: url,
        titulo: res.titulo,
        conteudo_snippet: res.snippet,
        tags: res.tags
      }]);

      if (error) throw error;
      setStatus('🚀 Documento adicionado ao Acervo com sucesso!');
      setUrl(''); // Limpa o campo
      
    } catch (erro) {
      setStatus(`❌ Erro: ${erro.message}`);
    }
  };

  // Se não estiver autenticado, mostra o login. Se estiver, mostra o formulário.
  if (!autenticado) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <form onSubmit={tentarLogin} className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Área Restrita</h2>
          <input 
            type="password" placeholder="Senha do Admin" required
            className="border p-2 w-full mb-4 rounded"
            onChange={(e) => setSenha(e.target.value)} 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
        </form>
      </div>
    );
  }

  // COMPONENTE: AdminForm
  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold mb-2">Adicionar Novo Material</h1>
      <p className="text-gray-500 mb-6">O sistema criará as tags automaticamente.</p>
      
      <form onSubmit={enviarLink} className="space-y-4">
        <input 
          type="url" required placeholder="Cole o link do Google Drive aqui..."
          className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500"
          value={url} onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition">
          Processar e Salvar Documento
        </button>
      </form>

      {/* Exibe o status da operação na tela */}
      {status && <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm font-mono text-gray-800">{status}</div>}
    </div>
  );
}