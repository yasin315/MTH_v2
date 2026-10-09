import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPage } from '@/components/LegalPage';
import { getDict, isLang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };

// TODO: remove "robots" once the real privacy policy is in place.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: getDict(lang).legal.privacyTitle, robots: { index: false } };
}

export default async function Privacy({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDict(lang);

  return (
   {/* <LegalPage lang={lang} back={d.legal.back} title={d.legal.privacyTitle}>
      {/*
        TODO: insert the legally reviewed privacy policy. It must describe (see README.md, "Legal"):
        hosting provider and server log files, the contact form (including file attachments),
        the e-mail provider, self-hosted fonts (no Google Fonts CDN), and that no analytics or
        tracking cookies are used.
      
    <p className="note-box">{d.legal.todo}</p>
    </LegalPage>*/}
  );
}
