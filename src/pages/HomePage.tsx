import PageLayout from "@/layout/pageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Antenna, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHead from "@/components/ui/sectionHead";
import ChallengeCard from "@/components/ui/challengeCard";
import getObjectValues from "@/utils/firebase/get-object-values";
import { useMemo } from "react";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import type { Challenge, LeaderboardEntry } from "@/types/challenge";
import { mongo } from "@/utils/mongo/api";
import RankBadge from "@/components/ui/rankBadge";
import { useUser } from "@/context/user";
import { useLeaderboardArrays } from "@/utils/leaderboard/use-leaderboard-arrays";
import { withProtected } from "@/utils/auth/use-protected";
import { Button } from "@/components/ui/button";
const Home = () => {
  const { avatar, name, uid } = useUser();

  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useRealtimeValue<LeaderboardEntry>("leaderboard");

  const {
    data: result,
    isLoading: resultLoading,
    error: resultError,
  } = useRealtimeValue(`challengeResults/${uid}`);

  const { leaderboardArray } = useLeaderboardArrays(leaderboard, null, null);

  const user = {
    photoURL: avatar || undefined,
    displayName: name || "User",
  };
  const navigate = useNavigate();
  const {
    data: challenges,
    isLoading: challengesLoading,
    error: challengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const res = await mongo.get("challenges/");
      return res.data;
    },
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useRealtimeValue("users");

  const usersArray = useMemo(() => {
    if (!users || typeof users !== "object") return [];
    return getObjectValues(users);
  }, [users]);

  if (
    challengesLoading ||
    usersLoading ||
    !users ||
    !challenges ||
    leaderboardLoading ||
    resultLoading
  ) {
    return <Loading />;
  }

  if (
    challengesError ||
    usersError ||
    leaderboardError ||
    !leaderboard ||
    resultError
  ) {
    return <ErrPage code={400} />;
  }

  const userStats = leaderboardArray.find((l) => l.uid === uid);
  const userRank = leaderboardArray.indexOf(userStats!) + 1;

  const done = (challenges as Challenge[]).filter((ch) =>
    Object.keys(result ?? {}).includes(ch._id)
  );

  return (
    <PageLayout>
      <main>
        <SectionHead title={"Profile"} fx={true} path="/profile">
          <div className="flex sm:flex-row flex-col gap-2 sm:gap-10 items-center w-full">
            <Avatar
              onClick={() => {
                navigate("/profile");
              }}
              className="sm:w-20 w-35 sm:h-20 h-35 cursor-pointer"
            >
              <AvatarImage src={user.photoURL} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="h-full flex flex-col sm:items-start items-center gap-2 w-full">
              <h2 className="text-2xl sm:text-left text-center font-semibold">
                {user.displayName}
              </h2>
              <div className="flex w- items-center gap-3">
                <RankBadge rank={userRank} />
                <div className="text-sm">{userStats?.score}</div>
              </div>
            </div>
          </div>
        </SectionHead>
        <SectionHead title={"Challenges"} fx={true} path="/challenges">
          <div className="flex flex-col-reverse gap-3">
            {done.length > 0 ? (
              done.map((ch) => (
                <ChallengeCard
                  key={ch._id}
                  challenge={ch}
                  usersArray={usersArray}
                />
              ))
            ) : (
              <div className="w-full h-50 flex flex-col gap-5 justify-center items-center text-black/50 text-center">
                <Antenna />
                <p className="max-w-[229px]">
                  It seems you haven't completed any challenges.
                </p>
                <Button
                  onClick={() => {
                    navigate("/challenges");
                  }}
                  className="cursor-pointer"
                >
                  Search
                </Button>
              </div>
            )}
          </div>
        </SectionHead>
      </main>
    </PageLayout>
  );
};

const HomePage = withProtected(Home);
export default HomePage;
