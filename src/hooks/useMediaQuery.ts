import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/** Shared breakpoint helpers (mirrors --bp values in tokens.css). */
export const useIsMobile = () => useMediaQuery("(max-width: 640px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1024px)");
