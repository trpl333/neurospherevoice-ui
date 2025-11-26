import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LandingPortal from "../pages/landing/page";
import Dashboard from "../pages/dashboard/page";
import UserMemories from "../pages/user-memories/page";
import AISettings from "../pages/ai-settings/page";
import Login from "../pages/login/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPortal />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/ai-settings",
    element: <AISettings />,
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
