import { SignInWithGoogle } from "@/services/firebase";
import { withUnprotected } from "@/utils/auth/use-protected";
import { DoorOpen } from "lucide-react";
import { useEffect, useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LogIn = async () => {
    setIsLoading(true);
    try {
      await SignInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    LogIn();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 items-center justify-center pop">
      <DoorOpen strokeWidth={1} size={50} />
      <h1 className="text-4xl font-bold">Signing you in.</h1>
      <button
        onClick={() => {
          LogIn();
        }}
        disabled={isLoading ? true : false}
        className={`italic cursor-pointer font-light transition-smooth ${
          isLoading ? "opacity-0" : "opacity-75"
        }`}
      >
        Click here to try again
      </button>
    </div>
  );
};

const LoginPage = withUnprotected(Login);
export default LoginPage;
