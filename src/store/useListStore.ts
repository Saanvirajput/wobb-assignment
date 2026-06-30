import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

export interface ListProfile extends UserProfileSummary {
  platform: Platform;
}

interface ListState {
  selectedProfiles: ListProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (username: string) => void;
  isProfileAdded: (username: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      addProfile: (profile, platform) => {
        const { selectedProfiles } = get();
        if (!selectedProfiles.find((p) => p.username === profile.username)) {
          set({
            selectedProfiles: [...selectedProfiles, { ...profile, platform }],
          });
        }
      },
      removeProfile: (username) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.username !== username
          ),
        }));
      },
      isProfileAdded: (username) => {
        return !!get().selectedProfiles.find((p) => p.username === username);
      },
    }),
    {
      name: "influencer-list-storage",
    }
  )
);
