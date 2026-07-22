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
        // Keep toast and in-page message aligned with E2E expectations
        setMessage('Documento criado com sucesso');
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Painel de Administração</h2>
          <form onSubmit={login} className="space-y-4">
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha do Admin" type="password" className="input-field" />
            <button type="submit" className="btn-primary w-full">
              {loading ? <><span className="spinner" />Entrando...</> : 'Entrar'}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>}
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Painel Administrativo</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Estante — Painel de Administração</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Adicione e organize documentos na base.</p>
            </div>
            <nav className="flex flex-wrap gap-3">
              <a href="/" className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-red-500">Início</a>
              <a href="/sobre" className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-red-500">Sobre</a>
            </nav>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="col-span-1 md:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Adicionar material</h3>
            <form onSubmit={addDocument} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Link do documento, página ou recurso" className="input-field w-full" disabled={loading} />
              <button type="submit" className="btn-primary" disabled={loading || !newUrl.trim()}>
                {loading ? <><span className="spinner" />Processando...</> : 'Processar'}
              </button>
            </form>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Aceita URLs de páginas web e documentos de texto. O sistema tenta extrair o conteúdo para análise.</p>
            <form onSubmit={handleFilterSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar por título" className="input-field" disabled={loading} />
              <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="input-field" disabled={loading}>
                <option value=''>Filtrar por tag (todas)</option>
                {availableTags.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary" disabled={loading}>Aplicar</button>
                <button type="button" onClick={(e) => { e.preventDefault(); setSearchTerm(''); setTagFilter(''); fetchDocs(1); }} className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-red-400" disabled={loading}>Limpar</button>
              </div>
            </form>
            {message && <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</div>}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Chave de API de IA</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Use esta chave apenas quando o limite de requests da API principal for atingido. Cole aqui sua chave Groq para evitar bloqueios temporários e continuar processando documentos.
            </p>
            <form onSubmit={saveGroqKey} className="space-y-3">
              <input value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder="Cole sua chave Groq aqui" className="input-field" disabled={loading} />
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <><span className="spinner" />Salvando...</> : 'Salvar chave'}
              </button>
            </form>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <p className="font-semibold">Como conseguir sua chave Groq</p>
              <ol className="mt-2 list-inside list-decimal space-y-2 text-slate-600 dark:text-slate-300">
                <li>Abra <a href="https://groq.com" target="_blank" rel="noreferrer" className="font-medium text-red-700 hover:underline dark:text-red-400">groq.com</a> e crie uma conta.</li>
                <li>Acesse o painel de desenvolvedor e gere uma nova API key.</li>
                <li>Cole a chave aqui e clique em salvar.</li>
              </ol>
              <p className="mt-3">A chave salva é usada para processar os links de documentos, reduzindo a dependência do limite do servidor principal.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Documentos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {docs.map((d) => (
              <div key={d.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{d.titulo || '—'}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{d.conteudo_snippet || 'Sem descrição disponível.'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(d.tags || []).map((t, i) => (
                        <span key={i} className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 text-left sm:items-end">
                    <a href={d.drive_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-red-700 transition hover:underline dark:text-red-400">Abrir</a>
                    <div className="grid w-full gap-2 sm:w-auto">
                      <button onClick={() => setEditing(Object.assign({}, d))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-red-400">Editar</button>
                      <button onClick={() => confirmDelete(d.id)} className="rounded-xl bg-red-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500">Excluir</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">Página {page}</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { if (page > 1) fetchDocs(page - 1); }} disabled={page <= 1} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Anterior</button>
              <button onClick={() => { if (hasMore) fetchDocs(page + 1); }} disabled={!hasMore} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-700 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Próxima</button>
            </div>
          </div>
        </section>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-10">
            <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Editar Documento</h3>
              <div className="space-y-3">
                <input value={editing.titulo || ''} onChange={(e) => setEditing({...editing, titulo: e.target.value})} className="input-field" disabled={loading} />
                <textarea value={editing.conteudo_snippet || ''} onChange={(e) => setEditing({...editing, conteudo_snippet: e.target.value})} className="input-field" rows={4} disabled={loading} />
                <input value={(editing.tags || []).join(', ')} onChange={(e) => setEditing({...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="input-field" placeholder="tags, separadas, por, vírgula" disabled={loading} />
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button onClick={() => setEditing(null)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-red-600 hover:text-red-300" disabled={loading}>Cancelar</button>
                  <button onClick={saveEdit} className="btn-primary rounded-xl px-4 py-2" disabled={loading}>
                    {loading ? <><span className="spinner" />Salvando...</> : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-10">
            <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Confirma exclusão?</h3>
              <p className="text-sm leading-6 text-slate-300 mb-5">Essa ação é irreversível. Deseja continuar?</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button onClick={() => setShowConfirm(null)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-red-600 hover:text-red-300" disabled={loading}>Cancelar</button>
                <button onClick={() => doDelete(showConfirm)} className="btn-danger rounded-xl px-4 py-2" disabled={loading}>
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
        
        <footer className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>© 2026 StatViva. Painel administrativo desenvolvido por @StatViva.</p>
          <p className="mt-2">Contato: <a href="mailto:hello.statviva@gmail.com" className="text-red-700 transition hover:underline dark:text-red-400">hello.statviva@gmail.com</a></p>
        </footer>
      </div>
    </div>
  );
}