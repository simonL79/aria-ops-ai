
import React from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AdminWalkthrough from "@/components/home/AdminWalkthrough";

const SalesFunnelPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <PublicLayout>
      <div className="container max-w-screen-xl mx-auto py-12">
        {isAuthenticated ? (
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                Welcome to A.R.I.A™ Admin Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Follow this walkthrough guide to manage your clients' reputation,
                analyze threats, and deliver actionable insights.
              </p>
            </div>
            
            <AdminWalkthrough />
            
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="action"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="shadow-lg"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/clients")}
              >
                Manage Clients
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  A.I. Reputation <br />
                  Intelligence Assistant™
                </h1>
                <p className="text-xl text-muted-foreground">
                  Protect and enhance your brand's reputation with our advanced A.I.-powered
                  monitoring and intelligence platform.
                </p>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="scan"
                    size="lg"
                    onClick={() => navigate("/scan")}
                    className="shadow-lg"
                  >
                    Free Reputation Scan
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/auth")}
                  >
                    Login / Sign Up
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <img
                  src="/assets/hero-image.svg"
                  alt="A.R.I.A™ Hero"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m4.93 4.93 4.24 4.24" />
                    <path d="m14.83 9.17 4.24-4.24" />
                    <path d="m14.83 14.83 4.24 4.24" />
                    <path d="m9.17 14.83-4.24 4.24" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Monitor</h3>
                <p className="text-muted-foreground">
                  24/7 real-time monitoring across social media, news, reviews, and the dark web.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" />
                    <line x1="16" y1="8" x2="2" y2="22" />
                    <line x1="17.5" y1="15" x2="9" y2="15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Analyze</h3>
                <p className="text-muted-foreground">
                  AI-powered threat detection and sentiment analysis to identify risks early.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Protect</h3>
                <p className="text-muted-foreground">
                  Strategic response generation and content removal services to safeguard your brand.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default SalesFunnelPage;
