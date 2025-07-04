import { GetServerSideProps } from 'next';
import { TCG_PATHS } from '@/utils/tcgPathHelper';
const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://snapcaster.ca';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
    <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/signin</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/signup</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/forgot-password</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- TCG Pages -->
  ${TCG_PATHS.map(
    (tcgPath) => `
  <url>
    <loc>${baseUrl}/buylists/${tcgPath}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/multisearch/${tcgPath}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/sealed/${tcgPath}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  ).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  );
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

export default Sitemap;
