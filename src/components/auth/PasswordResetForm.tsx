
import { useState } from "react";
import RequestResetForm from "./password-reset/RequestResetForm";
import VerifyResetForm from "./password-reset/VerifyResetForm";

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [currentStep, setCurrentStep] = useState<"request" | "verify">("request");
  
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
