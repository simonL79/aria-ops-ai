
import { useState, useEffect } from "react";
import RequestResetForm from "./password-reset/RequestResetForm";
import VerifyResetForm from "./password-reset/VerifyResetForm";
import { useSearchParams } from "react-router-dom";

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [currentStep, setCurrentStep] = useState<"request" | "verify">("request");
  const [searchParams] = useSearchParams();
  
  // Check if we're coming back from a reset link click
  const isResetMode = searchParams.get("type") === "recovery";
  const hasAccessToken = searchParams.get("access_token") !== null;
  
  useEffect(() => {
    // If coming from reset link, go straight to verify step
    if (isResetMode || hasAccessToken) {
      console.info("Reset mode detected from URL parameters, going to verify step");
      setCurrentStep("verify");
    }
  }, [isResetMode, hasAccessToken]);
  
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
