import { getDatabase, ref, remove, child } from "firebase/database";
import { useState, useRef } from "react";

interface RemoveValueResult {
  removeValue: (path: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const useRemoveValue = (): RemoveValueResult => {
  const [loading, setLoading] = useState(false);
  const error = useRef<string | null>(null);
  const success = useRef(false);

  const removeValue = async (path: string): Promise<void> => {
    setLoading(true);
    error.current = null;
    success.current = false;

    try {
      const rootReference = ref(getDatabase());
      const dbPath = child(rootReference, path);
      await remove(dbPath);
      success.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (removeError: any) {
      error.current = removeError.message ?? "Unknown error";
      success.current = false;
    }

    setLoading(false);
  };

  return {
    removeValue,
    loading,
    error: error.current,
    success: success.current,
  };
};

export default useRemoveValue;
