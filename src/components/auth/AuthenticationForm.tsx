
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { LogIn, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define a schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AuthenticationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Set up the form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Direct email signin implementation
  const handleSignInWithEmail = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      if (!signIn) {
        toast.error("Authentication service not available");
        setIsLoading(false);
        return;
      }
      
      // Attempt to sign in with provided credentials
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful");
        navigate(from);
      } else {
        console.error("Incomplete login status:", result);
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error?.errors?.[0]?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignInWithEmail)} className="space-y-4">
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
                    placeholder="••••••••"
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
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuthenticationForm;
