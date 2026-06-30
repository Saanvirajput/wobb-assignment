import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface MediaCyclerProps {
  frames: string[];
  playing: boolean;
  intervalMs?: number;
  className?: string;
}

/**
 * Crossfades through a small set of image URLs on a timer — the visual
 * effect of a short looping clip, built from real per-creator thumbnails
 * instead of a hotlinked external asset. Purely decorative (aria-hidden);
 * freezes on the first frame when the user prefers reduced motion.
 */
export function MediaCycler({
  frames,
  playing,
  intervalMs = 1100,
  className,
}: MediaCyclerProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!playing || reduceMotion || frames.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % frames.length),
      intervalMs
    );
    return () => window.clearInterval(id);
  }, [playing, reduceMotion, frames.length, intervalMs]);

  if (frames.length === 0) return null;

  const shownIndex = reduceMotion ? 0 : index;

  return (
    <div className={className} aria-hidden="true">
      <AnimatePresence mode="sync">
        <motion.img
          key={frames[shownIndex]}
          src={frames[shownIndex]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
