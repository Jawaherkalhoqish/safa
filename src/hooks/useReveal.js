import { useEffect, useRef } from 'react';

/**
 * Adds the `reveal-in` class once the element scrolls into view.
 * The element must already carry the `reveal` class.
 * Respects prefers-reduced-motion and degrades gracefully.
 */
export default function useReveal({ delay = 0, threshold = 0.16 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in');
      el.style.transitionDelay = '0ms';
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('reveal-in');
          observer.unobserve(el);
        });
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return ref;
}