import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://aphura.ai';
  const lastModified = new Date();

  const routes = [
    '',
    '/about',
    '/pricing',
    '/pricing/organizations',
    '/blog',
    '/terms-privacy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
