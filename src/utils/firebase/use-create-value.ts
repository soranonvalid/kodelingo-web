import { type CreateValueResult, type FirebaseValue } from "@/types/firebase";
import { child, getDatabase, push, ref, set } from "firebase/database";
import { useState, useRef } from "react";

const useCreateValue = <
  T extends FirebaseValue = FirebaseValue
>(): CreateValueResult<T> => {
  const [loading, setLoading] = useState(false);
  const data = useRef<{ key: string | null; value: T | null } | null>(null);
  const error = useRef<string | null>(null);
  const success = useRef(false);

  const pushValue = async (path: string, value: T): Promise<void> => {
    setLoading(true);
    try {
      const rootReference = ref(getDatabase());
      const dbPath = child(rootReference, path);
      const dbPush = await push(dbPath, value);
      data.current = { key: dbPush.key, value };
      success.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (pushError: any) {
      error.current = pushError.message ?? "Unknown error";
    }
    setLoading(false);
  };

  const setValue = async (path: string, value: T): Promise<void> => {
    setLoading(true);
    try {
      const rootReference = ref(getDatabase());
      const dbPath = child(rootReference, path);
      await set(dbPath, value);
      success.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (setError: any) {
      error.current = setError.message ?? "Unknown error";
    }
    setLoading(false);
  };
  return {
    pushValue,
    setValue,
    error: error.current,
    success: success.current,
    loading,
    data,
  };
};

export default useCreateValue;
