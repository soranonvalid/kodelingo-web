import { getDatabase, ref, set } from "firebase/database";
import useCreateValue from "@/utils/firebase/use-create-value";

export const useSubmitChallengeScore = (
  uid: string | null,
  challengeId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userGlobalEntry: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userChallengeEntry: any
) => {
  const db = getDatabase();
  const { setValue } = useCreateValue();

  const submitScore = (score: number) => {
    if (!uid) return;

    set(ref(db, `challengeResults/${uid}/${challengeId}`), {
      score,
      finishedAt: Date.now(),
    });

    const newGlobal = (userGlobalEntry?.score || 0) + score;
    setValue(`leaderboard/${uid}`, {
      uid,
      score: newGlobal,
    });

    const newChallenge = (userChallengeEntry?.score || 0) + score;
    setValue(`challenges/leaderboard/${challengeId}/${uid}`, {
      uid,
      score: newChallenge,
      finishedAt: Date.now(),
    });
  };

  return submitScore;
};
