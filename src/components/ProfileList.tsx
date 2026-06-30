import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
};

export function ProfileList({ profiles, platform }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <SearchX className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-slate-700">No creators found</p>
        <p className="mt-1 text-sm text-slate-500">
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
