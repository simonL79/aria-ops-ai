
import { useState } from "react";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "./LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";

// Define schema for the verify reset form
const completeResetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CompleteResetFormValues = z.infer<typeof completeResetSchema>;

interface VerifyResetFormProps {
  resetEmail: string;
  onSuccess: () => void;
  onBack: () => void;
}

const VerifyResetForm = ({ resetEmail, onSuccess, onBack }: VerifyResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Set up the new password form
  const verifyForm = useForm<CompleteResetFormValues>({
    resolver: zodResolver(completeResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const handleCompletePasswordReset = async (values: CompleteResetFormValues) => {
    setIsLoading(true);
    console.log("Attempting to update password");
    
    try {
      // For Supabase, we don't need the email verification code as the user
      // has already clicked on the reset link in their email which sets the session
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (error) {
        console.error("Error updating password:", error);
        toast.error("Failed to update password", {
          description: error.message
        });
      } else {
        toast.success("Password updated successfully");
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password", {
        description: error?.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Reset Your Password</h2>
      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-300">
        <AlertDescription>
          Please enter your new password for <span className="font-medium">{resetEmail}</span>.
        </AlertDescription>
      </Alert>
      
      <Form {...verifyForm}>
        <form onSubmit={verifyForm.handleSubmit(handleCompletePasswordReset)} className="space-y-4">
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
          
          <FormField
            control={verifyForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
              <LoadingSpinner text="Updating Password..." />
            ) : (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Update Password
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
