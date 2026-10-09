import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Hero } from '@/components/Hero';
import { Machines } from '@/components/Machines';
import { ProcessStory } from '@/components/ProcessStory';
import { Services } from '@/components/Services';
import { COMPANY, SITE_URL, getDict, isLang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: { de: `${SITE_URL}/de`, en: `${SITE_URL}/en`, 'x-default': `${SITE_URL}/de` },
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDict(lang);

  // Structured data for search engines (company name, address, phone)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.name,
    url: `${SITE_URL}/${lang}`,
    telephone: '+49 345 6811811',
    email: COMPANY.email,
    foundingDate: String(COMPANY.founded),
    description: d.meta.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      postalCode: COMPANY.zip,
      addressLocality: 'Halle (Saale)',
      addressCountry: 'DE',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Hero lang={lang} d={d.hero} />
      <Services materials={d.materials} services={d.services} />
      <ProcessStory d={d.process} />
      <Machines lang={lang} d={d.machines} />
      <About lang={lang} d={d.about} />
      <Contact lang={lang} d={d.contact} />
    </>
  );
}
