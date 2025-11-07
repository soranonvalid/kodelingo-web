import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/auth/AuthLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestChat from "./pages/TestChat";
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
          path: "/test",
          element: <TestChat />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Route;
