
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Mail, Lock, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Define schemas for the multi-step form
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const completeResetSchema = z.object({
  code: z.string().min(6, "Please enter the verification code"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type CompleteResetFormValues = z.infer<typeof completeResetSchema>;

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [currentStep, setCurrentStep] = useState<"request" | "verify">("request");
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  
  // Set up the reset request form with validation
  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Set up the code verification and new password form
  const verifyForm = useForm<CompleteResetFormValues>({
    resolver: zodResolver(completeResetSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });
  
  const handlePasswordResetRequest = async (values: RequestResetFormValues) => {
    setIsLoading(true);
    console.log("Attempting to send password reset to:", values.email);
    
    try {
      if (!signIn || !isSignInLoaded) {
        toast.error("Authentication service not available");
        console.error("SignIn not available:", { signIn, isSignInLoaded });
        setIsLoading(false);
        return;
      }
      
      // Attempt to reset password via email
      const result = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });
      
      console.log("Password reset result:", result);
      
      if (result.status === "needs_first_factor") {
        setResetEmail(values.email);
        setCurrentStep("verify");
        toast.success("Password reset code sent to your email");
      } else {
        console.error("Unexpected reset password status:", result);
        toast.error("Failed to send reset email. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      toast.error(error?.errors?.[0]?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompletePasswordReset = async (values: CompleteResetFormValues) => {
    setIsLoading(true);
    console.log("Attempting to verify code and set new password");
    
    try {
      if (!signIn || !isSignInLoaded) {
        toast.error("Authentication service not available");
        console.error("SignIn not available:", { signIn, isSignInLoaded });
        setIsLoading(false);
        return;
      }
      
      // First attempt to verify the code
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: values.code,
        password: values.password,
      });
      
      console.log("Password reset verification result:", result);
      
      if (result.status === "complete") {
        toast.success("Password reset successful. You can now sign in with your new password.");
        onBack(); // Return to sign in form
      } else {
        console.error("Unexpected verification status:", result);
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast.error(error?.errors?.[0]?.message || "Invalid code or unable to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (currentStep === "verify") {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-center">Reset Your Password</h2>
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-300">
          <AlertDescription>
            Please enter the verification code sent to <span className="font-medium">{resetEmail}</span> and your new password.
          </AlertDescription>
        </Alert>
        
        <Form {...verifyForm}>
          <form onSubmit={verifyForm.handleSubmit(handleCompletePasswordReset)} className="space-y-4">
            <FormField
              control={verifyForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={verifyForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        autoComplete="new-password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </span>
              ) : (
                <span>Reset Password</span>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentStep("request")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Email Form
            </Button>
          </form>
        </Form>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Reset Your Password</h2>
      <p className="text-sm text-gray-500 text-center">
        Enter your email address and we'll send you a code to reset your password.
      </p>
      
      <Form {...requestForm}>
        <form onSubmit={requestForm.handleSubmit(handlePasswordResetRequest)} className="space-y-4">
          <FormField
            control={requestForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="name@example.com" 
                      className="pl-10"
                      autoComplete="email"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Reset Code...
              </span>
            ) : (
              <span>Send Reset Code</span>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordResetForm;
