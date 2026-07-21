'use client';

import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Voltar à busca
          </Link>
          <h1 className="text-4xl font-bold mt-4 mb-2">Sobre Estante Acadêmica</h1>
          <p className="text-gray-600">Plataforma de estudos e pesquisa</p>
        </div>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none mb-12 space-y-8">
          {/* How it works */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Como funciona</h2>
            <p className="text-gray-700 leading-relaxed">
              Estante Acadêmica é uma plataforma desenvolvida para facilitar o acesso a recursos acadêmicos e artigos de pesquisa. 
              O site funciona como um repositório de documentos organizados por tags temáticas, permitindo que você busque e explore 
              conteúdo acadêmico de forma prática e intuitiva.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Você pode utilizar a ferramenta de busca para localizar documentos por título, autor ou assunto. Os documentos estão 
              organizados por tags, facilitando a navegação por temas específicos. A plataforma é constantemente atualizada com novos 
              materiais de pesquisa e documentos acadêmicos.
            </p>
          </section>

          {/* About João Carvalho */}
          <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Sobre o Gestor da Plataforma</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Prof. João Rafael Chió Serra Carvalho</h3>
              <p className="text-sm text-gray-500 mb-4">Canal: @assimdisseojoao</p>
              
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Formação:</strong> Graduação em História pela Universidade Federal de Minas Gerais (2005) com formação 
                  complementar em Letras Clássicas e Mestrado em História Social pela Universidade de São Paulo (USP - FFLCH - 2009). 
                  Atualmente cursa Doutorado em História Social da Cultura na Universidade Federal de Minas Gerais (UFMG).
                </p>
                
                <p>
                  <strong>Áreas de pesquisa:</strong> História do Marxismo, História da África e História da Ásia com ênfase em 
                  Anticolonialismo, Nacionalismo e obra fanoniana. Experiência também em História Antiga (Suméria e Babilônia), 
                  História Medieval (Reforma do Século XII, Representações do Diabo, Escatologia e Ensino religioso) e História 
                  Religiosa.
                </p>
                
                <p className="text-xs text-gray-500">
                  Informações coletadas do Lattes em 20/07/2026
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Conecte-se com o Prof. João</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="https://apoia.se/assimdisseojoao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-100 transition"
                >
                  <span>💜</span> <span className="font-medium">Contribua no Apoia.se</span>
                </a>
                
                <a 
                  href="https://youtube.com/assimdisseojoao/join" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-900 dark:text-red-100 transition"
                >
                  <span>▶️</span> <span className="font-medium">Seja membro do canal</span>
                </a>
                
                <a 
                  href="https://instagram.com/assimdisseojoao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-800 text-pink-900 dark:text-pink-100 transition"
                >
                  <span>📷</span> <span className="font-medium">Instagram</span>
                </a>
                
                <a 
                  href="https://twitter.com/assimdisseojoao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100 transition"
                >
                  <span>𝕏</span> <span className="font-medium">Twitter/X</span>
                </a>
                
                <a 
                  href="https://twitch.tv/assimdisseojoao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  <span>📡</span> <span className="font-medium">Outras Lives na Twitch</span>
                </a>
                
                <a 
                  href="https://youtube.com/@assimdisseojoao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded bg-red-600 hover:bg-red-700 text-white transition"
                >
                  <span>📺</span> <span className="font-medium">Canal no YouTube</span>
                </a>
              </div>
            </div>
          </section>

          {/* About Developer */}
          <section className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
            <h2 className="text-2xl font-bold mb-4">Quem criou este site?</h2>
            
            <p className="text-gray-700 dark:text-gray-200 mb-4">
              Estante Acadêmica foi desenvolvida por <strong>@dyinghawks</strong> (YouTube), sob o nome de sua futura empresa 
              <strong> StatContext</strong>. Sou um seguidor do canal do Prof. João Carvalho e criei esta plataforma para 
              facilitar o acesso aos materiais de pesquisa e recursos acadêmicos.
            </p>
            
            <div className="bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-600 p-4 rounded">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ⚠️ Informação importante
              </p>
              <p className="text-blue-900 dark:text-blue-100">
                Este site não foi criado pelo Prof. João Carvalho. Qualquer erro, sugestão ou problema na plataforma 
                deve ser direcionado para mim (@dyinghawks). O Prof. João é responsável apenas pelo conteúdo 
                armazenado no repositório.
              </p>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Feedback e Suporte</h2>
            <p className="text-gray-700 leading-relaxed">
              Se você encontrou algum erro, tem sugestões de melhorias ou problemas ao usar a plataforma, 
              entre em contato comigo: @dyinghawks no YouTube ou procure no StatContext.
            </p>
          </section>
        </article>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <Link href="/" className="btn-primary">
            ← Voltar à Busca
          </Link>
        </div>

        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} StatContext. Plataforma desenvolvida por @dyinghawks.</p>
        </footer>
      </div>
    </main>
  );
}
