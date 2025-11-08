import { SignInWithGoogle } from "@/services/firebase";
import { withUnprotected } from "@/utils/auth/use-protected";
import { useEffect, useRef } from "react";

const Login = () => {
  const hasRun = useRef<boolean>(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    SignInWithGoogle();
  }, []);

  return <div className="w-full min-h-screen grid place-items-center">...</div>;
};

const LoginPage = withUnprotected(Login);
export default LoginPage;
