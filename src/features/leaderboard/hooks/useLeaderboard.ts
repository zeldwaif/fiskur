import { useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { demoAnglers } from "../data/demoAnglers";
import { buildLeaderboard, verifiedCatches } from "../logic/leaderboard";
import type { Angler, CategoryId } from "../types";

/**
 * Assembles the field: the real user plus the clearly-marked sample anglers.
 *
 * Note the user's row is built from the same `Angler` shape and scored by the same
 * function as everyone else — there is no separate "me" code path, so the ranking cannot
 * quietly flatter the user.
 */
export function useLeaderboard(categoryId: CategoryId) {
  const { catches, profile } = useAppStore();

  const self: Angler = useMemo(
    () => ({
      id: "self",
      displayName: profile.displayName,
      handle: profile.handle,
      catches,
      isSample: false,
      isSelf: true,
    }),
    [catches, profile.displayName, profile.handle],
  );

  const entries = useMemo(() => buildLeaderboard(categoryId, [self, ...demoAnglers]), [categoryId, self]);

  const selfStats = useMemo(() => {
    const verified = verifiedCatches(catches);
    return {
      total: catches.length,
      verified: verified.length,
      excluded: catches.length - verified.length,
    };
  }, [catches]);

  return { entries, selfStats };
}
