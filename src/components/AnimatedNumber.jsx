import { useEffect, useRef, useState } from 'react';

export default function AnimatedNumber({ value = 0, decimals = 0, suffix = '', className }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef();
  const target = Number(value) || 0;

  useEffect(() => {
    const start = performance.now();
    const from = display;
    const duration = 700;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const text = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span className={className}>
      {text}
      {suffix}
    </span>
  );
}