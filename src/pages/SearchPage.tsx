import { useState, useMemo, useEffect } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/utils/cn";

type SortOption = "default" | "followers_desc" | "followers_asc" | "engagement_desc" | "engagement_asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "followers_desc", label: "Followers ↓" },
  { value: "followers_asc", label: "Followers ↑" },
  { value: "engagement_desc", label: "Engagement ↓" },
  { value: "engagement_asc", label: "Engagement ↑" },
];

function sortProfiles(profiles: UserProfileSummary[], sort: SortOption): UserProfileSummary[] {
  if (sort === "default") return profiles;

  return [...profiles].sort((a, b) => {
    switch (sort) {
      case "followers_desc":
        return b.followers - a.followers;
      case "followers_asc":
        return a.followers - b.followers;
      case "engagement_desc":
        return (b.engagement_rate || 0) - (a.engagement_rate || 0);
      case "engagement_asc":
        return (a.engagement_rate || 0) - (b.engagement_rate || 0);
      default:
        return 0;
    }
  });
}

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Dynamic page title
  useEffect(() => {
    document.title = "Vibe — Influencer Search Platform";
  }, []);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const sorted = useMemo(
    () => sortProfiles(filtered, sortBy),
    [filtered, sortBy]
  );

  return (
    <Layout>
      <div className="text-center mb-16 mt-12 md:mt-24">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-coke tracking-tighter uppercase mb-6 leading-none">
          Find Creators.<br />
          <span className="text-slate-500">Elevate Brands.</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-medium tracking-wide">
          Analyze and select the most influential voices across major social platforms.
        </p>
      </div>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
          setSortBy("default");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 px-4 border-b border-slate-300 pb-4 gap-4">
        <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
          Showing <span className="text-coke">{sorted.length}</span> results on <span className="text-coke">{platform}</span>
        </p>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                aria-label={`Sort by ${opt.label}`}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold uppercase tracking-widest border transition-all focus:outline-none focus:ring-2 focus:ring-coke-red/30",
                  sortBy === opt.value
                    ? "coke-panel border-coke"
                    : "bg-transparent text-slate-600 border-slate-300 hover:border-coke hover:text-coke"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ProfileList
        profiles={sorted}
        platform={platform}
        searchQuery={searchQuery}
      />
    </Layout>
  );
}
