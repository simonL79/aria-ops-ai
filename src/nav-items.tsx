import { HomeIcon, Users, Calendar, Settings, BarChart3, Shield, Eye, Brain, Zap, Search, AlertTriangle, FileText, UserPlus, Building, Radar, MessageSquare, Lock, Activity, Gavel, Database, Globe, Target, TrendingUp, Cpu, BookOpen, Phone, HelpCircle, DollarSign, CreditCard, UserCheck, Clock, Briefcase, Headphones, Mail, FileImage, Megaphone, Lightbulb, CheckSquare, Layers, Command, Bot, Network, Gauge } from "lucide-react";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import Features from "./pages/Features";
import HowItWorksPage from "./pages/HowItWorksPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Authentication from "./pages/Authentication";
import AdminLogin from "./pages/AdminLogin";
import ScanPage from "./pages/ScanPage";
import FreeScanResults from "./pages/FreeScanResults";
import ReputationScanPage from "./pages/ReputationScanPage";
import ReputationScanForm from "./pages/ReputationScanForm";
import ThankYouPage from "./pages/ThankYouPage";
import Monitor from "./pages/Monitor";
import Reports from "./pages/Reports";
import Clients from "./pages/Clients";
import SettingsPage from "./pages/Settings";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import BiographyPage from "./pages/BiographyPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogAdminPage from "./pages/BlogAdminPage";
import ClientIntakePage from "./pages/ClientIntakePage";
import DPARequestPage from "./pages/DPARequestPage";
import RequestDataAccessPage from "./pages/RequestDataAccessPage";
import PaymentPage from "./pages/PaymentPage";
import ContactFormPage from "./pages/ContactFormPage";
// CleanLaunchPage removed (legacy)
import CalendarPage from "./pages/CalendarPage";
import ThreatsPage from "./pages/ThreatsPage";
import Discovery from "./pages/Discovery";
// NewCoPage removed (legacy)
import InfluencerRadar from "./pages/InfluencerRadar";
// OutreachPipelinePage and RSI removed (legacy)
import EideticPage from "./pages/EideticPage";
// GraveyardPage and SovraPage removed (legacy)
import EmergencyStrikePage from "./pages/EmergencyStrikePage";
// StrikeManagementPage and EmployeeBrandRiskPage removed (legacy)
// SeoCenterPage removed (legacy)
import OperatorConsole from "./pages/OperatorConsole";
import AriaCommand from "./pages/AriaCommand";
// HyperCorePage and AnubisCockpitPage removed (legacy)
import AiScrapingPage from "./pages/AiScrapingPage";
import EnhancedIntelligence from "./pages/EnhancedIntelligence";
import IntelligenceWorkbench from "./pages/IntelligenceWorkbench";
import OffensiveOperations from "./pages/OffensiveOperations";
import NotFound from "./pages/NotFound";
import ExecutiveReportsPage from "./pages/ExecutiveReportsPage";
import SystemCheckPage from "./pages/SystemCheckPage";
import QATestPage from "./pages/QATestPage";
import UsersPage from "./pages/UsersPage";

// Admin imports
import SystemOptimizationPage from "./pages/admin/SystemOptimizationPage";
import SystemAuditPage from "./pages/admin/SystemAuditPage";
import QATestingPage from "./pages/admin/QATestingPage";
import StrategyBrainStage3TestPage from "./pages/admin/StrategyBrainStage3TestPage";
import PersonaSaturationPage from "./pages/admin/PersonaSaturationPage";
import GenesisSentinelPage from "./pages/admin/GenesisSentinelPage";
import GenesisSentinel from "./pages/admin/GenesisSentinel";
import SentinelPage from "./pages/admin/SentinelPage";
import SentinelOperatorPage from "./pages/admin/SentinelOperatorPage";
import IntelligenceCorePage from "./pages/admin/IntelligenceCorePage";
import LegalOpsPage from "./pages/admin/LegalOpsPage";
import AnubisMemoryPage from "./pages/admin/AnubisMemoryPage";

