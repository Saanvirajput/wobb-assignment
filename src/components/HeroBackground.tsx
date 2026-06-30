import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative, animated backdrop for the search hero — soft drifting brand
 * blobs over a faint dot grid. Purely cosmetic (aria-hidden), contained to
 * its parent, and freezes in place when the user prefers reduced motion.
 */
export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="dot-grid absolute inset-0" />

      <motion.div
        className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-[60%] rounded-full bg-brand-400/30 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 30, -20, 0], y: [0, 20, -10, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-12 left-1/2 h-72 w-72 translate-x-[10%] rounded-full bg-violet-400/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -25, 15, 0], y: [0, -15, 25, 0], scale: [1, 0.94, 1.1, 1] }
        }
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-12 left-1/3 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, 20, -30, 0], y: [0, 25, -5, 0] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
