
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
import MonitoringPage from "./pages/MonitoringPage";
import Reports from "./pages/Reports";
import ReportsPage from "./pages/ReportsPage";
import Clients from "./pages/Clients";
import ClientsPage from "./pages/ClientsPage";
import Settings from "./pages/Settings";
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
import SecureClientIntakePage from "./pages/SecureClientIntakePage";
import DPARequestPage from "./pages/DPARequestPage";
import RequestDataAccessPage from "./pages/RequestDataAccessPage";
import PaymentPage from "./pages/PaymentPage";
import ContactFormPage from "./pages/ContactFormPage";
import CleanLaunchPage from "./pages/CleanLaunchPage";
import CleanLaunch from "./pages/CleanLaunch";
import CalendarPage from "./pages/CalendarPage";
import ThreatsPage from "./pages/ThreatsPage";
import Discovery from "./pages/Discovery";
import NewCoPage from "./pages/NewCoPage";
import InfluencerRadar from "./pages/InfluencerRadar";
import OutreachPipelinePage from "./pages/OutreachPipelinePage";
import RSI from "./pages/RSI";
import EideticPage from "./pages/EideticPage";
import GraveyardPage from "./pages/GraveyardPage";
import SovraPage from "./pages/SovraPage";
import EmergencyStrikePage from "./pages/EmergencyStrikePage";
import StrikeManagementPage from "./pages/StrikeManagementPage";
import EmployeeBrandRiskPage from "./pages/EmployeeBrandRiskPage";
import SeoCenterPage from "./pages/SeoCenterPage";
import OperatorConsole from "./pages/OperatorConsole";
import AriaCommand from "./pages/AriaCommand";
import HyperCorePage from "./pages/HyperCorePage";
import AnubisGPTCockpit from "./pages/AnubisGPTCockpit";
import AnubisCockpitPage from "./pages/AnubisCockpitPage";
import AiScrapingPage from "./pages/AiScrapingPage";
import EnhancedIntelligence from "./pages/EnhancedIntelligence";
import IntelligenceWorkbench from "./pages/IntelligenceWorkbench";
import OffensiveOperations from "./pages/OffensiveOperations";
import NotFound from "./pages/NotFound";
import ExecutiveReportsPage from "./pages/ExecutiveReportsPage";
import SystemCheckPage from "./pages/SystemCheckPage";
import QATestPage from "./pages/QATestPage";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import UsersPage from "./pages/UsersPage";

// Admin imports
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import ClientManagementPage from "./pages/admin/ClientManagementPage";
import ClientsPageAdmin from "./pages/admin/ClientsPage";
import SettingsPageAdmin from "./pages/admin/SettingsPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
import SystemOptimizationPage from "./pages/admin/SystemOptimizationPage";
import SystemAuditPage from "./pages/admin/SystemAuditPage";
import QATestingPage from "./pages/admin/QATestingPage";
import StrategyBrainTestPage from "./pages/admin/StrategyBrainTestPage";
import StrategyBrainStage3Page from "./pages/admin/StrategyBrainStage3Page";
import StrategyBrainStage3TestPage from "./pages/admin/StrategyBrainStage3TestPage";
import PersonaSaturationPage from "./pages/admin/PersonaSaturationPage";
import KeywordToArticleSystemPage from "./pages/admin/KeywordToArticleSystemPage";
import GenesisSentinelPage from "./pages/admin/GenesisSentinelPage";
import GenesisSentinel from "./pages/admin/GenesisSentinel";
import SentinelPage from "./pages/admin/SentinelPage";
import SentinelOperatorPage from "./pages/admin/SentinelOperatorPage";
import IntelligenceCorePage from "./pages/admin/IntelligenceCorePage";
import ControlCenterPage from "./pages/admin/ControlCenterPage";
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

