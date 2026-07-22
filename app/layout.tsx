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
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-[#202122]">
        {children}
      </body>
    </html>
  );
}