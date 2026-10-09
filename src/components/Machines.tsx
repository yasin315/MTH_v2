import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { formatNumber, type Lang } from '@/lib/i18n';
import type { Dict } from '@/lib/dictionaries/de';
import { machineIcons } from './MachineIcons';

function Meter(props: { lang: Lang; value: number; unit: string; label: string; width: string; prefix?: string }) {
  return (
    <div className="meter">
      <div className="mv">
        {props.prefix}
        <span data-count={props.value}>{formatNumber(props.value, props.lang)}</span>
        <small>{props.unit}</small>
      </div>
      <div className="ml">{props.label}</div>
      <div className="bar" style={{ '--w': props.width } as CSSProperties}>
        <i />
      </div>
    </div>
  );
}

function Row(props: { src: string; alt: string; tag: string; name: string; use: string; children: ReactNode }) {
  return (
    <article className="mrow" data-reveal>
      <figure className="photo">
        <Image src={props.src} alt={props.alt} width={250} height={200} sizes="(max-width: 720px) 100vw, 250px" />
      </figure>
      <div className="minfo">
        <span className="tag">{props.tag}</span>
        <h3>{props.name}</h3>
        <p className="use">{props.use}</p>
        {props.children}
      </div>
    </article>
  );
}

export function Machines({ lang, d }: { lang: Lang; d: Dict['machines'] }) {
  return (
    <section id="machines">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2>{d.title}</h2>
          <p>{d.lead}</p>
        </div>

        <h3 className="group-title">{d.cutting}</h3>
        <div className="mlist">
          <Row src="/machines/trumatic-6000.jpg" alt={d.alt.trumatic} tag={d.cutting} name="Trumatic 6000" use={d.trumatic.use}>
            <div className="chips2">
              {d.trumatic.chips.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </Row>
          <Row src="/machines/multitherm.jpg" alt={d.alt.multitherm} tag={d.cutting} name="MultiTherm mit HiFocus" use={d.multitherm.use}>
            <div className="meters">
              <Meter lang={lang} value={120} unit="mm" label={d.multitherm.thickness} width="100%" />
              <Meter lang={lang} value={6} unit="m" label={d.multitherm.length} width="100%" prefix={d.multitherm.approx} />
            </div>
          </Row>
        </div>

        <h3 className="group-title">{d.forming}</h3>
        <div className="mlist">
          <Row src="/machines/trubend-5230.jpg" alt={d.alt.tb5230} tag={d.forming} name="TruBend 5230" use={d.tb5230.use}>
            <div className="meters">
              <Meter lang={lang} value={3230} unit="mm" label={d.tb5230.length} width="100%" />
              <Meter lang={lang} value={2300} unit="kN" label={d.tb5230.force} width="100%" />
            </div>
          </Row>
          <Row src="/machines/trubend-7036.jpg" alt={d.alt.tb7036} tag={d.forming} name="TruBend 7036" use={d.tb7036.use}>
            <div className="meters">
              <Meter lang={lang} value={1020} unit="mm" label={d.tb5230.length} width="32%" />
              <Meter lang={lang} value={360} unit="kN" label={d.tb5230.force} width="16%" />
            </div>
            <p className="cmp">{d.tb7036.cmp}</p>
          </Row>
        </div>

        <h3 className="group-title">{d.more}</h3>
        <div className="more-grid stagger" data-reveal>
          {d.extra.map((m, i) => (
            <article className="mc2" key={m.name}>
              {machineIcons[i]}
              <h3>{m.name}</h3>
              <p>{m.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
