import Link from 'next/link';
import type { ReactNode } from 'react';

export function LegalPage({ lang, back, title, children }: { lang: string; back: string; title: string; children: ReactNode }) {
  return (
    <section className="legal">
      <div className="wrap">
        <Link className="back" href={`/${lang}`}>
          {back}
        </Link>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}