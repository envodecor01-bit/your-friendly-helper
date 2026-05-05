import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Wraps a section to create a continuous, cinematic flow between blocks:
 * - top + bottom gradient blend overlays (no hard edges)
 * - subtle scroll-driven scale, blur and opacity on enter/exit
 *
 * Keep it intentionally restrained — restraint is the premium feel.
 */
export function SectionFlow({
  children,
  className = "",
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  /** 0 = none, 1 = default subtle, 1.5 = pronounced */
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const k = reduce ? 0 : intensity;
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - 0.04 * k, 1, 1 - 0.02 * k]);
  const blurPx = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [6 * k, 0, 0, 4 * k]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Top + bottom blends — soften the seam between sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-32 bg-gradient-to-b from-background via-background/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-background via-background/60 to-transparent"
      />

      <motion.div
        style={{ scale, filter, opacity, willChange: "transform, filter, opacity" }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
