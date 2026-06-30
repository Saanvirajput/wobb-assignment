import { Search, Camera, Tv, Smartphone } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { cn } from "@/utils/cn";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PlatformIcon = ({ platform, className }: { platform: Platform, className?: string }) => {
  switch (platform) {
    case "instagram": return <Camera className={className} />;
    case "youtube": return <Tv className={className} />;
    case "tiktok": return <Smartphone className={className} />;
    default: return null;
  }
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="mb-12 space-y-8 max-w-3xl mx-auto px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-zinc-500 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="SEARCH BY USERNAME OR NAME..."
          aria-label="Search influencers by username or full name"
          className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-lg md:text-xl font-bold uppercase tracking-wider pl-16 pr-6 py-5 focus:outline-none focus:bg-zinc-900 focus:border-white transition-all focus:ring-2 focus:ring-white/30"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center" role="tablist" aria-label="Filter by platform">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={selected === p}
            aria-label={`Filter by ${getPlatformLabel(p)}`}
            onClick={() => onChange(p)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-white/30",
              selected === p
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                : "bg-black text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-500 hover:bg-zinc-900"
            )}
          >
            <PlatformIcon platform={p} className="w-5 h-5" />
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>
    </div>
  );
}
