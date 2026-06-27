
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { initializeARIACore } from "@/services/ariaCore";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Apply initial charcoal theme to prevent flash
const applyInitialTheme = () => {
  const root = document.documentElement;
  const body = document.body;

  root.style.backgroundColor = '#0B0B0F';
  root.style.color = '#F8FAFC';
  body.style.backgroundColor = '#0B0B0F';
  body.style.color = '#F8FAFC';
  body.style.minHeight = '100vh';

  root.classList.add('dark');
  root.classList.remove('light');
};

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
