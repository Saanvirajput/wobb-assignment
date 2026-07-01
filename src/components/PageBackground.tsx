/**
 * Full-page ambient background — an original animated "aurora" of large,
 * softly-blurred colour fields that drift on slow, offset loops. Rendered
 * once in the Layout as a FIXED, full-viewport layer behind all content, so
 * the whole app (search + profile pages) shares one calm, living backdrop
 * rather than a boxed hero effect.
 *
 * Tuned deliberately subtle and pushed toward the edges/top so it never
 * competes with cards or body text in the centre of the page. Pure CSS,
 * cosmetic only (aria-hidden), and frozen under prefers-reduced-motion via
 * the global rule in index.css.
 */
export function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Top — the richest concentration, behind the hero */}
      <div
        className="absolute left-1/2 top-[-18%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(37,99,235,0.34), transparent 70%)",
          animation: "aurora-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-6%] top-[-8%] h-[30rem] w-[30rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6,182,212,0.30), transparent 70%)",
          animation: "aurora-b 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[-8%] top-[6%] h-[28rem] w-[28rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(129,140,248,0.26), transparent 70%)",
          animation: "aurora-c 26s ease-in-out infinite",
        }}
      />

      {/* Lower down — fainter, keeps the page alive as you scroll */}
      <div
        className="absolute bottom-[6%] left-[-4%] h-[26rem] w-[26rem] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(16,185,129,0.16), transparent 70%)",
          animation: "aurora-b 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-6%] right-[-4%] h-[28rem] w-[28rem] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(37,99,235,0.16), transparent 70%)",
          animation: "aurora-c 34s ease-in-out infinite",
        }}
      />
    </div>
  );
}
