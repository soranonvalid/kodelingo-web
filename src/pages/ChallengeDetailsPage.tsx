import PageLayout from "@/layout/pageLayout";
import { withProtected } from "@/utils/auth/use-protected";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Code,
  Play,
  SignalHigh,
  Star,
  Trash2Icon,
  User,
} from "lucide-react";
import type { FirebaseUser } from "@/types/firebase";
import { Badge } from "@/components/ui/badge";
import { useChallenge } from "@/utils/challenges/use-challenge";
import InfoCard from "@/components/ui/infoCard";
import { firstLetterToUpperCase } from "@/lib/word";
import getObjectValues from "@/utils/firebase/get-object-values";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatedScore } from "@/components/ui/animatedScore";
import { Button } from "@/components/ui/button";
import { mongo } from "@/utils/mongo/api";
import { getLangIco } from "@/utils/renderUtils";
import { useUser } from "@/context/user";
import { useLeaderboardArrays } from "@/utils/leaderboard/use-leaderboard-arrays";
import type { LeaderboardEntry } from "@/types/challenge";
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

const ChallengeDetails = () => {
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const { id } = useParams();
  const { uid } = useUser();
  const navigate = useNavigate();
  const {
    data: challenge,
    isLoading: challengeLoading,
    error: challengeError,
  } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const res = await mongo.get("/challenges/" + id);
      return res.data;
    },
  });

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useRealtimeValue<FirebaseUser>(
    challenge ? `users/${challenge.author}` : null
  );

  const {
    data: result,
    isLoading: resultLoading,
    error: resultError,
  } = useRealtimeValue(`challengeResults/${uid}`);

  const { getDifficulty, formatDate } = useChallenge();

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useRealtimeValue("users");

  const { data: sudahData, isLoading: sudahDataLoading } =
    useRealtimeValue<LeaderboardEntry>(`challengeResults/${uid}/${id}`);

  const usersArray: FirebaseUser[] = useMemo(() => {
    if (!users || typeof users !== "object") return [];
    return getObjectValues(users);
  }, [users]);

  const { data, isLoading, error } = useRealtimeValue<LeaderboardEntry>(
    "challenges/leaderboard/" + id
  );

  const { challengeArray } = useLeaderboardArrays(null, data);

  const getOrdinalSuffix = (num: number): string => {
    const tens = num % 100;

    if (tens >= 11 && tens <= 13) {
      return "th";
    }

    switch (num % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (
    challengeLoading ||
    !challenge ||
    profileLoading ||
    !profile ||
    usersLoading ||
    isLoading ||
    sudahDataLoading ||
    resultLoading
  ) {
    return <Loading />;
  }

  if (challengeError || profileError || usersError || error || resultError) {
    return <ErrPage code={500} />;
  }

  const infoItems = {
    details: [
      {
        icon: <User className="w-4.5 h-4.5" />,
        label: "Author",
        content: (
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={profile.photoURL} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm">{profile.displayName}</p>
          </div>
        ),
      },
      {
        icon: <Code className="w-4.5 h-4.5" />,
        label: "Language",
        content: (
          <div className="flex gap-2 items-center">
            <p className="text-sm">{getLangIco(challenge.lang)}</p>
            {challenge.lang}
          </div>
        ),
      },
      {
        icon: <SignalHigh className="w-4.5 h-4.5" />,
        label: "Difficulty",
        content: (
          <Badge
            variant={getDifficulty(challenge.difficulty)}
            className="font-bold"
          >
            {firstLetterToUpperCase(challenge.difficulty)}
          </Badge>
        ),
      },
      {
        icon: <Calendar className="w-4.5 h-4.5" />,
        label: "Created at",
        content: <p className="text-sm">{formatDate(challenge.createdAt)}</p>,
      },
    ],
    stats: sudahData
      ? [
          {
            icon: <Star className="w-4.5 h-4.5" />,
            label: "Score",
            content: <p className="text-sm">{sudahData.score}</p>,
          },
          {
            icon: <Calendar className="w-4.5 h-4.5" />,
            label: "Finished at",
            content: (
              <p className="text-sm">{formatDate(sudahData.finishedAt!)}</p>
            ),
          },
        ]
      : [],
  };

  const handleDelete = async (id: string) => {
    setIsProcess(true);
    try {
      console.log("deleting...");
      await mongo.delete(`/challenges/${id}`);
      navigate("/challenges");
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcess(false);
    }
  };

  return (
    <PageLayout>
      <div
        onClick={() => {
          navigate("/challenges");
        }}
        className="flex gap-3 items-center mb-5"
      >
        <ArrowLeft />
        <h1 className="font-bold">Challenge</h1>
      </div>

      <InfoCard>
        <div className="w-full mb-4">
          <h1 className="font-bold">{challenge.name}</h1>
        </div>

        <div className="w-full flex flex-col gap-5">
          {infoItems.details.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 min-h-[24px]"
            >
              <div className="flex items-center gap-2 opacity-60 min-w-[100px] md:min-w-[120px]">
                {item.icon}
                <p className="text-sm font-medium">{item.label}</p>
              </div>
              {item.content}
            </div>
          ))}
        </div>
      </InfoCard>
      <div className="mt-3 flex gap-5 items-center">
        {Object.keys(result ?? {}).includes(challenge._id) ? (
          <Button
            className="cursor-pointer bg-black"
            onClick={() => navigate("/challenges/play/" + challenge._id)}
          >
            Try again
          </Button>
        ) : (
          <div
            className="flex gap-3 bg-black w-min text-white rounded-md px-3 py-2 text-sm items-center cursor-pointer select-none"
            onClick={() => navigate("/challenges/play/" + challenge._id)}
          >
            <Play fill="white" size={15} />
            Play
          </div>
        )}
        {uid === profile.uid && (
          <AlertDialog>
            <AlertDialogTrigger
              disabled={isProcess ? true : false}
              className={`flex gap-2 text-red-500 items-center text-sm ${
                isProcess ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Trash2Icon size={15} />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This challenge will be deleted. This only delete the challenge
                  and the rank within it but the score wont be decreased once it
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isProcess ? true : false}
                  className="cursor-pointer bg-red-500"
                  onClick={() => {
                    handleDelete(challenge._id);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="my-2" />
      {sudahData && (
        <InfoCard>
          <div className="w-full mb-4">
            <h1 className="font-bold">Your Stats</h1>
          </div>

          <div className="w-full flex flex-col gap-5">
            {infoItems.stats.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 min-h-[24px]"
              >
                <div className="flex items-center gap-2 opacity-60 min-w-[100px] md:min-w-[120px]">
                  {item.icon}
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
                {item.content}
              </div>
            ))}
          </div>
        </InfoCard>
      )}
      <div className="flex justify-between items-center mb-5 mt-5">
        <h1 className="font-bold">Leaderboard</h1>
      </div>
      <div className="flex flex-col ">
        <div className="flex w-full justify-center min-h-[200px] gap-5 overflow-hidden">
          {[challengeArray[1], challengeArray[0], challengeArray[2]].map(
            (user, idx) => {
              if (!user) {
                return (
                  <div
                    key={"empty-" + idx}
                    className="flex flex-col items-center opacity-40"
                  >
                    <p className="font-bold">-</p>
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  </div>
                );
              }

              const profile = usersArray.find((u) => u.uid === user.uid);
              const podiumRanks = [2, 1, 3];
              const marginTop = [30, 10, 40];
              const speed = [1.4, 1.2, 1.6];

              return (
                <div
                  key={user.uid}
                  style={{ marginTop: marginTop[idx] + "px" }}
                  className="flex flex-col items-center"
                >
                  <motion.p
                    className="font-bold flex items-start"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: speed[idx] }}
                    viewport={{ once: true }}
                  >
                    {podiumRanks[idx]}
                    <span className="text-[12px]">
                      {getOrdinalSuffix(podiumRanks[idx])}
                    </span>
                  </motion.p>

                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ y: 120, opacity: 0.8 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: speed[idx], ease: "easeInOut" }}
                    viewport={{ once: true }}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile?.photoURL} />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{profile?.displayName || "Unknown User"}</p>
                      </TooltipContent>
                    </Tooltip>

                    <AnimatedScore score={user.score} />
                  </motion.div>
                </div>
              );
            }
          )}
        </div>
        {[...challengeArray].splice(3, challengeArray.length).length > 0 && (
          <InfoCard>
            <div className="w-full flex flex-col">
              {[...challengeArray]
                .splice(3, challengeArray.length)
                .map((user, idx) => {
                  const profile = usersArray.find((u) => u.uid === user.uid);
                  return (
                    <div
                      key={user.uid}
                      className={`w-full flex items-center gap-6 py-2.5 ${
                        idx !== 0 ? "border-t border-black/10" : ""
                      }`}
                    >
                      <p className="font-bold flex items-start">
                        {idx + 4}
                        <span className="text-[12px]">
                          {getOrdinalSuffix(idx + 4)}
                        </span>
                      </p>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={profile?.photoURL} />
                            <AvatarFallback>
                              <User />
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm">{profile?.displayName}</p>
                        </div>
                        <AnimatedScore score={user.score} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </InfoCard>
        )}
      </div>
    </PageLayout>
  );
};

const ChallengeDetailsPage = withProtected(ChallengeDetails);
export default ChallengeDetailsPage;
