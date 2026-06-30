import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SelectedProfilesDrawer } from "./SelectedProfilesDrawer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 relative">
      {/* Skip to content link — accessibility best practice */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-bold"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-30 liquid-silver border-b border-white/50"
        role="banner"
      >
        <nav
          className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3 text-coke hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-coke-red"
            aria-label="Vibe — Go to homepage"
          >
            <div className="w-10 h-10 coke-panel flex items-center justify-center font-serif italic text-xl pr-0.5">
              V
            </div>
            VIBE
          </Link>
          <SelectedProfilesDrawer />
        </nav>
      </header>

      <main
        id="main-content"
        className="flex-1 w-full max-w-6xl mx-auto px-6 py-12"
        role="main"
      >
        {title && (
          <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter uppercase text-coke">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
