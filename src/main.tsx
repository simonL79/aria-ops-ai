
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { initializeARIACore } from "@/services/ariaCore";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Apply initial theme styles immediately to prevent flash
const applyInitialTheme = () => {
  const root = document.documentElement;
  const body = document.body;
  
  // Set CSS custom properties immediately
  root.style.setProperty('--background', '10 11 13');
  root.style.setProperty('--foreground', '249 250 251');
  root.style.backgroundColor = '#0A0B0D';
  root.style.color = '#F9FAFB';
  body.style.backgroundColor = '#0A0B0D';
  body.style.color = '#F9FAFB';
  body.style.minHeight = '100vh';
  
  // Add dark class
  root.classList.add('dark');
  root.classList.remove('light');
};

// Apply theme immediately before React renders
applyInitialTheme();

console.log('🚀 Starting A.R.I.A/EX™ System...');

// Initialize core services
initializeARIACore().then(() => {
  console.log('✅ A.R.I.A™ Core Services initialized successfully');
}).catch((error) => {
  console.error('❌ A.R.I.A™ Core initialization failed:', error);
});

// Initialize database monitoring
initializeDatabase().then(() => {
  console.log('✅ Database monitoring initialized');
}).catch((error) => {
  console.error('❌ Database initialization failed:', error);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
