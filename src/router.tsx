import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/main";
import NotFound from "./pages/notFound";
function Route() {
  const router = createBrowserRouter([
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/",
      element: <Main />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Route;
