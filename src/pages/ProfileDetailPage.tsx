import { useEffect, useState } from "react";
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
  ExternalLink,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatCompact, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
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
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </span>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
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
        <div className="flex justify-center py-32">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
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
          <p className="text-xl font-bold text-slate-900">Profile not found</p>
          <p className="mt-2 text-sm text-slate-500">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="mx-auto max-w-4xl"
      >
        {/* Header card */}
        <div className="card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-brand-600 to-violet-500" />
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
              {avatarFailed ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-3xl font-bold text-slate-400 ring-4 ring-white">
                  {(user.username || user.fullname || "?").charAt(0).toUpperCase()}
                </div>
              ) : (
                <img
                  src={user.picture}
                  alt={`${user.username}'s avatar`}
                  onError={() =>
                    setAvatarState({ username: user.username, failed: true })
                  }
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white"
                />
              )}
              <div className="mt-4 sm:ml-5 sm:mt-0 sm:pb-1">
                <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {user.fullname}
                  </h1>
                  <VerifiedBadge verified={user.is_verified} className="h-5 w-5" />
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="text-sm text-slate-500">@{user.username}</span>
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
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-slate-600 sm:text-left">
                {user.description}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => toggleProfile(user, platform)}
                aria-pressed={isAdded}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  isAdded
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
                    : "bg-brand-600 text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
                )}
              >
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
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
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
