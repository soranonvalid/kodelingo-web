import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import PageLayout from "@/layout/pageLayout";
import type { Challenge } from "@/types/challenge";
import { withProtected } from "@/utils/auth/use-protected";
import { mongo } from "@/utils/mongo/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import InfoCard from "@/components/ui/infoCard";

const Play = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const res = await mongo.get<Challenge>("/challenges/" + id);
      return res.data;
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data, isLoading]);

  const currentQuestion = useMemo(() => {
    if (!data) return null;
    return data.questions[currentIndex];
  }, [data, currentIndex]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data || error || !currentQuestion) {
    return <ErrPage code={500} />;
  }

  const percentage = ((currentIndex + 1) / data.questions.length) * 100;
  const type = currentQuestion.type;

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <h1 className="font-bold">{data.name}</h1>
        <span>
          Questions: {currentIndex + 1} / {data.questions.length}
        </span>
      </div>
      <div className="flex flex-col w-full mt-5">
        <div className="w-full h-2 bg-[#e2e2e2] rounded-full overflow-hidden">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${percentage}%`,
            }}
            transition={{
              ease: "easeInOut",
              duration: 1,
            }}
            style={{ width: `${75}%` }}
            className={`bg-amber-400 h-full`}
          />
        </div>
      </div>
      <div className="mt-10 text-xl">
        <Markdown>{currentQuestion.text}</Markdown>
      </div>
      <div className="mt-10 flex flex-col gap-2">
        {type === "multiple choice" ? (
          currentQuestion.options.map((o) => {
            return (
              <motion.div
                key={o}
                className="rounded-2xl border border-black/10 min-w-full z-10 snap-start px-6 py-5 sm:py-3 sm:px-5 bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#F4F4F4_99.56%)] cursor-pointer"
              >
                {o}
              </motion.div>
            );
          })
        ) : (
          <></>
        )}
        {/* {currentIndex < data.questions.length - 1 && (
          <Button onClick={() => setCurrentIndex((prev) => prev + 1)}>
            Next
          </Button>
        )} */}
      </div>
    </PageLayout>
  );
};

const PlayPage = withProtected(Play);
export default PlayPage;
