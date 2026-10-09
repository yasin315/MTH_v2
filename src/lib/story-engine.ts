/**
 * Scroll-driven "from data to part" animation.
 *
 * The section is a tall track (.story) with a sticky stage inside. Scroll progress through the
 * track (0..1) is split into five scenes. Every SVG element with data-fx / data-r attributes is
 * animated from that progress:
 *   data-fx="dash|fade|slide|grow"   how the element reacts
 *   data-r="a,b"                     fade/draw in between a and b (0..1 inside the scene)
 *   data-r="a,b,c,d"                 fade in a..b, fade out c..d
 *   data-d="dx,dy"                   start offset for "slide"
 *   data-w="470"                     final width for "grow"
 * Scenes 3 (laser), 4 (press brake) and 5 (weld sparks) have extra custom code below.
 */

const NS = 'http://www.w3.org/2000/svg';

type FxKind = 'dash' | 'fade' | 'slide' | 'grow';
interface Fx {
  el: SVGElement;
  scene: number;
  kind: FxKind;
  r: number[];
  d: number[];
  w: number;
}
interface Seg {
  a: number;
  b: number;
  path: SVGGeometryElement & { _len?: number };
  tx: number;
  ty: number;
  s: number;
}

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

function mk<K extends string>(name: K, attrs: Record<string, string | number>, parent?: Element): SVGElement {
  const e = document.createElementNS(NS, name) as SVGElement;
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(e);
  return e;
}

// Part geometry, identical to the part in the hero drawing.
const GEO = {
  out: 'M60 60H400L500 160V360Q500 400 460 400H100Q60 400 60 360Z',
  holes: [
    'M108 130a22 22 0 1 0 44 0a22 22 0 1 0-44 0Z',
    'M108 330a22 22 0 1 0 44 0a22 22 0 1 0-44 0Z',
    'M252 190H368a22 22 0 0 1 0 44H252a22 22 0 0 1 0-44Z',
    'M424 300a16 16 0 1 0 32 0a16 16 0 1 0-32 0Z',
  ],
};

