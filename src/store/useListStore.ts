import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

export interface ListProfile {
  user_id: string;
  username: string;
  fullname: string;
  picture: string;
  is_verified: boolean;
  followers: number;
  engagement_rate?: number;
  platform: Platform;
}

interface ListState {
  selectedProfiles: ListProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (username: string) => void;
  toggleProfile: (profile: UserProfileSummary, platform: Platform) => void;
  isSelected: (username: string) => boolean;
  clear: () => void;
}

/** Normalises an arbitrary profile object down to the fields we persist. */
function toListProfile(
  profile: UserProfileSummary,
  platform: Platform
): ListProfile {
  return {
    user_id: profile.user_id,
    username: profile.username,
    fullname: profile.fullname,
    picture: profile.picture,
    is_verified: profile.is_verified,
    followers: profile.followers,
    engagement_rate: profile.engagement_rate,
    platform,
  };
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

      addProfile: (profile, platform) =>
        set((state) =>
          state.selectedProfiles.some((p) => p.username === profile.username)
            ? state // duplicate — no-op
            : {
                selectedProfiles: [
                  ...state.selectedProfiles,
                  toListProfile(profile, platform),
                ],
              }
        ),

      removeProfile: (username) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.username !== username
          ),
        })),

      toggleProfile: (profile, platform) => {
        const { isSelected, addProfile, removeProfile } = get();
        if (isSelected(profile.username)) {
          removeProfile(profile.username);
        } else {
          addProfile(profile, platform);
        }
      },

      isSelected: (username) =>
        get().selectedProfiles.some((p) => p.username === username),

      clear: () => set({ selectedProfiles: [] }),
    }),
    {
      name: "vibe-selected-profiles",
      version: 1,
    }
  )
);