// Intelligence imports
import IntelligenceWorkbenchPage from "./pages/intelligence/IntelligenceWorkbench";
import OffensiveOperationsPage from "./pages/intelligence/OffensiveOperations";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "About",
    to: "/about",
    icon: <Users className="h-4 w-4" />,
    page: <AboutPage />,
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
    title: "Features",
    to: "/features",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <Features />,
  },
  {
    title: "How It Works",
    to: "/how-it-works",
    icon: <HelpCircle className="h-4 w-4" />,
    page: <HowItWorksPage />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Admin Dashboard",
    to: "/admin",
    icon: <Shield className="h-4 w-4" />,
    page: <AdminDashboard />,
  },
  {
    title: "Authentication",
    to: "/auth",
    icon: <UserCheck className="h-4 w-4" />,
    page: <Authentication />,
  },
  {
    title: "Admin Login",
    to: "/admin-login",
    icon: <Lock className="h-4 w-4" />,
    page: <AdminLogin />,
  },
  {
    title: "Scan",
    to: "/scan",
    icon: <Search className="h-4 w-4" />,
    page: <ScanPage />,
  },
  {
    title: "Free Scan Results",
    to: "/free-scan-results",
    icon: <FileText className="h-4 w-4" />,
    page: <FreeScanResults />,
  },
  {
    title: "Reputation Scan",
    to: "/reputation-scan",
    icon: <Target className="h-4 w-4" />,
    page: <ReputationScanPage />,
  },
  {
    title: "Reputation Scan Form",
    to: "/reputation-scan-form",
    icon: <FileText className="h-4 w-4" />,
    page: <ReputationScanForm />,
  },
  {
    title: "Thank You",
    to: "/thank-you",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <ThankYouPage />,
  },
  {
    title: "Monitor",
    to: "/monitor",
    icon: <Eye className="h-4 w-4" />,
    page: <Monitor />,
  },
  {
    title: "Monitoring",
    to: "/monitoring",
    icon: <Activity className="h-4 w-4" />,
    page: <MonitoringPage />,
  },
  {
    title: "Reports",
    to: "/reports",
    icon: <FileText className="h-4 w-4" />,
    page: <Reports />,
  },
  {
    title: "Reports Page",
    to: "/reports-page",
    icon: <FileImage className="h-4 w-4" />,
    page: <ReportsPage />,
  },
  {
    title: "Clients",
    to: "/clients",
    icon: <Users className="h-4 w-4" />,
    page: <Clients />,
  },
  {
    title: "Clients Page",
    to: "/clients-page",
    icon: <Building className="h-4 w-4" />,
    page: <ClientsPage />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <Settings />,
  },
  {
    title: "Contact Form",
    to: "/contact-form",
    icon: <Mail className="h-4 w-4" />,
    page: <Contact />,
  },
  {
    title: "Terms",
    to: "/terms",
    icon: <FileText className="h-4 w-4" />,
    page: <Terms />,
  },
  {
    title: "Privacy Policy",
    to: "/privacy-policy",
    icon: <Lock className="h-4 w-4" />,
    page: <PrivacyPolicyPage />,
  },
  {
    title: "Disclaimer",
    to: "/disclaimer",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <DisclaimerPage />,
  },
  {
    title: "Simon Lindsay",
    to: "/simon-lindsay",
    icon: <Users className="h-4 w-4" />,
    page: <SimonLindsayPage />,
  },
  {
    title: "Biography",
    to: "/biography",
    icon: <BookOpen className="h-4 w-4" />,
    page: <BiographyPage />,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: <BookOpen className="h-4 w-4" />,
    page: <BlogPage />,
  },
  {
    title: "Blog Post",
    to: "/blog/:slug",
    icon: <FileText className="h-4 w-4" />,
    page: <BlogPostPage />,
  },
  {
    title: "Blog Admin",
    to: "/blog-admin",
    icon: <Settings className="h-4 w-4" />,
    page: <BlogAdminPage />,
  },
  {
    title: "Client Intake",
    to: "/client-intake",
    icon: <UserPlus className="h-4 w-4" />,
    page: <ClientIntakePage />,
  },
  {
    title: "A.R.I.A™ Secure Intake",
    to: "/secure-intake",
    icon: <Shield className="h-4 w-4" />,
    page: <SecureClientIntakePage />,
  },
  {
    title: "DPA Request",
    to: "/dpa-request",
    icon: <FileText className="h-4 w-4" />,
    page: <DPARequestPage />,
  },
  {
    title: "Request Data Access",
    to: "/request-data-access",
    icon: <Database className="h-4 w-4" />,
    page: <RequestDataAccessPage />,
  },
  {
    title: "Payment",
    to: "/payment",
    icon: <CreditCard className="h-4 w-4" />,
    page: <PaymentPage />,
  },
  {
    title: "Contact Form Page",
    to: "/contact-form-page",
    icon: <Mail className="h-4 w-4" />,
    page: <ContactFormPage />,
  },
  {
    title: "Clean Launch",
    to: "/clean-launch",
    icon: <Lightbulb className="h-4 w-4" />,
    page: <CleanLaunchPage />,
  },
  {
    title: "Clean Launch Alt",
    to: "/clean-launch-alt",
    icon: <Globe className="h-4 w-4" />,
    page: <CleanLaunch />,
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
    title: "NewCo",
    to: "/newco",
    icon: <Building className="h-4 w-4" />,
    page: <NewCoPage />,
  },
  {
    title: "Influencer Radar",
    to: "/influencer-radar",
    icon: <Radar className="h-4 w-4" />,
    page: <InfluencerRadar />,
  },
  {
    title: "Outreach Pipeline",
    to: "/outreach-pipeline",
    icon: <Megaphone className="h-4 w-4" />,
    page: <OutreachPipelinePage />,
  },
  {
    title: "RSI",
    to: "/rsi",
    icon: <Shield className="h-4 w-4" />,
    page: <RSI />,
  },
  {
    title: "Eidetic",
    to: "/eidetic",
    icon: <Brain className="h-4 w-4" />,
    page: <EideticPage />,
  },
  {
    title: "Graveyard",
    to: "/graveyard",
    icon: <Eye className="h-4 w-4" />,
    page: <GraveyardPage />,
  },
  {
    title: "Sovra",
    to: "/sovra",
    icon: <Zap className="h-4 w-4" />,
    page: <SovraPage />,
  },
  {
    title: "Emergency Strike",
    to: "/emergency-strike",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <EmergencyStrikePage />,
  },
  {
    title: "Strike Management",
    to: "/strike-management",
    icon: <Gavel className="h-4 w-4" />,
    page: <StrikeManagementPage />,
  },
  {
    title: "Employee Brand Risk",
    to: "/employee-brand-risk",
    icon: <Briefcase className="h-4 w-4" />,
    page: <EmployeeBrandRiskPage />,
  },
  {
    title: "SEO Center",
    to: "/seo-center",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <SeoCenterPage />,
  },
  {
    title: "Operator Console",
    to: "/operator-console",
    icon: <Command className="h-4 w-4" />,
    page: <OperatorConsole />,
  },
  {
    title: "ARIA Command",
    to: "/aria-command",
    icon: <Bot className="h-4 w-4" />,
    page: <AriaCommand />,
  },
  {
    title: "HyperCore",
    to: "/hypercore",
    icon: <Cpu className="h-4 w-4" />,
    page: <HyperCorePage />,
  },
  {
    title: "Anubis GPT Cockpit",
    to: "/anubis-gpt-cockpit",
    icon: <Bot className="h-4 w-4" />,
    page: <AnubisGPTCockpit />,
  },
  {
    title: "Anubis Cockpit",
    to: "/anubis-cockpit",
    icon: <Gauge className="h-4 w-4" />,
    page: <AnubisCockpitPage />,
  },
  {
    title: "AI Scraping",
    to: "/ai-scraping",
    icon: <Network className="h-4 w-4" />,
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
    icon: <Layers className="h-4 w-4" />,
    page: <IntelligenceWorkbench />,
  },
  {
    title: "Offensive Operations",
    to: "/offensive-operations",
    icon: <Target className="h-4 w-4" />,
    page: <OffensiveOperations />,
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
    icon: <Settings className="h-4 w-4" />,
    page: <SystemCheckPage />,
  },
  {
    title: "QA Test",
    to: "/qa-test",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <QATestPage />,
  },
  {
    title: "Client Onboarding",
    to: "/client-onboarding",
    icon: <UserPlus className="h-4 w-4" />,
    page: <ClientOnboardingPage />,
  },
  {
    title: "Users",
    to: "/users",
    icon: <Users className="h-4 w-4" />,
    page: <UsersPage />,
  },

  // Admin routes
  {
    title: "Admin Dashboard",
    to: "/admin/dashboard",
    icon: <Shield className="h-4 w-4" />,
    page: <AdminDashboardPage />,
  },
  {
    title: "Client Management",
    to: "/admin/client-management",
    icon: <Users className="h-4 w-4" />,
    page: <ClientManagementPage />,
  },
  {
    title: "Admin Clients",
    to: "/admin/clients",
    icon: <Building className="h-4 w-4" />,
    page: <ClientsPageAdmin />,
  },
  {
    title: "Admin Settings",
    to: "/admin/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPageAdmin />,
  },
  {
    title: "System Settings",
    to: "/admin/system-settings",
    icon: <Cpu className="h-4 w-4" />,
    page: <SystemSettingsPage />,
  },
  {
    title: "System Optimization",
    to: "/admin/system-optimization",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <SystemOptimizationPage />,
  },
  {
    title: "System Audit",
    to: "/admin/system-audit",
    icon: <Activity className="h-4 w-4" />,
    page: <SystemAuditPage />,
  },
  {
    title: "QA Testing",
    to: "/admin/qa-testing",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <QATestingPage />,
  },
  {
    title: "Strategy Brain Test",
    to: "/admin/strategy-brain-test",
    icon: <Brain className="h-4 w-4" />,
    page: <StrategyBrainTestPage />,
  },
  {
    title: "Strategy Brain Stage 3",
    to: "/admin/strategy-brain-stage3",
    icon: <Layers className="h-4 w-4" />,
    page: <StrategyBrainStage3Page />,
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
    title: "Keyword to Article System",
    to: "/admin/keyword-to-article-system",
    icon: <Target className="h-4 w-4" />,
    page: <KeywordToArticleSystemPage />,
  },
  {
    title: "Genesis Sentinel",
    to: "/admin/genesis-sentinel",
    icon: <Eye className="h-4 w-4" />,
    page: <GenesisSentinelPage />,
  },
  {
    title: "Genesis Sentinel Alt",
    to: "/admin/genesis-sentinel-alt",
    icon: <Shield className="h-4 w-4" />,
    page: <GenesisSentinel />,
  },
  {
    title: "Sentinel",
    to: "/admin/sentinel",
    icon: <Eye className="h-4 w-4" />,
    page: <SentinelPage />,
  },
  {
    title: "Sentinel Operator",
    to: "/admin/sentinel-operator",
    icon: <Command className="h-4 w-4" />,
    page: <SentinelOperatorPage />,
  },
  {
    title: "Intelligence Core",
    to: "/admin/intelligence-core",
    icon: <Brain className="h-4 w-4" />,
    page: <IntelligenceCorePage />,
  },
  {
    title: "Control Center",
    to: "/admin/control-center",
    icon: <Command className="h-4 w-4" />,
    page: <ControlCenterPage />,
  },
  {
    title: "Legal Ops",
    to: "/admin/legal-ops",
    icon: <Gavel className="h-4 w-4" />,
    page: <LegalOpsPage />,
  },
  {
    title: "Anubis Memory",
    to: "/admin/anubis-memory",
    icon: <Database className="h-4 w-4" />,
    page: <AnubisMemoryPage />,
  },

  // Dashboard routes
  {
    title: "Dashboard Main",
    to: "/dashboard/main",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <DashboardPage />,
  },
  {
    title: "ARIA Ingest",
    to: "/dashboard/aria-ingest",
    icon: <Database className="h-4 w-4" />,
    page: <AriaIngestPage />,
  },
  {
    title: "Analytics",
    to: "/dashboard/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <AnalyticsPage />,
  },
  {
    title: "Command Center",
    to: "/dashboard/command-center",
    icon: <Command className="h-4 w-4" />,
    page: <CommandCenterPage />,
  },
  {
    title: "Intelligence",
    to: "/dashboard/intelligence",
    icon: <Brain className="h-4 w-4" />,
    page: <IntelligencePage />,
  },
  {
    title: "Threat Response",
    to: "/dashboard/threat-response",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <ThreatResponsePage />,
  },
  {
    title: "Scan Submissions",
    to: "/dashboard/scan-submissions",
    icon: <Search className="h-4 w-4" />,
    page: <ScanSubmissionsPage />,
  },
  {
    title: "Mentions",
    to: "/dashboard/mentions",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <MentionsPage />,
  },
  {
    title: "Radar",
    to: "/dashboard/radar",
    icon: <Radar className="h-4 w-4" />,
    page: <RadarPage />,
  },

  // Intelligence routes
  {
    title: "Intelligence Workbench Alt",
    to: "/intelligence/workbench",
    icon: <Layers className="h-4 w-4" />,
    page: <IntelligenceWorkbenchPage />,
  },
  {
    title: "Offensive Operations Alt",
    to: "/intelligence/offensive-operations",
    icon: <Target className="h-4 w-4" />,
    page: <OffensiveOperationsPage />,
  },

  // 404 route should be last
  {
    title: "Not Found",
    to: "*",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <NotFound />,
  },
];
