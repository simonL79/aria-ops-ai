
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define schema for the request reset form
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;

interface RequestResetFormProps {
  onSuccess: (email: string) => void;
  onBack: () => void;
}

const RequestResetForm = ({ onSuccess, onBack }: RequestResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  
  // Set up the reset request form with validation
  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
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
        toast.success("Password reset code sent to your email");
        onSuccess(values.email);
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

export default RequestResetForm;
