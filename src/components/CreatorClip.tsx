import { useEffect, useState } from "react";
import { extractClipFrames, loadProfileByUsername } from "@/utils/profileLoader";
import { MediaCycler } from "./MediaCycler";

interface CreatorClipProps {
  username: string;
  active: boolean;
}

// Module-level cache so re-hovering the same card never re-fetches.
const frameCache = new Map<string, string[]>();

/**
 * Fetches a creator's reel/post thumbnails lazily — only once a card is
 * actually hovered or focused — and hands them to MediaCycler to play as a
 * short looping preview over the avatar. Only ever mounted for usernames
 * that have a linked detail profile (see hasLinkedProfile), so it never
 * does pointless work for the rest of the catalog.
 */
export function CreatorClip({ username, active }: CreatorClipProps) {
  const [frames, setFrames] = useState<string[] | null>(
    frameCache.get(username) ?? null
  );

  useEffect(() => {
    if (!active || frames !== null) return;
    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      const profile = data?.data?.user_profile;
      const result = profile ? extractClipFrames(profile) : [];
      frameCache.set(username, result);
      setFrames(result);
    });

    return () => {
      cancelled = true;
    };
  }, [active, username, frames]);

  if (!frames || frames.length === 0) return null;

  return (
    <MediaCycler
      frames={frames}
      playing={active}
      className="absolute inset-0 overflow-hidden rounded-full"
    />
  );
}
