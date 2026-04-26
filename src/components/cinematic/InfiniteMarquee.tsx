import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface InfiniteMarqueeProps {
  stacks: string[];
}

export function InfiniteMarquee({ stacks }: InfiniteMarqueeProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 20 });

  // Generate random floating positions for the pills
  const items = useMemo(() => {
    return stacks.map((stack, i) => ({
      name: stack,
      x: (i % 6) * 16 - 40 + (Math.random() * 8 - 4), // Percentage based distribution
      y: Math.floor(i / 6) * 30 - 30 + (Math.random() * 15 - 7.5),
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
  }, [stacks]);

  return (
    <motion.div
      ref={container}
      style={{ opacity, scale: springScale }}
      className="relative py-24 md:py-32 overflow-hidden border-y border-white/5 flex items-center justify-center min-h-[60vh]"
    >
      {/* Background glow for the section */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.72 0.13 240 / 0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto h-[400px]">
        {/* Central Core Element */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center bg-background/50 backdrop-blur-md shadow-[0_0_50px_oklch(0.72_0.13_240/0.3)] z-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-24 h-24 rounded-full border border-primary/20 border-dashed" />
          <div className="absolute inset-0 bg-primary/5 rounded-full" />
        </motion.div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-primary z-30 font-bold" style={{ fontFamily: "var(--font-mono)" }}>
          SYSTEM
        </div>

        {/* Orbiting / Floating Stack Items */}
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 group cursor-pointer"
            style={{ 
              marginLeft: `${item.x}%`, 
              marginTop: `${item.y}px` 
            }}
            animate={{ 
              y: ["-10px", "10px", "-10px"],
              rotate: ["-1deg", "1deg", "-1deg"]
            }}
            transition={{
              y: { duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay },
              rotate: { duration: item.duration * 1.5, repeat: Infinity, ease: "easeInOut", delay: item.delay }
            }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
          >
            <div className="relative px-5 py-2.5 rounded-full border border-white/10 bg-background/80 backdrop-blur-md transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:shadow-[0_0_30px_oklch(0.72_0.13_240/0.4)]">
              <span 
                className="font-mono text-xs tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {item.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
