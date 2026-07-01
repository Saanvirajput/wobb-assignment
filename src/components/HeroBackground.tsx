/**
 * The hero's dynamic background — an original animated "aurora": three large,
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
        className="absolute left-1/2 top-[-20%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(37,99,235,0.30), transparent 70%)",
          animation: "aurora-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[8%] top-[-10%] h-[26rem] w-[26rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6,182,212,0.26), transparent 70%)",
          animation: "aurora-b 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[6%] top-[10%] h-[24rem] w-[24rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(129,140,248,0.22), transparent 70%)",
          animation: "aurora-c 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
