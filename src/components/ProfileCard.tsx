import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus, Users } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { PLATFORM_META } from "@/utils/dataHelpers";
import { formatCompact, formatEngagementRate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

function ProfileCardComponent({ profile, platform }: ProfileCardProps) {
  const navigate = useNavigate();
  const isAdded = useListStore((s) => s.isSelected(profile.username));
  const toggleProfile = useListStore((s) => s.toggleProfile);
  const [imgFailed, setImgFailed] = useState(false);

  const goToProfile = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, profile.username, platform]);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleProfile(profile, platform);
    },
    [toggleProfile, profile, platform]
  );

  const meta = PLATFORM_META[platform];

  return (
    <div
      onClick={goToProfile}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToProfile();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${profile.fullname} (@${profile.username})`}
      className="card group flex cursor-pointer flex-col p-6 hover:-translate-y-1 hover:border-ink-900/[0.08] hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {imgFailed ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-ink-400 ring-2 ring-slate-100">
              {(profile.username || profile.fullname || "?").charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={profile.picture}
              alt={`${profile.username}'s avatar`}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100"
            />
          )}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-white",
              meta.dotClass
            )}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold tracking-[-0.01em] text-ink-900">
              {profile.fullname}
            </h3>
            <VerifiedBadge verified={profile.is_verified} className="h-4 w-4" />
          </div>
          <p className="truncate text-[13px] text-ink-400">@{profile.username}</p>
          <span
            className={cn(
              "mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
              meta.badgeClass
            )}
          >
            {meta.label}
          </span>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-ink-900/[0.06] pt-4">
        <div>
          <dt className="flex items-center gap-1 text-xs font-medium text-ink-400">
            <Users className="h-3.5 w-3.5" /> Followers
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tracking-[-0.01em] text-ink-900">
            {formatCompact(profile.followers)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-ink-400">Engagement</dt>
          <dd className="mt-0.5 text-lg font-semibold tracking-[-0.01em] text-ink-900">
            {formatEngagementRate(profile.engagement_rate)}
          </dd>
        </div>
      </dl>

      <button
        onClick={handleToggle}
        aria-pressed={isAdded}
        aria-label={
          isAdded
            ? `Remove ${profile.username} from list`
            : `Add ${profile.username} to list`
        }
        className={cn(
          "btn-pill mt-5 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          isAdded
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
            : "bg-ink-900 text-white shadow-sm hover:bg-brand-600"
        )}
      >
        {isAdded ? (
          <>
            <Check className="h-4 w-4" /> Added
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Add to list
          </>
        )}
      </button>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);
