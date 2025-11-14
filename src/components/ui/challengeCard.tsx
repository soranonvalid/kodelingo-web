import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import InfoCard from "./infoCard";
import { Badge } from "./badge";
import type { Challenge } from "@/types/challenge";
import type { FirebaseUser } from "@/types/firebase";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/utils/challenges/use-challenge";
import { firstLetterToUpperCase } from "@/lib/word";
import { getLangIco } from "@/utils/renderUtils";

const ChallengeCard = ({
  challenge,
  usersArray,
}: {
  challenge: Challenge;
  usersArray: FirebaseUser[];
}) => {
  const navigate = useNavigate();

  const { formatDate, getDifficulty } = useChallenge();

  const getProfile = useMemo(
    () => usersArray.find((user) => user.uid === challenge.author),
    [usersArray, challenge]
  );

  return (
    <InfoCard
      isPointer={true}
      onClick={() => navigate("/challenges/" + challenge._id)}
    >
      <div className="flex w-full justify-between items-start">
        <div className="flex w-full flex-col">
          <p className="font-bold">{challenge.name}</p>
          <span className="text-[12px] text-black/50">
            {formatDate(challenge.createdAt)}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger>{getLangIco(challenge.lang)}</TooltipTrigger>
          <TooltipContent>
            <p>Javascript</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="text-sm flex w-full items-center justify-between mt-5 gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={getProfile?.photoURL} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{getProfile?.displayName}</p>
        </div>
        <div className="flex md:gap-3 md:flex-row flex-col-reverse items-end gap-1">
          <Badge
            variant={getDifficulty(challenge.difficulty)}
            className="h-fit! px-1! py-0.2! font-bold rounded-sm"
          >
            {firstLetterToUpperCase(challenge.difficulty)}
          </Badge>
          <span className="text-sm text-nowrap text-black/50">
            {challenge.questions.length} Questions
          </span>
        </div>
      </div>
    </InfoCard>
  );
};

export default ChallengeCard;
