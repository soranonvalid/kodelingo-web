import { useMemo } from "react";
import getObjectValues from "@/utils/firebase/get-object-values";
import { type LeaderboardEntry } from "@/types/challenge";

export const useLeaderboardArrays = (
  leaderboard?: LeaderboardEntry | null,
  challenge?: LeaderboardEntry | null,
  uid?: string | null
) => {
  const sortLeaderboard = (arr: LeaderboardEntry[]) => {
    return arr.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      return (a.finishedAt ?? 0) - (b.finishedAt ?? 0);
    });
  };

  const leaderboardArray = useMemo(() => {
    if (!leaderboard) return [];
    const arr = getObjectValues(leaderboard) as LeaderboardEntry[];
    return sortLeaderboard(arr);
  }, [leaderboard]);

  const challengeArray = useMemo(() => {
    if (!challenge) return [];
    const arr = getObjectValues(challenge) as LeaderboardEntry[];
    return sortLeaderboard(arr);
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
    return leaderboardArray.findIndex((u) => u.uid === uid) + 1;
  }, [leaderboardArray, uid]);

  const challengeRank = useMemo(() => {
    if (!uid || challengeArray.length === 0) return null;
    return challengeArray.findIndex((u) => u.uid === uid) + 1;
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
