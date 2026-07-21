'use client';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast';

function fetchJson(url, opts = {}) {
  const final = Object.assign({ credentials: 'include', headers: { 'Content-Type': 'application/json' } }, opts);
  return fetch(url, final).then(async (r) => {
    const text = await r.text();
    try { return JSON.parse(text); } catch { return { ok: r.ok, text }; }
  });
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [docs, setDocs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [groqKey, setGroqKey] = useState('');
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'info') {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
  }

  function removeToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  useEffect(() => {
    // Try to fetch docs to check auth status and list tags
    (async () => {
      await fetchDocs(1);
      // fetch distinct tags
      const tagsRes = await fetchJson('/api/admin_docs?distinct_tags=1', { method: 'GET' });
      if (tagsRes && tagsRes.success) setAvailableTags(tagsRes.tags || []);
    })();
  }, []);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('Entrando...');
    try {
      const res = await fetchJson('/api/admin_login', { method: 'POST', body: JSON.stringify({ password }) });
      if (res && res.success) {
        setAuthed(true);
        setMessage('Autenticado');
        addToast('Login realizado com sucesso', 'success');
        const list = await fetchJson('/api/admin_docs', { method: 'GET' });
        if (list && list.success) setDocs(list.documents || []);
      } else {
        setMessage(res.error || 'Erro ao autenticar');
        addToast(res.error || 'Erro ao autenticar', 'error');
      }
    } catch (err) {
      setMessage('Erro de rede');
      addToast('Erro de rede ao autenticar', 'error');
    }
    setLoading(false);
  }

  async function addDocument(e) {
    e.preventDefault();
    setLoading(true); setMessage('Analisando e salvando...');
    try {
      const res = await fetchJson('/api/process-link', { method: 'POST', body: JSON.stringify({ url: newUrl }) });
      if (res && res.sucesso) {
        setMessage('Documento adicionado');
        addToast('Documento criado com sucesso', 'success');
        setNewUrl('');
        await fetchDocs(1);
      } else {
        const errorMessage = res?.erro || 'Erro ao processar';
        setMessage(errorMessage);
        addToast(errorMessage, 'error');
      }
    } catch (e) {
      setMessage('Erro');
      addToast('Erro ao processar documento', 'error');
    }
    setLoading(false);
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true); setMessage('Salvando alterações...');
    try {
      const res = await fetchJson('/api/admin_docs', { method: 'PUT', body: JSON.stringify(editing) });
      if (res && res.success) {
        await fetchDocs(page);
        setEditing(null);
        setMessage('Atualizado');
        addToast('Documento atualizado', 'success');
      } else {
        setMessage(res.error || 'Erro ao salvar');
        addToast(res.error || 'Erro ao salvar documento', 'error');
      }
    } catch (e) {
      setMessage('Erro');
      addToast('Erro ao salvar alterações', 'error');
    }
    setLoading(false);
  }

  async function confirmDelete(id) {
    setShowConfirm(id);
  }

  async function doDelete(id) {
    setLoading(true); setMessage('Excluindo...');
    try {
      const res = await fetchJson('/api/admin_docs', { method: 'DELETE', body: JSON.stringify({ id }) });
      if (res && res.success) {
        await fetchDocs(page);
        setShowConfirm(null);
        setMessage('Excluído');
        addToast('Documento excluído', 'success');
      } else {
        setMessage(res.error || 'Erro ao excluir');
        addToast(res.error || 'Erro ao excluir documento', 'error');
      }
    } catch (e) {
      setMessage('Erro');
      addToast('Erro ao excluir documento', 'error');
    }
    setLoading(false);
  }

  async function fetchDocs(p = 1) {
    setLoading(true);
    setMessage('Carregando...');
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('per_page', String(perPage));
      if (tagFilter) params.set('tag', tagFilter);
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetchJson('/api/admin_docs?' + params.toString(), { method: 'GET' });
      if (res && res.success) {
        setDocs(res.documents || []);
        setPage(res.page || p);
        setHasMore(!!res.has_more);
        setAuthed(true);
      } else {
        setMessage(res.error || 'Erro ao buscar');
      }
    } catch (e) { setMessage('Erro'); }
    setLoading(false);
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await fetchDocs(1);
  }

  async function saveGroqKey(e) {
    e.preventDefault(); setLoading(true); setMessage('Salvando chave...');
    try {
      const res = await fetchJson('/api/admin_set_groq_key', { method: 'POST', body: JSON.stringify({ groq_api_key: groqKey }) });
      if (res && res.success) {
        setMessage('Chave salva');
        addToast('Chave Groq atualizada', 'success');
      } else {
        setMessage(res.error || 'Erro');
        addToast(res.error || 'Erro ao salvar chave Groq', 'error');
      }
    } catch (e) {
      setMessage('Erro');
      addToast('Erro ao salvar chave Groq', 'error');
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Painel de Administração</h2>
          <form onSubmit={login} className="space-y-4">
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha do Admin" type="password" className="input-field" disabled={loading} />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <><span className="spinner" />Entrando...</> : 'Entrar'}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
        </div>
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Acervo Acadêmico - Admin</h1>
          <div className="text-sm text-gray-600">Modo Administrador</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl shadow card">
            <h3 className="font-semibold mb-3">Adicionar material</h3>
            <form onSubmit={addDocument} className="flex gap-3">
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Link do Google Docs" className="input-field flex-1" disabled={loading} />
              <button type="submit" className="btn-primary" disabled={loading || !newUrl.trim()}>
                {loading ? <><span className="spinner" />Processando...</> : 'Processar'}
              </button>
            </form>
            <form onSubmit={handleFilterSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar por título" className="input-field" disabled={loading} />
              <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="input-field" disabled={loading}>
                <option value=''>Filtrar por tag (todas)</option>
                {availableTags.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary" disabled={loading}>Aplicar</button>
                <button type="button" onClick={(e) => { e.preventDefault(); setSearchTerm(''); setTagFilter(''); fetchDocs(1); }} className="px-2 py-2 rounded bg-gray-100 border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>Limpar</button>
              </div>
            </form>
            {message && <div className="mt-3 text-sm text-gray-600">{message}</div>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow card">
            <h3 className="font-semibold mb-3">Gerenciar chave Groq</h3>
            <form onSubmit={saveGroqKey} className="space-y-3">
              <input value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder="Nova chave Groq (opcional)" className="input-field" disabled={loading} />
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <><span className="spinner" />Salvando...</> : 'Salvar chave'}
              </button>
            </form>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Documentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((d) => (
              <div key={d.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{d.titulo || '—'}</h4>
                    <p className="text-sm text-gray-600 mt-1">{d.conteudo_snippet || ''}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(d.tags || []).map((t, i) => (
                        <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <a href={d.drive_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Abrir</a>
                    <div className="mt-3 space-y-2">
                      <button onClick={() => setEditing(Object.assign({}, d))} className="block w-full bg-gray-100 text-sm p-2 rounded">Editar</button>
                      <button onClick={() => confirmDelete(d.id)} className="block w-full btn-danger text-sm p-2 rounded">Excluir</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Página {page}</div>
            <div className="flex gap-2">
              <button onClick={() => { if (page > 1) fetchDocs(page - 1); }} disabled={page <= 1} className="px-3 py-2 bg-white border rounded">Anterior</button>
              <button onClick={() => { if (hasMore) fetchDocs(page + 1); }} disabled={!hasMore} className="px-3 py-2 bg-white border rounded">Próxima</button>
            </div>
          </div>
        </section>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                  <div className="bg-white p-6 rounded-xl w-full max-w-lg card">
              <h3 className="font-semibold mb-3">Editar Documento</h3>
              <div className="space-y-3">
                <input value={editing.titulo || ''} onChange={(e) => setEditing({...editing, titulo: e.target.value})} className="input-field" disabled={loading} />
                <textarea value={editing.conteudo_snippet || ''} onChange={(e) => setEditing({...editing, conteudo_snippet: e.target.value})} className="input-field" rows={4} disabled={loading} />
                <input value={(editing.tags || []).join(', ')} onChange={(e) => setEditing({...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="input-field" placeholder="tags, separadas, por, vírgula" disabled={loading} />
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setEditing(null)} className="px-4 py-2" disabled={loading}>Cancelar</button>
                  <button onClick={saveEdit} className="btn-primary px-4 py-2" disabled={loading}>
                    {loading ? <><span className="spinner" />Salvando...</> : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm delete */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                  <div className="bg-white p-6 rounded-xl w-full max-w-sm card">
              <h3 className="font-semibold mb-3">Confirma exclusão?</h3>
              <p className="text-sm text-gray-700 mb-4">Essa ação é irreversível. Deseja continuar?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowConfirm(null)} className="px-4 py-2" disabled={loading}>Cancelar</button>
                <button onClick={() => doDelete(showConfirm)} className="btn-danger px-4 py-2" disabled={loading}>
                  {loading ? <><span className="spinner" />Excluindo...</> : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
        
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} StatContext. Painel administrativo desenvolvido por @dyinghawks.</p>
        </footer>
      </div>
    </div>
  );
}