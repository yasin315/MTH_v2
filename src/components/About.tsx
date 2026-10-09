import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import type { Dict } from '@/lib/dictionaries/de';

export function About({ lang, d }: { lang: Lang; d: Dict['about'] }) {
  return (
    <section id="company" className="about">
      <div className="wrap about-grid">
        <div className="section-head" data-reveal>
          <h2>{d.title}</h2>
          <p>{d.text}</p>
          <p style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" href={`/${lang}#contact`}>
              {d.cta}
            </Link>
          </p>
        </div>
        <ol className="timeline" data-reveal>
          {d.timeline.map((t) => (
            <li key={t.year}>
              <b>{t.year}</b>
              <p>{t.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
