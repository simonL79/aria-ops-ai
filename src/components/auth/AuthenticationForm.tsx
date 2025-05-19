
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import PasswordResetForm from "./PasswordResetForm";

const AuthenticationForm = () => {
  const [showResetForm, setShowResetForm] = useState(false);

  if (showResetForm) {
    return <PasswordResetForm onBack={() => setShowResetForm(false)} />;
  }

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="signin" className="flex gap-2 items-center">
          <LogIn className="h-4 w-4" />
          Sign In
        </TabsTrigger>
        <TabsTrigger value="signup" className="flex gap-2 items-center">
          <UserPlus className="h-4 w-4" />
          Sign Up
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <SignInForm setShowResetForm={setShowResetForm} />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthenticationForm;
