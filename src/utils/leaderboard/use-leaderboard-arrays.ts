import { useMemo } from "react";
import getObjectValues from "@/utils/firebase/get-object-values";
import { type LeaderboardEntry } from "@/types/challenge";

export const useLeaderboardArrays = (
  leaderboard: LeaderboardEntry | null,
  challenge: LeaderboardEntry | null,
  uid: string | null
) => {
  const leaderboardArray = useMemo(() => {
    if (!leaderboard) return [];
    return getObjectValues(leaderboard);
  }, [leaderboard]);

  const challengeArray = useMemo(() => {
    if (!challenge) return [];
    return getObjectValues(challenge);
  }, [challenge]);

  const userGlobalEntry = useMemo(() => {
    if (!uid) return null;
    return leaderboardArray.find((a) => a.uid === uid) || null;
  }, [uid, leaderboardArray]);

  const userChallengeEntry = useMemo(() => {
    if (!uid) return null;
    return challengeArray.find((a) => a.uid === uid) || null;
  }, [uid, challengeArray]);

  const globalRank = useMemo(() => {
    if (!uid || leaderboardArray.length === 0) return null;
    const sorted = [...leaderboardArray].sort((a, b) => b.score - a.score);
    return sorted.findIndex((u) => u.uid === uid) + 1;
  }, [leaderboardArray, uid]);

  const challengeRank = useMemo(() => {
    if (!uid || challengeArray.length === 0) return null;
    const sorted = [...challengeArray].sort((a, b) => b.score - a.score);
    return sorted.findIndex((u) => u.uid === uid) + 1;
  }, [challengeArray, uid]);

  return {
    leaderboardArray,
    challengeArray,
    userGlobalEntry,
    userChallengeEntry,
    globalRank,
    challengeRank,
  };
};
