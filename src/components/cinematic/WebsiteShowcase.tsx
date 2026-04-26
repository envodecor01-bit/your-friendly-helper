import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SplitReveal } from "./SplitReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Magnetic } from "./Magnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface WebsiteProject {
  n: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  url: string;
  tech: string[];
  image: string;
  accentColor: string;
  features: string[];
}

interface WebsiteShowcaseProps {
  projects: WebsiteProject[];
}

export function WebsiteShowcase({ projects }: WebsiteShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = projects[activeIdx];

  // 3D Tilt Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { damping: 30, stiffness: 200 });
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 30, stiffness: 200 });
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), { damping: 30, stiffness: 200 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  useGSAP(() => {
    if (!containerRef.current) return;

    // Pinning ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        // Map progress to active index safely
        const progress = self.progress;
        let index = Math.floor(progress * projects.length);
        if (index >= projects.length) index = projects.length - 1;
        if (index < 0) index = 0;
        setActiveIdx(index);
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, { scope: containerRef, dependencies: [projects.length] });

  const scrollToProject = (index: number) => {
    if (!containerRef.current) return;
    const start = containerRef.current.offsetTop;
    // Total scrollable distance is container height - viewport height
    const scrollDistance = (projects.length * window.innerHeight) - window.innerHeight;
    
    // We want to scroll to the exact progress that triggers this index
    // The range for index is [index/length, (index+1)/length). We target the midpoint.
    const targetProgress = (index + 0.5) / projects.length;
    const targetScroll = start + (targetProgress * scrollDistance);
    
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: `${projects.length * 100}vh` }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-background px-6 md:px-16 lg:px-24">
        <div className="w-full max-w-6xl mx-auto flex flex-col justify-center h-full pt-20 pb-10">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="chapter-num mb-6"
          >
            <span className="text-primary mr-3">03</span> Web Projects
          </motion.div>

          <SplitReveal
            as="h2"
            by="word"
            className="font-display font-light tracking-[-0.03em] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] mb-12 max-w-3xl"
          >
            Websites built to convert.
          </SplitReveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 items-start h-[65vh]">
            
            {/* Left — project list navigation */}
            <div className="flex flex-col h-full overflow-y-auto pr-4 custom-scrollbar" style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}>
              {projects.map((p, i) => {
                const isActive = activeIdx === i;
                return (
                  <button
                    key={p.n}
                    onClick={() => scrollToProject(i)}
                    className={`group relative text-left flex items-start gap-5 py-6 border-b transition-all duration-500 cursor-pointer ${
                      isActive
                        ? "border-primary/40 opacity-100"
                        : "border-white/8 hover:border-white/16 opacity-40 hover:opacity-70 grayscale-[50%]"
                    }`}
                  >
                    {/* Active indicator bar */}
                    <motion.div
                      className="absolute left-0 top-0 w-0.5 rounded-full bg-primary"
                      initial={false}
                      animate={{ height: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
                    />

                    {/* Number */}
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.3em] pt-1 flex-shrink-0 transition-colors duration-400 ${
                        isActive ? "text-primary" : "text-muted-foreground/50"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p.n}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1.5">
                        <h3
                          className={`font-display text-lg md:text-xl font-light transition-colors duration-400 ${
                            isActive ? "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "text-muted-foreground"
                          }`}
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {p.title}
                        </h3>
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50 flex-shrink-0"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {p.year}
                        </span>
                      </div>
                      <p className={`text-xs transition-colors duration-500 ${isActive ? "text-muted-foreground/90" : "text-muted-foreground/40"}`}>{p.category}</p>

                      {/* Tech pills — only show on active */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {p.tech.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-[0.15em] border border-white/10 text-primary/80 bg-primary/5"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right — cinematic preview */}
            <div className="relative h-full flex items-center justify-center perspective-[1200px]">
              
              {/* Soft dynamic glow behind the card */}
              <motion.div 
                className="absolute w-[80%] h-[80%] rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000"
                animate={{ backgroundColor: active.accentColor }}
                style={{ filter: "blur(120px)" }}
              />

              <AnimatePresence>
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95, rotateX: 5 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 w-full h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[oklch(0.08_0.015_250)]"
                  style={{
                    boxShadow: `0 40px 100px oklch(0 0 0 / 0.8), 0 0 0 1px oklch(1 1 1 / 0.05) inset`,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-[oklch(0.12_0.015_250)] border-b border-white/5 relative z-20">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 shadow-inner">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-muted-foreground/50 flex-shrink-0">
                          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M3 5h4M5 3v4" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        <span className="font-mono text-[9px] text-muted-foreground/60 truncate" style={{ fontFamily: "var(--font-mono)" }}>
                          {active.url}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot with parallax */}
                  <div className="relative flex-1 overflow-hidden bg-black/50 min-h-0">
                    <motion.img
                      src={active.image}
                      alt={active.title}
                      className="w-[110%] h-[110%] max-w-none object-cover object-top -left-[5%] -top-[5%] absolute"
                      style={{ x: parallaxX, y: parallaxY }}
                    />
                    {/* Gradient overlay at bottom */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, oklch(0.08 0.015 250) 0%, transparent 100%)`,
                      }}
                    />
                  </div>

                  {/* Card footer (Content slides up slightly) */}
                  <div className="p-6 bg-[oklch(0.08_0.015_250)] relative z-20">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="font-display text-xl font-light text-foreground mb-1.5"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {active.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="text-sm text-muted-foreground leading-relaxed line-clamp-2 pr-4"
                        >
                          {active.desc}
                        </motion.p>
                      </div>
                      
                      <Magnetic strength={0.4}>
                        <a
                          href={active.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-foreground transition-all duration-500 group relative overflow-hidden"
                          style={{ fontFamily: "var(--font-mono)" }}
                          data-cursor="view"
                        >
                          <span className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                          <span className="relative z-10">Visit ↗</span>
                        </a>
                      </Magnetic>
                    </div>

                    {/* Features (Staggered reveal) */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 border-t border-white/5 pt-4">
                      {active.features.map((f, idx) => (
                        <motion.span 
                          key={f} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (idx * 0.1), duration: 0.4 }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground/70"
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active.accentColor, boxShadow: `0 0 10px ${active.accentColor}` }} />
                          {f}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
