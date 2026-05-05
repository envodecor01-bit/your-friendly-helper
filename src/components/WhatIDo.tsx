import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code2, Sparkles, Layers, X } from "lucide-react";
import { FadeUp } from "./SplitReveal";

type CardId = "web" | "ai" | "ux";

const ITEMS: {
  id: CardId;
  icon: typeof Code2;
  title: string;
  desc: string;
  longDesc: string;
  accent: string;
  tags: string[];
}[] = [
  {
    id: "web",
    icon: Code2,
    title: "Modern Web Apps",
    desc: "Fast, reactive interfaces in React, Next.js & TypeScript — built to feel weightless.",
    longDesc:
      "Production-grade React / Next.js apps with type-safe APIs, edge-ready backends, real-time data and obsessive performance budgets.",
    accent: "from-primary/40 to-accent/20",
    tags: ["React", "Next.js", "TypeScript", "Edge", "Tailwind"],
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI-Powered Tools",
    desc: "Agents, RAG systems and creative AI workflows that actually do useful things.",
    longDesc:
      "From chat agents and RAG pipelines to multi-step automations — I design AI products that are reliable, observable, and feel native.",
    accent: "from-accent/40 to-primary/20",
    tags: ["OpenAI", "LangGraph", "RAG", "Embeddings", "Agents"],
  },
  {
    id: "ux",
    icon: Layers,
    title: "Interactive UI/UX",
    desc: "Shaders, motion, micro-interactions — the small details that make products memorable.",
    longDesc:
      "Three.js, GSAP and shader work used with restraint — to make interfaces feel alive without ever fighting the content.",
    accent: "from-primary-glow/40 to-accent/20",
    tags: ["Three.js", "GSAP", "GLSL", "Framer", "Lenis"],
  },
];

