import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
      <main className="max-w-4xl w-full p-12 rounded-2xl card">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
            <Image src="/next.svg" alt="logo" width={48} height={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Acervo Acadêmico Inteligente</h1>
            <p className="text-gray-600 mt-1">Organize e descubra conhecimento com classificação automática por IA.</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a className="btn-primary inline-flex items-center gap-3" href="/admin">Painel Admin</a>
          <a className="px-4 py-2 rounded bg-white border" href="/">Explorar acervo</a>
        </div>
      </main>
    </div>
  );
}
