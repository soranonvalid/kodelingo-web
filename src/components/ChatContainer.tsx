import type { ChatMessage } from "@/types/firebase";
import { motion } from "framer-motion";

const ChatContainer = ({
  message,
  friendId,
}: {
  message: ChatMessage;
  friendId: string;
}) => {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return message.sender === friendId ? (
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
      <p className="text-sm text-black">{message.text}</p>
      <p className="text-[12px] text-black/50 w-full text-end">
        {formattedTime}
      </p>
    </motion.div>
  ) : (
    <motion.div
      className="w-fit bg-[#40A87B] p-2 h-fit flex flex-col gap-2 rounded-lg rounded-tr-none min-w-10 md:max-w-[75%] max-w-[90%] ml-auto"
      initial={{
        y: 10,
        x: 5,
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
      <p className="text-sm text-white">{message.text}</p>
      <p className="text-[12px] text-white/50 w-full text-end">
        {formattedTime}
      </p>
    </motion.div>
  );
};

export default ChatContainer;
