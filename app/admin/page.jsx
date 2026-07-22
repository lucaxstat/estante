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
  const [darkMode, setDarkMode] = useState(false);

  function addToast(message, type = 'info') {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
  }

  function removeToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && document.documentElement.classList.contains('dark'));
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDocs(1);
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
        setMessage('Autenticado com sucesso');
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
    setLoading(true);
    setMessage('Processando...');
    try {
      const res = await fetchJson('/api/process-link', { method: 'POST', body: JSON.stringify({ url: newUrl }) });
      if (res && res.sucesso) {
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
      setMessage('Erro ao processar documento');
      addToast('Erro ao processar documento', 'error');
    }
    setLoading(false);
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true);
    setMessage('Salvando alterações...');
    try {
      const res = await fetchJson('/api/admin_docs', { method: 'PUT', body: JSON.stringify(editing) });
      if (res && res.success) {
        await fetchDocs(page);
        setEditing(null);
        setMessage('Documento atualizado');
        addToast('Documento atualizado', 'success');
      } else {
        setMessage(res.error || 'Erro ao salvar');
        addToast(res.error || 'Erro ao salvar documento', 'error');
      }
    } catch (e) {
      setMessage('Erro ao salvar alterações');
      addToast('Erro ao salvar alterações', 'error');
    }
    setLoading(false);
  }

  async function confirmDelete(id) {
    setShowConfirm(id);
  }

  async function doDelete(id) {
    setLoading(true);
    setMessage('Excluindo...');
    try {
      const res = await fetchJson('/api/admin_docs', { method: 'DELETE', body: JSON.stringify({ id }) });
      if (res && res.success) {
        await fetchDocs(page);
        setShowConfirm(null);
        setMessage('Documento excluído');
        addToast('Documento excluído', 'success');
      } else {
        setMessage(res.error || 'Erro ao excluir');
        addToast(res.error || 'Erro ao excluir documento', 'error');
      }
    } catch (e) {
      setMessage('Erro ao excluir documento');
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
    } catch (e) {
      setMessage('Erro ao buscar documentos');
    }
    setLoading(false);
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await fetchDocs(1);
  }

  async function saveGroqKey(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('Salvando chave...');
    try {
      const res = await fetchJson('/api/admin_set_groq_key', { method: 'POST', body: JSON.stringify({ groq_api_key: groqKey }) });
      if (res && res.success) {
        setMessage('Chave salva com sucesso');
        addToast('Chave Groq atualizada', 'success');
      } else {
        setMessage(res.error || 'Erro ao salvar');
        addToast(res.error || 'Erro ao salvar chave Groq', 'error');
      }
    } catch (e) {
      setMessage('Erro ao salvar chave');
      addToast('Erro ao salvar chave Groq', 'error');
    }
    setLoading(false);
  }

  // ---- TELA DE LOGIN ----
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-6 text-center">Acesso Restrito</h2>
          <form onSubmit={login} className="space-y-4">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha Administrativa"
              type="password"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none transition focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 text-sm"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Entrar no Painel'}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{message}</p>}
        </div>
        <div className="toast-container fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>
    );
  }

  // ---- TELA DO PAINEL ADMIN ----
  return (
    <div className="min-h-screen flex flex-col text-zinc-800 dark:text-zinc-100">
      <div className="flex-1 mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Admin */}
        <header className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">Painel de Administração</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Gerenciamento de documentos e sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition">Sair / Início</a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 transition text-zinc-600 dark:text-zinc-400"
              aria-label="Alternar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Adicionar Material */}
        <div className="mb-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Adicionar Documento</h3>
          <form onSubmit={addDocument} className="grid gap-3 sm:grid-cols-[1fr_auto] mb-3">
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Cole a URL do Google Docs"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none transition focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 px-6 py-2.5 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !newUrl.trim()}
            >
              {loading ? 'Processando IA...' : 'Processar Documento'}
            </button>
          </form>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">O sistema extrairá o texto puro, criará o resumo e as tags automaticamente usando a IA.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Filtros */}
          <div className="md:col-span-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Filtrar Acervo</h3>
            <form onSubmit={handleFilterSubmit} className="grid gap-3 sm:grid-cols-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm transition focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                disabled={loading}
              />
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-zinc-900 dark:text-zinc-100 outline-none text-sm transition focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                disabled={loading}
              >
                <option value="">Todas as tags</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-white disabled:opacity-50"
                  disabled={loading}
                >
                  Filtrar
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setTagFilter(''); fetchDocs(1); }}
                  className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  disabled={loading}
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>

          {/* Configuração de API */}
          <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Chave da IA (Groq)</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              Atualize a chave para evitar bloqueios de limite de requisições (rate limit).
            </p>
            <form onSubmit={saveGroqKey} className="space-y-2">
              <input
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                type="password"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm transition focus:ring-1 focus:ring-zinc-400"
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-white disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Atualizar Chave'}
              </button>
            </form>
          </div>
        </div>

        {/* Listagem para Edição e CRUD */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Gerenciar Documentos</h2>
          <div className="grid grid-cols-1 gap-3">
            {docs.map((d) => (
              <div key={d.id} className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                <div className="flex-1">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{d.titulo || 'Sem Título'}</h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">{d.conteudo_snippet || 'Sem descrição'}</p>
                </div>
                <div className="flex gap-2">
                  <a href={d.drive_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                    Drive
                  </a>
                  <button onClick={() => setEditing(Object.assign({}, d))} className="rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    Editar
                  </button>
                  <button onClick={() => confirmDelete(d.id)} className="rounded border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/40">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Página {page}</p>
            <div className="flex gap-2">
              <button onClick={() => { if (page > 1) fetchDocs(page - 1); }} disabled={page <= 1} className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50">
                Anterior
              </button>
              <button onClick={() => { if (hasMore) fetchDocs(page + 1); }} disabled={!hasMore} className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50">
                Próxima
              </button>
            </div>
          </div>
        </section>

        {/* Modal de Edição CRUD */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-10">
            <div className="w-full max-w-lg rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Editar Metadados</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Título do Documento</label>
                  <input
                    value={editing.titulo || ''}
                    onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 outline-none text-sm focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Resumo Gerado (Snippet)</label>
                  <textarea
                    value={editing.conteudo_snippet || ''}
                    onChange={(e) => setEditing({ ...editing, conteudo_snippet: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 outline-none text-sm focus:ring-1 focus:ring-zinc-400"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Tags Indexadas (separadas por vírgula)</label>
                  <input
                    value={(editing.tags || []).join(', ')}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 outline-none text-sm focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditing(null)} className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-50 dark:hover:bg-zinc-700">
                    Cancelar
                  </button>
                  <button onClick={saveEdit} className="rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-white" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl text-center">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Excluir documento?</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Esta ação apagará permanentemente o documento do Supabase.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowConfirm(null)} className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Cancelar
                </button>
                <button onClick={() => doDelete(showConfirm)} className="rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium transition hover:bg-red-700" disabled={loading}>
                  {loading ? 'Excluindo...' : 'Sim, Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toasts */}
        <div className="toast-container fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>

      {/* Footer Admin */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p className="mb-1">© 2026 StatViva. Painel administrativo desenvolvido por @StatViva.</p>
        <p>Contato: <a href="mailto:hello.statviva@gmail.com" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">hello.statviva@gmail.com</a></p>
      </footer>
    </div>
  );
}