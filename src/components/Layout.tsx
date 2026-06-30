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
        className="sticky top-0 z-30 glass border-b border-slate-200/70"
        role="banner"
      >
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-label="Vibe — go to homepage"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white shadow-sm shadow-brand-600/30 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
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

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <p>
          Built with React, TypeScript &amp; Zustand ·{" "}
          <span className="font-medium text-slate-600">Vibe</span> creator search
        </p>
      </footer>
    </div>
  );
}
