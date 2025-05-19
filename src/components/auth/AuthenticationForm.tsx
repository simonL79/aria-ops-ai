
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { LogIn, Mail, Lock, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordResetForm from "./PasswordResetForm";

// Define a schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define a schema for signup form validation with additional fields
const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthenticationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { signIn, setActive: setActiveSignIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: isSignUpLoaded } = useSignUp();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Set up the login form with validation
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Set up the signup form with validation
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  
  // Direct email signin implementation
  const handleSignInWithEmail = async (values: LoginFormValues) => {
    setIsLoading(true);
    console.log("Attempting to sign in with:", values.email);
    
    try {
      if (!signIn || !isSignInLoaded) {
        toast.error("Authentication service not available");
        console.error("SignIn not available:", { signIn, isSignInLoaded });
        setIsLoading(false);
        return;
      }
      
      // Attempt to sign in with provided credentials
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });
      
      console.log("Sign in result:", result);
      
      if (result.status === "complete") {
        await setActiveSignIn({ session: result.createdSessionId });
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

  // Sign up with email implementation
  const handleSignUpWithEmail = async (values: SignupFormValues) => {
    setIsLoading(true);
    console.log("Attempting to sign up with:", values.email);
    
    try {
      if (!signUp || !isSignUpLoaded) {
        toast.error("Authentication service not available");
        console.error("SignUp not available:", { signUp, isSignUpLoaded });
        setIsLoading(false);
        return;
      }
      
      // Attempt to sign up with provided credentials
      const result = await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      
      console.log("Sign up result:", result);
      
      if (result.status === "complete") {
        await setActiveSignUp({ session: result.createdSessionId });
        toast.success("Registration successful");
        navigate(from);
      } else {
        // Handle verification step if needed
        toast.info("Please check your email to complete registration");
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error?.errors?.[0]?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return <PasswordResetForm onBack={() => setShowResetForm(false)} />;
  }

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="signin" className="flex gap-2 items-center">
          <LogIn className="h-4 w-4" />
          Sign In
        </TabsTrigger>
        <TabsTrigger value="signup" className="flex gap-2 items-center">
          <UserPlus className="h-4 w-4" />
          Sign Up
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleSignInWithEmail)} className="space-y-4">
            <FormField
              control={loginForm.control}
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
              control={loginForm.control}
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
            
            <div className="text-right">
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="px-0" 
                onClick={() => setShowResetForm(true)}
              >
                Forgot your password?
              </Button>
            </div>
            
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
      </TabsContent>
      
      <TabsContent value="signup">
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(handleSignUpWithEmail)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={signupForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="John" 
                          className="pl-10"
                          autoComplete="given-name"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Doe" 
                          autoComplete="family-name"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={signupForm.control}
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
              control={signupForm.control}
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
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </span>
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default AuthenticationForm;
