
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { initializeAriaCore } from "@/services/ariaCore";
import { initializeDatabase } from "@/utils/initializeMonitoring";

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
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
