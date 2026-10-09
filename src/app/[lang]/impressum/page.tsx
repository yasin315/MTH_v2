import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPage } from '@/components/LegalPage';
import { COMPANY, getDict, isLang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };

// TODO: remove "robots" once the real legal text is in place.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: getDict(lang).legal.imprintTitle, robots: { index: false } };
}

export default async function Imprint({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDict(lang);

  return (
    <LegalPage lang={lang} back={d.legal.back} title={d.legal.imprintTitle}>
      <dl>
        <div>
          <dt>{COMPANY.name}</dt>
          <dd>
            {COMPANY.street}, {COMPANY.zip} {COMPANY.city}
          </dd>
        </div>
        <div>
          <dt>{d.contact.phone} / {d.contact.fax}</dt>
          <dd>
            {COMPANY.phone} / {COMPANY.fax}
          </dd>
        </div>
        <div>
          <dt>{d.contact.email}</dt>
          <dd>{COMPANY.email}</dd>
        </div>
        {/* TODO: fill in from the current legal notice: managing director, commercial register, VAT ID, ... */}
        {/*<div>
          <dt>Geschäftsführer / Managing director</dt>
          <dd>[TODO]</dd>
        </div>
        <div>
          <dt>Handelsregister / Commercial register</dt>
          <dd>[TODO]</dd>
        </div>
        <div>
          <dt>USt-IdNr. / VAT ID</dt>
          <dd>[TODO]</dd>
        </div>*/}
      </dl> 
      <p className="note-box">{d.legal.todo}</p> 
    </LegalPage>
  );
}
