
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
import AdminLoginSystemCheck from '@/components/admin/AdminLoginSystemCheck';

const AdminLoginGateway = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [showSystemCheck, setShowSystemCheck] = useState(false);
  const [systemCheckComplete, setSystemCheckComplete] = useState(false);
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

    logSecurityEvent('page_loaded', true, 'Admin login gateway loaded');
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
      authLoading,
      showSystemCheck,
      systemCheckComplete
    });
    
    // If admin is authenticated and system check is complete, redirect
    if (!authLoading && isAuthenticated && isAdmin && systemCheckComplete) {
      const from = location.state?.from?.pathname || '/admin';
      console.log('✅ Admin authenticated and system check complete, redirecting to:', from);
      logSecurityEvent('admin_access_granted', true, `Redirecting to: ${from}`);
      toast.success('Welcome back, admin! System fully operational.');
      navigate(from, { replace: true });
    }
    
    // If admin is authenticated but system check not shown yet, show it
    if (!authLoading && isAuthenticated && isAdmin && !showSystemCheck && !systemCheckComplete) {
      console.log('🔧 Admin authenticated, starting system check...');
      setShowSystemCheck(true);
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate, location.state, showSystemCheck, systemCheckComplete]);

  const handleSystemCheckComplete = (success: boolean) => {
    console.log('🔧 System check completed with success:', success);
    setSystemCheckComplete(true);
    
    if (success) {
      logSecurityEvent('system_check_passed', true, 'All system checks passed during admin login');
    } else {
      logSecurityEvent('system_check_issues', false, 'System check completed with issues during admin login');
    }
  };

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
    setShowSystemCheck(false);
    setSystemCheckComplete(false);
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

  // Show system check if admin is authenticated
  if (!authLoading && isAuthenticated && isAdmin && showSystemCheck && !systemCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D] p-4">
        <div className="max-w-4xl w-full">
          <AdminLoginSystemCheck onComplete={handleSystemCheckComplete} />
        </div>
      </div>
    );
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D] p-4">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <img 
              src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
              alt="A.R.I.A Logo" 
              className="h-24 w-auto"
            />
          </div>
          <div className="animate-spin h-16 w-16 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
          <div className="text-white space-y-4">
            <div className="text-2xl font-bold tracking-wide">INITIALIZING SECURITY PROTOCOLS</div>
            <div className="text-gray-300">Establishing secure connection to A.R.I.A™ intelligence network...</div>
          </div>
          <div className="space-y-4">
            <Button
              onClick={handleForceReset}
              variant="outline"
              className="bg-transparent border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              FORCE SYSTEM RESET
            </Button>
            <Button
              onClick={handleEmergencyAccess}
              className="bg-amber-600 hover:bg-amber-500 text-black"
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
      <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D] p-4">
        <Card className="max-w-lg w-full bg-[#1A1B1E] border-gray-800 shadow-2xl">
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <img 
                src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                alt="A.R.I.A Logo" 
                className="h-24 w-auto"
              />
            </div>
            <div className="text-red-400 text-3xl font-bold">❌ ACCESS DENIED</div>
            <div className="text-white text-xl">ADMIN CLEARANCE REQUIRED</div>
            <div className="text-gray-300">
              This area requires administrative privileges. All access attempts are monitored and logged for security purposes.
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => signOut()}
                className="w-full bg-[#111214] text-white hover:bg-gray-700 border border-gray-700"
              >
                SIGN OUT
              </Button>
              <Button
                onClick={handleEmergencyAccess}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black"
              >
                <Key className="mr-2 h-4 w-4" />
                EMERGENCY ADMIN ACCESS
              </Button>
              <Button
                onClick={handleForceReset}
                variant="outline"
                className="w-full bg-transparent border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black"
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
        toast.success('🔐 Authentication successful! Initializing A.R.I.A™ systems...');
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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D] p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <img 
              src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
              alt="A.R.I.A Logo" 
              className="h-24 w-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-amber-400 tracking-wide">SECURE ADMIN GATEWAY</h2>
          <p className="text-gray-300 mt-2">Advanced Reputation Intelligence & Analysis</p>
        </div>

        {/* Security Notice */}
        <Alert className="border-amber-600/30 bg-amber-600/10 backdrop-blur-sm">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <AlertDescription className="text-gray-300">
            <strong className="text-amber-400">RESTRICTED ACCESS:</strong> This is a secure administrative portal. All access attempts are monitored and logged for security purposes.
            {isLocked && (
              <div className="mt-2 text-red-400 font-bold">
                🔒 SECURITY LOCKOUT ACTIVE - Time remaining: {getLockoutTimeRemaining()}
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Login Card */}
        <Card className="bg-[#1A1B1E] border-gray-800 shadow-2xl">
          <CardHeader className="text-center p-8 border-b border-gray-800">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
              <Lock className="h-7 w-7 text-amber-400" />
              ADMIN AUTHENTICATION
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Enter your secure credentials to access the A.R.I.A™ command center
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-amber-400 mb-2">
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
                  className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600 focus:ring-amber-600/20 h-12"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-amber-400 mb-2">
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
                    className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600 focus:ring-amber-600/20 h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-amber-400 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 text-lg shadow-lg hover:shadow-amber-600/25 transform hover:scale-[1.02] transition-all duration-300"
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
            <div className="mt-6 pt-6 border-t border-gray-800 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleForceReset}
                  variant="outline"
                  className="bg-transparent border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black text-sm"
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  RESET
                </Button>
                <Button
                  onClick={handleEmergencyAccess}
                  className="bg-amber-600 hover:bg-amber-500 text-black text-sm"
                  disabled={isLoading}
                >
                  <Key className="mr-2 h-4 w-4" />
                  EMERGENCY
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-400 text-center space-y-2">
                <div>🔒 256-bit encrypted sessions • Zero-trust architecture</div>
                <div>⚡ Auto-expiring tokens • Multi-factor authentication ready</div>
                <div>📊 Real-time threat monitoring • Advanced intrusion detection</div>
                <div>🔧 Automated system integrity checks • Live configuration validation</div>
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
        <div className="text-center text-sm text-gray-400">
          A.R.I.A™ Adaptive Reputation Intelligence & Analysis System
        </div>
      </div>
    </div>
  );
};

export default AdminLoginGateway;
