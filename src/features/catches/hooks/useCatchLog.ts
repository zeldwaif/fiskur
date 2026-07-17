import { useAppStore } from "@/store/appStore";

/**
 * Feature-facing accessor for the catch log. Keeps catch components decoupled from
 * the global store shape and from the persistence mechanism.
 */
export function useCatchLog() {
  const { catches, addCatch, removeCatch } = useAppStore();
  return { catches, addCatch, removeCatch };
}
