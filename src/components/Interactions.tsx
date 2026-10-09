'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { formatNumber, type Lang } from '@/lib/i18n';

/**
 * Global page behaviour: reveal-on-scroll for [data-reveal] blocks and count-up numbers
 * for [data-count]. Numbers are rendered in full on the server (works without JS) and
 * reset to 0 here before the first paint so they can count up when they scroll into view.
 */
export function Interactions({ lang }: { lang: Lang }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      if (!el.closest('.in')) el.textContent = '0';
    });
  }, [pathname, lang]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      if (reduce) {
        el.textContent = formatNumber(to, lang);
        return;
      }
      let t0: number | null = null;
      const step = (t: number) => {
        t0 = t0 ?? t;
        const p = 1 - Math.pow(1 - Math.min(1, (t - t0) / 1400), 3);
        el.textContent = formatNumber(Math.round(to * p), lang);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const target = e.target as HTMLElement;
          target.classList.add('in');
          target.querySelectorAll<HTMLElement>('[data-count]').forEach(count);
          io.unobserve(target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, lang]);

  return null;
}
