import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative, animated backdrop for the search hero — soft, slow-drifting
 * ambient light over a faint dot grid. Purely cosmetic (aria-hidden),
 * contained to its parent, and freezes when the user prefers reduced motion.
 * Deliberately quiet: the goal is depth, not decoration.
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
        className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-[65%] rounded-full bg-brand-400/20 blur-[100px]"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 26, -18, 0], y: [0, 18, -10, 0], scale: [1, 1.06, 0.97, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-16 left-1/2 h-96 w-96 translate-x-[5%] rounded-full bg-violet-400/16 blur-[100px]"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -22, 12, 0], y: [0, -12, 20, 0], scale: [1, 0.96, 1.07, 1] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
