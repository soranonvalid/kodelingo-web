import ChatContainer from "@/components/ChatContainer";
import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ErrPage from "@/components/ui/errPage";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/context/user";
import PageLayout from "@/layout/pageLayout";
import type { ChatMessage, FirebaseUser } from "@/types/firebase";
import { withProtected } from "@/utils/auth/use-protected";
import getObjectValues from "@/utils/firebase/get-object-values";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import {
  getOrCreateChat,
  sendMessage,
  useChatMessages,
} from "@/utils/friends/use-chat";
import useFriends from "@/utils/friends/use-friends";
import { ChevronLeft, SendHorizonal, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import TextareaAutoSize from "react-textarea-autosize";

type MessageInput = {
  message: string;
};

const Chat = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const { uid } = useUser();
  const [chatId, setChatId] = useState<string | null>(null);
  const { areFriends } = useFriends();
  const { register, handleSubmit, reset, watch } = useForm<MessageInput>();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: registerRef, ...registerRest } = register("message", {
    required: true,
  });
  const navigate = useNavigate();
  const {
    data: friendProfile,
    isLoading: friendLoading,
    error: friendError,
  } = useRealtimeValue(`users/${friendId}`);

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

  const chatList = useMemo(() => {
    if (!messages) return [];
    return getObjectValues(messages).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatList.length > 0) {
      scrollToBottom();
    }
  }, [chatList]);

  const handleSend = async (data: MessageInput) => {
    if (!watch("message").trim() || !chatId) return;
    try {
      await sendMessage(chatId!, uid as string, data.message);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(scrollToBottom, 100);
    }
  };

  if (!chatId || isLoading || !chatList || friendLoading) {
    return <Loading />;
  }

  if (error || friendError) {
    return <ErrPage code={400} />;
  }

  return (
    <PageLayout>
      <div className="w-full border-b flex items-center gap-4 bg-white p-2 absolute -top-px left-0">
        <button
          onClick={() => {
            navigate("/friends");
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={(friendProfile as FirebaseUser).photoURL} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <p className="font-bold text-sm">
          {(friendProfile as FirebaseUser).displayName}
        </p>
      </div>
      <div className="w-full flex-col flex gap-1 pb-30 pt-15 max-h-[calc(100svh-100px)] overflow-y-scroll hide-scroll">
        {chatList.map((message: ChatMessage, idx) => {
          return (
            <ChatContainer
              key={`${message.timestamp}-${message.sender}-${idx}`}
              message={message}
              friendId={friendId!}
            />
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="w-full absolute bottom-0 right-0 grid place-items-center pb-18 px-4 bg-white pt-3">
        <form
          onSubmit={handleSubmit(handleSend)}
          className="w-full max-w-3xl relative"
        >
          <TextareaAutoSize
            className={`w-full text-sm px-4 py-2 bg-black/5 focus:outline-2 focus:outline-black/50 font-jakarta focus:bg-[#DFDFDF]/25 resize-none hide-scroll transition-smooth ${
              (textareaRef.current?.clientHeight ?? 0) <= 37
                ? "rounded-full focus:rounded-2xl"
                : "rounded-xl"
            }`}
            minRows={1}
            maxRows={5}
            placeholder="Type a message"
            {...registerRest}
            ref={(el) => {
              textareaRef.current = el;
              registerRef(el);
            }}
          />
          <Tooltip>
            <TooltipTrigger
              asChild
              className="absolute right-3 bottom-2"
              style={{ display: watch("message") ? "" : "none" }}
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
    </PageLayout>
  );
};

const ChatPage = withProtected(Chat);
export default ChatPage;
