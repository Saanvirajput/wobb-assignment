import { motion } from "framer-motion";
import { Search, X, Camera, Play, Music2 } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, PLATFORM_META } from "@/utils/dataHelpers";
import { cn } from "@/utils/cn";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PLATFORM_ICONS: Record<Platform, typeof Camera> = {
  instagram: Camera,
  youtube: Play,
  tiktok: Music2,
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="mx-auto mb-12 max-w-xl space-y-6">
      {/* Search */}
      <div className="group relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-brand-600"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name"
          aria-label="Search influencers by username or full name"
          className="w-full rounded-full border border-ink-900/10 bg-white py-3.5 pl-12 pr-11 text-[15px] text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out placeholder:text-ink-400 focus:border-brand-500/40 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Segmented platform control */}
      <div
        role="tablist"
        aria-label="Filter by platform"
        className="mx-auto inline-flex items-center gap-0.5 rounded-full bg-slate-100/80 p-1"
      >
        {PLATFORMS.map((p) => {
          const Icon = PLATFORM_ICONS[p];
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Filter by ${PLATFORM_META[p].label}`}
              onClick={() => onChange(p)}
              className={cn(
                "relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:px-5",
                isActive
                  ? PLATFORM_META[p].textClass
                  : "text-ink-600 hover:text-ink-900"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="platform-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  transition={{ type: "spring", stiffness: 450, damping: 38 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {PLATFORM_META[p].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
