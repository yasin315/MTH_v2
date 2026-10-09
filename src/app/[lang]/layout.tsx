import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Interactions } from '@/components/Interactions';
import { LOCALES, SITE_URL, getDict, isLang } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: '%s | MTH Halle' },
    description: d.meta.description,
    openGraph: {
      type: 'website',
      siteName: 'Metall Technologie Höhne GmbH',
      title: d.meta.title,
      description: d.meta.description,
      locale: lang === 'de' ? 'de_DE' : 'en_GB',
    },
    icons: { icon: '/icon.svg' },
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#content">
          {d.skip}
        </a>
        <Header lang={lang} d={d.nav} />
        <main id="content">{children}</main>
        <Footer lang={lang} d={d.footer} />
        <Interactions lang={lang} />
      </body>
    </html>
  );
}
