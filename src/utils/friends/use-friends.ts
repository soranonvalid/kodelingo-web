import { useUser } from "@/context/user";
import useCreateValue from "../firebase/use-create-value";
import useRemoveValue from "../firebase/use-remove-value";
import { get, getDatabase, ref } from "firebase/database";

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

  const removeFriend = async (targetUid: string) => {
    await removeValue(`/friends/${uid}/${targetUid}`);
    await removeValue(`/friends/${targetUid}/${uid}`);
  };

  const declineFriendRequest = async (senderUid: string) => {
    await removeValue(`friendRequests/${uid}/${senderUid}`);
  };

  const areFriends = async (uid1: string, uid2: string) => {
    const db = getDatabase();
    const friendRef = ref(db, `friends/${uid1}/${uid2}`);
    const snap = await get(friendRef);
    return snap.exists();
  };

  return {
    handleSendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    areFriends,
  };
};

export default useFriends;
