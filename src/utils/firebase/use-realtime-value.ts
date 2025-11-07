import { type FirebaseValue, type RealtimeValueResult } from "@/types/firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";

const useRealtimeValue = <T extends FirebaseValue = FirebaseValue>(
  path: string
): RealtimeValueResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, path);

    onValue(
      dbRef,
      (snapshot) => {
        const value = snapshot.val();
        if (snapshot.exists()) {
          setData(value);
          setIsEmpty(false);
        } else {
          setData(null);
          setIsEmpty(true);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err.message ?? "Unknown error");
        setIsLoading(false);
      }
    );

    return () => {
      off(dbRef);
    };
  }, [path]);

  return {
    data,
    isLoading,
    error,
    isEmpty,
  };
};

export default useRealtimeValue;
