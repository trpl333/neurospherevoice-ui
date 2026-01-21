
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LandingPortal from "../pages/landing/page";
import Dashboard from "../pages/dashboard/page";
import UserMemories from "../pages/user-memories/page";
import AISettings from "../pages/ai-settings/page";
import PhoneSystem from "../pages/phone-system/page";
import Login from "../pages/login/page";
import PricingPage from "../pages/pricing/page";

import OnboardingStep1 from "../pages/onboarding/step1";
import OnboardingStep2 from "../pages/onboarding/step2";
import OnboardingStep3 from "../pages/onboarding/step3";
import OnboardingStep4 from "../pages/onboarding/step4";
import OnboardingCheckout from "../pages/onboarding/checkout";
import OnboardingSuccess from "../pages/onboarding/success";

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
    path: "/phone-system",
    element: <PhoneSystem />,
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
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingStep1 />,
  },
  {
    path: "/onboarding/1",
    element: <OnboardingStep1 />,
  },
  {
    path: "/onboarding/2",
    element: <OnboardingStep2 />,
  },
  {
    path: "/onboarding/3",
    element: <OnboardingStep3 />,
  },
  {
    path: "/onboarding/4",
    element: <OnboardingStep4 />,
  },
  {
    path: "/onboarding/checkout",
    element: <OnboardingCheckout />,
  },
  {
    path: "/onboarding/success",
    element: <OnboardingSuccess />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
