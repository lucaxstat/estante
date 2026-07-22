import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estante Materialista — Acervo e Pesquisa",
  description: "Estante Materialista é um acervo inteligente de documentos e textos compartilhados pelo Prof. João Carvalho. Busque por título, autor ou tema e encontre resultados rápidos e organizados.",
  applicationName: 'StatViva',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* Aqui a classe body garante o contraste perfeito no modo escuro para todas as páginas */}
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}