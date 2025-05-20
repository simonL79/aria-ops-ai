
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import PasswordResetForm from "./PasswordResetForm";

const AuthenticationForm = () => {
  const [showResetForm, setShowResetForm] = useState(false);

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
