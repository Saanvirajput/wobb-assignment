import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { extractProfiles, PLATFORM_META } from "@/utils/dataHelpers";
import { cn } from "@/utils/cn";

interface MarqueeProfile extends UserProfileSummary {
  platform: Platform;
}

function AvatarTile({ profile }: { profile: MarqueeProfile }) {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const meta = PLATFORM_META[profile.platform];

  return (
    <button
      type="button"
      onClick={() => navigate(`/profile/${profile.username}?platform=${profile.platform}`)}
      title={`${profile.fullname} · ${meta.label}`}
      aria-label={`View ${profile.fullname} on ${meta.label}`}
      className="group relative mx-2.5 shrink-0 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      {failed ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-ink-400 ring-2 ring-white">
          {profile.fullname.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          src={profile.picture}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-14 w-14 rounded-full object-cover shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-2 ring-white transition-shadow duration-300 group-hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
        />
      )}
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white",
          meta.dotClass
        )}
        aria-hidden="true"
      />
    </button>
  );
}

/**
 * A continuously drifting reel of real creator avatars — a self-contained,
 * always-loaded substitute for a "product demo GIF": it shows the breadth
 * of the catalog (every platform represented) without an external asset,
 * and doubles as quick navigation. Pauses on hover and under
 * prefers-reduced-motion (handled globally in index.css).
 */
export function CreatorMarquee() {
  const profiles = useMemo<MarqueeProfile[]>(() => {
    const pick = (platform: Platform, count: number) =>
      extractProfiles(platform)
        .slice(0, count)
        .map((p) => ({ ...p, platform }));

    return [...pick("instagram", 6), ...pick("youtube", 5), ...pick("tiktok", 5)];
  }, []);

  if (profiles.length === 0) return null;

  return (
    <div
      className="relative mx-auto mt-10 max-w-4xl overflow-hidden py-2"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
      aria-label="Sample of creators available to search"
    >
      <div className="marquee-track flex w-max">
        {[...profiles, ...profiles].map((profile, i) => (
          <AvatarTile key={`${profile.platform}-${profile.user_id}-${i}`} profile={profile} />
        ))}
      </div>
    </div>
  );
}
