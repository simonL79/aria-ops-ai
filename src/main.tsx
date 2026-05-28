
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { initializeARIACore } from "@/services/ariaCore";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Apply initial light theme styles immediately to prevent flash
const applyInitialTheme = () => {
  const root = document.documentElement;
  const body = document.body;

  root.style.backgroundColor = '#F4F6F8';
  root.style.color = '#111827';
  body.style.backgroundColor = '#F4F6F8';
  body.style.color = '#111827';
  body.style.minHeight = '100vh';

  // Default to light mode for public site; /admin re-enables `.dark`
  root.classList.remove('dark');
  root.classList.add('light');
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
