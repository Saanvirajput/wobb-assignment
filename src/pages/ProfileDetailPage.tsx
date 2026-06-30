import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Activity, LayoutGrid, Heart, MessageCircle, Play, Eye, Plus, Check } from "lucide-react";
import { cn } from "@/utils/cn";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

const StatBox = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="bg-zinc-900/30 border border-zinc-800 p-8 flex flex-col items-center text-center gap-4 hover:border-zinc-500 transition-all hover:bg-zinc-900">
    <div className="text-zinc-600">
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <div className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">{value}</div>
      <div className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "unknown") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  const { addProfile, removeProfile, isProfileAdded } = useListStore();

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-32">
          <p className="text-3xl font-black text-white uppercase tracking-widest mb-8">Invalid profile</p>
          <Link to="/" className="text-zinc-500 hover:text-white inline-flex items-center gap-3 font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-5 h-5" /> Return
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-none h-16 w-16 border-4 border-zinc-800 border-t-white"></div>
        </div>
      </Layout>
    );
  }

  if (!profileData || !profileData.data.success) {
    return (
      <Layout>
        <div className="text-center py-32">
          <p className="text-3xl font-black text-red-500 uppercase tracking-widest mb-8">Profile Not Found</p>
          <Link to="/" className="text-zinc-500 hover:text-white inline-flex items-center gap-3 font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-5 h-5" /> Return
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isAdded = isProfileAdded(user.username);

  const handleListToggle = () => {
    if (isAdded) {
      removeProfile(user.username);
    } else {
      addProfile(user, platform);
    }
  };

  return (
    <Layout title="">
      <Link to="/" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white mb-12 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Go Back
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col items-center text-center mb-16">
          <img
            src={user.picture}
            alt={`Profile of ${user.username}`}
            className="w-40 h-40 md:w-56 md:h-56 object-cover border border-zinc-800 grayscale mb-8 shadow-2xl"
          />
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase flex items-center justify-center gap-4 mb-4">
            @{user.username}
            <VerifiedBadge verified={user.is_verified} />
          </h2>
          
          <p className="text-2xl text-zinc-400 font-medium mb-6 tracking-wide">{user.fullname}</p>
          
          <span className="inline-block px-4 py-2 border border-zinc-700 text-zinc-300 text-sm font-black uppercase tracking-widest mb-10">
            {platform}
          </span>

          {user.description && (
            <p className="text-zinc-500 max-w-3xl text-lg md:text-xl font-medium leading-relaxed mb-10">{user.description}</p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md">
            <button
              onClick={handleListToggle}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-8 py-5 text-sm font-black uppercase tracking-widest transition-all duration-300 border",
                isAdded
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  : "bg-black text-white border-zinc-700 hover:border-white hover:bg-zinc-900"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" /> Added to List
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Add to List
                </>
              )}
            </button>

            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 px-8 py-5 text-sm font-black uppercase tracking-widest bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-500 transition-all"
              >
                View Profile
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 border-t border-zinc-900 pt-16">
          <StatBox icon={Users} label="Followers" value={formatFollowersDetail(user.followers)} />
          <StatBox 
            icon={Activity} 
            label="Engagement Rate" 
            value={formatEngagementRate(user.engagement_rate)} 
          />
          {user.posts_count !== undefined && (
            <StatBox icon={LayoutGrid} label="Posts" value={user.posts_count} />
          )}
          {user.avg_likes !== undefined && (
            <StatBox icon={Heart} label="Avg Likes" value={formatFollowersDetail(user.avg_likes)} />
          )}
          {user.avg_comments !== undefined && (
            <StatBox icon={MessageCircle} label="Avg Comments" value={user.avg_comments} />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatBox icon={Eye} label="Avg Views" value={formatFollowersDetail(user.avg_views)} />
          )}
          {user.engagements !== undefined && (
            <StatBox icon={Play} label="Engagements" value={formatFollowersDetail(user.engagements)} />
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
