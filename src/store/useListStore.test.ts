import { describe, it, expect, beforeEach } from "vitest";
import { useListStore } from "./useListStore";
import type { UserProfileSummary } from "@/types";

const mockProfile: UserProfileSummary = {
  user_id: "123",
  username: "testuser",
  fullname: "Test User",
  picture: "https://example.com/pic.jpg",
  url: "https://instagram.com/testuser",
  followers: 10000,
  is_verified: true,
  engagement_rate: 0.05,
};

const mockProfile2: UserProfileSummary = {
  user_id: "456",
  username: "anotheruser",
  fullname: "Another User",
  picture: "https://example.com/pic2.jpg",
  url: "https://youtube.com/anotheruser",
  followers: 50000,
  is_verified: false,
  engagement_rate: 0.03,
};

describe("useListStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    useListStore.setState({ selectedProfiles: [] });
  });

  it("should start with an empty list", () => {
    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toEqual([]);
  });

  it("should add a profile to the list", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(1);
    expect(selectedProfiles[0].username).toBe("testuser");
    expect(selectedProfiles[0].platform).toBe("instagram");
  });

  it("should prevent duplicate entries by username", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile, "youtube"); // Same username, different platform — should still be blocked

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(1);
  });

  it("should remove a profile by username", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");

    expect(useListStore.getState().selectedProfiles).toHaveLength(2);

    const { removeProfile } = useListStore.getState();
    removeProfile("testuser");

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(1);
    expect(selectedProfiles[0].username).toBe("anotheruser");
  });

  it("should correctly report if a profile is added", () => {
    const { addProfile, isProfileAdded } = useListStore.getState();

    expect(isProfileAdded("testuser")).toBe(false);

    addProfile(mockProfile, "instagram");

    // Need to get fresh state after mutation
    expect(useListStore.getState().isProfileAdded("testuser")).toBe(true);
    expect(useListStore.getState().isProfileAdded("nonexistent")).toBe(false);
  });

  it("should handle removing a non-existent profile gracefully", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");

    const { removeProfile } = useListStore.getState();
    removeProfile("nonexistent");

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(1);
  });

  it("should add multiple different profiles", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(2);
    expect(selectedProfiles[0].platform).toBe("instagram");
    expect(selectedProfiles[1].platform).toBe("youtube");
  });
});
