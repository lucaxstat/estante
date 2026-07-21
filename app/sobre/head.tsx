export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: 'Sobre — Estante Acadêmica',
    description: 'Informações sobre a plataforma Estante Acadêmica e sobre o Prof. João Carvalho. Contato técnico disponível via email.',
    url: 'https://example.com/sobre'
  };

  return (
    <>
      <title>Sobre — Estante Acadêmica</title>
      <meta name="description" content="Informações sobre a plataforma Estante Acadêmica e sobre o Prof. João Carvalho. Contato técnico via hello.statviva@gmail.com" />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href="https://example.com/sobre" />
      <meta property="og:title" content="Sobre — Estante Acadêmica" />
      <meta property="og:description" content="Informações sobre a plataforma Estante Acadêmica e sobre o Prof. João Carvalho." />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
