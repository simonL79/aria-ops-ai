
import { useState } from "react";
import RequestResetForm from "./password-reset/RequestResetForm";
import VerifyResetForm from "./password-reset/VerifyResetForm";
import { useLocation } from "react-router-dom";

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [currentStep, setCurrentStep] = useState<"request" | "verify">("request");
  const location = useLocation();
  
  // Check if we're coming back from a reset link click
  const searchParams = new URLSearchParams(location.search);
  const isReset = searchParams.get("reset") === "true";
  
  // If coming from reset link, go straight to verify step
  if (isReset && currentStep === "request") {
    setCurrentStep("verify");
  }
  
  const handleRequestSuccess = (email: string) => {
    setResetEmail(email);
    setCurrentStep("verify");
  };
  
  const handleBackToRequest = () => {
    setCurrentStep("request");
  };
  
  if (currentStep === "verify") {
    return (
      <VerifyResetForm
        resetEmail={resetEmail}
        onSuccess={onBack}
        onBack={handleBackToRequest}
      />
    );
  }
  
  return (
    <RequestResetForm
      onSuccess={handleRequestSuccess}
      onBack={onBack}
    />
  );
};

export default PasswordResetForm;
