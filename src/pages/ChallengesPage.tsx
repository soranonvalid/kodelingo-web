import PageLayout from "@/layout/pageLayout";
import { withProtected } from "@/utils/auth/use-protected";
import { Plus, User } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import demo from "@/data/demo.json";
import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FirebaseUser } from "@/types/firebase";
import getObjectValues from "@/utils/firebase/get-object-values";
import { SiJavascript } from "react-icons/si";

const Challenges = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const {
    data: challenges,
    isLoading: challengesLoading,
    error: challengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const res = demo;
      return res;
    },
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useRealtimeValue("users");

  const usersArray = useMemo(() => {
    if (!users) return [];
    return getObjectValues(users as object);
  }, [users]);

  const getProfile = (challenge: any) =>
    usersArray.find((user: FirebaseUser) => user.uid === challenge.author);

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

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
            (challenge) =>
              searchValue.trim() === "" ||
              challenge.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((challenge) => {
            return (
              <div
                key={challenge.id}
                className="w-full p-4 border border-black/10 rounded-xl"
                style={{
                  background:
                    "linear-gradient(234.98deg, #FFFFFF 49.95%, #F4F4F4 99.56%)",
                }}
              >
                <div className="flex w-full justify-between">
                  <div className="flex w-full flex-col">
                    <p className="font-bold">{challenge.name}</p>
                    <span className="text-[12px] text-black/50">
                      {formatDate(challenge.createdAt)}
                    </span>
                  </div>
                  <span className="text-sm text-nowrap">
                    Questions: {challenge.questions.length}
                  </span>
                </div>
                <div className="text-sm flex w-full justify-between mt-5 gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={getProfile(challenge).photoURL} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <p>{getProfile(challenge).displayName}</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <SiJavascript size={25} color="#EDE242" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Javascript</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
      </div>
    </PageLayout>
  );
};

const ChallengesPage = withProtected(Challenges);
export default ChallengesPage;
