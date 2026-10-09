import Link from 'next/link';
import { HeroDrawing } from './HeroDrawing';
import { formatNumber, type Lang } from '@/lib/i18n';
import type { Dict } from '@/lib/dictionaries/de';

export function Hero({ lang, d }: { lang: Lang; d: Dict['hero'] }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <h1>{d.title}</h1>
            <p className="lead">{d.lead}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/${lang}#contact`}>
                {d.cta}
              </Link>
              <Link className="btn btn-ghost" href={`/${lang}#process`}>
                {d.secondary}
              </Link>
            </div>
          </div>
          <HeroDrawing label={d.drawing} bendLine={d.bendLine} />
        </div>
        <div className="facts" data-reveal>
          {d.facts.map((f) => (
            <div className="fact" key={f.label}>
              <b>
                <span data-count={f.value}>{formatNumber(f.value, lang)}</span>
                <small>{f.unit}</small>
              </b>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
