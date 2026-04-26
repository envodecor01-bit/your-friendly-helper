import { useEffect, useState } from "react";

/** Smooth scroll + global progress (0..1). */
export function useSmoothScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
    };

    const loop = () => {
      onScroll();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
