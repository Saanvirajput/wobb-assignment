import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
}

/**
 * Counts up from 0 to `value` once, on mount, using requestAnimationFrame
 * with an ease-out curve. Skips straight to the final value when the user
 * prefers reduced motion.
 */
export function AnimatedNumber({
  value,
  format,
  durationMs = 1200,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    // Reduced motion skips the animation entirely — `shown` below falls
    // back to the final value directly, without touching state here.
    if (reduceMotion) return;

    const start = performance.now();
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setDisplay(Math.round(value * easeOutExpo(progress)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, durationMs, reduceMotion]);

  const shown = reduceMotion ? value : display;
  return <>{format(shown)}</>;
}
