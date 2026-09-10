import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
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
        ],
        disallow: [
          '/student/',
          '/aspirant/',
          '/alumni/',
          '/admin/',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://campusverse.edu/sitemap.xml',
  };
}
