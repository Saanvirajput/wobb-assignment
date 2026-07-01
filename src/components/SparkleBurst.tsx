import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SparkleBurstProps {
  active: boolean;
}

const PARTICLES = [
  { angle: -90, color: "bg-brand-500" },
  { angle: -45, color: "bg-violet-500" },
  { angle: 0, color: "bg-emerald-500" },
  { angle: 45, color: "bg-brand-400" },
  { angle: 90, color: "bg-violet-400" },
  { angle: 135, color: "bg-emerald-400" },
  { angle: 180, color: "bg-brand-500" },
  { angle: -135, color: "bg-violet-500" },
];

/**
 * A small brand-colored particle burst — a self-contained, native stand-in
 * for the "celebratory reaction" a GIF would give, fired the moment a
 * creator is added to the treasure list. No external asset, no hotlink risk;
 * respects reduced motion.
 */
export function SparkleBurst({ active }: SparkleBurstProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {active && (
        <span className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          {PARTICLES.map(({ angle, color }, i) => {
            const rad = (angle * Math.PI) / 180;
            const distance = 22;
            return (
              <motion.span
                key={i}
                className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full ${color}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </span>
      )}
    </AnimatePresence>
  );
}
