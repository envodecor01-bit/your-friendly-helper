import React, { useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Tool {
  id: string;
  name: string;
  category: "core" | "secondary";
  desc: string;
}

const TOOLS: Tool[] = [
  { id: "python", name: "Python", category: "core", desc: "Backend & ML" },
  { id: "typescript", name: "TypeScript", category: "core", desc: "Type-safe UI" },
  { id: "langgraph", name: "LangGraph", category: "core", desc: "Agent Workflows" },
  { id: "openai", name: "OpenAI", category: "core", desc: "Foundation Models" },
  { id: "postgres", name: "Postgres", category: "core", desc: "Relational DB" },
  { id: "pinecone", name: "Pinecone", category: "core", desc: "Vector Search" },
  { id: "nextjs", name: "Next.js", category: "secondary", desc: "React Framework" },
  { id: "threejs", name: "Three.js", category: "secondary", desc: "3D Rendering" },
  { id: "cloudflare", name: "Cloudflare", category: "secondary", desc: "Edge Network" },
  { id: "supabase", name: "Supabase", category: "secondary", desc: "BaaS & Auth" },
  { id: "docker", name: "Docker", category: "secondary", desc: "Containerization" },
  { id: "fastapi", name: "FastAPI", category: "secondary", desc: "High-perf APIs" },
  { id: "llamaindex", name: "LlamaIndex", category: "secondary", desc: "Data Framework" },
  { id: "redis", name: "Redis", category: "secondary", desc: "Caching & PubSub" },
  { id: "gsap", name: "GSAP", category: "secondary", desc: "Advanced Motion" },
];

export function StackEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Pre-calculate positions for stability
  const clusterPositions = useMemo(() => {
    return TOOLS.map(() => ({
      x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth * 0.6 : 800) + (Math.random() > 0.5 ? 100 : -100),
      y: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500) + (Math.random() > 0.5 ? 100 : -100),
    }));
  }, []);

  const circlePositions = useMemo(() => {
    return TOOLS.map((_, i) => {
      const angle = (i / TOOLS.length) * Math.PI * 2;
      const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 340;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Phase 1: Start State -> Reveal
    tl.to(".ecosystem-title", {
      opacity: 0,
      y: -50,
      filter: "blur(10px)",
      duration: 1,
      ease: "power2.inOut"
    })
    .to(".ecosystem-beam", {
      scaleY: 1,
      opacity: 0.8,
      duration: 1.5,
      ease: "power3.inOut"
    }, "<");

    // Phase 2: Sequential Reveal & Scatter
    TOOLS.forEach((tool, i) => {
      tl.fromTo(`.tool-item-${i}`,
        { opacity: 0, scale: 2, x: 0, y: 0, rotationX: 45, filter: "blur(20px)" },
        { opacity: 1, scale: 1.5, rotationX: 0, filter: "blur(0px)", duration: 1, ease: "back.out(1.2)" }
      );
      tl.to(`.tool-item-${i} .sweep-glow`, { left: "150%", duration: 0.8, ease: "power1.inOut" }, "<0.2");
      tl.to(`.tool-item-${i}`, {
        x: clusterPositions[i].x,
        y: clusterPositions[i].y,
        scale: 0.7,
        opacity: 0.4,
        filter: "blur(2px)",
        duration: 1.2,
        ease: "power3.inOut"
      }, "+=0.3");
    });

    // Phase 3: Build the Grid
    tl.addLabel("build-system");
    tl.to(".ecosystem-beam", { opacity: 0, scaleY: 0, duration: 1, ease: "power2.inOut" }, "build-system");
    tl.to(".ecosystem-bg-pulse", { opacity: 0.8, scale: 1.2, duration: 2, ease: "power2.out" }, "build-system");

    const cols = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5;
    const xSpacing = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 160;
    const ySpacing = 80;

    TOOLS.forEach((tool, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const gridX = (col - Math.floor(cols / 2)) * xSpacing;
      const gridY = (row - Math.floor(TOOLS.length / cols / 2)) * ySpacing;

      tl.to(`.tool-item-${i}`, {
        x: gridX, y: gridY, scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "expo.inOut"
      }, "build-system");
    });

    tl.to({}, { duration: 1 }); // Pause on grid

    // Phase 4: Final Transformation (Grid -> Circle)
    tl.addLabel("transform-system");
    
    // Animate tools to circular positions
    TOOLS.forEach((tool, i) => {
      tl.to(`.tool-item-${i}`, {
        x: circlePositions[i].x,
        y: circlePositions[i].y,
        scale: 0.9,
        duration: 2.5,
        ease: "power4.inOut"
      }, "transform-system");
      
      // Animate SVG lines drawing outwards from center to tools
      tl.fromTo(`.conn-line-${i}`,
        { strokeDasharray: "0 1000", opacity: 0 },
        { strokeDasharray: "1000 1000", opacity: 0.2, duration: 2, ease: "power3.inOut" },
        "transform-system+=1"
      );
    });

    // Fade in center focus text
    tl.fromTo(".center-focus-text",
      { opacity: 0, scale: 0.9, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" },
      "transform-system+=1.5"
    );
    
    // Deepen background pulse
    tl.to(".ecosystem-bg-pulse", {
      scale: 1.5,
      opacity: 0.4,
      background: "radial-gradient(circle, rgba(112, 20, 245, 0.15) 0%, transparent 60%)",
      duration: 2
    }, "transform-system");

    tl.to({}, { duration: 2 }); // Pause on circle formation

    // Phase 5: Exit Transition
    tl.addLabel("exit-system");
    tl.to(".ecosystem-wrapper", {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      duration: 2,
      ease: "power2.inOut"
    }, "exit-system");

    // Independent premium floating motion
    gsap.to(ringRef.current, {
      y: "-=20",
      x: "+=10",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-[800vh] bg-[#020005]">
      {/* Sticky container */}
      <div ref={wrapperRef} className="ecosystem-wrapper sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-[1000px]">
        
        {/* Ambient Background & Pulse */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="ecosystem-bg-pulse absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-primary/10 blur-[100px] opacity-20" />
        </div>

        {/* Start State: Title */}
        <div className="ecosystem-title absolute z-10 flex flex-col items-center pointer-events-none">
          <div className="font-mono text-sm md:text-base uppercase tracking-[0.4em] text-white/80 mb-4" style={{ fontFamily: "var(--font-mono)" }}>
            Tools I trust in production
          </div>
          <div className="w-12 h-px bg-primary/50" />
        </div>

        {/* Reveal System: Beam */}
        <div className="ecosystem-beam absolute z-10 w-[2px] h-[60vh] bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 scale-y-0" style={{ transformOrigin: "top" }} />

        {/* Continuous Ring System */}
        <div ref={ringRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          
          {/* SVG Connections */}
          <svg className="absolute w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            <g transform={`translate(${typeof window !== 'undefined' ? window.innerWidth / 2 : 500}, ${typeof window !== 'undefined' ? window.innerHeight / 2 : 500})`}>
              {TOOLS.map((tool, i) => (
                <line
                  key={`line-${i}`}
                  className={`conn-line-${i} transition-all duration-500`}
                  x1="0"
                  y1="0"
                  x2={circlePositions[i].x}
                  y2={circlePositions[i].y}
                  stroke={hoveredId === tool.id ? "#7014f5" : "#7014f5"}
                  strokeWidth={hoveredId === tool.id ? 2 : 1}
                  opacity={hoveredId === tool.id ? 0.6 : 0}
                  style={{ filter: hoveredId === tool.id ? "drop-shadow(0 0 8px #7014f5)" : "none" }}
                />
              ))}
            </g>
          </svg>

          {/* Tools Elements */}
          {TOOLS.map((tool, i) => (
            <div 
              key={tool.id}
              className={`tool-item-${i} absolute opacity-0 pointer-events-auto`}
              onPointerEnter={() => setHoveredId(tool.id)}
              onPointerLeave={() => setHoveredId(null)}
            >
              <div 
                className={`relative group px-5 py-2.5 rounded-full border bg-background/90 backdrop-blur-md overflow-hidden transition-all duration-300 ${
                  hoveredId === tool.id ? "border-primary shadow-[0_0_30px_oklch(0.70_0.14_245/0.5)] scale-110 z-50" : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="sweep-glow absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg]" />
                <span className={`relative z-10 font-mono text-xs tracking-widest transition-colors duration-300 ${hoveredId === tool.id ? "text-foreground" : "text-muted-foreground"}`} style={{ fontFamily: "var(--font-mono)" }}>
                  {tool.name}
                </span>
              </div>

              <AnimatePresence>
                {hoveredId === tool.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 rounded-md bg-white/10 backdrop-blur-xl border border-white/20 whitespace-nowrap z-50 pointer-events-none"
                  >
                    <div className="font-body text-[10px] text-foreground/80">{tool.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Center Focus Text (Outside ringRef so it doesn't rotate) */}
        <div className="center-focus-text absolute z-30 flex flex-col items-center pointer-events-none opacity-0">
          <div className="font-display text-xl md:text-3xl tracking-tight text-white/90" style={{ fontFamily: "var(--font-display)" }}>
            This is the stack behind the systems I build.
          </div>
        </div>

        {/* Overlay Title */}
        <div className="absolute top-10 left-6 md:left-16 lg:left-24 z-40 pointer-events-none">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="text-primary mr-3">05</span> Ecosystem
          </div>
        </div>

      </div>
    </div>
  );
}
