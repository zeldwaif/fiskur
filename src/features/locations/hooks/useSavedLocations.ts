import { useAppStore } from "@/store/appStore";

/**
 * Feature-facing accessor for saved locations. Components use this rather than
 * reaching into the global store directly, so the storage backing can change later
 * without touching the Locations UI.
 */
export function useSavedLocations() {
  const { savedLocations, addSavedLocation, renameSavedLocation, removeSavedLocation } = useAppStore();
  return { savedLocations, addSavedLocation, renameSavedLocation, removeSavedLocation };
}
