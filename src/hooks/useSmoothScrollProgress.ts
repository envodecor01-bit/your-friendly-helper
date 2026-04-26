import { useEffect, useState } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scrollTo";

/** Smooth scroll + global progress (0..1). */
export function useSmoothScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId: number;
    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          duration: 1.35,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.82,
          touchMultiplier: 1.08,
        });

    setLenis(lenis);

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
    };

    const loop = (time: number) => {
      lenis?.raf(time);
      updateProgress();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return progress;
}
