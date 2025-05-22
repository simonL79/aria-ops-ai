
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Define a schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  // Set up the login form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Handle password reset request
  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email address to reset your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent to your email", {
        description: "Please check your inbox and follow the instructions",
      });
      
      setIsResetMode(false);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset link", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Email signin implementation
  const handleSignIn = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await signIn(values.email, values.password);
      
      if (success) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error("Login failed", {
        description: error.message || "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetMode) {
    // Show password reset form
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reset your password</h3>
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePasswordReset(form.getValues("email"));
          }} className="space-y-4">
            <FormField
              control={form.control}
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
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1" 
                onClick={() => setIsResetMode(false)}
                disabled={isLoading}
              >
                Back to Login
              </Button>
              
              <Button 
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Regular login form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
        <FormField
          control={form.control}
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
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    autoComplete="current-password"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-right">
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            className="px-0" 
            onClick={() => setIsResetMode(true)}
          >
            Forgot your password?
          </Button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-lg font-semibold"
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
