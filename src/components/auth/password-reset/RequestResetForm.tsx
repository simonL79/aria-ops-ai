
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

interface RequestResetFormProps {
  onSuccess: (email: string) => void;
  onBack: () => void;
}

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const RequestResetForm = ({ onSuccess, onBack }: RequestResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendResetLink = async (values: EmailFormValues) => {
    setIsLoading(true);
    console.info("Attempting to send password reset email to:", values.email);

    try {
      const redirectURL = `${window.location.origin}/auth?type=recovery`;
      console.info("Using redirect URL for password reset:", redirectURL);
      
      // Use password reset instead of OTP since OTP is disabled
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: redirectURL
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      toast.success("Password reset email sent successfully! Check your inbox to continue.");
      onSuccess(values.email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Sending password reset email..." />;
  }

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-green-50 text-green-700 p-4 rounded-lg">
          <h3 className="font-semibold">Email Sent!</h3>
          <p className="text-sm">Please check your inbox for instructions to reset your password.</p>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Reset Your Password</h2>
        <p className="text-sm text-gray-500">
          Enter your email address and we'll send you a password reset link.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSendResetLink)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
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
              <Send className="h-4 w-4" />
              Send Reset Link
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RequestResetForm;
