import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

interface FloatingStickerProps {
  src: string;
  className?: string;
}

/**
 * A small looping GIF sticker that gently bobs and tilts — used to bring a
 * bit of genuine, visible motion to the page (hero, empty states) rather
 * than tucking animated assets away in rare loading/error moments. Freezes
 * in place when the user prefers reduced motion.
 */
export function FloatingSticker({ src, className }: FloatingStickerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      className={cn("rounded-2xl object-cover shadow-[0_8px_24px_rgba(79,70,229,0.18)]", className)}
      animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
