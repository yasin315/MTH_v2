import type { CSSProperties } from 'react';
import type { Dict } from '@/lib/dictionaries/de';
import { serviceIcons } from './ServiceIcons';

const MATERIAL_COLORS = ['#B7C6D4', '#4F6F92', '#8FA9C2'];

export function Services({ materials, services }: { materials: Dict['materials']; services: Dict['services'] }) {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2>{materials.title}</h2>
          <p>{materials.lead}</p>
        </div>

        <div className="materials stagger" data-reveal>
          {materials.items.map((m, i) => (
            <div className="mat" key={m.name} style={{ '--m': MATERIAL_COLORS[i] } as CSSProperties}>
              <div className="sw" />
              <h3>{m.name}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <div className="services stagger" data-reveal>
          {services.items.map((s, i) => (
            <article className="svc" key={s.title}>
              {serviceIcons[i]}
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="spec">{s.spec}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
