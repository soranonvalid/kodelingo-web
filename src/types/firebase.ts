export type FirebasePrimitive = string | number | boolean | null;

export type FirebaseValue =
  | FirebasePrimitive
  | FirebaseValue[]
  | { [key: string]: FirebaseValue };

export interface RealtimeValueResult<T = FirebaseValue> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export interface CreateValueResult<T = FirebaseValue> {
  pushValue: (path: string, value: T) => Promise<void>;
  setValue: (path: string, value: T) => Promise<void>;
  error: string | null;
  success: boolean;
  loading: boolean;
  data: React.MutableRefObject<{ key: string | null; value: T | null } | null>;
}
