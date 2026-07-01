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
        className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-400/16 blur-[110px]"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 20, -16, 0], y: [0, 14, -8, 0] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-amber-300/12 blur-[110px]"
        animate={
          reduceMotion ? undefined : { x: [0, -16, 10, 0], y: [0, -10, 14, 0] }
        }
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
