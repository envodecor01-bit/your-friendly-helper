import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeUp } from "./SplitReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TIMELINE = [
  { year: "2020", title: "First lines of code", note: "Started with HTML/CSS, fell in love with the web." },
  { year: "2022", title: "Discovered React", note: "Began building real interfaces, shipped first side projects." },
  { year: "2023", title: "Diving into AI", note: "LLMs, embeddings, agents — explored what AI can do for product." },
  { year: "2024", title: "WebGL & motion", note: "Three.js, GLSL, Framer Motion. Interfaces became experiences." },
  { year: "2025", title: "Building in public", note: "Now shipping AI-powered tools and creative tech experiments." },
];

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGRectElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const dots = dotsRef.current.filter(Boolean) as HTMLDivElement[];
      const blocks = blocksRef.current.filter(Boolean) as HTMLDivElement[];
      if (!dots.length || !blocks.length || !pinRef.current || !sectionRef.current) return;

      // Initial states
      gsap.set(blocks, { opacity: 0.15, y: 24, filter: "blur(4px)" });
      gsap.set(dots, { scale: 0.6, opacity: 0.35, boxShadow: "0 0 0px oklch(0.85 0.18 340 / 0)" });
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: pinRef.current,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // line draw
          gsap.to(lineRef.current, { scaleY: Math.min(1, p / 0.95), duration: 0.2, overwrite: true });
          // subtle camera zoom + tint shift
          if (stageRef.current) {
            gsap.to(stageRef.current, {
              scale: 1 + p * 0.04,
              duration: 0.3,
              overwrite: true,
              ease: "power2.out",
            });
          }
          if (tintRef.current) {
            const hue = 270 + p * 80;
            tintRef.current.style.background = `radial-gradient(ellipse at 50% ${
              30 + p * 40
            }%, oklch(0.4 0.15 ${hue} / 0.18), transparent 60%)`;
          }

          // milestone activation — distribute over 0.1 → 0.95
          const range = [0.08, 0.95];
          const steps = TIMELINE.length;
          const idx = Math.min(
            steps - 1,
            Math.max(0, Math.floor(((p - range[0]) / (range[1] - range[0])) * steps)),
          );
          setActive(idx);

          dots.forEach((d, i) => {
            const isActive = i === idx;
            const isPast = i < idx;
            gsap.to(d, {
              scale: isActive ? 1.35 : isPast ? 1 : 0.65,
              opacity: isActive ? 1 : isPast ? 0.85 : 0.35,
              duration: 0.5,
              overwrite: true,
              ease: "power2.out",
            });
          });

          blocks.forEach((b, i) => {
            const isActive = i === idx;
            const isPast = i < idx;
            gsap.to(b, {
              opacity: isActive ? 1 : isPast ? 0.55 : 0.15,
              y: isActive ? -4 : 0,
              filter: isActive ? "blur(0px)" : isPast ? "blur(0.5px)" : "blur(4px)",
              duration: 0.6,
              overwrite: true,
              ease: "power3.out",
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: "400vh" }}
    >
      {/* section blends */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-40 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />

      <div
        ref={pinRef}
        className="relative flex h-screen items-center overflow-hidden px-6 md:px-12"
      >
        {/* shifting tint backdrop */}
        <div
          ref={tintRef}
          className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-700"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, oklch(0.4 0.15 270 / 0.15), transparent 60%)",
          }}
        />

        <div ref={stageRef} className="relative mx-auto w-full max-w-5xl will-change-transform">
          <FadeUp className="mb-12 max-w-2xl">
            <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
              07 / Journey
            </div>
            <h2 className="font-display mt-4 text-4xl font-light md:text-5xl lg:text-6xl">
              How I got <span className="gradient-text">here.</span>
            </h2>
          </FadeUp>

          <div className="relative">
            {/* SVG timeline line with gradient + animated draw */}
            <svg
              className="pointer-events-none absolute left-3 top-0 h-full w-1 md:left-1/2 md:-translate-x-1/2"
              preserveAspectRatio="none"
              viewBox="0 0 2 100"
              aria-hidden
            >
              <defs>
                <linearGradient id="journey-line" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.18 280)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="oklch(0.8 0.18 340)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.85 0.15 30)" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* faint base */}
              <rect x="0.7" y="0" width="0.6" height="100" fill="oklch(1 0 0 / 0.06)" />
              {/* animated draw */}
              <rect
                ref={lineRef}
                x="0.5"
                y="0"
                width="1"
                height="100"
                fill="url(#journey-line)"
              />
            </svg>

            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={t.year}
                  className={`relative mb-6 flex items-center md:mb-3 ${
                    left ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* dot */}
                  <div className="absolute left-3 z-10 -translate-x-1/2 md:left-1/2">
                    <div
                      ref={(el) => {
                        dotsRef.current[i] = el;
                      }}
                      className="relative h-3.5 w-3.5 rounded-full bg-accent will-change-transform"
                      style={{
                        boxShadow:
                          active === i
                            ? "0 0 24px oklch(0.85 0.18 340 / 0.7), 0 0 4px oklch(0.85 0.18 340 / 0.9)"
                            : "0 0 0 oklch(0.85 0.18 340 / 0)",
                        transition: "box-shadow 400ms ease",
                      }}
                    >
                      {active === i && (
                        <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-accent/40" />
                      )}
                    </div>
                  </div>

                  <div className="ml-10 w-full md:ml-0 md:w-1/2 md:px-12">
                    <div
                      ref={(el) => {
                        blocksRef.current[i] = el;
                      }}
                      className={`will-change-transform ${left ? "md:text-right" : "md:text-left"}`}
                    >
                      <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-accent">
                        {t.year}
                      </div>
                      <h3 className="font-display mt-2 text-xl font-light text-foreground md:text-2xl">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/65">{t.note}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>

          {/* progress hint */}
          <div className="mt-10 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.32em] text-foreground/40">
            <span>↓ Scroll through time</span>
            <span className="text-foreground/60">
              {String(active + 1).padStart(2, "0")} / {String(TIMELINE.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
