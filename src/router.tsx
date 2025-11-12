import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/auth/AuthLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestChatPage from "./pages/TestChatPage";
import LoginPage from "./pages/LoginPage";
import FriendsListPage from "./pages/FriendsListPage";
import ChatPage from "./pages/ChatPage";
import ChallengesPage from "./pages/ChallengesPage";
import ClientLayout from "./layout/client/ClientLayout";
import ChallengeDetailsPage from "./pages/ChallengeDetailsPage";
import PlayPage from "./pages/PlayPage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <ClientLayout />,
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
            path: "/challenges",
            element: <ChallengesPage />,
          },
          {
            path: "/challenges/:id",
            element: <ChallengeDetailsPage />,
          },
          {
            path: "/challenges/play/:id",
            element: <PlayPage />,
          },
          {
            path: "/friends",
            element: <FriendsListPage />,
          },
          {
            path: "/test",
            element: <TestChatPage />,
          },
          {
            path: "/chat/:friendId",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

function Route() {
  return <RouterProvider router={router} />;
}

export default Route;
