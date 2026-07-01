/**
 * Original, hand-drawn rolling-hills illustration for the foot of the
 * hero — inspired by a pastoral cartoon-landscape look (soft rounded
 * hills), but entirely our own shapes: no traced or copied artwork from
 * any existing show. Kept to just the hill silhouette (no clouds) so it
 * doesn't collide with the marquee/content sitting just above it.
 */
export function HeroLandscape() {
  return (
    <svg
      viewBox="0 0 1200 140"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-20 w-full sm:h-24"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 15%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%)",
      }}
    >
      {/* Back hill */}
      <path
        d="M0,70 C150,32 300,88 450,60 C600,32 760,82 900,52 C1040,26 1140,68 1200,58 L1200,140 L0,140 Z"
        fill="#a7f3d0"
        opacity="0.55"
      />

      {/* Front hill */}
      <path
        d="M0,108 C180,70 320,128 480,98 C650,64 800,118 960,88 C1080,68 1150,98 1200,92 L1200,140 L0,140 Z"
        fill="#6ee7b7"
        opacity="0.75"
      />

      {/* A few little stumps on the front hill, echoing a pastoral scene */}
      <g fill="#a67c52" opacity="0.6">
        <ellipse cx="230" cy="102" rx="11" ry="6" />
        <ellipse cx="560" cy="96" rx="10" ry="5.5" />
        <ellipse cx="880" cy="90" rx="11" ry="6" />
      </g>
    </svg>
  );
}
