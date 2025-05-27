
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Eye, EyeOff, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AdminLoginGateway = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const { isAuthenticated, isAdmin, signIn, signOut, isLoading: authLoading, forceReset } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Handle force reset with immediate feedback
  const handleForceReset = async () => {
    toast.info('Resetting authentication...', { duration: 1000 });
    await forceReset();
    setEmail('');
    setPassword('');
    setLoginAttempts(0);
    setIsLocked(false);
    setLockoutTime(null);
    toast.success('Authentication reset complete', { duration: 2000 });
  };

  // Check for existing lockout
  useEffect(() => {
    const lockout = localStorage.getItem('admin_lockout');
    if (lockout) {
      try {
        const lockoutData = JSON.parse(lockout);
        const lockoutExpiry = new Date(lockoutData.expiry);
        
        if (new Date() < lockoutExpiry) {
          setIsLocked(true);
          setLockoutTime(lockoutExpiry);
          setLoginAttempts(lockoutData.attempts);
        } else {
          localStorage.removeItem('admin_lockout');
        }
      } catch (error) {
        localStorage.removeItem('admin_lockout');
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setInterval(() => {
        if (new Date() >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          localStorage.removeItem('admin_lockout');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  // Handle authentication redirect - simplified logic
  useEffect(() => {
    console.log('🔍 AdminLoginGateway auth state:', { 
      isAuthenticated, 
      isAdmin, 
      authLoading 
    });
    
    // Only redirect if we're sure about the auth state
    if (!authLoading && isAuthenticated && isAdmin) {
      const from = location.state?.from?.pathname || '/discovery';
      console.log('✅ Admin authenticated, redirecting to:', from);
      toast.success('Welcome back, admin!');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate, location.state]);

  // Show simple loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center space-y-6">
          <div className="animate-spin h-16 w-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
          <div className="text-white space-y-2">
            <div className="text-xl font-semibold">Initializing A.R.I.A™</div>
            <div className="text-gray-400">Loading authentication system...</div>
          </div>
          <Button
            onClick={handleForceReset}
            variant="outline"
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Force Reset
          </Button>
        </div>
      </div>
    );
  }

  // If authenticated but not admin, show clear error
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center space-y-6">
          <div className="text-red-400 text-2xl font-semibold">❌ Access Denied</div>
          <div className="text-gray-300 text-lg">Admin privileges required for this area</div>
          <div className="space-x-4">
            <Button 
              onClick={() => signOut()}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Sign Out
            </Button>
            <Button
              onClick={handleForceReset}
              variant="outline"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Auth
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Audit log function
  const logAdminAction = async (action: string, success: boolean, details?: string) => {
    try {
      await supabase.from('admin_action_logs').insert({
        action,
        success,
        details,
        ip_address: 'client-side',
        user_agent: navigator.userAgent,
        email_attempted: email
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error('Account temporarily locked due to multiple failed attempts');
      return;
    }

    setIsLoading(true);

    try {
      if (!email.includes('@') || email.length < 5) {
        throw new Error('Invalid email format');
      }

      const { error } = await signIn(email, password);

      if (error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        await logAdminAction('admin_login_failed', false, `Failed attempt ${newAttempts}: ${error.message}`);

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutExpiry = new Date(Date.now() + LOCKOUT_DURATION);
          setIsLocked(true);
          setLockoutTime(lockoutExpiry);
          
          localStorage.setItem('admin_lockout', JSON.stringify({
            attempts: newAttempts,
            expiry: lockoutExpiry.toISOString()
          }));

          toast.error(`Account locked for ${LOCKOUT_DURATION / 60000} minutes`);
        } else {
          toast.error(`Login failed. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        }
      } else {
        setLoginAttempts(0);
        localStorage.removeItem('admin_lockout');
        await logAdminAction('admin_login_success', true, 'Successful admin login');
        toast.success('Login successful! Checking admin status...');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      await logAdminAction('admin_login_error', false, error.message);
      toast.error('Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getLockoutTimeRemaining = () => {
    if (!lockoutTime) return '';
    const remaining = Math.ceil((lockoutTime.getTime() - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">A.R.I.A™</h1>
          </div>
          <p className="text-gray-300">Secure Admin Access Gateway</p>
        </div>

        {/* Emergency Reset Button */}
        <div className="text-center">
          <Button
            onClick={handleForceReset}
            variant="outline"
            className="text-gray-300 border-gray-600 hover:bg-gray-700 bg-red-900/20 border-red-600"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Emergency Reset
          </Button>
          <p className="text-xs text-gray-500 mt-2">Click if stuck on verification</p>
        </div>

        {/* Security Notice */}
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Restricted Access:</strong> This is a secure admin portal. All login attempts are monitored and logged.
          </AlertDescription>
        </Alert>

        {/* Login Card */}
        <Card className="border-gray-700 bg-gray-800 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Admin Authentication
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your secure credentials to access the A.R.I.A™ command center
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLocked ? (
              <div className="text-center space-y-4">
                <div className="text-red-400 font-semibold">
                  Account Temporarily Locked
                </div>
                <div className="text-gray-300">
                  Time remaining: {getLockoutTimeRemaining()}
                </div>
                <div className="text-sm text-gray-400">
                  Too many failed login attempts. Please wait before trying again.
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Admin Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@aria.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Secure Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {loginAttempts > 0 && (
                  <Alert className="border-red-500 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. 
                      {MAX_ATTEMPTS - loginAttempts} remaining before lockout.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Secure Login
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-400 text-center space-y-1">
                <div>🔒 All sessions are encrypted and monitored</div>
                <div>⚡ Sessions auto-expire for security</div>
                <div>📊 Access attempts are logged and audited</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          A.R.I.A™ AI Reputation Intelligence Agent
        </div>
      </div>
    </div>
  );
};

export default AdminLoginGateway;
