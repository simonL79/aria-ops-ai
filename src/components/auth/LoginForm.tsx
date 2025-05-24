
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email address to reset your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Sending password reset to:", email);
      console.log("Redirect URL:", `${window.location.origin}/auth?type=recovery`);
      
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      console.log("Password reset response:", { error, data });
      
      if (error) throw error;
      
      setResetSent(true);
      toast.success("Password reset link sent to your email", {
        description: "Please check your inbox (and spam folder) and follow the instructions",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset link", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email address to send magic link");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Sending magic link to:", email);
      console.log("Redirect URL:", `${window.location.origin}/dashboard`);
      
      const { error, data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      console.log("Magic link response:", { error, data });
      
      if (error) throw error;
      
      setMagicLinkSent(true);
      toast.success("Magic link sent to your email", {
        description: "Please check your inbox (and spam folder) to sign in",
      });
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast.error("Failed to send magic link", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignIn = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting sign in with:", values.email);
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast.error("Login failed", {
          description: error.message || "Please check your credentials",
        });
      } else {
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

  if (isMagicLinkMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sign in with Magic Link</h3>
        
        {magicLinkSent ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-800">
            <p className="mb-2 font-medium">Magic link sent!</p>
            <p className="text-sm mb-3">Please check your email inbox (and spam folder) for the magic link to sign in.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsMagicLinkMode(false);
                setMagicLinkSent(false);
              }}
            >
              Back to login
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleMagicLink(form.getValues("email"));
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
                  onClick={() => setIsMagicLinkMode(false)}
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
                  ) : "Send Magic Link"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    );
  }

  if (isResetMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reset your password</h3>
        
        {resetSent ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-800">
            <p className="mb-2 font-medium">Reset link sent!</p>
            <p className="text-sm mb-3">Please check your email inbox (and spam folder) for the password reset link.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsResetMode(false);
                setResetSent(false);
              }}
            >
              Back to login
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    );
  }

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
        
        <div className="flex justify-between text-sm">
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            className="px-0" 
            onClick={() => setIsResetMode(true)}
          >
            Forgot your password?
          </Button>
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            className="px-0" 
            onClick={() => setIsMagicLinkMode(true)}
          >
            Use Magic Link
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

        <Button 
          type="button" 
          variant="outline"
          className="w-full"
          onClick={() => setIsMagicLinkMode(true)}
          disabled={isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Sign In with Magic Link
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
