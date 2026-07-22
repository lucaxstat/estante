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
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
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

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 py-10">
        <div className="w-full max-w-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-6">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4">Painel de Administração</h2>
          <form onSubmit={login} className="space-y-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              type="password"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none transition focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">Painel de Administração</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Gerenciamento de documentos do acervo</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition">Início</a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
              aria-label="Alternar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Formulário de adição */}
        <div className="mb-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Adicionar material</h3>
          <form onSubmit={addDocument} className="grid gap-3 sm:grid-cols-[1fr_auto] mb-3">
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Cole a URL do documento ou página"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none transition focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
              disabled={loading}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !newUrl.trim()}
            >
              {loading ? 'Processando...' : 'Processar'}
            </button>
          </form>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Aceita URLs de páginas web e documentos de texto. O sistema extrai e analisa o conteúdo automaticamente.</p>
        </div>

        {/* Filtros e Groq Key */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Filtros */}
          <div className="md:col-span-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Filtros</h3>
            <form onSubmit={handleFilterSubmit} className="grid gap-3 sm:grid-cols-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por título"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm transition focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
                disabled={loading}
              />
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2 text-zinc-900 dark:text-zinc-100 outline-none text-sm transition focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
                disabled={loading}
              >
                <option value="">Todas as tags</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Aplicar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setTagFilter('');
                    fetchDocs(1);
                  }}
                  className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition hover:border-zinc-400 dark:hover:border-zinc-600"
                  disabled={loading}
                >
                  Limpar
                </button>
              </div>
            </form>
            {message && <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
          </div>

          {/* Groq Key */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-3">Chave Groq</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
              Cole sua chave Groq para evitar bloqueios ao processar documentos.
            </p>
            <form onSubmit={saveGroqKey} className="space-y-2.5">
              <input
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="Cole aqui"
                type="password"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm transition focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-900 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de documentos */}
        <section>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Documentos ({docs.length})</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {docs.map((d) => (
              <div
                key={d.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-4 transition hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm leading-snug">{d.titulo || '—'}</h4>
                    <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400 line-clamp-2">{d.conteudo_snippet || 'Sem descrição'}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(d.tags || []).map((t, i) => (
                        <span key={i} className="rounded-full border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <a href={d.drive_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:underline">
                      Abrir
                    </a>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditing(Object.assign({}, d))}
                        className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition hover:border-zinc-400 dark:hover:border-zinc-600"
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => confirmDelete(d.id)}
                        className="rounded-md bg-zinc-800 dark:bg-zinc-700 text-white px-2.5 py-1 text-xs font-medium transition hover:bg-zinc-900 dark:hover:bg-zinc-600"
                        disabled={loading}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Página {page}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (page > 1) fetchDocs(page - 1);
                }}
                disabled={page <= 1}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition hover:border-zinc-400 dark:hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  if (hasMore) fetchDocs(page + 1);
                }}
                disabled={!hasMore}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition hover:border-zinc-400 dark:hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </section>

        {/* Modal de Edição */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm px-4 py-10">
            <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-800 p-5 shadow-lg">
              <h3 className="text-lg font-medium text-zinc-100 mb-4">Editar Documento</h3>
              <div className="space-y-3">
                <input
                  value={editing.titulo || ''}
                  onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none text-sm transition focus:ring-1 focus:ring-zinc-600"
                  placeholder="Título"
                  disabled={loading}
                />
                <textarea
                  value={editing.conteudo_snippet || ''}
                  onChange={(e) => setEditing({ ...editing, conteudo_snippet: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none text-sm transition focus:ring-1 focus:ring-zinc-600"
                  rows={3}
                  placeholder="Descrição"
                  disabled={loading}
                />
                <input
                  value={(editing.tags || []).join(', ')}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none text-sm transition focus:ring-1 focus:ring-zinc-600"
                  placeholder="tags, separadas, por, vírgula"
                  disabled={loading}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded-lg border border-zinc-700 bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-600"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveEdit}
                    className="rounded-lg bg-zinc-700 text-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-600"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm px-4 py-10">
            <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-800 p-5 shadow-lg">
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Confirmar exclusão?</h3>
              <p className="text-sm leading-5 text-zinc-400 mb-5">Essa ação é irreversível.</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="rounded-lg border border-zinc-700 bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-600"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => doDelete(showConfirm)}
                  className="rounded-lg bg-zinc-800 text-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-900"
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
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

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-500 space-y-1">
          <p>© 2026 StatViva. Painel administrativo desenvolvido por @StatViva.</p>
          <p>Contato: <a href="mailto:hello.statviva@gmail.com" className="text-zinc-700 dark:text-zinc-300 hover:underline">hello.statviva@gmail.com</a></p>
        </footer>
      </div>
    </div>
  );
}