import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import PageLayout from "@/layout/pageLayout";
import type { Challenge, LeaderboardEntry } from "@/types/challenge";
import { withProtected } from "@/utils/auth/use-protected";
import { mongo } from "@/utils/mongo/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@uidotdev/usehooks";
import remarkGfm from "remark-gfm";
import { useUser } from "@/context/user";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import ResultContainer from "@/components/ResultContainer";
import type { FirebaseUser } from "@/types/firebase";

const shuffle = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Play = () => {
  const { id } = useParams();
  const { uid } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctsAnswer, setCorrectsAnswer] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { width } = useWindowSize();

  const {
    data: challenge,
    isLoading: challengeLoading,
    error: challengeError,
  } = useQuery({
    queryKey: ["challenge", id],
    queryFn: async () => {
      if (!id) throw new Error("No challenge id");
      const res = await mongo.get<Challenge>(`/challenges/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useRealtimeValue<FirebaseUser>(`users/${uid}`);

  const {
    data: challengeLeaderboard,
    isLoading: challengeLeaderboardLoading,
    error: challengeLeaderboardError,
  } = useRealtimeValue<LeaderboardEntry>(`challenges/leaderboard/${id}`);

  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useRealtimeValue<LeaderboardEntry>("leaderboard");

  const currentQuestion = useMemo(() => {
    if (!challenge) return null;
    return challenge.questions[currentIndex];
  }, [challenge, currentIndex]);

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffle(currentQuestion.options);
  }, [currentQuestion]);

  if (
    challengeLoading ||
    profileLoading ||
    challengeLeaderboardLoading ||
    leaderboardLoading
  )
    return <Loading />;
  if (
    !challenge ||
    challengeError ||
    !currentQuestion ||
    !width ||
    !profile ||
    profileError ||
    challengeLeaderboardError ||
    leaderboardError ||
    !id
  )
    return <ErrPage code={500} />;

  const percentage = ((currentIndex + 1) / challenge.questions.length) * 100;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    setIsAnswered(true);
    if (currentQuestion.answer === option) {
      setCorrectsAnswer((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleComplete = () => {
    if (currentIndex < challenge.questions.length - 1) return;
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <PageLayout center>
        <ResultContainer
          correctsAnswer={correctsAnswer}
          questionsLength={challenge.questions.length}
          profile={profile}
          challengeLeaderboard={challengeLeaderboard}
          leaderboard={leaderboard}
          challengeId={id}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <h1 className="font-bold">{challenge.name}</h1>
        <span>
          Questions: {currentIndex + 1} / {challenge.questions.length}
        </span>
      </div>

      <div className="flex flex-col w-full mt-5">
        <div className="w-full h-2 bg-[#e2e2e2] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ ease: "easeInOut", duration: 0.8 }}
            className="bg-amber-400 h-full"
          />
        </div>
      </div>

      <div className="mt-10 text-xl">
        <Markdown remarkPlugins={[remarkGfm]}>{currentQuestion.text}</Markdown>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        {shuffledOptions.map((o, idx) => {
          let bg = "linear-gradient(234.98deg,#FFFFFF 49.95%,#F4F4F4 99.56%)";

          if (isAnswered) {
            if (o === currentQuestion.answer)
              bg = "linear-gradient(234.98deg,#D1FAE5 0%,#A7F3D0 100%)";
            else if (o === selected)
              bg = "linear-gradient(234.98deg,#FEE2E2 0%,#FCA5A5 100%)";
          } else if (selected === o) {
            bg = "linear-gradient(234.98deg,#FEF3C7 0%,#FDE68A 100%)";
          }

          return (
            <motion.div
              key={idx}
              onClick={() => handleSelect(o)}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-black/10 px-6 py-5 sm:py-3 sm:px-5 cursor-pointer"
              initial={{ backgroundImage: bg }}
              animate={{ backgroundImage: bg }}
            >
              {o}
            </motion.div>
          );
        })}
      </div>

      {isAnswered && currentIndex < challenge.questions.length - 1 && (
        <Button className="mt-6" onClick={handleNext}>
          Next
        </Button>
      )}

      {isAnswered && currentIndex === challenge.questions.length - 1 && (
        <Button className="mt-6" onClick={handleComplete}>
          Complete
        </Button>
      )}
    </PageLayout>
  );
};

const PlayPage = withProtected(Play);
export default PlayPage;
