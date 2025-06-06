
import { HomeIcon, DashboardIcon, GearIcon } from "@radix-ui/react-icons";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HomePage />,
  },
  {
    title: "Index",
    to: "/index",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
];
