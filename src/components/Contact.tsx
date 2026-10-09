import { COMPANY, type Lang } from '@/lib/i18n';
import type { Dict } from '@/lib/dictionaries/de';
import { ContactForm } from './ContactForm';

export function Contact({ lang, d }: { lang: Lang; d: Dict['contact'] }) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${COMPANY.street} ${COMPANY.zip} Halle`)}`;
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2>{d.title}</h2>
          <p>{d.lead}</p>
        </div>
        <div className="contact-grid" data-reveal>
          <dl>
            <div>
              <dt>{d.phone}</dt>
              <dd>
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              </dd>
            </div>
            <div>
              <dt>{d.email}</dt>
              <dd>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                <small>
                  <a href={`mailto:${COMPANY.email2}`} style={{ border: 0 }}>
                    {COMPANY.email2}
                  </a>
                </small>
              </dd>
            </div>
            <div>
              <dt>{d.address}</dt>
              <dd>
                MTH GmbH
                <br />
                {COMPANY.street}
                <br />
                {COMPANY.zip} {COMPANY.city}
                <small>
                  <a href={maps} target="_blank" rel="noopener noreferrer">
                    {d.route}
                  </a>
                </small>
              </dd>
            </div>
            <div>
              <dt>{d.fax}</dt>
              <dd>{COMPANY.fax}</dd>
            </div>
          </dl>
          <ContactForm lang={lang} d={d.form} />
        </div>
      </div>
    </section>
  );
}