// Dashboard imports
import DashboardPage from "./pages/dashboard/DashboardPage";
import AriaIngestPage from "./pages/dashboard/AriaIngestPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import CommandCenterPage from "./pages/dashboard/CommandCenterPage";
import IntelligencePage from "./pages/dashboard/IntelligencePage";
import ThreatResponsePage from "./pages/dashboard/ThreatResponsePage";
import ScanSubmissionsPage from "./pages/dashboard/ScanSubmissionsPage";
import MentionsPage from "./pages/dashboard/MentionsPage";
import RadarPage from "./pages/dashboard/RadarPage";

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
    title: "Pricing",
    to: "/pricing",
    icon: <DollarSign className="h-4 w-4" />,
    page: <PricingPage />,
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
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Admin Dashboard",
    to: "/admin/dashboard",
    icon: <Command className="h-4 w-4" />,
    page: <AdminDashboard />,
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
    title: "Free Scan Results",
    to: "/scan-results",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <FreeScanResults />,
    isPublic: true,
  },
  {
    title: "Reputation Scan",
    to: "/reputation-scan",
    icon: <Eye className="h-4 w-4" />,
    page: <ReputationScanPage />,
    isPublic: true,
  },
  {
    title: "Reputation Scan Form",
    to: "/reputation-scan-form",
    icon: <FileText className="h-4 w-4" />,
    page: <ReputationScanForm />,
    isPublic: true,
  },
  {
    title: "Thank You",
    to: "/thank-you",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <ThankYouPage />,
    isPublic: true,
  },
  {
    title: "Monitor",
    to: "/monitor",
    icon: <Activity className="h-4 w-4" />,
    page: <Monitor />,
  },
  {
    title: "Reports",
    to: "/reports",
    icon: <FileText className="h-4 w-4" />,
    page: <Reports />,
  },
  {
    title: "Clients",
    to: "/clients",
    icon: <Users className="h-4 w-4" />,
    page: <Clients />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPage />,
  },
  {
    title: "Contact Us",
    to: "/contact-us",
    icon: <Mail className="h-4 w-4" />,
    page: <Contact />,
    isPublic: true,
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
    icon: <UserPlus className="h-4 w-4" />,
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
    title: "Blog Post",
    to: "/blog-post",
    icon: <FileText className="h-4 w-4" />,
    page: <BlogPostPage />,
    isPublic: true,
  },
  {
    title: "Blog Admin",
    to: "/blog-admin",
    icon: <Command className="h-4 w-4" />,
    page: <BlogAdminPage />,
  },
  {
    title: "Client Intake",
    to: "/client-intake",
    icon: <FileText className="h-4 w-4" />,
    page: <ClientIntakePage />,
    isPublic: true,
  },
  {
    title: "DPA Request",
    to: "/dpa-request",
    icon: <FileText className="h-4 w-4" />,
    page: <DPARequestPage />,
    isPublic: true,
  },
  {
    title: "Request Data Access",
    to: "/request-data-access",
    icon: <Database className="h-4 w-4" />,
    page: <RequestDataAccessPage />,
    isPublic: true,
  },
  {
    title: "Payment",
    to: "/payment",
    icon: <CreditCard className="h-4 w-4" />,
    page: <PaymentPage />,
    isPublic: true,
  },
  {
    title: "Contact Form",
    to: "/contact-form",
    icon: <Mail className="h-4 w-4" />,
    page: <ContactFormPage />,
    isPublic: true,
  },
  {
    title: "Calendar",
    to: "/calendar",
    icon: <Calendar className="h-4 w-4" />,
    page: <CalendarPage />,
  },
  {
    title: "Threats",
    to: "/threats",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <ThreatsPage />,
  },
  {
    title: "Discovery",
    to: "/discovery",
    icon: <Search className="h-4 w-4" />,
    page: <Discovery />,
  },
  {
    title: "Influencer Radar",
    to: "/influencer-radar",
    icon: <Radar className="h-4 w-4" />,
    page: <InfluencerRadar />,
  },
  {
    title: "Eidetic",
    to: "/eidetic",
    icon: <Brain className="h-4 w-4" />,
    page: <EideticPage />,
  },
  {
    title: "Emergency Strike",
    to: "/emergency-strike",
    icon: <Zap className="h-4 w-4" />,
    page: <EmergencyStrikePage />,
  },
  {
    title: "Operator Console",
    to: "/operator-console",
    icon: <Command className="h-4 w-4" />,
    page: <OperatorConsole />,
  },
  {
    title: "Aria Command",
    to: "/aria-command",
    icon: <Command className="h-4 w-4" />,
    page: <AriaCommand />,
  },
  {
    title: "AI Scraping",
    to: "/ai-scraping",
    icon: <Zap className="h-4 w-4" />,
    page: <AiScrapingPage />,
  },
  {
    title: "Enhanced Intelligence",
    to: "/enhanced-intelligence",
    icon: <Brain className="h-4 w-4" />,
    page: <EnhancedIntelligence />,
  },
  {
    title: "Intelligence Workbench",
    to: "/intelligence-workbench",
    icon: <Brain className="h-4 w-4" />,
    page: <IntelligenceWorkbench />,
  },
  {
    title: "Offensive Operations",
    to: "/offensive-operations",
    icon: <Gavel className="h-4 w-4" />,
    page: <OffensiveOperations />,
  },
  {
    title: "Not Found",
    to: "/404",
    icon: <HelpCircle className="h-4 w-4" />,
    page: <NotFound />,
    isPublic: true,
  },
  {
    title: "Executive Reports",
    to: "/executive-reports",
    icon: <FileText className="h-4 w-4" />,
    page: <ExecutiveReportsPage />,
  },
  {
    title: "System Check",
    to: "/system-check",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <SystemCheckPage />,
  },
  {
    title: "QA Test",
    to: "/qa-test",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <QATestPage />,
  },
  {
    title: "Users",
    to: "/users",
    icon: <Users className="h-4 w-4" />,
    page: <UsersPage />,
  },
  // Admin Routes (unique to navItems — not duplicated in App.tsx)
  {
    title: "System Optimization",
    to: "/admin/system-optimization",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <SystemOptimizationPage />,
  },
  {
    title: "System Audit",
    to: "/admin/system-audit",
    icon: <FileText className="h-4 w-4" />,
    page: <SystemAuditPage />,
  },
  {
    title: "QA Testing",
    to: "/admin/qa-testing",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <QATestingPage />,
  },
  {
    title: "Strategy Brain Stage 3 Test",
    to: "/admin/strategy-brain-stage3-test",
    icon: <Brain className="h-4 w-4" />,
    page: <StrategyBrainStage3TestPage />,
  },
  {
    title: "Persona Saturation",
    to: "/admin/persona-saturation",
    icon: <Users className="h-4 w-4" />,
    page: <PersonaSaturationPage />,
  },
  {
    title: "Genesis Sentinel",
    to: "/admin/genesis-sentinel",
    icon: <Shield className="h-4 w-4" />,
    page: <GenesisSentinel />,
  },
  {
    title: "Genesis Sentinel Page",
    to: "/admin/genesis-sentinel-page",
    icon: <Shield className="h-4 w-4" />,
    page: <GenesisSentinelPage />,
  },
  {
    title: "Sentinel Page",
    to: "/admin/sentinel-page",
    icon: <Shield className="h-4 w-4" />,
    page: <SentinelPage />,
  },
  {
    title: "Sentinel Operator Page",
    to: "/admin/sentinel-operator-page",
    icon: <Shield className="h-4 w-4" />,
    page: <SentinelOperatorPage />,
  },
  {
    title: "Intelligence Core",
    to: "/admin/intelligence-core-page",
    icon: <Brain className="h-4 w-4" />,
    page: <IntelligenceCorePage />,
  },
  {
    title: "Legal Ops",
    to: "/admin/legal-ops-page",
    icon: <Gavel className="h-4 w-4" />,
    page: <LegalOpsPage />,
  },
  {
    title: "Anubis Memory",
    to: "/admin/anubis-memory-page",
    icon: <Database className="h-4 w-4" />,
    page: <AnubisMemoryPage />,
  },
  // Dashboard Routes
  {
    title: "Dashboard Page",
    to: "/dashboard/dashboard-page",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <DashboardPage />,
  },
  {
    title: "Aria Ingest",
    to: "/dashboard/aria-ingest-page",
    icon: <Zap className="h-4 w-4" />,
    page: <AriaIngestPage />,
  },
  {
    title: "Analytics",
    to: "/dashboard/analytics-page",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <AnalyticsPage />,
  },
  {
    title: "Command Center",
    to: "/dashboard/command-center-page",
    icon: <Command className="h-4 w-4" />,
    page: <CommandCenterPage />,
  },
  {
    title: "Intelligence",
    to: "/dashboard/intelligence-page",
    icon: <Brain className="h-4 w-4" />,
    page: <IntelligencePage />,
  },
  {
    title: "Threat Response",
    to: "/dashboard/threat-response-page",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <ThreatResponsePage />,
  },
  {
    title: "Scan Submissions",
    to: "/dashboard/scan-submissions-page",
    icon: <FileText className="h-4 w-4" />,
    page: <ScanSubmissionsPage />,
  },
  {
    title: "Mentions",
    to: "/dashboard/mentions-page",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <MentionsPage />,
  },
  {
    title: "Radar",
    to: "/dashboard/radar-page",
    icon: <Radar className="h-4 w-4" />,
    page: <RadarPage />,
  },
];
