
import { useState } from "react";
import { useLocation } from "react-router-dom";
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

interface LoginFormProps {
  defaultSignUp?: boolean;
}

const LoginForm = ({ defaultSignUp = false }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(defaultSignUp);
  const [resetSent, setResetSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const location = useLocation();
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/admin";
  const { signIn } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: LoginFormValues) => {
    if (values.password.length < 6) {
      toast.error("Password too short", {
        description: "Please use at least 6 characters.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname}${window.location.search}`,
        },
      });
      if (error) {
        if (error.message?.toLowerCase().includes("already")) {
          toast.error("Account already exists", {
            description: "Please sign in instead.",
          });
          setIsSignUpMode(false);
        } else {
          toast.error("Could not create account", {
            description: error.message || "Please try again.",
          });
        }
        return;
      }
      // If email confirmation is disabled, the session is active immediately.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        toast.success("Account created!");
        // Redirect handled by Authentication.tsx via isAuthenticated.
      } else {
        toast.success("Check your email to confirm your account", {
          description: "We've sent you a confirmation link to finish signing up.",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error("Could not create account", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
      const magicRedirect = `${window.location.origin}${fromPath}`;
      console.log("Sending magic link to:", email);
      console.log("Redirect URL:", magicRedirect);

      const { error, data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: magicRedirect,
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
        // Redirect handled by Authentication.tsx via isAuthenticated + location.state.from
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
      <form onSubmit={form.handleSubmit(isSignUpMode ? handleSignUp : handleSignIn)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder={isSignUpMode ? "Create a password (min. 6 characters)" : "Enter your password"}
                    className="pl-10"
                    autoComplete={isSignUpMode ? "new-password" : "current-password"}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isSignUpMode && (
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
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors text-lg font-semibold"
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isSignUpMode ? "Creating account..." : "Signing in..."}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <LogIn className="mr-2 h-5 w-5" />
              {isSignUpMode ? "Create account & continue" : "Sign In"}
            </span>
          )}
        </Button>

        {!isSignUpMode && (
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
        )}

        <div className="text-center text-sm text-muted-foreground pt-2">
          {isSignUpMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-1"
            onClick={() => setIsSignUpMode((v) => !v)}
            disabled={isLoading}
          >
            {isSignUpMode ? "Sign in" : "Create one"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
