import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import RankCard from "@/components/ui/rankCard";
import PageLayout from "@/layout/pageLayout";
import type { LeaderboardEntry } from "@/types/challenge";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { useLeaderboardArrays } from "@/utils/leaderboard/use-leaderboard-arrays";
import { useEffect } from "react";

const LeaderboardPage = () => {
  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useRealtimeValue<LeaderboardEntry>("leaderboard");

  const { leaderboardArray } = useLeaderboardArrays(leaderboard);

  useEffect(() => {
    console.log(leaderboardArray);
  }, [leaderboardArray]);

  if (leaderboardLoading) {
    return <Loading />;
  }

  if (leaderboardError || !leaderboard) {
    return <ErrPage code={500} />;
  }

  return (
    <PageLayout>
      <div className="flex w-full items-center justify-between">
        <h1 className="font-bold">Global Leaderboard</h1>
      </div>
      <section className="flex flex-col gap-3 mt-5">
        {leaderboardArray.map((l, idx) => (
          <RankCard key={idx} rank={idx + 1} score={l.score} avatar={l.uid} />
        ))}
      </section>
    </PageLayout>
  );
};

export default LeaderboardPage;
