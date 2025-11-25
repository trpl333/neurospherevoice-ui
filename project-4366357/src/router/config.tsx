import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LandingPortal from "../pages/landing/page";
import Dashboard from "../pages/dashboard/page";
import UserMemories from "../pages/user-memories/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPortal />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/user-memories",
    element: <UserMemories />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
