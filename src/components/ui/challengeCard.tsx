import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { SiJavascript } from "react-icons/si";
import InfoCard from "./infoCard";

interface props {
  title: string | number;
  date: string;
  lang: string;
  src: string;
  user: string;
  question: number;
}

const ChallengeCard = ({
  title = "Challenge",
  date,
  lang,
  user = "user",
  src,
  question,
}: props) => {
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
      <div className="text-sm flex w-full items-end justify-between mt-5 gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={src} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{user}</p>
        </div>
        <span className="text-sm text-nowrap text-black/50">
          {question} Questions
        </span>
      </div>
    </InfoCard>
  );
};

export default ChallengeCard;
