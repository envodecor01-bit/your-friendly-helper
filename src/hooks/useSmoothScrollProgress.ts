import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scrollTo";

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll + global progress (0..1). Integrates Lenis with GSAP ScrollTrigger. */
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

    // CRITICAL: Tell ScrollTrigger to update on every Lenis scroll tick so
    // pinned/scrubbed sections (HorizontalScroll, WebsiteShowcase, StackEcosystem)
    // stay aligned with the smoothed scroll position.
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      // Drive Lenis from gsap's ticker so it shares the same RAF as ScrollTrigger
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
    };

    const loop = () => {
      updateProgress();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // Refresh ScrollTrigger after Lenis is ready so pin offsets are correct
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      setLenis(null);
      gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
      });
    };
  }, []);

  return progress;
}
