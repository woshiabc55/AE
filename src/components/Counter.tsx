import { useEffect, useState } from 'react';

interface Props {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function Counter({ end, duration = 1800, suffix = '', className = '' }: Props) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      // ease-out
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(e * end));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setV(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <span className={`counter-pulse ${className}`}>{v.toLocaleString('en-US')}{suffix}</span>;
}
