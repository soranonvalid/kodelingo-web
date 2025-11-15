import type { FirebaseUser } from "@/types/firebase";
import { motion } from "framer-motion";
import { AnimatedScore } from "./ui/animatedScore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CornerDownRight, Medal, User } from "lucide-react";
import { useEffect, useState } from "react";
import { GiPodium } from "react-icons/gi";
import { useUser } from "@/context/user";
import { useLeaderboardArrays } from "@/utils/leaderboard/use-leaderboard-arrays";
import type { LeaderboardEntry } from "@/types/challenge";
import { useChallengeCompletion } from "@/utils/leaderboard/use-challenge-completion";
import { useSubmitChallengeScore } from "@/utils/leaderboard/use-submit-challenge-score";
import { useNavigate } from "react-router-dom";

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
  challengeLeaderboard: LeaderboardEntry | null;
  leaderboard: LeaderboardEntry | null;
  challengeId: string;
}) => {
  const { uid } = useUser();
  const [totalScore, setTotalScore] = useState(0);

  const {
    leaderboardArray,
    challengeArray,
    userChallengeEntry,
    userGlobalEntry,
    globalRank,
    challengeRank,
  } = useLeaderboardArrays(leaderboard, challengeLeaderboard, uid);

  const alreadyCompleted = useChallengeCompletion(uid, challengeId);

  const submitScore = useSubmitChallengeScore(
    uid,
    challengeId,
    userGlobalEntry,
    userChallengeEntry
  );

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
    submitScore(attemptScore);
  }, [alreadyCompleted, correctsAnswer, questionsLength, submitScore, uid]);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <Avatar className="w-30 h-30 border">
            <AvatarImage src={profile.photoURL} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
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
          <span className="text-3xl">
            {globalRank ?? "-"} / {leaderboardArray.length || 1}
          </span>
          <p className="text-black/50 flex text-sm gap-1 items-center">
            <GiPodium className="w-5" /> Current global rank
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl">
            {challengeRank ?? "-"} / {challengeArray.length || 1}
          </span>
          <p className="text-black/50 flex text-sm gap-1 items-center">
            <Medal className="w-4" /> Current challenge rank
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          navigate(`/challenges/${challengeId}`);
        }}
        className="flex gap-3 py-15 italic opacity-45 pop cursor-pointer"
      >
        <CornerDownRight />
        Return
      </button>
    </div>
  );
};

export default ResultContainer;
