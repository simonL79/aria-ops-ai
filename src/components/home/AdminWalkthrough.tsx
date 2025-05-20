
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps, Step } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Scan, FileText, Bell, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps = [
    {
      title: "Client Management",
      description: "Add new clients and manage existing client records",
      icon: <Users className="h-5 w-5" />,
      path: "/clients",
      buttonText: "Go to Client Management",
      buttonVariant: "action" as const
    },
    {
      title: "Intelligence Sweep",
      description: "Run reputation scans to gather intelligence",
      icon: <Scan className="h-5 w-5" />,
      path: "/dashboard",
      buttonText: "Start Intelligence Sweep",
      buttonVariant: "scan" as const
    },
    {
      title: "Threat Analysis",
      description: "Review and classify threats to client reputation",
      icon: <Shield className="h-5 w-5" />,
      path: "/monitor",
      buttonText: "Review Threats",
      buttonVariant: "escalate" as const
    },
    {
      title: "Report Generation",
      description: "Create comprehensive reports from gathered intelligence",
      icon: <FileText className="h-5 w-5" />,
      path: "/reports",
      buttonText: "Generate Reports",
      buttonVariant: "generate" as const
    },
    {
      title: "Client Delivery",
      description: "Deliver insights and recommendations to clients",
      icon: <Bell className="h-5 w-5" />,
      path: "/reports",
      buttonText: "Deliver to Client",
      buttonVariant: "deliver" as const
    }
  ];
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">A.R.I.A™ Admin Walkthrough</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Steps value={currentStep} onChange={setCurrentStep} className="py-4">
          {steps.map((step, idx) => (
            <Step key={idx} title={step.title} description={step.description} icon={step.icon} />
          ))}
        </Steps>
        
        <div className="bg-muted/30 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            {steps[currentStep].icon}
            <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
          </div>
          
          {currentStep === 0 && (
            <div className="space-y-4">
              <p>
                Start by setting up your client in the system. Add their basic information,
                key contacts, and specify keywords for monitoring their online reputation.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Navigate to the Clients section</li>
                <li>Click "Add New Client" and complete the form</li>
                <li>Include specific keywords to monitor (company name, executives, products)</li>
                <li>Save the client profile to begin monitoring</li>
              </ul>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <p>
                Once your client is set up, run an Intelligence Sweep to gather
                mentions, reviews, and content from across the web.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Select your client from the profile dropdown</li>
                <li>Set your date range parameters</li>
                <li>Click "Intelligence Sweep" to begin data collection</li>
                <li>Wait for the scan to complete and results to populate</li>
              </ul>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <p>
                Review the collected content and analyze potential threats to your client's
                reputation. A.R.I.A™ uses AI to classify content, but you should review results.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Filter by platform or sentiment for focused analysis</li>
                <li>Review AI-classified threat levels and categories</li>
                <li>Take action on high-priority threats by clicking "Escalate"</li>
                <li>Generate strategic responses for concerning content</li>
              </ul>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <p>
                Generate comprehensive reports that summarize findings and provide
                strategic recommendations for your clients.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Navigate to Reports and select "Create Report"</li>
                <li>Choose your client and set the date range</li>
                <li>Select what to include (threats, sentiment, recommendations)</li>
                <li>Generate the report in your preferred format</li>
              </ul>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-4">
              <p>
                Deliver insights to your clients through their preferred channels,
                with appropriate context and priority levels.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Select a delivery method (email, portal, or scheduled review)</li>
                <li>Customize the message and select priority level if needed</li>
                <li>Deliver the report and confirm client receipt</li>
                <li>Schedule follow-ups for critical issues</li>
              </ul>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant={steps[currentStep].buttonVariant} 
                onClick={() => handleNavigate(steps[currentStep].path)}
                className="flex items-center gap-2"
              >
                {steps[currentStep].buttonText}
              </Button>
              
              <Button 
                variant="action" 
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-1"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminWalkthrough;
