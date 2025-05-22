
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
  
  // Check if we're coming back from a password reset link
  const isRecovery = searchParams.get("type") === "recovery";
  const hasAccessToken = searchParams.get("access_token") !== null;
  
  useEffect(() => {
    // If coming from reset link or has token, go straight to verify step
    if (isRecovery || hasAccessToken) {
      console.info("Password reset flow detected, going to reset password step");
      setCurrentStep("verify");
    }
  }, [isRecovery, hasAccessToken]);
  
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
