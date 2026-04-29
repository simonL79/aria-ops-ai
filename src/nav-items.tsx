import { HomeIcon, Users, Settings, Shield, Brain, Search, FileText, Lock, Gavel, AlertTriangle, BookOpen, Phone, HelpCircle, DollarSign, UserCheck, Cpu, Lightbulb, Megaphone, Command } from "lucide-react";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

import Features from "./pages/Features";
import HowItWorksPage from "./pages/HowItWorksPage";
import Authentication from "./pages/Authentication";
import AdminLogin from "./pages/AdminLogin";
import ScanPage from "./pages/ScanPage";
import SettingsPage from "./pages/Settings";
import Terms from "./pages/Terms";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import BiographyPage from "./pages/BiographyPage";
import BlogPage from "./pages/BlogPage";
import RequestDataAccessPage from "./pages/RequestDataAccessPage";
import NotFound from "./pages/NotFound";

export const navItems: { title: string; to: string; icon: React.ReactElement; page: React.ReactElement; isPublic?: boolean }[] = [
  {
    title: "Home",
    to: "/home",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HomePage />,
    isPublic: true,
  },
  {
    title: "About",
    to: "/about",
    icon: <Users className="h-4 w-4" />,
    page: <AboutPage />,
    isPublic: true,
  },
  {
    title: "Contact",
    to: "/contact",
    icon: <Phone className="h-4 w-4" />,
    page: <ContactPage />,
    isPublic: true,
  },
  {
    title: "Features",
    to: "/features",
    icon: <Cpu className="h-4 w-4" />,
    page: <Features />,
    isPublic: true,
  },
  {
    title: "How it Works",
    to: "/how-it-works",
    icon: <Lightbulb className="h-4 w-4" />,
    page: <HowItWorksPage />,
    isPublic: true,
  },
  {
    title: "Authentication",
    to: "/authentication",
    icon: <Lock className="h-4 w-4" />,
    page: <Authentication />,
    isPublic: true,
  },
  {
    title: "Admin Login",
    to: "/admin/login",
    icon: <UserCheck className="h-4 w-4" />,
    page: <AdminLogin />,
    isPublic: true,
  },
  {
    title: "Free Scan",
    to: "/scan",
    icon: <Search className="h-4 w-4" />,
    page: <ScanPage />,
    isPublic: true,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPage />,
  },
  {
    title: "Terms of Service",
    to: "/terms",
    icon: <FileText className="h-4 w-4" />,
    page: <Terms />,
    isPublic: true,
  },
  {
    title: "Privacy Policy",
    to: "/privacy-policy",
    icon: <Lock className="h-4 w-4" />,
    page: <PrivacyPolicyPage />,
    isPublic: true,
  },
  {
    title: "Disclaimer",
    to: "/disclaimer",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <DisclaimerPage />,
    isPublic: true,
  },
  {
    title: "Simon Lindsay",
    to: "/simon-lindsay",
    icon: <UserCheck className="h-4 w-4" />,
    page: <SimonLindsayPage />,
    isPublic: true,
  },
  {
    title: "Biography",
    to: "/biography",
    icon: <BookOpen className="h-4 w-4" />,
    page: <BiographyPage />,
    isPublic: true,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: <Megaphone className="h-4 w-4" />,
    page: <BlogPage />,
    isPublic: true,
  },
  {
    title: "Request Data Access",
    to: "/request-data-access",
    icon: <FileText className="h-4 w-4" />,
    page: <RequestDataAccessPage />,
    isPublic: true,
  },
  {
    title: "Not Found",
    to: "/404",
    icon: <HelpCircle className="h-4 w-4" />,
    page: <NotFound />,
    isPublic: true,
  },
];
