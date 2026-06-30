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
    useListStore.setState({ selectedProfiles: [] });
  });

  it("starts with an empty list", () => {
    expect(useListStore.getState().selectedProfiles).toEqual([]);
  });

  it("adds a profile to the list", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(1);
    expect(selectedProfiles[0].username).toBe("testuser");
    expect(selectedProfiles[0].platform).toBe("instagram");
  });

  it("persists only the whitelisted summary fields", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    expect(useListStore.getState().selectedProfiles[0]).toEqual({
      user_id: "123",
      username: "testuser",
      fullname: "Test User",
      picture: "https://example.com/pic.jpg",
      is_verified: true,
      followers: 10000,
      engagement_rate: 0.05,
      platform: "instagram",
    });
  });

  it("prevents duplicate entries by username", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile, "youtube"); // same username, different platform — still blocked

    expect(useListStore.getState().selectedProfiles).toHaveLength(1);
  });

  it("removes a profile by username", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");
    expect(useListStore.getState().selectedProfiles).toHaveLength(2);

    useListStore.getState().removeProfile("testuser");

    const { selectedProfiles } = useListStore.getState();
    expect(selectedProfiles).toHaveLength(1);
    expect(selectedProfiles[0].username).toBe("anotheruser");
  });

  it("toggles a profile on and off", () => {
    const { toggleProfile } = useListStore.getState();

    toggleProfile(mockProfile, "instagram");
    expect(useListStore.getState().isSelected("testuser")).toBe(true);

    useListStore.getState().toggleProfile(mockProfile, "instagram");
    expect(useListStore.getState().isSelected("testuser")).toBe(false);
  });

  it("reports whether a profile is selected", () => {
    expect(useListStore.getState().isSelected("testuser")).toBe(false);
    useListStore.getState().addProfile(mockProfile, "instagram");
    expect(useListStore.getState().isSelected("testuser")).toBe(true);
    expect(useListStore.getState().isSelected("nonexistent")).toBe(false);
  });

  it("removes a non-existent profile gracefully", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().removeProfile("nonexistent");
    expect(useListStore.getState().selectedProfiles).toHaveLength(1);
  });

  it("clears the entire list", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");

    useListStore.getState().clear();
    expect(useListStore.getState().selectedProfiles).toEqual([]);
  });
});
