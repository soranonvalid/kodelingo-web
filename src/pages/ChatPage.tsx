import ChatContainer from "@/components/ChatContainer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/context/user";
import type { ChatMessage } from "@/types/firebase";
import getObjectValues from "@/utils/firebase/get-object-values";
import {
  getOrCreateChat,
  sendMessage,
  useChatMessages,
} from "@/utils/friends/use-chat";
import useFriends from "@/utils/friends/use-friends";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import TextareaAutoSize from "react-textarea-autosize";

type MessageInput = {
  message: string;
};

const ChatPage = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const { uid } = useUser();
  const [chatId, setChatId] = useState<string | null>(null);
  const { areFriends } = useFriends();
  const { register, handleSubmit, reset, watch } = useForm<MessageInput>();

  useEffect(() => {
    const initChat = async () => {
      const bool = await areFriends(uid!, friendId!);
      if (!uid || !friendId) return;
      if (!bool) return;
      const id = await getOrCreateChat(uid, friendId);
      setChatId(id);
    };
    initChat();
  }, [uid, friendId, areFriends]);

  const { data: messages, isLoading, error } = useChatMessages(chatId ?? "");

  useEffect(() => {
    if (messages) {
      console.log(getObjectValues(messages));
    }
  }, [messages, isLoading, error]);

  const handleSend = async (data: MessageInput) => {
    if (!watch("message").trim() || !chatId) return;
    try {
      await sendMessage(chatId!, uid as string, data.message);
    } catch (err) {
      console.error(err);
    } finally {
      reset();
    }
  };

  const chatList = messages
    ? getObjectValues(messages).sort((a, b) => a.timestamp - b.timestamp)
    : [];

  if (!chatId || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something error...</div>;
  }

  return (
    <div className="w-full max-h-svh min-h-svh flex justify-center overflow-y-scroll">
      <div className="max-w-3xl w-full py-3 px-4 md:px-0 h-full flex flex-col">
        <div className="w-full flex-col">
          {chatList.map((message: ChatMessage, idx) => {
            return (
              <ChatContainer
                key={`${message.timestamp}-${message.sender}-${idx}`}
                message={message}
                friendId={friendId!}
                currentUserId={uid!}
              />
            );
          })}
        </div>
        <div className="w-full fixed bottom-0 right-0 grid place-items-center pb-10 px-4">
          <form
            onSubmit={handleSubmit(handleSend)}
            className="w-full max-w-3xl relative"
          >
            <TextareaAutoSize
              className="w-full text-sm px-4 py-2 bg-black/5 focus:outline-2 focus:outline-black/50 focus:rounded-sm font-jakarta focus:bg-[#DFDFDF]/25 resize-none hide-scroll"
              minRows={1}
              maxRows={10}
              placeholder="Type a message"
              {...register("message", { required: true })}
              style={{
                transition: "all ease-in-out 200ms",
              }}
            />
            <Tooltip>
              <TooltipTrigger
                asChild
                className="absolute right-3 bottom-3"
                style={{
                  display: watch("message") ? "" : "none",
                }}
              >
                <button className="hover:cursor-pointer">
                  <SendHorizonal className="w-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send</p>
              </TooltipContent>
            </Tooltip>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
