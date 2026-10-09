import Link from 'next/link';
import { COMPANY, type Lang } from '@/lib/i18n';
import type { Dict } from '@/lib/dictionaries/de';

export function Footer({ lang, d }: { lang: Lang; d: Dict['footer'] }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div>
            <h2>{COMPANY.name}</h2>
            <p>
              {COMPANY.street}
              <br />
              {COMPANY.zip} {COMPANY.city}
              <br />
              {d.phone} {COMPANY.phone}
            </p>
          </div>
          <div>
            <h2>{d.legal}</h2>
            <ul>
              <li>
                <Link href={`/${lang}/impressum`}>{d.imprint}</Link>
              </li>
              <li>
                <Link href={`/${lang}/datenschutz`}>{d.privacy}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{d.funding}</h2>
            <p>{d.fundingText}</p>
            <p style={{ marginTop: 8 }}>
              {/* TODO: copy efre.pdf into /public and link it locally once the old website is switched off */}
              <a href="https://www.mth-halle.de/index_htm_files/efre.pdf" target="_blank" rel="noopener noreferrer">
                {d.erdf}
              </a>
            </p>
          </div>
        </div>
        <p className="copy">{d.copyright}</p>
      </div>
    </footer>
  );
}
