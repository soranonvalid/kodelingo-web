import AuthStateChangeProvider from "@/context/auth";
import { UserProvider } from "@/context/user";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <UserProvider>
      <AuthStateChangeProvider>
        <Outlet />
      </AuthStateChangeProvider>
    </UserProvider>
  );
};

export default AuthLayout;
