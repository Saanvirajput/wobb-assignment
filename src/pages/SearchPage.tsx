import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { PLATFORMS, extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { formatCompact } from "@/utils/formatters";

const heroContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

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
      <section className="relative mx-auto mb-10 max-w-3xl px-4 pb-2 pt-12 text-center sm:px-0 sm:pt-16">
        <motion.div variants={heroContainer} initial="hidden" animate="show">
          <motion.span
            variants={heroItem}
            className="inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-400/[0.08] px-3.5 py-1.5 text-[13px] font-medium text-brand-200 shadow-[0_0_20px_-6px_rgba(221,173,76,0.4)]"
          >
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
              aria-hidden="true"
            />
            Creator discovery platform
          </motion.span>
          <motion.h1
            variants={heroItem}
            className="glow-heading mx-auto mt-6 max-w-2xl text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.035em] text-ink-900 sm:text-6xl"
          >
            Find the right{" "}
            <span className="text-shimmer bg-gradient-to-r from-brand-300 via-brand-100 to-brand-400 bg-clip-text text-transparent">
              creators
            </span>{" "}
            for your brand
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-600"
          >
            Search, compare, and shortlist top voices across Instagram, YouTube,
            and TikTok — all in one place.
          </motion.p>

          <motion.p variants={heroItem} className="mt-6 text-sm text-ink-400">
            <span className="font-semibold text-ink-900">
              <AnimatedNumber
                value={catalogStats.creatorCount}
                format={(n) => n.toString()}
              />
              +
            </span>{" "}
            creators indexed ·{" "}
            <span className="font-semibold text-ink-900">
              <AnimatedNumber value={catalogStats.totalReach} format={formatCompact} />
              +
            </span>{" "}
            combined reach
          </motion.p>
        </motion.div>
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
            className="cursor-pointer appearance-none rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-9 text-sm font-medium text-ink-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-300 hover:border-white/20 hover:text-ink-900 focus:border-brand-500/50 focus:outline-none focus:ring-4 focus:ring-brand-500/15 [&>option]:bg-[#131318] [&>option]:text-ink-900"
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
