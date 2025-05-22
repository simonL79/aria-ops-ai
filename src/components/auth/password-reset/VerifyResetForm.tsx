
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface VerifyResetFormProps {
  resetEmail?: string;
  onSuccess: () => void;
  onBack: () => void;
}

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const VerifyResetForm = ({ resetEmail, onSuccess, onBack }: VerifyResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleCompletePasswordReset = async (values: PasswordFormValues) => {
    setIsLoading(true);
    console.info("Attempting to update password");

    try {
      // Extract tokens from URL parameters
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      
      if (accessToken) {
        console.info("Found access token, setting session");
        
        // If we have an access token from the URL, set the session
        if (refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (sessionError) {
            console.error("Error setting session:", sessionError);
            throw sessionError;
          }
        }
        
        // Now update the password
        const { error: pwError } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (pwError) {
          console.error("Error updating password after setting session:", pwError);
          throw pwError;
        }
        
        console.info("Password updated successfully with token from URL");
      } else {
        // No tokens in URL, try to use existing session (user must be logged in)
        console.info("No tokens in URL, attempting to update with existing session");
        
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (error) {
          console.error("Error updating password with existing session:", error);
          throw error;
        }
      }

      toast.success("Password has been reset successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to reset password. Please try again or request a new reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Updating your password..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Set New Password</h2>
        <p className="text-sm text-gray-500">
          Please enter a new secure password for your account
          {resetEmail && <span className="font-medium"> ({resetEmail})</span>}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCompletePasswordReset)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              type="submit"
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VerifyResetForm;
