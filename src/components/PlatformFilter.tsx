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
    <div className="mx-auto mb-10 max-w-2xl space-y-5">
      {/* Search */}
      <div className="group relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-600"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name…"
          aria-label="Search influencers by username or full name"
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-11 text-base text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Platform tabs */}
      <div
        className="flex flex-wrap justify-center gap-2.5"
        role="tablist"
        aria-label="Filter by platform"
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
                "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                isActive
                  ? "border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {PLATFORM_META[p].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
