import type { FirebaseUser } from "@/types/firebase";
import { motion } from "framer-motion";
import { AnimatedScore } from "./ui/animatedScore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Medal, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GiPodium } from "react-icons/gi";
import getObjectValues from "@/utils/firebase/get-object-values";
import useCreateValue from "@/utils/firebase/use-create-value";
import { useUser } from "@/context/user";
import { getDatabase, ref, onValue, set } from "firebase/database";

type LeaderboardEntry = {
  uid: string;
  score: number;
  [k: string]: any;
};

const ResultContainer = ({
  correctsAnswer,
  questionsLength,
  profile,
  challengeLeaderboard,
  leaderboard,
  challengeId,
}: {
  correctsAnswer: number;
  questionsLength: number;
  profile: FirebaseUser;
  challengeLeaderboard: Record<string, any> | null;
  leaderboard: Record<string, any> | null;
  challengeId: string;
}) => {
  const db = getDatabase();
  const [totalScore, setTotalScore] = useState(0);
  const { setValue } = useCreateValue();
  const { uid } = useUser();
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean | null>(null);

  const leaderboardArray = useMemo<LeaderboardEntry[]>(() => {
    if (!leaderboard) return [];
    return getObjectValues(leaderboard) as LeaderboardEntry[];
  }, [leaderboard]);

  const challengeArray = useMemo<LeaderboardEntry[]>(() => {
    if (!challengeLeaderboard) return [];
    return getObjectValues(challengeLeaderboard) as LeaderboardEntry[];
  }, [challengeLeaderboard]);

  const userGlobalEntry = useMemo(() => {
    if (!uid || !leaderboardArray.length) return null;
    return leaderboardArray.find((a) => a.uid === uid) || null;
  }, [uid, leaderboardArray]);

  const userChallengeEntry = useMemo(() => {
    if (!uid || !challengeArray.length) return null;
    return challengeArray.find((a) => a.uid === uid) || null;
  }, [uid, challengeArray]);

  const globalRank = useMemo(() => {
    if (!leaderboardArray.length) return null;
    const sorted = [...leaderboardArray].sort((a, b) => b.score - a.score);
    return sorted.findIndex((u) => u.uid === uid) + 1;
  }, [leaderboardArray, uid]);

  const challengeRank = useMemo(() => {
    if (!challengeArray.length) return null;
    const sorted = [...challengeArray].sort((a, b) => b.score - a.score);
    return sorted.findIndex((u) => u.uid === uid) + 1;
  }, [challengeArray, uid]);

  useEffect(() => {
    if (!uid) return;
    const compRef = ref(db, `challengeResults/${uid}/${challengeId}`);
    onValue(compRef, (snap) => {
      setAlreadyCompleted(snap.exists());
    });
  }, [uid, challengeId, db]);

  useEffect(() => {
    if (alreadyCompleted === null) return;
    if (!uid) return;

    const attemptScore = Math.floor((correctsAnswer / questionsLength) * 100);
    setTotalScore(attemptScore);

    if (alreadyCompleted) {
      console.log("[SKIP] User already completed this challenge before.");
      return;
    }

    console.log("[UPDATE] First time completion — updating score...");

    set(ref(db, `challengeResults/${uid}/${challengeId}`), {
      score: attemptScore,
      finishedAt: Date.now(),
    });

    const newGlobalScore = (userGlobalEntry?.score || 0) + attemptScore;
    setValue(`leaderboard/${uid}`, { uid, score: newGlobalScore });

    const newChallengeScore = (userChallengeEntry?.score || 0) + attemptScore;
    setValue(`challenges/leaderboard/${challengeId}/${uid}`, {
      uid,
      score: newChallengeScore,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyCompleted]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <Avatar className="w-30 h-30 border">
            <AvatarImage src={profile.photoURL} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
        </motion.div>
      </div>

      <motion.div
        className="overflow-hidden flex items-center mt-5"
        initial={{ height: 0, gap: 6 }}
        animate={{ height: "fit-content", gap: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex items-center flex-col overflow-hidden w-fit justify-center"
          initial={{ width: 100 }}
          animate={{ x: 50, opacity: 0, width: 0 }}
          transition={{ delay: 0.5, ease: "easeInOut" }}
        >
          <div className="flex gap-1">
            <span className="text-4xl -translate-y-1">+</span>
            <AnimatedScore
              score={totalScore}
              delay={0.2}
              duration={1.2}
              className="font-bold text-4xl"
            />
          </div>
          <p className="text-black/50">Score</p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center flex-col"
          animate={{ width: "100%" }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-1">
            <p className="text-4xl">{totalScore}</p>
          </div>
          <p className="text-black/50">Total score</p>
        </motion.div>
      </motion.div>

      <div className="flex md:gap-10 md:flex-row flex-col gap-4 mt-6">
        <div className="flex flex-col items-center">
          <span className="text-3xl">{globalRank ?? "-"} / {leaderboardArray.length || 1}</span>
          <p className="text-black/50 flex text-sm gap-1 items-center">
            <GiPodium className="w-5" /> Current global rank
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl">{challengeRank ?? "-"} / {challengeArray.length || 1}</span>
          <p className="text-black/50 flex text-sm gap-1 items-center">
            <Medal className="w-4" /> Current challenge rank
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultContainer;