
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import LoadingSpinner from "./LoadingSpinner";

// Define schema for the verify reset form
const completeResetSchema = z.object({
  code: z.string().min(6, "Please enter the verification code"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CompleteResetFormValues = z.infer<typeof completeResetSchema>;

interface VerifyResetFormProps {
  resetEmail: string;
  onSuccess: () => void;
  onBack: () => void;
}

const VerifyResetForm = ({ resetEmail, onSuccess, onBack }: VerifyResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  
  // Set up the code verification and new password form
  const verifyForm = useForm<CompleteResetFormValues>({
    resolver: zodResolver(completeResetSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });
  
  const handleCompletePasswordReset = async (values: CompleteResetFormValues) => {
    setIsLoading(true);
    console.log("Attempting to verify code and set new password");
    console.log("Code value:", values.code); // Debugging log
    
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
        onSuccess(); // Return to sign in form
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
                  <div className="flex flex-col items-center space-y-2">
                    <InputOTP 
                      maxLength={6}
                      value={field.value} 
                      onChange={field.onChange}
                      className="flex justify-center gap-2"
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {field.value && field.value.length === 6 && (
                      <span className="text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Code entered
                      </span>
                    )}
                  </div>
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
              <LoadingSpinner text="Resetting Password..." />
            ) : (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Reset Password
              </span>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Email Form
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyResetForm;
