
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
  
  // Check if we're coming back from a magic link click
  const isAuth = searchParams.get("type") === "magiclink";
  const hasAccessToken = searchParams.get("access_token") !== null;
  
  useEffect(() => {
    // If coming from magic link or has token, go straight to verify step
    if (isAuth || hasAccessToken) {
      console.info("Magic link authentication detected, going to reset password step");
      setCurrentStep("verify");
    }
  }, [isAuth, hasAccessToken]);
  
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
