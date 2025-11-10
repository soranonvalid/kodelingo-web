import { SignInWithGoogle } from "@/services/firebase";
import { withUnprotected } from "@/utils/auth/use-protected";
import { motion } from "framer-motion";
import { useState } from "react";

const variants = {
  initial: {
    y: -3,
    x: -3,
    boxShadow: "3px 3px black",
  },
  hovered: {
    y: 0,
    x: 0,
    boxShadow: "0px 0px black",
  },
  disabled: {
    opacity: 0.5,
    y: 0,
    x: 0,
    boxShadow: "0px 0px black",
    cursor: "not-allowed",
  },
};

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <motion.button
        variants={variants}
        whileHover={"hovered"}
        initial={"initial"}
        animate={isLoading ? "disabled" : "initial"}
        whileTap={"hovered"}
        transition={{
          ease: "linear",
          duration: 0.1,
        }}
        disabled={isLoading}
        className="border border-black px-4 py-1 hover:cursor-pointer flex justify-center items-center gap-2 flex-row-reverse"
        onClick={async () => {
          try {
            setIsLoading(true);
            await SignInWithGoogle();
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <span>Sign in with Google</span>
        <img
          src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
          alt="google"
          className="w-5 h-5 object-cover object-center"
        />
      </motion.button>
    </div>
  );
};

const LoginPage = withUnprotected(Login);
export default LoginPage;
