import { createContext, useContext, useState, type ReactNode } from "react";

export interface UserState {
  email: string | null;
  uid: string | null;
  avatar: string | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const InitialUserState: UserState = {
  email: null,
  uid: null,
  avatar: null,
};

interface UserContextType extends UserState {
  SetUser: (userCredential: UserState) => void;
  ResetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userState, setUserState] = useState<UserState>(InitialUserState);

  const SetUser = (userCredential: UserState) => {
    setUserState({ ...userCredential });
  };

  const ResetUser = () => {
    setUserState(InitialUserState);
  };

  const value: UserContextType = { ...userState, SetUser, ResetUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
