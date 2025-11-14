import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
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
      <div>LeaderboardPage</div>
    </PageLayout>
  );
};

export default LeaderboardPage;
