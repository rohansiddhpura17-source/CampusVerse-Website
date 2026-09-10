import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://campusverse.edu';
  const publicRoutes = [
    '',
    '/about',
    '/features',
    '/students',
    '/aspirants',
    '/alumni',
    '/institutions',
    '/help',
    '/faq',
    '/contact',
    '/terms',
    '/privacy',
    '/community-guidelines',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/features' ? 0.9 : 0.8,
  }));
}
