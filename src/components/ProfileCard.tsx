import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { cn } from "@/utils/cn";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isProfileAdded } = useListStore();
  const isAdded = isProfileAdded(profile.username);

  const handleClick = useCallback(() => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, onProfileClick, profile.username, platform]);

  const handleListToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isAdded) {
        removeProfile(profile.username);
      } else {
        addProfile(profile, platform);
      }
    },
    [isAdded, addProfile, removeProfile, profile, platform]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      aria-label={`View profile of ${profile.fullname} (@${profile.username})`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="flex flex-col sm:flex-row items-center gap-6 p-6 mb-4 w-full max-w-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
      data-search={searchQuery}
    >
      <img
        src={profile.picture}
        alt={`Profile of ${profile.username}`}
        loading="lazy"
        className="w-20 h-20 object-cover border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500"
      />
      <div className="text-center sm:text-left flex-1 min-w-0">
        <div className="font-black text-white flex items-center justify-center sm:justify-start gap-2 text-2xl md:text-3xl tracking-tighter uppercase truncate">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-base text-zinc-400 font-medium truncate mt-1">
          {profile.fullname}
        </div>
        <div className="text-sm text-zinc-600 mt-2 font-bold tracking-widest uppercase">
          {formatFollowersLocal(profile.followers)}
        </div>
      </div>

      <button
        onClick={handleListToggle}
        aria-label={
          isAdded
            ? `Remove ${profile.username} from list`
            : `Add ${profile.username} to list`
        }
        className={cn(
          "w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 border mt-4 sm:mt-0 focus:outline-none focus:ring-2 focus:ring-white/30",
          isAdded
            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            : "bg-black text-white border-zinc-700 hover:border-white hover:bg-zinc-900"
        )}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            <span>Added</span>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </>
        )}
      </button>
    </motion.div>
  );
});