export function startStory(track: HTMLElement, opts: { of: string }): () => void {
  const stick = track.querySelector<HTMLElement>('.stick');
  const svg = track.querySelector<SVGSVGElement>('#storySvg');
  const tag = track.querySelector<HTMLElement>('#stageTag');
  const hint = track.querySelector<HTMLElement>('#hint');
  if (!stick || !svg || !tag || !hint) return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = Array.from(svg.querySelectorAll<SVGGElement>('.scene'));
  const N = scenes.length;
  const lis = Array.from(track.querySelectorAll<HTMLElement>('#steps li'));
  const dots = Array.from(track.querySelectorAll<HTMLButtonElement>('#dots button'));
  const defs = svg.querySelector('defs')!;
  const created: Element[] = [];
  const add = <T extends SVGElement>(e: T): T => {
    created.push(e);
    return e;
  };

  // ---- geometry definitions (shared by <use> elements) ----
  add(mk('path', { id: 'pOut', d: GEO.out, pathLength: 1 }, defs));
  add(mk('path', { id: 'pFill', d: GEO.out + GEO.holes.join(''), 'fill-rule': 'evenodd' }, defs));
  GEO.holes.forEach((d, i) => add(mk('path', { id: 'pH' + i, d, pathLength: 1 }, defs)));

  // hidden clones used to measure the position of the laser tip
  const measOut = add(mk('path', { d: GEO.out, visibility: 'hidden', fill: 'none' }, svg)) as unknown as Seg['path'];
  const measHoles = GEO.holes.map(
    (d) => add(mk('path', { d, visibility: 'hidden', fill: 'none' }, svg)) as unknown as Seg['path'],
  );
  measOut._len = measOut.getTotalLength();
  measHoles.forEach((p) => (p._len = p.getTotalLength()));

  interface PartOpts {
    stroke: string;
    sw: number;
    fill?: string;
    fillR?: number[];
    out?: number[];
    holes?: number[][];
  }
  function part(parent: Element, s: number, X: number, Y: number, o: PartOpts) {
    const tf = `translate(${X - 60 * s} ${Y - 60 * s}) scale(${s})`;
    const sw = o.sw / s;
    if (o.fill && o.fillR)
      add(mk('use', { href: '#pFill', transform: tf, fill: o.fill, stroke: 'none', 'data-fx': 'fade', 'data-r': o.fillR.join(',') }, parent));
    if (o.out)
      add(
        mk(
          'use',
          { href: '#pOut', transform: tf, fill: 'none', stroke: o.stroke, 'stroke-width': sw, 'stroke-linejoin': 'round', 'data-fx': 'dash', 'data-r': o.out.join(',') },
          parent,
        ),
      );
    o.holes?.forEach((r, k) =>
      add(mk('use', { href: '#pH' + k, transform: tf, fill: 'none', stroke: o.stroke, 'stroke-width': sw, 'data-fx': 'dash', 'data-r': r.join(',') }, parent)),
    );
    return { tx: X - 60 * s, ty: Y - 60 * s, s };
  }

  // Scene 1: drawing on paper
  const s1 = svg.querySelector('#s1part');
  if (s1)
    part(s1, 0.9, 200, 62, {
      stroke: '#1A2229',
      sw: 3,
      fill: '#D3DEE8',
      fillR: [0.42, 0.62],
      out: [0.08, 0.42],
      holes: [[0.4, 0.5], [0.43, 0.53], [0.46, 0.56], [0.49, 0.59]],
    });

  // Scene 2: nesting on the sheet
  const g2 = svg.querySelector('#nest2');
  if (g2) {
    for (let j = 0; j < 2; j++)
      for (let i = 0; i < 4; i++) {
        const a = 0.24 + (j * 4 + i) * 0.045;
        part(g2, 0.2, 84 + i * 102, 86 + j * 98, { stroke: '#3AA9F0', sw: 1.8, out: [a, a + 0.08] });
      }
  }

  // Scene 3: laser cutting, holes first, contour last
  const g3 = svg.querySelector('#nest3');
  const segs: Seg[] = [];
  if (g3) {
    const w = 0.11;
    for (let j = 0; j < 2; j++)
      for (let i = 0; i < 4; i++) {
        const a = 0.04 + (j * 4 + i) * w;
        const holes: number[][] = [];
        for (let k = 0; k < 4; k++) holes.push([a + k * 0.15 * w, a + (k + 1) * 0.15 * w]);
        const out = [a + 0.6 * w, a + w];
        const t = part(g3, 0.34, 76 + i * 172, 100 + j * 172, {
          stroke: '#3AA9F0',
          sw: 2.2,
          fill: '#2A4D72',
          fillR: [a + w, a + w + 0.035],
          out,
          holes,
        });
        holes.forEach((h, k) => segs.push({ a: h[0], b: h[1], path: measHoles[k], ...t }));
        segs.push({ a: out[0], b: out[1], path: measOut, ...t });
      }
  }
  const laserG = svg.querySelector<SVGGElement>('#laserG');
  const sparkLines = Array.from(svg.querySelectorAll<SVGLineElement>('#sparks line'));
  function laser(t: number) {
    if (!laserG) return;
    const s = segs.find((x) => t > x.a && t < x.b);
    if (!s) {
      laserG.style.opacity = '0';
      return;
    }
    const len = s.path._len ?? 0;
    const pt = s.path.getPointAtLength(ease(clamp((t - s.a) / (s.b - s.a))) * len);
    laserG.setAttribute('transform', `translate(${(s.tx + s.s * pt.x).toFixed(1)} ${(s.ty + s.s * pt.y).toFixed(1)})`);
    laserG.style.opacity = '1';
    sparkLines.forEach((l) => {
      const an = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 22;
      l.setAttribute('x2', (Math.cos(an) * r).toFixed(1));
      l.setAttribute('y2', (Math.sin(an) * r).toFixed(1));
    });
  }

  // Scene 4: press brake bends the sheet, angle counts down from 180 to 90 degrees
  const ram = svg.querySelector('#ram');
  const punch = svg.querySelector('#punch');
  const sheet = svg.querySelector('#sheet4');
  const bend = svg.querySelector<SVGElement>('#bend4');
  const angT = svg.querySelector('#angTxt');
  function press(t: number) {
    if (!ram || !punch || !sheet || !bend || !angT) return;
    let cy = 300;
    let tip: number;
    if (t < 0.5) tip = lerp(70, 295, ease(t / 0.5));
    else {
      cy = 300 + 60 * ease((t - 0.5) / 0.5);
      tip = cy - 5;
    }
    const a = Math.atan2(cy - 300, 60);
    const dx = 150 * Math.cos(a);
    const dy = 150 * Math.sin(a);
    sheet.setAttribute('points', `${400 - dx},${cy - dy} 400,${cy} ${400 + dx},${cy - dy}`);
    bend.setAttribute('cy', String(cy));
    bend.style.opacity = t > 0.5 ? '1' : '0';
    punch.setAttribute('points', [372, tip - 120, 428, tip - 120, 428, tip - 50, 400, tip, 372, tip - 50].join(' '));
    ram.setAttribute('y', String(tip - 250));
    angT.textContent = Math.round(180 - (2 * a * 180) / Math.PI) + '°';
  }

  // Scene 5: weld sparks
  const weldSparks = svg.querySelector<SVGGElement>('#weldSparks');
  const weldLines = weldSparks ? Array.from(weldSparks.querySelectorAll<SVGLineElement>('line')) : [];
  function weld(t: number) {
    if (!weldSparks) return;
    const on = t > 0.33 && t < 0.55;
    weldSparks.style.opacity = on ? '1' : '0';
    if (!on) return;
    weldLines.forEach((l) => {
      const an = -Math.PI * (0.1 + Math.random() * 0.8);
      const r = 8 + Math.random() * 24;
      l.setAttribute('x2', (Math.cos(an) * r).toFixed(1));
      l.setAttribute('y2', (Math.sin(an) * r).toFixed(1));
    });
  }

  // ---- generic data-attribute effects ----
  const fx: Fx[] = [];
  svg.querySelectorAll<SVGElement>('[data-r]').forEach((el) => {
    const sceneAttr = el.getAttribute('data-scene');
    const scene = sceneAttr !== null ? Number(sceneAttr) : scenes.indexOf(el.closest('.scene') as SVGGElement);
    const kind = el.getAttribute('data-fx') as FxKind;
    if (kind === 'dash') {
      el.style.strokeDasharray = '1';
      if (el.tagName.toLowerCase() !== 'use') el.setAttribute('pathLength', '1');
    }
    fx.push({
      el,
      scene,
      kind,
      r: (el.getAttribute('data-r') ?? '0,1').split(',').map(Number),
      d: (el.getAttribute('data-d') ?? '0,0').split(',').map(Number),
      w: Number(el.getAttribute('data-w')) || 0,
    });
  });
  function ramp(t: number, r: number[]) {
    const up = t >= r[1] ? 1 : t <= r[0] ? 0 : (t - r[0]) / (r[1] - r[0]);
    if (r.length > 2) {
      const dn = t >= r[3] ? 1 : t <= r[2] ? 0 : (t - r[2]) / (r[3] - r[2]);
      return ease(up) * (1 - ease(dn));
    }
    return ease(up);
  }
  function apply(f: Fx, t: number) {
    const p = ramp(t, f.r);
    const e = f.el;
    if (f.kind === 'dash') e.style.strokeDashoffset = (1 - p).toFixed(4);
    else if (f.kind === 'fade') e.style.opacity = p.toFixed(3);
    else if (f.kind === 'slide') {
      e.style.opacity = p.toFixed(3);
      e.style.transform = `translate(${(f.d[0] * (1 - p)).toFixed(1)}px,${(f.d[1] * (1 - p)).toFixed(1)}px)`;
    } else if (f.kind === 'grow') e.setAttribute('width', (f.w * p).toFixed(1));
  }

  // ---- scroll progress ----
  let stickTop = 0;
  const measure = () => {
    stickTop = parseFloat(getComputedStyle(stick).top) || 0;
  };
  let raf = 0;
  let lastTag = '';
  function update() {
    raf = 0;
    const r = track.getBoundingClientRect();
    const range = track.offsetHeight - stick!.offsetHeight;
    const P = clamp((stickTop - r.top) / Math.max(range, 1));
    const cur = Math.min(N - 1, Math.floor(P * N));
    const ts: number[] = [];
    for (let i = 0; i < N; i++) ts[i] = clamp((P * N - i) / 0.85);

    scenes.forEach((s, i) => s.classList.toggle('on', i === cur));
    for (const f of fx) apply(f, ts[f.scene] ?? 0);
    laser(ts[2]);
    press(ts[3]);
    weld(ts[4]);

    lis.forEach((li, i) => {
      li.classList.toggle('on', i === cur);
      li.classList.toggle('done', i < cur);
      li.style.setProperty('--fill', (ts[i] * 100).toFixed(0) + '%');
    });
    dots.forEach((b, i) => (b.firstElementChild as HTMLElement | null)?.style.setProperty('--f', ts[i].toFixed(3)));

    const title = lis[cur]?.querySelector('h3')?.textContent ?? '';
    const label = `${cur + 1}|${title}`;
    if (label !== lastTag) {
      lastTag = label;
      const b = document.createElement('b');
      b.textContent = String(cur + 1);
      tag!.replaceChildren(b, ` ${opts.of} ${N}: ${title}`);
    }
    hint!.classList.toggle('gone', P > 0.02);
  }
  const req = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  const onResize = () => {
    measure();
    req();
  };
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', onResize);
  measure();
  update();

  // ---- click on a step to jump to it ----
  const smooth = reduce ? 'auto' : 'smooth';
  function jump(i: number) {
    const r = track.getBoundingClientRect();
    const range = track.offsetHeight - stick!.offsetHeight;
    window.scrollTo({ top: window.scrollY + r.top - stickTop + range * ((i + 0.03) / N), behavior: smooth });
  }
  const handlers: Array<[HTMLElement, () => void]> = [];
  [...lis, ...dots].forEach((el, idx) => {
    const i = idx % N;
    const h = () => jump(i);
    el.addEventListener('click', h);
    handlers.push([el, h]);
  });

  return () => {
    window.removeEventListener('scroll', req);
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
    handlers.forEach(([el, h]) => el.removeEventListener('click', h));
    created.forEach((e) => e.remove());
  };
}
