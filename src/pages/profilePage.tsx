import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ErrPage from "@/components/ui/errPage";
import RankBadge from "@/components/ui/rankBadge";
import { useUser } from "@/context/user";
import PageLayout from "@/layout/pageLayout";
import type { LeaderboardEntry } from "@/types/challenge";
import { withProtected } from "@/utils/auth/use-protected";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { useLeaderboardArrays } from "@/utils/leaderboard/use-leaderboard-arrays";
import { LogOut, User } from "lucide-react";
import { SignOut } from "@/services/firebase";
import { useState } from "react";

const Profile = () => {
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const { avatar, name, uid } = useUser();
  const {
    data: leaderboard,
    isLoading,
    error,
  } = useRealtimeValue<LeaderboardEntry>("leaderboard");

  const { leaderboardArray } = useLeaderboardArrays(leaderboard, null, null);

  const userStats = leaderboardArray.find((l) => l.uid === uid);
  const userRank = leaderboardArray.indexOf(userStats!) + 1;

  if (isLoading) return <Loading />;
  if (error) return <ErrPage code={500} />;

  const handleLogout = async () => {
    try {
      await SignOut();
      console.log("Logged out");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <PageLayout center={true} scroll={false}>
      <div className="flex flex-col gap-5 items-center">
        <div className="flex flex-col gap-2 items-center w-full">
          <Avatar className="w-35 h-35">
            <AvatarImage src={avatar || ""} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="h-full flex flex-col items-center gap-2 w-full">
            <h2 className="text-2xl w-full text-center font-semibold">
              {name || "user"}
            </h2>
            <div className="flex w- items-center gap-3">
              <RankBadge rank={userRank} />
              <div className="text-sm">{userStats?.score}</div>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`flex gap-3 text-sm items-center transition-smooth mt-5 ${
            isProcess ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <LogOut size={17} />
          <p>Sign Out</p>
        </button>
      </div>
    </PageLayout>
  );
};

const ProfilePage = withProtected(Profile);
export default ProfilePage;
