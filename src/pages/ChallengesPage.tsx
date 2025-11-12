import PageLayout from "@/layout/pageLayout";
import { withProtected } from "@/utils/auth/use-protected";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import getObjectValues from "@/utils/firebase/get-object-values";
import ChallengeCard from "@/components/ui/challengeCard";
import type { Challenge } from "@/types/challenge";
import sudah from "@/data/challengeSudah.json";
import { mongo } from "@/utils/mongo/api";

const Challenges = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const {
    data: challenges,
    isLoading: challengesLoading,
    error: challengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const res = await mongo.get<Challenge[]>("/challenges");
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

  useEffect(() => {
    console.log(challenges);
  }, [challenges, challengesLoading]);

  if (
    challengesLoading ||
    !challenges ||
    !users ||
    usersLoading ||
    usersArray.length == 0
  ) {
    return <Loading />;
  }

  if (challengesError || usersError) {
    return <ErrPage code={400} />;
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <h1 className="font-bold">Challenges</h1>
        <Tooltip>
          <TooltipTrigger asChild className="hover:cursor-pointer px-3">
            <button className="relative">
              <Plus className="w-4.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create challenge</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="w-full mt-2">
        <input
          type="text"
          className="w-full text-sm px-4 py-3 bg-black/5 focus:outline-2 focus:outline-black/50 rounded-sm font-jakarta focus:bg-[#DFDFDF]/25"
          placeholder="Search challenge.."
          onChange={(e) => setSearchValue(e.target.value)}
          defaultValue={searchValue}
        />
      </div>
      <div className="w-full flex flex-col gap-3 pt-4">
        {challenges
          .filter(
            (challenge: Challenge) =>
              !sudah.some((item) => item.idChallenge === challenge._id)
          )
          .filter(
            (challenge: Challenge) =>
              searchValue.trim() === "" ||
              challenge.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((challenge: Challenge) => {
            return (
              <ChallengeCard challenge={challenge} usersArray={usersArray} />
            );
          })}
      </div>
    </PageLayout>
  );
};

const ChallengesPage = withProtected(Challenges);
export default ChallengesPage;
