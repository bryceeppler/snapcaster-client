import Head from 'next/head';

export const PageHead = ({
  title,
  description,
  url
}: {
  title: string;
  description: string;
  url: string;
}) => {
  return (
    <Head>
      {/* Core SEO Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Snapcaster" />

      {/* Open Graph Tags (Social Media Preview) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Viewport & Icons */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