export function WhatIDo() {
  const [expanded, setExpanded] = useState<CardId | null>(null);
  const [explore, setExplore] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const sx = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const sy = useSpring(cursorY, { stiffness: 80, damping: 20 });
  const spotBg = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(700px circle at ${x}% ${y}%, oklch(0.8 0.18 340 / 0.14), transparent 60%)`,
  );

  return (
    <section
      id="what"
      ref={sectionRef}
      onMouseMove={(e) => {
        const r = sectionRef.current?.getBoundingClientRect();
        if (!r) return;
        cursorX.set(((e.clientX - r.left) / r.width) * 100);
        cursorY.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative overflow-hidden px-6 py-32 md:px-12 md:py-40"
    >
      {/* Section blends top + bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-40 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />

      {/* Soft glow backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-[40vmin] w-[40vmin] rounded-full bg-accent/10 blur-[100px]" />
      </div>
      {/* Cursor spotlight */}
      <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: spotBg }} />

      <div className="relative mx-auto max-w-6xl">
        <FadeUp className="mb-12 max-w-2xl">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
            02 / What I Do
          </div>
          <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-6xl">
            I build at the edge of <span className="gradient-text text-glow">code & creativity.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/60 md:text-base">
            Hover a module to wake it up · click to step inside.
          </p>
        </FadeUp>

        {/* Explore Mode toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-foreground/50">
            {explore ? "Drag the cards · physics on" : "Grid layout"}
          </div>
          <button
            data-hover
            onClick={() => setExplore((v) => !v)}
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tech text-[10px] uppercase tracking-[0.28em] transition-all ${
              explore
                ? "border-accent bg-accent/15 text-accent shadow-[0_0_20px_oklch(0.8_0.1_10/0.4)]"
                : "border-foreground/20 text-foreground/70 hover:border-accent hover:text-accent"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${explore ? "bg-accent animate-pulse" : "bg-foreground/40"}`} />
            Explore Mode
          </button>
        </div>

        <AnimatePresence mode="wait">
          {explore ? (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-[560px] overflow-hidden rounded-2xl border border-foreground/10 bg-card/30 backdrop-blur-md"
            >
              {ITEMS.map((it, i) => (
                <DraggableCard key={it.id} item={it} index={i} onOpen={() => setExpanded(it.id)} />
              ))}
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono-tech text-[10px] uppercase tracking-[0.32em] text-foreground/40">
                ✦ Drag · throw · click to expand
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {ITEMS.map((it, i) => (
                <FadeUp key={it.id} delay={i * 0.1}>
                  <LiveCard item={it} onOpen={() => setExpanded(it.id)} />
                </FadeUp>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen expanded experience */}
      <AnimatePresence>
        {expanded && (
          <ExpandedExperience
            item={ITEMS.find((i) => i.id === expanded)!}
            onClose={() => setExpanded(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function DraggableCard({
  item,
  index,
  onOpen,
}: {
  item: (typeof ITEMS)[number];
  index: number;
  onOpen: () => void;
}) {
  const Icon = item.icon;
  const positions = [
    { x: 60, y: 80, r: -6 },
    { x: 360, y: 140, r: 4 },
    { x: 680, y: 60, r: -3 },
  ];
  const p = positions[index % positions.length];

  return (
    <motion.div
      drag
      dragMomentum
      dragElastic={0.4}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30, x: p.x, rotate: p.r }}
      animate={{
        opacity: 1,
        y: [p.y, p.y - 12, p.y],
        rotate: [p.r, p.r + 2, p.r],
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.1 },
        y: { duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
      }}
      onClick={onOpen}
      data-hover
      className="absolute h-56 w-64 cursor-grab overflow-hidden rounded-2xl border border-foreground/15 bg-card/60 p-5 backdrop-blur-xl active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${item.accent} opacity-50 blur-[2px]`} />
      <div className="relative">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display mt-4 text-xl font-light text-foreground">{item.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground/65">{item.desc}</p>
      </div>
    </motion.div>
  );
}


/* ---------- LIVE CARD with magnetic tilt + mini experience ---------- */
function LiveCard({
  item,
  onOpen,
}: {
  item: (typeof ITEMS)[number];
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 18 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHover(false);
  };

  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onClick={onOpen}
      data-hover
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="group relative h-[420px] cursor-pointer"
      animate={{ y: hover ? -6 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      {/* Animated gradient border */}
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${item.accent} opacity-60 blur-[2px] transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card/40 p-7 backdrop-blur-xl">
        {/* Cursor-following spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(320px circle at ${x} ${y}, oklch(0.85 0.18 340 / 0.18), transparent 60%)`,
            ),
          }}
        />

        {/* Noise overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' /></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <span className="font-mono-tech text-[9px] uppercase tracking-[0.32em] text-foreground/40">
            0{ITEMS.indexOf(item) + 1}
          </span>
        </div>

        <h3 className="font-display relative z-10 mt-5 text-2xl font-light text-foreground">
          {item.title}
        </h3>
        <p className="relative z-10 mt-2.5 text-sm leading-relaxed text-foreground/65">
          {item.desc}
        </p>

        {/* Mini experience canvas */}
        <div className="relative z-10 mt-5 flex-1 overflow-hidden rounded-xl border border-foreground/10 bg-background/40">
          <MiniExperience id={item.id} active={hover} />
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-4 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground/50">
          <span>Hover · Click to expand</span>
          <span className="text-accent">→</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- MINI EXPERIENCES ---------- */
function MiniExperience({ id, active }: { id: CardId; active: boolean }) {
  if (id === "web") return <WebMini active={active} />;
  if (id === "ai") return <AIMini active={active} />;
  return <UXMini active={active} />;
}

/* Web: animated wireframe building itself */
function WebMini({ active }: { active: boolean }) {
  return (
    <div className="relative h-full w-full p-3">
      <div className="grid h-full grid-cols-6 grid-rows-6 gap-1.5">
        {/* Top bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-6 row-span-1 origin-left rounded bg-foreground/15"
        />
        {/* Sidebar */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: active ? 1 : 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-1 row-span-5 origin-top rounded bg-foreground/10"
        />
        {/* Hero block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0.3 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="col-span-3 row-span-3 rounded bg-gradient-to-br from-primary/40 to-accent/20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0.3 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="col-span-2 row-span-3 rounded bg-foreground/10"
        />
        {/* Cards row */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: active ? 1 : 0.25, y: active ? 0 : 6 }}
            transition={{ duration: 0.4, delay: 0.45 + i * 0.05 }}
            className="row-span-2 rounded bg-foreground/12"
          />
        ))}
      </div>

      {/* Loading bar */}
      {active && (
        <motion.div
          className="absolute bottom-2 left-3 right-3 h-1 overflow-hidden rounded-full bg-foreground/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
}

/* AI: neural network with pulsing data flow */
function AIMini({ active }: { active: boolean }) {
  const layers = [
    [0.2, 0.5, 0.8],
    [0.15, 0.4, 0.65, 0.9],
    [0.25, 0.55, 0.85],
    [0.5],
  ];
  const xs = [0.12, 0.4, 0.68, 0.92];

  const nodes: { x: number; y: number; layer: number }[] = [];
  layers.forEach((col, li) => col.forEach((y) => nodes.push({ x: xs[li], y, layer: li })));

  const edges: { a: number; b: number }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const cur = nodes.filter((n) => n.layer === li);
    const next = nodes.filter((n) => n.layer === li + 1);
    cur.forEach((a) => next.forEach((b) => edges.push({ a: nodes.indexOf(a), b: nodes.indexOf(b) })));
  }

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      {edges.map((e, i) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        return (
          <g key={i}>
            <line
              x1={a.x * 100}
              y1={a.y * 100}
              x2={b.x * 100}
              y2={b.y * 100}
              stroke="oklch(0.75 0.15 340 / 0.25)"
              strokeWidth={0.3}
            />
            {active && (
              <motion.circle
                r={0.8}
                fill="oklch(0.85 0.15 10)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [a.x * 100, b.x * 100],
                  cy: [a.y * 100, b.y * 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.2 + (i % 5) * 0.15,
                  repeat: Infinity,
                  delay: (i % 7) * 0.15,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.x * 100}
            cy={n.y * 100}
            r={1.6}
            fill="oklch(0.8 0.18 340)"
            animate={
              active
                ? { r: [1.4, 2.2, 1.4], opacity: [0.7, 1, 0.7] }
                : { r: 1.4, opacity: 0.55 }
            }
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.08 }}
          />
        </g>
      ))}
    </svg>
  );
}

/* UX: ripple playground that follows cursor */
function UXMini({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const onClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const id = Date.now();
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((rp) => rp.id !== id)), 900);
  };

  // Auto ripples when active
  useEffect(() => {
    if (!active) return;
    const i = setInterval(() => {
      const id = Date.now();
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      setRipples((p) => [
        ...p,
        { id, x: Math.random() * r.width, y: Math.random() * r.height },
      ]);
      setTimeout(() => setRipples((p) => p.filter((rp) => rp.id !== id)), 900);
    }, 700);
    return () => clearInterval(i);
  }, [active]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onClick={onClick}
      className="relative h-full w-full overflow-hidden"
    >
      {/* Cursor trail */}
      <motion.div
        className="pointer-events-none absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-2xl"
        animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
      {/* Demo button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2 font-mono-tech text-[10px] uppercase tracking-[0.32em] text-foreground"
        >
          Hover · Click
        </motion.div>
      </div>
      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent"
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 30, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ---------- EXPANDED FULLSCREEN ---------- */
function ExpandedExperience({
  item,
  onClose,
}: {
  item: (typeof ITEMS)[number];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background/90 backdrop-blur-2xl"
    >
      {/* Animated themed bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-30`} />
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[60vmin] w-[60vmin] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-10 right-10 h-[40vmin] w-[40vmin] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="relative mx-6 grid h-[min(82vh,720px)] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-foreground/15 bg-card/60 backdrop-blur-2xl md:grid-cols-[1.1fr_1fr]"
      >
        {/* Left content */}
        <div className="flex flex-col justify-between p-8 md:p-12">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-display mt-6 text-4xl font-light leading-tight md:text-6xl">
              {item.title}
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg">
              {item.longDesc}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-foreground/15 bg-background/40 px-3 py-1 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <a
              href="#contact"
              data-hover
              className="rounded-full border border-primary/60 bg-primary/15 px-6 py-3 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground hover:border-primary hover:text-accent"
            >
              Start a project →
            </a>
            <button
              onClick={onClose}
              data-hover
              className="rounded-full border border-foreground/20 px-6 py-3 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground/80 hover:border-accent hover:text-accent"
            >
              Back
            </button>
          </div>
        </div>

        {/* Right: live experience */}
        <div className="relative border-t border-foreground/10 md:border-l md:border-t-0">
          <div className="absolute inset-0 p-6">
            <div className="h-full w-full overflow-hidden rounded-2xl border border-foreground/10 bg-background/40">
              <MiniExperience id={item.id} active />
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          data-hover
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background/40 text-foreground/80 transition-colors hover:border-accent hover:text-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
