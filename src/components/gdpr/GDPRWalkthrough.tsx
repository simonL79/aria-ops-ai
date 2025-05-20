
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Steps, Step } from "@/components/ui/steps";
import { Check, CheckCircle, Shield, Eye, ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const complianceSteps = [
  {
    title: "Lawful Basis",
    description: "Operate under Legitimate Interest or Consent depending on data usage",
    content: (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg mb-2">
          <h4 className="font-bold mb-2">Legitimate Interest (Art. 6(1)(f))</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Monitoring public data (news, forums, social) for reputational risks</li>
            <li>Providing B2B services like media alerts or reputation analysis</li>
          </ul>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg mb-2">
          <h4 className="font-bold mb-2">Consent (Art. 6(1)(a))</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Onboarding clients and running scans on their name/brand</li>
            <li>Storing analysis or personal insights long-term</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Best Practice:</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Document your legitimate interest assessment (LIA)</li>
            <li>Allow clients to explicitly opt in during onboarding</li>
            <li>Allow scanned individuals to request reports or opt out</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Data Minimization",
    description: "Only collect what you need, use it only for the stated purpose",
    content: (
      <div className="space-y-4">
        <h4 className="font-semibold mb-2">How A.R.I.A™ Complies:</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>Only pulls publicly available content (e.g., news articles, public tweets)</li>
          <li>Extracts entities and sentiment, not private attributes</li>
          <li>Data is used solely for reputation monitoring & protection</li>
        </ul>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Best Practice:</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Avoid scanning private platforms (e.g., private groups, password-protected forums)</li>
            <li>Avoid storing entire articles long-term — store summaries or URLs</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "User Rights",
    description: "Ensure transparency and respect rights to access, rectification, and erasure",
    content: (
      <div className="space-y-4">
        <h4 className="font-semibold mb-2">Under GDPR, individuals have rights:</h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>To know they're being scanned (transparency)</li>
          <li>To access what data is held on them (Art. 15 – Subject Access Request)</li>
          <li>To be forgotten (Art. 17 – Erasure)</li>
        </ul>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-1">What A.R.I.A™ Offers:</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Clear privacy policy outlining data collection and purpose</li>
            <li>Simple form for users to request access or deletion</li>
            <li>Data portability options for clients</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Security",
    description: "Implement strong technical and organizational safeguards",
    content: (
      <div className="space-y-4">
        <h4 className="font-semibold mb-2">A.R.I.A™ Best Practices:</h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>Host data in EU or GDPR-compliant regions (e.g., Supabase in Frankfurt or AWS in EU-West)</li>
          <li>Use role-based access controls (RLS policies in Supabase)</li>
          <li>Encrypt personal data at rest and in transit</li>
          <li>Keep audit logs for administrative access</li>
        </ul>
      </div>
    )
  },
  {
    title: "AI Accountability",
    description: "Ensure explainability and human oversight for AI-driven decisions",
    content: (
      <div className="space-y-4">
        <h4 className="font-semibold mb-2">If using AI to analyze or classify data:</h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ensure explainability for flagged results ("why was this marked as risky?")</li>
          <li>Allow human review (don't make fully automated decisions without oversight)</li>
          <li>Avoid storing any biometric or special category data unless explicitly necessary and with appropriate safeguards</li>
        </ul>
      </div>
    )
  }
];

const rulesOfThumb = [
  {
    title: "Public data = fair game",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    description: "If it's on a public news site, public tweet, blog, or company registry, GDPR doesn't restrict scanning or analyzing it."
  },
  {
    title: "Client data = authorized",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
    description: "If a user consents to scans on themselves, their name, or company, you can store results, run monitoring, and send alerts."
  },
  {
    title: "Non-clients = offer transparency",
    icon: <Eye className="h-5 w-5 text-purple-600" />,
    description: "If you scan founders or brands based on public data, explain why, offer opt-out, and don't expose data to third parties."
  },
  {
    title: "Avoid sensitive data",
    icon: <Shield className="h-5 w-5 text-amber-600" />,
    description: "GDPR restricts processing political beliefs, health/biometric data, sexual orientation, etc. A.R.I.A™ doesn't need these."
  }
];

const GDPRWalkthrough = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (activeStep < complianceSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-md border-blue-100">
        <CardHeader className="bg-blue-50/50 pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>A.R.I.A™ GDPR Compliance Walkthrough</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                {complianceSteps.map((step, index) => (
                  <li 
                    key={index} 
                    className={cn(
                      "ml-6 mb-6 cursor-pointer",
                      activeStep === index ? "text-blue-600" : ""
                    )}
                    onClick={() => setActiveStep(index)}
                  >
                    <span className={cn(
                      "absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white",
                      activeStep === index ? "bg-blue-600" : "bg-gray-200"
                    )}>
                      {activeStep > index ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <span className={activeStep === index ? "text-white" : "text-gray-500"}>
                          {index + 1}
                        </span>
                      )}
                    </span>
                    <h3 className={cn(
                      "font-medium",
                      activeStep === index ? "text-blue-600" : ""
                    )}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="w-full md:w-2/3 bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-bold mb-4">
                {complianceSteps[activeStep].title}
              </h3>
              
              {complianceSteps[activeStep].content}
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>
                
                {activeStep < complianceSteps.length - 1 ? (
                  <Button 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/gdpr-compliance')}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    View Full GDPR Details
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Key Rules of Thumb to Stay Compliant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesOfThumb.map((rule, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{rule.icon}</div>
                  <div>
                    <h4 className="font-bold text-base">{rule.title}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Bottom Line</h3>
              <p className="mb-4">
                GDPR compliance won't restrict A.R.I.A™'s power — it protects your right to use it responsibly.
              </p>
              <div className="space-x-3">
                <Button 
                  className="shadow-sm" 
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/gdpr-compliance')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  GDPR Compliance Details
                </Button>
                <Button 
                  className="shadow-sm bg-blue-600 hover:bg-blue-700" 
                  size="sm"
                  onClick={() => navigate('/request-data-access')}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Data Access Portal
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRWalkthrough;
