import type { ChatMessage, FirebaseUser } from "@/types/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { User } from "lucide-react";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";

const ChatContainer = ({
  message,
  friendId,
  currentUserId,
}: {
  message: ChatMessage;
  friendId: string;
  currentUserId: string;
}) => {
  const {
    data: friend,
    isLoading: friendLoading,
    error: friendError,
  } = useRealtimeValue("users/" + friendId);
  const {
    data: currentUser,
    isLoading: currentUserLoading,
    error: currentUserError,
  } = useRealtimeValue("users/" + currentUserId);

  const friendChat = message.sender === friendId;

  if (friendLoading || currentUserLoading) {
    return <></>;
  }

  if (friendError || currentUserError) {
    return <></>;
  }

  return friendChat ? (
    <div className="w-full">
      <div className="md:max-w-[75%] max-w-[90%] w-full">
        <Avatar>
          <AvatarImage src={(friend as FirebaseUser).photoURL} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  ) : (
    <div className="w-full grid place-items-end ">
      <div className="md:max-w-[75%] max-w-[90%] w-full flex justify-end gap-4">
        <div className="w-fit bg-black p-2 h-fit rounded-lg min-w-10">
          <p className="text-sm text-white">{message.text}</p>
        </div>
        <Avatar className="w-10 h-10">
          <AvatarImage src={(currentUser as FirebaseUser).photoURL} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default ChatContainer;
