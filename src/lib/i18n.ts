import { de, type Dict } from './dictionaries/de';
import { en } from './dictionaries/en';

import type { Lang } from './locales';
export { LOCALES, DEFAULT_LOCALE, isLang } from './locales';
export type { Lang } from './locales';

const dictionaries: Record<Lang, Dict> = { de, en };
export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mth-halle.de').replace(/\/$/, '');

export const COMPANY = {
  name: 'Metall Technologie Höhne GmbH',
  street: 'Angerstraße 18',
  zip: '06118',
  city: 'Halle (Saale)',
  phone: '0345 6811 811',
  phoneHref: 'tel:+493456811811',
  fax: '0345 6811 812',
  email: 'info@mth-halle.de',
  email2: 'sekretariat@mth-halle.de',
  founded: 2006,
};

/** Number formatting used for the animated counters (same on server and client). */
export function formatNumber(n: number, lang: Lang): string {
  return n.toLocaleString(lang === 'en' ? 'en-GB' : 'de-DE');
}
