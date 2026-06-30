import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { SelectedProfilesDrawer } from "./SelectedProfilesDrawer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Accessibility: jump straight to content with the keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-30 glass border-b border-ink-900/[0.06]"
        role="banner"
      >
        <nav
          className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-label="Vibe — go to homepage"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 text-white transition-transform duration-300 ease-out group-hover:scale-105">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink-900">
              Vibe
            </span>
          </Link>

          <SelectedProfilesDrawer />
        </nav>
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12"
        role="main"
      >
        {children}
      </main>

      <footer className="border-t border-ink-900/[0.06] py-10 text-center text-[13px] text-ink-400">
        <p>
          Built with React, TypeScript &amp; Zustand ·{" "}
          <span className="font-medium text-ink-600">Vibe</span> creator search
        </p>
      </footer>
    </div>
  );
}
