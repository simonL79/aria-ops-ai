
import { Home, User, FileText, Phone, DollarSign, Scan } from "lucide-react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ScanPage from "./pages/ScanPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";

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
    title: "About",
    to: "/about",
    icon: <FileText className="h-4 w-4" />,
    page: <AboutPage />,
  },
  {
    title: "Scan",
    to: "/scan",
    icon: <Scan className="h-4 w-4" />,
    page: <ScanPage />,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: <FileText className="h-4 w-4" />,
    page: <BlogPage />,
  },
  {
    title: "Contact",
    to: "/contact",
    icon: <Phone className="h-4 w-4" />,
    page: <ContactPage />,
  },
  {
    title: "Pricing",
    to: "/pricing",
    icon: <DollarSign className="h-4 w-4" />,
    page: <PricingPage />,
  },
  {
    title: "Simon Lindsay",
    to: "/simon-lindsay",
    icon: <User className="h-4 w-4" />,
    page: <SimonLindsayPage />,
  },
];
