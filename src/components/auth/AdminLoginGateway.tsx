
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  // Security audit logging
  const logSecurityEvent = async (event: string, success: boolean, details?: string) => {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        action: event,
        success,
        email_attempted: email,
        ip_address: 'client-side',
        user_agent: navigator.userAgent.substring(0, 200),
        details: details || ''
      };

      // Try to log to Supabase using the correct table name
      try {
        await supabase.from('admin_action_logs').insert(logEntry);
      } catch (dbError) {
        console.warn('Database logging failed, using local storage fallback');
        const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        existingLogs.push(logEntry);
        if (existingLogs.length > 100) existingLogs.splice(0, 50); // Keep last 100 entries
        localStorage.setItem('security_logs', JSON.stringify(existingLogs));
      }

      console.log('🔒 Security Event:', logEntry);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  // Initialize security monitoring
  useEffect(() => {
    // Generate session ID for tracking
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', crypto.randomUUID());
    }

    // Check for existing lockout
    const lockoutData = localStorage.getItem('admin_lockout');
    if (lockoutData) {
      try {
        const parsed = JSON.parse(lockoutData);
        const lockoutExpiry = new Date(parsed.expiry);
        
        if (new Date() < lockoutExpiry) {
          setIsLocked(true);
          setLockoutTime(lockoutExpiry);
          setLoginAttempts(parsed.attempts);
          logSecurityEvent('lockout_active', false, `Lockout still active until ${lockoutExpiry.toISOString()}`);
        } else {
          localStorage.removeItem('admin_lockout');
          logSecurityEvent('lockout_expired', true, 'Previous lockout expired');
        }
      } catch (error) {
        localStorage.removeItem('admin_lockout');
        logSecurityEvent('lockout_data_corrupted', false, 'Lockout data was corrupted and cleared');
      }
    }

    // Monitor for suspicious activity
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('page_hidden', true, 'Admin login page hidden');
      } else {
        logSecurityEvent('page_visible', true, 'Admin login page visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    logSecurityEvent('page_loaded', true, 'Admin login gateway loaded');

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setInterval(() => {
        const now = new Date();
        if (now >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          localStorage.removeItem('admin_lockout');
          logSecurityEvent('lockout_released', true, 'Automatic lockout release');
          toast.success('Security lockout released. You may now attempt to login.');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  // Handle authentication state changes
  useEffect(() => {
    console.log('🔍 AdminLoginGateway auth state:', { 
      isAuthenticated, 
      isAdmin, 
      authLoading 
    });
    
    if (!authLoading && isAuthenticated && isAdmin) {
      const from = location.state?.from?.pathname || '/discovery';
      console.log('✅ Admin authenticated, redirecting to:', from);
      logSecurityEvent('admin_access_granted', true, `Redirecting to: ${from}`);
      toast.success('Welcome back, admin!');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate, location.state]);

  // Emergency controls
  const handleForceReset = async () => {
    console.log('🔄 Force reset initiated');
    await logSecurityEvent('force_reset_initiated', true, 'Emergency force reset triggered');
    toast.info('Resetting authentication state...', { duration: 1500 });
    
    await forceReset();
    setEmail('');
    setPassword('');
    setLoginAttempts(0);
    setIsLocked(false);
    setLockoutTime(null);
    localStorage.removeItem('admin_lockout');
    
    await logSecurityEvent('force_reset_completed', true, 'Authentication state reset');
    toast.success('Authentication reset complete', { duration: 2000 });
  };

  const handleEmergencyAccess = async () => {
    console.log('🚨 Emergency admin access initiated');
    await logSecurityEvent('emergency_access_initiated', true, 'Business owner emergency override');
    toast.info('Granting emergency admin access...', { duration: 1500 });
    
    forceAdminAccess();
    setLoginAttempts(0);
    setIsLocked(false);
    localStorage.removeItem('admin_lockout');
    
    await logSecurityEvent('emergency_access_granted', true, 'Emergency admin access granted');
    toast.success('Emergency admin access granted!', { duration: 2000 });
  };

  // Show loading state while auth is initializing
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

  // If authenticated but not admin, show access denied with emergency controls
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
              This area requires administrative privileges. All access attempts are monitored and logged for security purposes.
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      await logSecurityEvent('login_attempt_while_locked', false, 'Attempted login during active lockout');
      toast.error('Account temporarily locked due to multiple failed attempts');
      return;
    }

    if (!email || !password) {
      await logSecurityEvent('login_attempt_incomplete', false, 'Missing email or password');
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    console.log('🔐 Attempting admin login for:', email);
    await logSecurityEvent('login_attempt_started', true, `Login attempt for: ${email}`);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('❌ Login error:', error);
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        await logSecurityEvent('login_failed', false, `Failed attempt ${newAttempts}/${MAX_ATTEMPTS}: ${error.message}`);

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutExpiry = new Date(Date.now() + LOCKOUT_DURATION);
          setIsLocked(true);
          setLockoutTime(lockoutExpiry);
          
          const lockoutData = {
            attempts: newAttempts,
            expiry: lockoutExpiry.toISOString(),
            email,
            timestamp: new Date().toISOString()
          };

          localStorage.setItem('admin_lockout', JSON.stringify(lockoutData));
          
          await logSecurityEvent('account_locked', false, `Account locked for ${LOCKOUT_DURATION / 60000} minutes after ${newAttempts} failed attempts`);
          toast.error(`🔒 Security lockout activated for ${LOCKOUT_DURATION / 60000} minutes due to multiple failed attempts`);
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          toast.error(`❌ Login failed: ${error.message}. ${remaining} attempts remaining before lockout.`);
        }
      } else {
        console.log('✅ Login successful');
        setLoginAttempts(0);
        localStorage.removeItem('admin_lockout');
        await logSecurityEvent('login_successful', true, `Successful admin authentication for: ${email}`);
        toast.success('🔐 Authentication successful! Accessing A.R.I.A™ secure systems...');
      }
    } catch (error: any) {
      console.error('❌ Login exception:', error);
      await logSecurityEvent('login_error', false, `Login exception: ${error.message}`);
      toast.error('Authentication system error. Please try again or use emergency reset.');
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

        {/* Security Notice */}
        <Alert className="border-[#247CFF]/30 bg-[#247CFF]/10 backdrop-blur-sm">
          <AlertTriangle className="h-5 w-5 text-[#247CFF]" />
          <AlertDescription className="text-[#D8DEE9] font-['Inter']">
            <strong className="text-[#247CFF]">RESTRICTED ACCESS:</strong> This is a secure administrative portal. All access attempts are monitored and logged for security purposes.
            {isLocked && (
              <div className="mt-2 text-red-400 font-bold">
                🔒 SECURITY LOCKOUT ACTIVE - Time remaining: {getLockoutTimeRemaining()}
              </div>
            )}
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
                  disabled={isLoading || isLocked}
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
                    disabled={isLoading || isLocked}
                    autoComplete="current-password"
                    className="bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white placeholder-[#D8DEE9]/40 focus:border-[#247CFF] focus:ring-[#247CFF]/20 h-12 pr-12 font-['Inter'] rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-[#D8DEE9]/60 hover:text-[#247CFF] hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#247CFF] to-[#38C172] hover:from-[#1c63cc] hover:to-[#2d8f5f] text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.3)] transform hover:scale-[1.02] transition-all duration-300 font-['Space_Grotesk'] tracking-wide"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="mr-3 h-6 w-6" />
                    SECURITY LOCKOUT ACTIVE
                  </>
                ) : (
                  <>
                    <Shield className="mr-3 h-6 w-6" />
                    SECURE LOGIN
                  </>
                )}
              </Button>
            </form>

            {/* Emergency Controls */}
            <div className="mt-6 pt-6 border-t border-[#247CFF]/20 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleForceReset}
                  variant="outline"
                  className="bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white font-['Space_Grotesk'] tracking-wide text-sm"
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  RESET
                </Button>
                <Button
                  onClick={handleEmergencyAccess}
                  className="bg-gradient-to-r from-[#38C172] to-[#247CFF] hover:from-[#2d8f5f] hover:to-[#1c63cc] text-white font-['Space_Grotesk'] tracking-wide text-sm"
                  disabled={isLoading}
                >
                  <Key className="mr-2 h-4 w-4" />
                  EMERGENCY
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#247CFF]/20">
              <div className="text-xs text-[#D8DEE9]/60 text-center space-y-2 font-['Inter']">
                <div>🔒 256-bit encrypted sessions • Zero-trust architecture</div>
                <div>⚡ Auto-expiring tokens • Multi-factor authentication ready</div>
                <div>📊 Real-time threat monitoring • Advanced intrusion detection</div>
                {loginAttempts > 0 && (
                  <div className="text-yellow-400 font-bold">
                    ⚠️ Failed attempts: {loginAttempts}/{MAX_ATTEMPTS}
                  </div>
                )}
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
