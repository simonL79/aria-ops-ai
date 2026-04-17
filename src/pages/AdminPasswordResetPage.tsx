
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { validatePassword } from "@/utils/passwordStrength";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";

const AdminPasswordResetPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verify user is authenticated and is the admin
  useEffect(() => {
    const checkAdminAuth = async () => {
      setIsCheckingAuth(true);
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast.error("Authentication required", { 
          description: "You must be logged in to reset your password"
        });
        navigate("/auth", { replace: true });
        return;
      } 
      
      // Check admin via server-side RPC
      const { data: isAdminUser, error } = await (supabase.rpc as any)('is_current_user_admin');
      if (error || !isAdminUser) {
        toast.error("Not authorized", {
          description: "Only admin users can access this page"
        });
        navigate("/", { replace: true });
        return;
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAdminAuth();
  }, [navigate]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    
    // Validate password strength (client-side HIBP fallback)
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setMessage(validation.errors[0]);
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error("Password reset error:", error);
        setMessage(`Reset failed: ${error.message}`);
        toast.error("Password reset failed", {
          description: error.message
        });
      } else {
        setMessage("Password updated successfully!");
        toast.success("Password updated", {
          description: "Your password has been reset successfully"
        });
        
        // Redirect to admin dashboard after successful reset
        setTimeout(() => {
          navigate("/blog/admin");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Helmet>
        <title>Admin Password Reset - A.R.I.A™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Reset Admin Password</CardTitle>
            <CardDescription>
              Please enter your new secure password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <PasswordStrengthMeter password={password} className="mt-2" />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded ${message.includes("successfully") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  {message}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                variant="action"
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default AdminPasswordResetPage;
