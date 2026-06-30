import { motion } from "framer-motion";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { SearchX } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
        <SearchX className="w-24 h-24 mb-6 opacity-20" />
        <p className="text-2xl font-black uppercase tracking-widest text-zinc-500">No profiles found</p>
        <p className="text-base text-zinc-600 mt-2 font-medium">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center w-full"
    >
      {profiles.map((profile) => (
        <motion.div key={profile.user_id} variants={item} className="w-full flex justify-center">
          <ProfileCard
            profile={profile}
            platform={platform}
            searchQuery={searchQuery}
            onProfileClick={onProfileClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
