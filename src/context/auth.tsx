import { auth } from "@/services/firebase";
import { useEffect, useState, type ReactNode } from "react";
import { InitialUserState, useUser } from "./user";
import Loading from "@/components/Loading";
import useCreateValue from "@/utils/firebase/use-create-value";

interface AuthStateChangeProviderProps {
  children: ReactNode;
}

const AuthStateChangeProvider = ({
  children,
}: AuthStateChangeProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { SetUser } = useUser();
  const { setValue } = useCreateValue();

  const InitiateAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        SetUser({ email: user.email, uid: user.uid, avatar: user.photoURL });
        setValue("users/" + user.uid, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: Date.now(),
        });
        console.log("User signed in:", user);
      } else {
        SetUser(InitialUserState);
        console.log("No user signed in");
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    InitiateAuthStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <main className="w-full min-h-screen grid place-items-center">
        <Loading />
      </main>
    );
  }

  return <>{children}</>;
};

export default AuthStateChangeProvider;
