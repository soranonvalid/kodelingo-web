import type { Chat, ChatMessage } from "@/types/firebase";
import useRealtimeValue from "../firebase/use-realtime-value";
import { get, getDatabase, push, ref, set } from "firebase/database";

export const useChatMessages = (chatId: string) => {
  return useRealtimeValue<Record<string, ChatMessage>>(
    `/chats/${chatId}/messages`
  );
};

export const getOrCreateChat = async (uid1: string, uid2: string) => {
  const db = getDatabase();

  const userChatRef = ref(db, `userChats/${uid1}`);
  const userChatsSnap = await get(userChatRef);

  if (userChatsSnap.exists()) {
    const chats = userChatsSnap.val();
    for (const chatId in chats) {
      const participantsRef = ref(db, `chats/${chatId}/participants`);
      const participantsSnap = await get(participantsRef);
      const participants = participantsSnap.val();
      if (participants && participants[uid2]) {
        return chatId;
      }
    }
  }

  const newChatRef = push(ref(db, "chats"));
  const chatId = newChatRef.key!;
  const newChat: Chat = {
    participants: {
      [uid1]: true,
      [uid2]: true,
    },
    createdAt: Date.now(),
  };

  await set(newChatRef, newChat);
  await set(ref(db, `userChats/${uid1}/${chatId}`), true);
  await set(ref(db, `userChats/${uid1}/${chatId}`), true);

  return chatId;
};

export const sendMessage = async (
  chatId: string,
  senderUid: string,
  text: string
) => {
  const db = getDatabase();
  const msgRef = push(ref(db, `chats/${chatId}/messages`));

  const message: ChatMessage = {
    sender: senderUid,
    text,
    timestamp: Date.now(),
  };

  await set(msgRef, message);
  await set(ref(db, `chats/${chatId}/lastMessages`), {
    text,
    timestamp: Date.now(),
  });
};
