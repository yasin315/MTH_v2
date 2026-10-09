'use client';

import { useEffect, useRef } from 'react';
import type { Dict } from '@/lib/dictionaries/de';
import { startStory } from '@/lib/story-engine';
import { StorySvg } from './StorySvg';

export function ProcessStory({ d }: { d: Dict['process'] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track.current) return;
    return startStory(track.current, { of: d.of });
  }, [d.of]);

  return (
    <section id="process" className="process">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2>{d.title}</h2>
          <p>{d.lead}</p>
        </div>
      </div>

      <div className="story" id="story" ref={track}>
        <div className="stick">
          <div className="wrap story-grid">
            <div className="stage">
              {/* content is written by the story engine */}
              <div className="stage-tag" id="stageTag" suppressHydrationWarning />
              <StorySvg d={d} />
              <div className="hint" id="hint">
                {d.hint}
              </div>
            </div>

            <div>
              <div className="dots" id="dots">
                {d.steps.map((s, i) => (
                  <button type="button" key={s.title} aria-label={`${d.step} ${i + 1}: ${s.title}`}>
                    <i />
                  </button>
                ))}
              </div>
              <ol className="steps" id="steps">
                {d.steps.map((s, i) => (
                  <li className={i === 0 ? 'on' : ''} key={s.title}>
                    <div className="hd">
                      <span className="n">{i + 1}</span>
                      <h3>{s.title}</h3>
                    </div>
                    <div className="more">
                      <div>
                        <p>{s.text}</p>
                        <div className="chips">
                          {s.chips.map((c) => (
                            <i key={c}>{c}</i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
