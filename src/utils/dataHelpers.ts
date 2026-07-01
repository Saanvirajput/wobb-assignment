import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

/** Presentational metadata for each platform — keeps brand styling in one place. */
export const PLATFORM_META: Record<
  Platform,
  { label: string; badgeClass: string; dotClass: string; textClass: string }
> = {
  instagram: {
    label: "Instagram",
    badgeClass:
      "bg-gradient-to-tr from-amber-400 via-pink-600 to-purple-600 text-white",
    dotClass: "bg-pink-500",
    textClass: "text-pink-600",
  },
  youtube: {
    label: "YouTube",
    badgeClass: "bg-red-600 text-white",
    dotClass: "bg-red-500",
    textClass: "text-red-600",
  },
  tiktok: {
    label: "TikTok",
    badgeClass: "bg-slate-900 text-white",
    dotClass: "bg-cyan-400",
    textClass: "text-cyan-600",
  },
};

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_META[platform]?.label ?? platform;
}

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

/**
 * Some real-world platform data (notably YouTube) omits `username` and only
 * provides `handle` or `user_id`. Normalising here guarantees every profile
 * downstream has a non-empty, stable `username` to key off (cards, routing,
 * the shortlist store).
 */
function normalizeProfile(profile: UserProfileSummary): UserProfileSummary {
  if (profile.username) return profile;
  return { ...profile, username: profile.handle || profile.user_id };
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) =>
    normalizeProfile(item.account.user_profile)
  );
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return profiles;
  return profiles.filter(
    (p) =>
      p.username.toLowerCase().includes(q) ||
      p.fullname.toLowerCase().includes(q)
  );
}
