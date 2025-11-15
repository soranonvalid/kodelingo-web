import type { ChatMessage, FirebaseUser } from "@/types/firebase";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import InfoCard from "./ui/infoCard";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

const safeParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const ChatContainer = ({
  message,
  friendId,
}: {
  message: ChatMessage;
  friendId: string;
}) => {
  const navigate = useNavigate();
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const parsed = safeParse(message.text);
  const isChallenge = parsed && parsed.type === "challenge";

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useRealtimeValue<FirebaseUser>(`users/${parsed?.author}`);

  const isFromFriend = message.sender === friendId;

  const baseStyles =
    "w-fit h-fit flex flex-col gap-2 rounded-lg min-w-10 md:max-w-[75%] max-w-[90%]";
  const bubbleStyles = isFromFriend
    ? "bg-black/5 p-2 rounded-tl-none mr-auto"
    : "bg-[#40A87B] p-2 rounded-tr-none ml-auto";

  const challengeStyles = isFromFriend
    ? "mr-auto cursor-pointer"
    : "ml-auto cursor-pointer";

  if (profileLoading) {
    return (
      <motion.div
        className="w-fit bg-black/5 p-2 h-fit flex flex-col gap-2 rounded-lg rounded-tl-none min-w-10 md:max-w-[75%] max-w-[90%] mr-auto"
        initial={{
          y: 10,
          x: -5,
          scale: 0.95,
        }}
        animate={{
          y: 0,
          x: 0,
          scale: 1,
        }}
        transition={{
          ease: "linear",
          duration: 0.1,
        }}
      >
        <Skeleton className="w-20 h-3" />
      </motion.div>
    );
  }

  if (profileError) {
    return (
      <motion.div
        className="w-fit bg-black/5 p-2 h-fit flex flex-col gap-2 rounded-lg rounded-tl-none min-w-10 md:max-w-[75%] max-w-[90%] mr-auto"
        initial={{
          y: 10,
          x: -5,
          scale: 0.95,
        }}
        animate={{
          y: 0,
          x: 0,
          scale: 1,
        }}
        transition={{
          ease: "linear",
          duration: 0.1,
        }}
      >
        Error
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${baseStyles} ${
        isChallenge ? challengeStyles : bubbleStyles
      }`}
      initial={{ y: 10, x: isFromFriend ? -5 : 5, scale: 0.95 }}
      animate={{ y: 0, x: 0, scale: 1 }}
      transition={{ ease: "linear", duration: 0.1 }}
    >
      {isChallenge ? (
        <InfoCard onClick={() => navigate(`/challenges/${parsed.challengeId}`)}>
          <div className="flex flex-col gap-2">
            <p
              className={`text-sm font-semibold ${
                isFromFriend ? "text-black" : "text-black"
              }`}
            >
              {parsed.challengeName}
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">{profile?.displayName}</p>
            </div>
            <div className="flex items-center gap-1">
              <ArrowRight
                size={15}
                color={isFromFriend ? "rgba(0,0,0,0.5)" : "black"}
              />
              <p
                className={`text-sm ${
                  isFromFriend ? "text-black/50" : "text-black/70"
                }`}
              >
                Try this challenge!
              </p>
            </div>
          </div>
        </InfoCard>
      ) : (
        <p className={`text-sm ${isFromFriend ? "text-black" : "text-white"}`}>
          {message.text}
        </p>
      )}
      <p
        className={`text-[12px] w-full text-end ${
          isFromFriend
            ? "text-black/50"
            : isChallenge
            ? "text-black/50"
            : "text-white/50"
        }`}
      >
        {formattedTime}
      </p>
    </motion.div>
  );
};

export default ChatContainer;
