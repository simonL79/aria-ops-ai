
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "./LoadingSpinner";

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
      // Use Supabase to send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        console.error("Error sending reset email:", error);
        toast.error("Failed to send reset email", {
          description: error.message
        });
      } else {
        toast.success("Password reset email sent successfully");
        onSuccess(values.email);
      }
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email", {
        description: error?.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Reset Your Password</h2>
      <p className="text-sm text-gray-500 text-center">
        Enter your email address and we'll send you a link to reset your password.
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
              <LoadingSpinner text="Sending Reset Email..." />
            ) : (
              <span>Send Reset Email</span>
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
