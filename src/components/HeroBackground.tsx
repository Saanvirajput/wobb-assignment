/**
 * The hero's dynamic background — an original animated "aurora": large,
 * softly-blurred colour fields that drift and breathe on slow, offset loops,
 * layered over a faint dot grid. Pure CSS/SVG (no external assets), cosmetic
 * only (aria-hidden), and frozen automatically under prefers-reduced-motion
 * via the global rule in index.css.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="dot-grid absolute inset-0" />

      <div
        className="absolute left-1/2 top-[-25%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(37,99,235,0.45), transparent 70%)",
          animation: "aurora-a 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[4%] top-[-15%] h-[28rem] w-[28rem] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6,182,212,0.42), transparent 70%)",
          animation: "aurora-b 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[2%] top-[5%] h-[26rem] w-[26rem] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(129,140,248,0.38), transparent 70%)",
          animation: "aurora-c 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-30%] left-1/2 h-[24rem] w-[30rem] -translate-x-1/2 rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(16,185,129,0.28), transparent 70%)",
          animation: "aurora-b 28s ease-in-out infinite",
        }}
      />
    </div>
  );
}
