import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getStatusBadge } from "@/utils/renderUtils";
import { AnimatedScore } from "@/components/ui/animatedScore";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import type { FirebaseUser } from "@/types/firebase";

interface props {
  rank: number;
  score: number;
  avatar: string;
}

const RankCard = ({ rank, score, avatar }: props) => {
  const { data, isLoading } = useRealtimeValue<FirebaseUser>("users/" + avatar);

  console.log(data);

  const getBGRank = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#FFE2A3_99.56%)]";
      case 2:
        return "bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#A1A1A1_99.56%)]";
      case 3:
        return "bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#FFCDAE_99.56%)]";
    }
    if (rank <= 100)
      return "bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#DADADA_99.56%)]";
    if (rank <= 1000)
      return "bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#EBEBEB_99.56%)]";
    return "bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#F4F4F4_99.56%)]";
  };
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
  return (
    <div>
      {isLoading ? (
        <div
          className={`w-full border flex justify-between items-center rounded-2xl px-4 py-3 border-black/20 h-[58px] ${getBGRank(
            rank
          )}`}
        ></div>
      ) : (
        <div
          className={`w-full border flex justify-between items-center rounded-2xl px-4 py-3 border-black/20 ${getBGRank(
            rank
          )}`}
        >
          <div className="flex gap-3 items-center">
            <span className="text-[12px] font-bold">
              {rank}
              {getOrdinalSuffix(rank)}
            </span>
            {getStatusBadge(rank)}
            <Avatar>
              <AvatarImage src={data?.photoURL ?? ""} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm">{data?.displayName ?? "user"}</p>
          </div>
          <AnimatedScore score={score} />
        </div>
      )}
    </div>
  );
};

export default RankCard;
