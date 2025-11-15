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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    setIsProcess(true);
    try {
      await SignOut();
      console.log("Logged out");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcess(false);
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
        <AlertDialog>
          <AlertDialogTrigger
            className={`flex gap-3 text-sm items-center text-red-500 transition-smooth mt-5 ${
              isProcess ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            disabled={isProcess ? true : false}
          >
            <LogOut size={17} />
            Log Out
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out from the current session, You will
                directed into log in as soon as you leave.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isProcess ? true : false}
                className="cursor-pointer bg-red-500"
                onClick={handleLogout}
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

const ProfilePage = withProtected(Profile);
export default ProfilePage;
