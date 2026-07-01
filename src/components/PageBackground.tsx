import { useReducedMotion } from "framer-motion";
import auroraLoop from "@/assets/aurora-loop.svg";

/**
 * Full-page ambient background — an original, self-hosted animated loop
 * (aurora-loop.svg: five soft colour fields that continuously drift via
 * SMIL). Rendered once in the Layout as a FIXED, full-viewport layer behind
 * all content, so the whole app shares one calm, living backdrop.
 *
 * It's a genuine looping animated *image file* (no external/third-party
 * asset, so no copyright issue), loaded via <img> so its animation plays.
 * A soft white wash sits on top to keep cards and body text readable, and a
 * static gradient is shown instead when the user prefers reduced motion.
 */
export function PageBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {reduceMotion ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(40rem 26rem at 50% -10%, rgba(37,99,235,0.22), transparent 60%), radial-gradient(30rem 22rem at 100% 0%, rgba(6,182,212,0.18), transparent 55%), radial-gradient(28rem 22rem at 0% 30%, rgba(129,140,248,0.16), transparent 55%)",
          }}
        />
      ) : (
        <img
          src={auroraLoop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Readability wash — softens the aurora so foreground stays crisp. */}
      <div className="absolute inset-0 bg-[#fcfcfd]/55" />
    </div>
  );
}
