import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

function CharReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em] leading-[1.05]">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ delay: delay + i * 0.045, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block pb-[0.05em]"
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const STATS = [
  { k: "30+", v: "Shipped projects" },
  { k: "5★", v: "Avg client rating" },
  { k: "AI", v: "First-class skill" },
  { k: "24h", v: "Avg reply time" },
];

const CAPABILITIES = [
  "Web Development",
  "AI Integration",
  "Interactive UI",
  "Three.js / WebGL",
  "Motion Design",
  "Product Thinking",
  "Performance",
  "Design Systems",
];

export function ImmersiveAbout() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  // Parallax
  const yLabel = useTransform(smooth, [0, 1], [60, -60]);
  const yTitle = useTransform(smooth, [0, 1], [120, -120]);
  const yPortrait = useTransform(smooth, [0, 1], [80, -120]);
  const rotPortrait = useTransform(smooth, [0, 1], [-4, 4]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
  }, [scrollYProgress]);

  // Soft animated noise / particle aurora
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    const parts: P[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts.length = 0;
      const n = Math.min(90, Math.floor((w * h) / 22000));
      for (let i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 0.3,
          hue: 320 + Math.random() * 50,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const p = progressRef.current;
      // Aurora blobs
      const cx = w / 2 + Math.sin(p * Math.PI * 2) * 80;
      const cy = h / 2 + Math.cos(p * Math.PI * 2) * 60;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      grad.addColorStop(0, "oklch(0.55 0.18 340 / 0.18)");
      grad.addColorStop(0.5, "oklch(0.4 0.12 320 / 0.08)");
      grad.addColorStop(1, "oklch(0.05 0.02 320 / 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const a of parts) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0) a.x = w;
        if (a.x > w) a.x = 0;
        if (a.y < 0) a.y = h;
        if (a.y > h) a.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `oklch(0.85 0.12 ${a.hue} / 0.5)`;
        ctx.shadowColor = `oklch(0.8 0.15 ${a.hue} / 0.7)`;
        ctx.shadowBlur = 8;
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Cursor-tracked spotlight
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const sx = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const sy = useSpring(cursorY, { stiffness: 80, damping: 20 });
  const spotBg = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}% ${y}%, oklch(0.75 0.18 340 / 0.18), transparent 60%)`,
  );

  return (
    <section
      id="about"
      ref={rootRef}
      onMouseMove={(e) => {
        const r = rootRef.current?.getBoundingClientRect();
        if (!r) return;
        cursorX.set(((e.clientX - r.left) / r.width) * 100);
        cursorY.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden bg-background py-32 md:py-44"
    >
      {/* Top + bottom blends so the section flows in/out cleanly */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-40 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />

      {/* Aurora canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-90" />

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: spotBg }}
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.06_0.03_330_/_0.7)_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* Section index */}
        <motion.div
          style={{ y: yLabel }}
          className="flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent"
        >
          <div className="flex items-center gap-3">
            <span>01 / About</span>
            <span className="h-px w-10 bg-accent/60" />
            <span className="text-foreground/50">Profile</span>
          </div>
          <span className="hidden text-foreground/40 md:inline">[ EST. 2021 — New Delhi, IN ]</span>
        </motion.div>

        {/* Hero name block */}
        <motion.div style={{ y: yTitle }} className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <h2 className="font-display text-[clamp(2.6rem,8vw,6.5rem)] font-light leading-[0.92] tracking-tight">
              <CharReveal text="Anushka" className="block text-foreground/95" />
              <CharReveal text="Mishra" className="block gradient-text text-glow" delay={0.35} />
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-tech text-[11px] uppercase tracking-[0.32em] text-foreground/70">
              <motion.span whileHover={{ y: -3 }} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-foreground cursor-default">
                Web Developer
              </motion.span>
              <motion.span whileHover={{ y: -3 }} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-foreground cursor-default">
                AI Builder
              </motion.span>
              <motion.span whileHover={{ y: -3 }} className="rounded-full border border-foreground/20 px-3 py-1 text-foreground/80 cursor-default">
                Creative Technologist
              </motion.span>
            </div>
          </div>

          {/* Portrait card */}
          <motion.div
            style={{ y: yPortrait, rotate: rotPortrait }}
            className="relative md:col-span-4"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl" />
            <div className="relative aspect-[0.8] overflow-hidden rounded-[1.75rem] border border-primary/30 bg-card/50 backdrop-blur-xl">
              <img
                src="/photo.jpeg"
                alt="Anushka Mishra"
                className="h-full w-full object-cover saturate-[0.95]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <div className="font-mono-tech text-[9px] uppercase tracking-[0.32em] text-foreground/60">
                    Signal
                  </div>
                  <div className="mt-1 font-display text-lg text-foreground">Online</div>
                </div>
                <div className="flex items-center gap-1.5 font-mono-tech text-[9px] uppercase tracking-[0.32em] text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Available
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bio paragraphs */}
        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-accent/80">
              [ The short version ]
            </div>
            <p className="mt-4 font-display text-2xl font-light leading-snug text-foreground/90 md:text-3xl">
              I design and build <span className="gradient-text">intelligent</span>, interactive
              experiences for the modern web — where motion, AI and clean engineering meet.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6 text-base leading-relaxed text-foreground/70 md:text-lg">
            <p>
              I'm <span className="text-foreground">Anushka Mishra</span> — a web developer & AI
              builder based in New Delhi. I work with founders, studios and creators to ship
              products that feel as good as they look: high-performance React apps, AI-powered
              tools, and immersive 3D / motion-driven interfaces.
            </p>
            <p>
              My obsession sits at the intersection of <span className="text-accent">code</span>,
              <span className="text-accent"> design</span> and <span className="text-accent">AI</span>.
              From RAG agents and automation flows to shader-heavy landing pages, I treat every
              project as a small product — not a deliverable.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-2 divide-foreground/10 border-y border-foreground/10 md:grid-cols-4 md:divide-x">
          {STATS.map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 py-8"
            >
              <div className="font-display text-4xl font-light text-foreground md:text-5xl">
                {s.k}
              </div>
              <div className="mt-2 font-mono-tech text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                {s.v}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee capabilities */}
        <div className="relative mt-16 overflow-hidden">
          <div className="flex w-max gap-12 animate-[marquee_28s_linear_infinite] font-display text-3xl text-foreground/40 md:text-5xl">
            {[...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES].map((c, i) => (
              <span key={i} className="flex items-center gap-12">
                {c}
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Signature row */}
        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-foreground/10 pt-10 md:flex-row md:items-end">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-foreground/50">
            Currently · Open to freelance & collabs
          </div>
          <a
            href="#contact"
            data-hover
            className="group inline-flex items-center gap-3 font-display text-2xl text-foreground transition-colors hover:text-accent md:text-3xl"
          >
            Let's build something
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
