
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { initializeAriaCore } from "@/services/ariaCore";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Force dark theme immediately
const forceDarkTheme = () => {
  document.documentElement.style.backgroundColor = '#0A0B0D';
  document.documentElement.style.color = '#F9FAFB';
  document.body.style.backgroundColor = '#0A0B0D';
  document.body.style.color = '#F9FAFB';
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
};

// Apply theme immediately
forceDarkTheme();

// Initialize A.R.I.A™ Core Services on startup
console.log('🚀 Starting A.R.I.A/EX™ System...');

// Initialize core services
initializeAriaCore().then((success) => {
  if (success) {
    console.log('✅ A.R.I.A™ Core Services initialized successfully');
  } else {
    console.warn('⚠️ A.R.I.A™ Core Services had initialization issues');
  }
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
