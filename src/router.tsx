import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/auth/AuthLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestChatPage from "./pages/TestChatPage";
import LoginPage from "./pages/LoginPage";
import FriendsListPage from "./pages/FriendsListPage";
function Route() {
  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: "*",
          element: <NotFoundPage />,
        },
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/friends",
          element: <FriendsListPage />,
        },
        {
          path: "/test",
          element: <TestChatPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Route;
