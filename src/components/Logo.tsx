interface LogoProps {
  className?: string;
}

/**
 * Brand mark: three connected nodes forming a triangle — a small, literal
 * nod to a creator network (profiles linked together) rather than a
 * generic icon. Used in the header and as the basis for the favicon.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Vibe logo"
    >
      <rect width="32" height="32" rx="9" fill="url(#vibe-logo-gradient)" />
      <path
        d="M12.5 13.6L13.6 18.6M19.5 13.6L18.4 18.6M14 11.2L18 11.2"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11.5" r="3.1" fill="white" />
      <circle cx="21" cy="11.5" r="3.1" fill="white" fillOpacity="0.78" />
      <circle cx="16" cy="20.5" r="3.1" fill="white" fillOpacity="0.92" />
      <defs>
        <linearGradient
          id="vibe-logo-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e6c274" />
          <stop offset="1" stopColor="#b57f22" />
        </linearGradient>
      </defs>
    </svg>
  );
}
