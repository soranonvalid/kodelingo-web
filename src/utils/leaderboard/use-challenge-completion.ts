import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

export const useChallengeCompletion = (
  uid: string | null,
  challengeId: string
) => {
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!uid) return;

    const db = getDatabase();
    const compRef = ref(db, `challengeResults/${uid}/${challengeId}`);

    const unsub = onValue(compRef, (snap) => {
      setAlreadyCompleted(snap.exists());
    });

    return () => unsub();
  }, [uid, challengeId]);

  return alreadyCompleted;
};
