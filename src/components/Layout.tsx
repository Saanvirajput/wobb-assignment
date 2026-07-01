import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { PageBackground } from "./PageBackground";
import { SelectedProfilesDrawer } from "./SelectedProfilesDrawer";
import { cn } from "@/utils/cn";

interface LayoutProps {
  children: ReactNode;
}

/** True once the page has scrolled past a small threshold. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export function Layout({ children }: LayoutProps) {
  const scrolled = useScrolled();

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <PageBackground />

      {/* Accessibility: jump straight to content with the keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "sticky top-0 z-30 glass border-b transition-shadow duration-300 ease-out",
          scrolled
            ? "border-ink-900/[0.08] shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(15,23,42,0.12)]"
            : "border-ink-900/[0.06] shadow-none"
        )}
        role="banner"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between px-4 transition-[height] duration-300 ease-out sm:px-6",
            scrolled ? "h-[52px]" : "h-[60px]"
          )}
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-label="Vibe — go to homepage"
          >
            <Logo className="h-7 w-7 transition-transform duration-300 ease-out group-hover:scale-105" />
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
