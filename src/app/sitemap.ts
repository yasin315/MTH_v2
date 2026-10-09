import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  // Legal pages are added once they contain the real text (they are noindex until then).
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`])) },
  }));
}
