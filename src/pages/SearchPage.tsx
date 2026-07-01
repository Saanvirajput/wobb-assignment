import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { HeroBackground } from "@/components/HeroBackground";
import { HeroLandscape } from "@/components/HeroLandscape";
import { CreatorMarquee } from "@/components/CreatorMarquee";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { PLATFORMS, extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { formatCompact } from "@/utils/formatters";

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

  // Catalog-wide totals (independent of the selected tab) for the hero stats.
  const catalogStats = useMemo(() => {
    const all = PLATFORMS.flatMap((p) => extractProfiles(p));
    return {
      creatorCount: all.length,
      totalReach: all.reduce((sum, p) => sum + p.followers, 0),
    };
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
      <section className="relative mx-auto mb-12 max-w-3xl overflow-hidden px-4 pb-12 pt-10 text-center sm:px-0 sm:pt-14">
        <HeroBackground />
        <HeroLandscape />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/[0.06] bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-ink-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span aria-hidden="true">✨</span> Creator discovery, reimagined
        </span>
        <h1 className="mx-auto mt-6 max-w-2xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-6xl lg:text-7xl">
          Find the right{" "}
          <span className="glow-text bg-gradient-to-r from-brand-600 to-teal-400 bg-clip-text text-transparent">
            creators
          </span>
          <br className="hidden sm:block" /> for your brand
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink-600 sm:text-xl">
          Search and shortlist top voices across Instagram, YouTube, and TikTok
          — all in one place.
        </p>

        <CreatorMarquee />

        <p className="mt-6 text-sm text-ink-400">
          <span className="font-semibold text-amber-600">
            <AnimatedNumber
              value={catalogStats.creatorCount}
              format={(n) => n.toString()}
            />
            +
          </span>{" "}
          creators indexed ·{" "}
          <span className="font-semibold text-teal-600">
            <AnimatedNumber value={catalogStats.totalReach} format={formatCompact} />+
          </span>{" "}
          combined reach
        </p>
      </section>

      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Results toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-600" aria-live="polite">
          <span className="font-semibold text-ink-900">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "creator" : "creators"}
        </p>

        <div className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort creators"
            className="cursor-pointer appearance-none rounded-full border border-ink-900/10 bg-white py-2 pl-9 pr-9 text-sm font-medium text-ink-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-300 hover:border-ink-900/20 hover:text-ink-900 focus:border-brand-500/40 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-400">
            ▼
          </span>
        </div>
      </div>

      <ProfileList profiles={sorted} platform={platform} />
    </Layout>
  );
}
