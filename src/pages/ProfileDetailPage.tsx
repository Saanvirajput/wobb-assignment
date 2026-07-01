import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Activity,
  LayoutGrid,
  Heart,
  MessageCircle,
  Eye,
  Plus,
  Check,
  Play,
  ExternalLink,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { MediaCycler } from "@/components/MediaCycler";
import { SparkleBurst } from "@/components/SparkleBurst";
import loadingHeart from "@/assets/loading-heart.gif";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatCompact, formatEngagementRate } from "@/utils/formatters";
import { extractClipFrames, loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { PLATFORM_META } from "@/utils/dataHelpers";
import { cn } from "@/utils/cn";

type Status = "loading" | "ready" | "error";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card flex flex-col gap-2 p-5">
      <div className="flex items-center gap-2 text-ink-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-2xl font-semibold tracking-[-0.02em] text-ink-900">
        {value}
      </span>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-ink-600 transition-colors duration-300 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4" /> Back to search
    </Link>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;

  // Result is tagged with the username it belongs to, so status can be derived
  // purely from render — no synchronous setState inside the effect.
  const [result, setResult] = useState<{
    username: string;
    user: FullUserProfile | null;
  } | null>(null);
  // Tagged with username (same pattern as `result`) so switching profiles
  // doesn't carry over a stale "image failed" flag without an extra effect.
  const [avatarState, setAvatarState] = useState<{
    username: string;
    failed: boolean;
  } | null>(null);
  const avatarFailed =
    avatarState?.username === username && (avatarState?.failed ?? false);

  useEffect(() => {
    if (!username) return;
    let active = true;

    loadProfileByUsername(username)
      .then((data: ProfileDetailResponse | null) => {
        if (!active) return;
        const profile =
          data?.data?.success && data.data.user_profile
            ? data.data.user_profile
            : null;
        setResult({ username, user: profile });
      })
      .catch(() => active && setResult({ username, user: null }));

    return () => {
      active = false;
    };
  }, [username]);

  const isResolved = !!username && result?.username === username;
  const user = isResolved ? result.user : null;
  const status: Status = !username
    ? "error"
    : !isResolved
      ? "loading"
      : user
        ? "ready"
        : "error";

  const isAdded = useListStore((s) =>
    user ? s.isSelected(user.username) : false
  );
  const toggleProfile = useListStore((s) => s.toggleProfile);
  const [burst, setBurst] = useState(false);

  const clipFrames = useMemo(() => (user ? extractClipFrames(user) : []), [user]);

  const handleToggle = () => {
    if (!user) return;
    const willAdd = !isAdded;
    toggleProfile(user, platform);
    if (willAdd) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 550);
    }
  };

  useEffect(() => {
    document.title = username ? `@${username} — Vibe` : "Vibe — Influencer Search";
    return () => {
      document.title = "Vibe — Influencer Search";
    };
  }, [username]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="mb-8">
          <BackLink />
        </div>
        <div className="flex flex-col items-center justify-center gap-3 py-28">
          <img
            src={loadingHeart}
            alt=""
            aria-hidden="true"
            className="h-14 w-14 rounded-2xl object-cover shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
          />
          <span className="sr-only">Loading profile…</span>
        </div>
      </Layout>
    );
  }

  if (status === "error" || !user) {
    return (
      <Layout>
        <div className="mb-8">
          <BackLink />
        </div>
        <div className="card mx-auto max-w-md p-10 text-center">
          <p className="text-xl font-semibold tracking-[-0.01em] text-ink-900">
            Profile not found
          </p>
          <p className="mt-2 text-sm text-ink-600">
            We couldn't find details for{" "}
            <span className="font-medium">@{username}</span>.
          </p>
        </div>
      </Layout>
    );
  }

  const meta = PLATFORM_META[platform];

  return (
    <Layout>
      <div className="mb-8">
        <BackLink />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-4xl"
      >
        {/* Header card */}
        <div className="card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300" />
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
              <div className="relative h-24 w-24 shrink-0">
                {avatarFailed ? (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/[0.06] text-3xl font-semibold text-ink-400 ring-4 ring-[#131318]">
                    {(user.username || user.fullname || "?").charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={user.picture}
                    alt={`${user.username}'s avatar`}
                    onError={() =>
                      setAvatarState({ username: user.username, failed: true })
                    }
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#131318]"
                  />
                )}
                {clipFrames.length > 0 && (
                  <>
                    <MediaCycler
                      frames={clipFrames}
                      playing
                      className="absolute inset-0 overflow-hidden rounded-2xl ring-4 ring-[#131318]"
                    />
                    <span
                      className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-black ring-2 ring-[#131318]"
                      title="Playing recent clips"
                      aria-hidden="true"
                    >
                      <Play className="h-3 w-3 fill-black" strokeWidth={0} />
                    </span>
                  </>
                )}
              </div>
              <div className="mt-4 sm:ml-5 sm:mt-0 sm:pb-1">
                <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                  <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink-900">
                    {user.fullname}
                  </h1>
                  <VerifiedBadge verified={user.is_verified} className="h-5 w-5" />
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="text-sm text-ink-400">@{user.username}</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      meta.badgeClass
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
              </div>
            </div>

            {user.description && (
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-ink-600 sm:text-left">
                {user.description}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleToggle}
                aria-pressed={isAdded}
                className={cn(
                  "btn-pill relative inline-flex flex-1 items-center justify-center gap-2 px-5 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131318]",
                  isAdded
                    ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30 hover:bg-emerald-500/15"
                    : "btn-gold"
                )}
              >
                <SparkleBurst active={burst} />
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4" /> Added to list
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Add to list
                  </>
                )}
              </button>

              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pill inline-flex flex-1 items-center justify-center gap-2 border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-ink-900 hover:border-brand-400/40 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131318]"
                >
                  View on {meta.label} <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label="Followers"
            value={formatCompact(user.followers)}
          />
          <StatCard
            icon={Activity}
            label="Engagement rate"
            value={formatEngagementRate(user.engagement_rate)}
          />
          {user.engagements !== undefined && (
            <StatCard
              icon={Activity}
              label="Engagements"
              value={formatCompact(user.engagements)}
            />
          )}
          {user.posts_count !== undefined && (
            <StatCard
              icon={LayoutGrid}
              label="Posts"
              value={formatCompact(user.posts_count)}
            />
          )}
          {user.avg_likes !== undefined && (
            <StatCard
              icon={Heart}
              label="Avg likes"
              value={formatCompact(user.avg_likes)}
            />
          )}
          {user.avg_comments !== undefined && (
            <StatCard
              icon={MessageCircle}
              label="Avg comments"
              value={formatCompact(user.avg_comments)}
            />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatCard
              icon={Eye}
              label="Avg views"
              value={formatCompact(user.avg_views)}
            />
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
