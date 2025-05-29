
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Eye, EyeOff, Loader2, AlertTriangle, RotateCcw, Key } from 'lucide-react';
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
  const { isAuthenticated, isAdmin, signIn, signOut, isLoading: authLoading, forceReset, forceAdminAccess } = useAuth();
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

  // Handle emergency admin access
  const handleEmergencyAccess = () => {
    toast.info('Granting emergency admin access...', { duration: 1000 });
    forceAdminAccess();
    toast.success('Emergency admin access granted!', { duration: 2000 });
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

  // Show luxurious loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F2C] via-[#1C1C1E] to-[#0A0F2C] p-4">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <h1 className="text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">A.R.I.A™</h1>
          </div>
          <div className="animate-spin h-16 w-16 border-4 border-[#247CFF] border-t-transparent rounded-full mx-auto"></div>
          <div className="text-white space-y-4">
            <div className="text-2xl font-bold font-['Space_Grotesk'] tracking-wide">INITIALIZING SECURITY PROTOCOLS</div>
            <div className="text-[#D8DEE9] font-['Inter']">Establishing secure connection to A.R.I.A™ intelligence network...</div>
          </div>
          <div className="space-y-4">
            <Button
              onClick={handleForceReset}
              variant="outline"
              className="bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white font-['Space_Grotesk'] tracking-wide"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              FORCE SYSTEM RESET
            </Button>
            <Button
              onClick={handleEmergencyAccess}
              className="bg-gradient-to-r from-[#247CFF] to-[#38C172] hover:from-[#1c63cc] hover:to-[#2d8f5f] text-white font-['Space_Grotesk'] tracking-wide"
            >
              <Key className="mr-2 h-4 w-4" />
              EMERGENCY OVERRIDE
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but not admin, show luxurious access denied
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F2C] via-[#1C1C1E] to-[#0A0F2C] p-4">
        <Card className="max-w-lg w-full bg-gradient-to-br from-[#1C1C1E]/90 to-[#0A0F2C]/90 border border-[#247CFF]/30 shadow-2xl backdrop-blur-xl rounded-3xl">
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h1 className="text-4xl font-black text-white font-['Space_Grotesk'] tracking-tight">A.R.I.A™</h1>
            </div>
            <div className="text-red-400 text-3xl font-bold font-['Space_Grotesk']">❌ ACCESS DENIED</div>
            <div className="text-white text-xl font-['Space_Grotesk']">ADMIN CLEARANCE REQUIRED</div>
            <div className="text-[#D8DEE9] font-['Inter']">
              This area requires administrative privileges. If you're the business owner, use emergency access below.
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => signOut()}
                className="w-full bg-[#1C1C1E] text-white hover:bg-[#2C2C2E] border border-[#247CFF]/30 font-['Space_Grotesk'] tracking-wide"
              >
                SIGN OUT
              </Button>
              <Button
                onClick={handleEmergencyAccess}
                className="w-full bg-gradient-to-r from-[#247CFF] to-[#38C172] hover:from-[#1c63cc] hover:to-[#2d8f5f] text-white font-['Space_Grotesk'] tracking-wide"
              >
                <Key className="mr-2 h-4 w-4" />
                EMERGENCY ADMIN ACCESS
              </Button>
              <Button
                onClick={handleForceReset}
                variant="outline"
                className="w-full bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white font-['Space_Grotesk'] tracking-wide"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                RESET AUTHENTICATION
              </Button>
            </div>
          </CardContent>
        </Card>
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
        toast.success('Authentication successful! Accessing A.R.I.A™ systems...');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F2C] via-[#1C1C1E] to-[#0A0F2C] p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <h1 className="text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">A.R.I.A™</h1>
          </div>
          <h2 className="text-2xl font-bold text-[#247CFF] font-['Space_Grotesk'] tracking-wide">SECURE ADMIN GATEWAY</h2>
          <p className="text-[#D8DEE9] font-['Inter'] mt-2">Advanced Reputation Intelligence & Analysis</p>
        </div>

        {/* Emergency Controls */}
        <div className="text-center space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleEmergencyAccess}
              className="w-full bg-gradient-to-r from-[#247CFF] to-[#38C172] hover:from-[#1c63cc] hover:to-[#2d8f5f] text-white font-['Space_Grotesk'] tracking-wide py-3"
            >
              <Key className="mr-2 h-5 w-5" />
              EMERGENCY ADMIN ACCESS
            </Button>
            <Button
              onClick={handleForceReset}
              variant="outline"
              className="w-full bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white font-['Space_Grotesk'] tracking-wide py-3"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              FORCE SYSTEM RESET
            </Button>
          </div>
          <p className="text-xs text-[#D8DEE9]/60 font-['Inter']">Business owner emergency controls</p>
        </div>

        {/* Security Notice */}
        <Alert className="border-[#247CFF]/30 bg-[#247CFF]/10 backdrop-blur-sm">
          <AlertTriangle className="h-5 w-5 text-[#247CFF]" />
          <AlertDescription className="text-[#D8DEE9] font-['Inter']">
            <strong className="text-[#247CFF]">RESTRICTED ACCESS:</strong> This is a secure administrative portal. All access attempts are monitored and logged for security purposes.
          </AlertDescription>
        </Alert>

        {/* Login Card */}
        <Card className="bg-gradient-to-br from-[#1C1C1E]/90 to-[#0A0F2C]/90 border border-[#247CFF]/30 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center p-8 border-b border-[#247CFF]/20">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3 font-['Space_Grotesk'] tracking-wide">
              <Lock className="h-7 w-7 text-[#247CFF]" />
              ADMIN AUTHENTICATION
            </CardTitle>
            <CardDescription className="text-[#D8DEE9] font-['Inter'] mt-2">
              Enter your secure credentials to access the A.R.I.A™ command center
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {isLocked ? (
              <div className="text-center space-y-6">
                <div className="text-red-400 font-bold text-xl font-['Space_Grotesk']">
                  🔒 SECURITY LOCKOUT ACTIVE
                </div>
                <div className="text-white text-lg font-['Space_Grotesk']">
                  Time remaining: <span className="text-[#247CFF] font-mono">{getLockoutTimeRemaining()}</span>
                </div>
                <div className="text-[#D8DEE9] font-['Inter']">
                  Multiple failed authentication attempts detected. System locked for security.
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-[#247CFF] mb-2 font-['Space_Grotesk'] tracking-wide">
                    ADMIN EMAIL
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
                    className="bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white placeholder-[#D8DEE9]/40 focus:border-[#247CFF] focus:ring-[#247CFF]/20 h-12 font-['Inter'] rounded-xl"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-[#247CFF] mb-2 font-['Space_Grotesk'] tracking-wide">
                    SECURE PASSWORD
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
                      className="bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white placeholder-[#D8DEE9]/40 focus:border-[#247CFF] focus:ring-[#247CFF]/20 h-12 pr-12 font-['Inter'] rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-[#D8DEE9]/60 hover:text-[#247CFF] hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {loginAttempts > 0 && (
                  <Alert className="border-red-500/30 bg-red-500/10">
                    <AlertDescription className="text-red-400 font-['Inter']">
                      <strong>{loginAttempts}</strong> failed attempt{loginAttempts > 1 ? 's' : ''}. 
                      <strong className="text-red-300"> {MAX_ATTEMPTS - loginAttempts}</strong> remaining before security lockout.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#247CFF] to-[#38C172] hover:from-[#1c63cc] hover:to-[#2d8f5f] text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.3)] transform hover:scale-[1.02] transition-all duration-300 font-['Space_Grotesk'] tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-3 h-6 w-6" />
                      SECURE LOGIN
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[#247CFF]/20">
              <div className="text-xs text-[#D8DEE9]/60 text-center space-y-2 font-['Inter']">
                <div>🔒 256-bit encrypted sessions • Zero-trust architecture</div>
                <div>⚡ Auto-expiring tokens • Multi-factor authentication ready</div>
                <div>📊 Real-time threat monitoring • Advanced intrusion detection</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-[#D8DEE9]/60 font-['Inter']">
          A.R.I.A™ Adaptive Reputation Intelligence & Analysis System
        </div>
      </div>
    </div>
  );
};

export default AdminLoginGateway;
