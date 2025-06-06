
import { Home } from "lucide-react";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <HomePage />,
  },
  {
    title: "Index",
    to: "/index",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
];
