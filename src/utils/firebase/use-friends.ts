import { useUser } from "@/context/user";
import useCreateValue from "./use-create-value";
import useRemoveValue from "./use-remove-value";

const useFriends = () => {
  const { uid } = useUser();
  const { setValue } = useCreateValue();
  const { removeValue } = useRemoveValue();

  const handleSendRequest = async (targetUid: string) => {
    await setValue(`/friendRequests/${targetUid}/${uid}`, {
      from: uid,
      timestamp: Date.now(),
    });
  };

  const acceptFriendRequest = async (senderUid: string) => {
    await setValue(`/friends/${uid}/${senderUid}`, true);
    await setValue(`/friends/${senderUid}/${uid}`, true);
    await removeValue(`/friendRequests/${uid}/${senderUid}`);
  };

  const declineFriendRequest = async (senderUid: string) => {
    await removeValue(`friendRequests/${uid}/${senderUid}`);
  };

  return { handleSendRequest, acceptFriendRequest, declineFriendRequest };
};

export default useFriends;
