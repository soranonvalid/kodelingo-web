import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/user";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import type { Challenge } from "@/types/challenge";
import type { FirebaseUser } from "@/types/firebase";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import { getOrCreateChat, sendMessage } from "@/utils/friends/use-chat";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  users: FirebaseUser[];
  challenge: Challenge;
};

const ShareChallengeModal = ({ challenge, open, setOpen, users }: Props) => {
  const { uid } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [isProcess, setIsProcess] = useState(false);

  const { data: friends, isLoading: friendsLoading } = useRealtimeValue<
    Record<string, boolean>
  >(`/friends/${uid}`);

  const toggleSelect = (friendId: string) => {
    setSelected((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  useEffect(() => {
    setSelected([]);
  }, [open]);

  const handleShare = async () => {
    try {
      setIsProcess(true);
      for (const friendId of selected) {
        const chatId = await getOrCreateChat(uid!, friendId);
        await sendMessage(
          chatId,
          uid!,
          JSON.stringify({
            type: "challenge",
            challengeId: challenge._id,
            challengeName: challenge.name,
            author: challenge.author,
            timestamp: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcess(false);
      setOpen(false);
      setSelected([]);
    }
  };

  const friendsArray = useMemo(() => {
    if (!users) return [];
    if (!friends) return [];
    return users.filter((user) =>
      Object.keys(friends ?? {}).includes(user.uid)
    );
  }, [friends, users]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md px-4!">
        <DialogHeader>
          <DialogTitle>Share Challenge</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2 max-h-60 overflow-y-auto pr-2 hide-scroll">
          {!friendsLoading &&
            friendsArray.map((friend) => {
              return (
                <label
                  key={friend.uid}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div
                    className="flex w-full gap-4 items-center hover:bg-black/5 p-3 rounded-lg"
                    key={friend?.uid}
                  >
                    <Avatar className="w-12 h-12 border-black border">
                      <AvatarImage src={friend?.photoURL} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full flex flex-col">
                      <span className="text-black text-sm">
                        {friend?.displayName}
                      </span>
                    </div>
                    <Checkbox
                      checked={selected.includes(friend.uid)}
                      onCheckedChange={() => toggleSelect(friend.uid)}
                    />
                  </div>
                </label>
              );
            })}
        </div>

        <DialogFooter>
          <Button
            onClick={handleShare}
            disabled={selected.length === 0 || isProcess}
            className="w-full cursor-pointer"
          >
            Share to {selected.length} friend(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ShareChallengeModal;
