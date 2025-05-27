
export const APP_CONFIG = {
  name: "A.R.I.A™",
  fullName: "Adaptive Reputation Intelligence & Analysis",
  description: "Real-time protection for your name, your business, and your future.",
  version: "1.0.0",
  author: "Simon Lindsay"
} as const;

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  BLOG: "/blog",
  ADMIN_LOGIN: "/admin/login",
  DASHBOARD: "/dashboard",
  DISCOVERY: "/discovery",
  CLIENTS: "/clients",
  EMPLOYEE_RISK: "/employee-risk",
  COMPLIANCE: "/compliance",
  EIDETIC: "/eidetic",
  RSI: "/rsi",
  GRAVEYARD: "/graveyard"
} as const;

export const API_ENDPOINTS = {
  SCAN_SUBMISSIONS: "reputation_scan_submissions",
  LEAD_MAGNETS: "lead_magnets",
  CLIENTS: "clients",
  CONTENT_ALERTS: "content_alerts"
} as const;

export const PRIVACY_CONFIG = {
  gdprCompliant: true,
  enterpriseEncryption: true,
  noPublicDashboard: true,
  verifiedOperators: true
} as const;

export const SECURITY_CONFIG = {
  enableDebugAccess: false,
  enableDevTools: false,
  enableStagingReplication: false,
  enableThirdPartyLogging: false,
  enableExternalBackups: false
} as const;
