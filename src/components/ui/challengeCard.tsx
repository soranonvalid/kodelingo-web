import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { SiJavascript } from "react-icons/si";
import InfoCard from "./infoCard";
import { Badge } from "./badge";

interface props {
  title: string | number;
  date: string;
  lang: string;
  src: string;
  user: string;
  question: number;
  difficulty?: string;
}

const ChallengeCard = ({
  title = "Challenge",
  date,
  lang,
  user = "user",
  src,
  question,
  difficulty = "easy",
}: props) => {
  const getDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "green";

      case "intermediate":
        return "orange";

      case "difficult":
        return "red";

      default:
        return "green";
    }
  };
  return (
    <InfoCard isPointer={true}>
      <div className="flex w-full justify-between items-start">
        <div className="flex w-full flex-col">
          <p className="font-bold">{title}</p>
          <span className="text-[12px] text-black/50">{date}</span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <SiJavascript size={25} color="black" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Javascript</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="text-sm flex w-full items-center justify-between mt-5 gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={src} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{user}</p>
        </div>
        <div className="flex gap-3">
          <Badge
            variant={getDifficulty(difficulty)}
            className="h-fit! px-1! py-0.2! font-bold rounded-sm"
          >
            {difficulty}
          </Badge>
          <span className="text-sm text-nowrap text-black/50">
            {question} Questions
          </span>
        </div>
      </div>
    </InfoCard>
  );
};

export default ChallengeCard;
