import { createBrowserRouter, Outlet } from "react-router";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ProfilingMethodSelector } from "./pages/ProfilingMethodSelector";
import { ProfileStep1New as ProfileStep1 } from "./pages/ProfileStep1New";
import { ProfileStep2New as ProfileStep2 } from "./pages/ProfileStep2New";
import { ProfileStep3New as ProfileStep3 } from "./pages/ProfileStep3New";
import { ProfileStep4New as ProfileStep4 } from "./pages/ProfileStep4New";
import { ProfileExtended } from "./pages/ProfileExtended";
import { Dashboard } from "./pages/DashboardNew";
import { AIChat } from "./pages/AIChat";
import { NutritionTracker } from "./pages/NutritionTracker";
import { WaterIntake } from "./pages/WaterIntake";
import { MealScanner } from "./pages/MealScanner";
import { MealPlan } from "./pages/MealPlan";

import { Profile } from "./pages/Profile";
import { MealPrepMode } from "./pages/MealPrepMode";
import { GroceryList } from "./pages/GroceryList";
import { NutritionProvider } from "./context/NutritionContext";
import { SidebarProvider } from "./context/SidebarContext";

import { GlobalHeader } from "./components/GlobalHeader";

// Layout component that provides context to all routes
function RootLayout() {
  return (
    <SidebarProvider>
      <NutritionProvider>
        <GlobalHeader />
        <Outlet />
      </NutritionProvider>
    </SidebarProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        Component: Login,
      },
      {
        path: "/login-signup",
        Component: Login,
      },
      {
        path: "/signup",
        Component: Signup,
      },
      {
        path: "/profiling-method",
        Component: ProfilingMethodSelector,
      },
      {
        path: "/profile/step1",
        Component: ProfileStep1,
      },
      {
        path: "/profile/step2",
        Component: ProfileStep2,
      },
      {
        path: "/profile/step3",
        Component: ProfileStep3,
      },
      {
        path: "/profile/step4",
        Component: ProfileStep4,
      },
      {
        path: "/profile/extended",
        Component: ProfileExtended,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/ai-chat",
        Component: AIChat,
      },
      {
        path: "/nutrition-tracker",
        Component: NutritionTracker,
      },
      {
        path: "/water-intake",
        Component: WaterIntake,
      },
      {
        path: "/meal-scanner",
        Component: MealScanner,
      },
      {
        path: "/meal-plan",
        Component: MealPlan,
      },
      {
        path: "/meal-prep",
        Component: MealPrepMode,
      },
      {
        path: "/grocery-list",
        Component: GroceryList,
      },

      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/insights",
        Component: NutritionTracker,
      },
      {
        path: "/kitchen",
        Component: MealScanner,
      },
    ],
  },
]);