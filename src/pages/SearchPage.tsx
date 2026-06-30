import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

type SortOption =
  | "default"
  | "followers_desc"
  | "followers_asc"
  | "engagement_desc"
  | "engagement_asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Relevance" },
  { value: "followers_desc", label: "Most followers" },
  { value: "followers_asc", label: "Fewest followers" },
  { value: "engagement_desc", label: "Highest engagement" },
  { value: "engagement_asc", label: "Lowest engagement" },
];

function sortProfiles(
  profiles: UserProfileSummary[],
  sort: SortOption
): UserProfileSummary[] {
  if (sort === "default") return profiles;
  const sorted = [...profiles];
  sorted.sort((a, b) => {
    switch (sort) {
      case "followers_desc":
        return b.followers - a.followers;
      case "followers_asc":
        return a.followers - b.followers;
      case "engagement_desc":
        return (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0);
      case "engagement_asc":
        return (a.engagement_rate ?? 0) - (b.engagement_rate ?? 0);
      default:
        return 0;
    }
  });
  return sorted;
}

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    document.title = "Vibe — Influencer Search";
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

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
    setSortBy("default");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="mx-auto mb-10 max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          ✨ Creator discovery, reimagined
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Find the right{" "}
          <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
            creators
          </span>{" "}
          for your brand
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Search and shortlist top voices across Instagram, YouTube, and TikTok —
          all in one place.
        </p>
      </section>

      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Results toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600" aria-live="polite">
          <span className="font-semibold text-slate-900">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "creator" : "creators"}
        </p>

        <div className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort creators"
            className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            ▼
          </span>
        </div>
      </div>

      <ProfileList profiles={sorted} platform={platform} />
    </Layout>
  );
}
