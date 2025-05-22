
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdminWalkthrough from "@/components/home/AdminWalkthrough";

const AdminDashboardWelcome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-screen-xl mx-auto py-12">
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
    </div>
  );
};

export default AdminDashboardWelcome;
