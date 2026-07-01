import { motion } from "framer-motion";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { FloatingSticker } from "./FloatingSticker";
import loadingHeart from "@/assets/loading-heart.gif";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.035 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ProfileList({ profiles, platform }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-900/10 bg-white/50 py-20 text-center">
        <FloatingSticker src={loadingHeart} className="mb-4 h-14 w-14" />
        <p className="text-lg font-semibold text-ink-900">No creators found</p>
        <p className="mt-1 text-sm text-ink-600">
          Try a different name, username, or platform.
        </p>
      </div>
    );
  }

  return (
    <motion.ul
      key={platform}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {profiles.map((profile) => (
        <motion.li key={`${platform}-${profile.user_id}`} variants={item}>
          <ProfileCard profile={profile} platform={platform} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
