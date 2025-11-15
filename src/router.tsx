import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/auth/AuthLayout";
import NotFoundPage from "./pages/NotFoundPage";
import TestChatPage from "./pages/TestChatPage";
import LoginPage from "./pages/LoginPage";
import FriendsListPage from "./pages/FriendsListPage";
import ChatPage from "./pages/ChatPage";
import ChallengesPage from "./pages/ChallengesPage";
import ClientLayout from "./layout/client/ClientLayout";
import ChallengeDetailsPage from "./pages/ChallengeDetailsPage";
import PlayPage from "./pages/PlayPage";
import ProfilePage from "./pages/profilePage";
import ChallengesCreatePage from "./pages/challengesCreatePage";
import NavbarLayout from "./layout/navbar/NavbarLayout";
import LeaderboardPage from "./pages/LeaderboardPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <ClientLayout />,
        children: [
          {
            path: "/",
            element: <LandingPage />,
          },
          {
            element: <NavbarLayout />,
            children: [
              {
                path: "*",
                element: <NotFoundPage />,
              },
              {
                path: "/home",
                element: <HomePage />,
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
                path: "/challenges/create",
                element: <ChallengesCreatePage />,
              },
              {
                path: "challenges/update/:id",
              },
              {
                path: "leaderboard",
                element: <LeaderboardPage />,
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
              {
                path: "/profile",
                element: <ProfilePage />,
              },
            ],
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
