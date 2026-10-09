'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dict } from '@/lib/dictionaries/de';
import { LOCALES, type Lang } from '@/lib/locales';

const ITEMS = ['services', 'process', 'machines', 'company', 'contact'] as const;

export function Header({ lang, d }: { lang: Lang; d: Dict['nav'] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(/^\/(de|en)(?=\/|$)/, '');
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href={`/${lang}`} aria-label={d.home} onClick={close}>
          <span className="logo-tile">
            <Image src="/logo-mth.png" alt="MTH GmbH" width={217} height={138} priority style={{ height: 38, width: 'auto' }} />
          </span>
          <span className="brand-text">
            <strong>Metall Technologie Höhne</strong>
            <span>Halle (Saale)</span>
          </span>
        </Link>

        <nav className={`nav${open ? ' open' : ''}`} id="nav" aria-label={d.main}>
          {ITEMS.map((id) => (
            <Link key={id} href={`/${lang}#${id}`} onClick={close}>
              {d[id]}
            </Link>
          ))}
          <Link className="btn btn-primary" href={`/${lang}#contact`} onClick={close}>
            {d.cta}
          </Link>
        </nav>

        <div className="lang" role="group" aria-label={d.lang}>
          {LOCALES.map((l) => (
            <Link key={l} href={`/${l}${rest}`} hrefLang={l} lang={l} scroll={false} aria-current={l === lang ? 'true' : undefined}>
              {l.toUpperCase()}
            </Link>
          ))}
        </div>

        <button className="menu-btn" type="button" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          {d.menu}
        </button>
      </div>
    </header>
  );
}
