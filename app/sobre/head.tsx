export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: 'Sobre — Estante Materialista',
    description: 'Informações sobre a Estante Materialista e o Prof. João Carvalho. Entre em contato via email.',
    url: 'https://example.com/sobre',
    dateModified: '2026-07-21',
  };

  return (
    <>
      <title>Sobre — Estante Materialista</title>
      <meta name="description" content="Sobre a Estante Materialista e os documentos compartilhados pelo Prof. João Carvalho. Saiba como a busca e a organização funcionam." />
      <meta name="robots" content="index,follow" />
      <meta name="author" content="StatViva" />
      <link rel="canonical" href="https://example.com/sobre" />
      <meta property="og:title" content="Sobre — Estante Materialista" />
      <meta property="og:description" content="Página Sobre da Estante Materialista. Encontre informações sobre o projeto, o Prof. João Carvalho e os recursos do acervo." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://example.com/sobre" />
      <meta property="og:site_name" content="Estante Materialista" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Sobre — Estante Materialista" />
      <meta name="twitter:description" content="Informações sobre a Estante Materialista e a organização de documentos e textos do Prof. João Carvalho." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
