import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  return (
    <Layout>
      <div className="text-center mb-16 mt-12 md:mt-24">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
          Find Creators.<br />
          <span className="text-zinc-600">Elevate Brands.</span>
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto font-medium tracking-wide">
          Analyze and select the most influential voices across major social platforms.
        </p>
      </div>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-3xl mx-auto flex items-center justify-between mb-8 px-4 border-b border-zinc-900 pb-4">
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
          Showing <span className="text-white">{filtered.length}</span> results on <span className="text-white">{platform}</span>
        </p>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
      />
    </Layout>
  );
}
