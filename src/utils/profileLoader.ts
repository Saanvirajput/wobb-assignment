import type { MediaItem, ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

const LINKED_USERNAMES = new Set(
  Object.keys(profileModules).map((path) =>
    path.replace("../assets/data/profiles/", "").replace(/\.json$/, "")
  )
);

/** True when a full profile (with detail + media) exists for this username. */
export function hasLinkedProfile(username: string): boolean {
  return LINKED_USERNAMES.has(username);
}

/** Pulls a handful of thumbnail URLs from a profile's reels/posts, reel-first. */
export function extractClipFrames(profile: {
  top_reels?: MediaItem[];
  recent_reels?: MediaItem[];
  top_posts?: MediaItem[];
}): string[] {
  const items = [
    ...(profile.top_reels ?? []),
    ...(profile.recent_reels ?? []),
    ...(profile.top_posts ?? []),
  ];
  const frames: string[] = [];
  for (const item of items) {
    const src = item.thumbnail || item.image;
    if (src && !frames.includes(src)) frames.push(src);
    if (frames.length >= 4) break;
  }
  return frames;
}

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (!loader) {
    return null;
  }

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}
