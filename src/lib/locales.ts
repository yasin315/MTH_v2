export const LOCALES = ['de', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Lang = 'de';

export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}

/** Picks de/en from an Accept-Language header. German is the default. */
export function pickFromAcceptLanguage(header: string | null): Lang {
  if (!header) return DEFAULT_LOCALE;
  for (const part of header.split(',')) {
    const primary = part.trim().split(/[;-]/)[0].toLowerCase();
    if (primary === 'de') return 'de';
    if (primary === 'en') return 'en';
  }
  return DEFAULT_LOCALE;
}
