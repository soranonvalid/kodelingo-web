import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/main";
import NotFound from "./pages/notFound";
import AuthLayout from "./layout/auth/AuthLayout";
function Route() {
  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "/",
          element: <Main />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Route;
