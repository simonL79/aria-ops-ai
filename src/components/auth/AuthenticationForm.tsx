
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignInForm from "./SignInForm";
import PasswordResetForm from "./PasswordResetForm";

const AuthenticationForm = () => {
  const [showResetForm, setShowResetForm] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Auto-show reset form if we detect recovery mode or auth token in URL
  useEffect(() => {
    const isRecoveryMode = searchParams.get("type") === "recovery";
    const hasAccessToken = searchParams.get("access_token") !== null;
    
    if (isRecoveryMode || hasAccessToken) {
      setShowResetForm(true);
    }
  }, [searchParams]);

  if (showResetForm) {
    return <PasswordResetForm onBack={() => setShowResetForm(false)} />;
  }

  return (
    <div className="w-full">
      <SignInForm setShowResetForm={setShowResetForm} />
    </div>
  );
};

export default AuthenticationForm;
