
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "@/hooks/useAuth";
import { RbacProvider } from "@/hooks/useRbac";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RbacProvider>
          <App />
        </RbacProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
