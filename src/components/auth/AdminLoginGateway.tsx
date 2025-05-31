
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminLoginGatewayProps {
  onComplete: (success: boolean) => void;
}

const AdminLoginGateway = ({ onComplete }: AdminLoginGatewayProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'checking' | 'operational' | 'degraded'>('checking');

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check if we can connect to the database using existing tables
      const { data, error } = await supabase
        .from('activity_logs')
        .select('id')
        .limit(1);

      if (!error) {
        setSystemStatus('operational');
      } else {
        setSystemStatus('degraded');
      }
    } catch (error) {
      console.error('System status check failed:', error);
      setSystemStatus('degraded');
    }
  };

  const logAdminAction = async (action: string, details: string) => {
    try {
      await supabase.from('activity_logs').insert({
        action,
        details,
        entity_type: 'admin_login',
        user_email: email
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result?.error) {
        await logAdminAction('login_failed', `Failed login attempt for ${email}: ${result.error.message}`);
        toast.error('Login failed: ' + result.error.message);
        onComplete(false);
        return;
      }

      if (result?.user) {
        await logAdminAction('login_success', `Successful admin login for ${email}`);
        toast.success('Admin access granted');
        onComplete(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      await logAdminAction('login_error', `Login error for ${email}: ${error.message}`);
      toast.error('Login failed');
      onComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">A.R.I.A™ Admin</CardTitle>
            <p className="text-slate-400 mt-2">Secure Administrative Access</p>
          </div>
          
          {/* System Status */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              systemStatus === 'operational' ? 'bg-green-500' :
              systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span className="text-sm text-slate-400">
              System {systemStatus === 'operational' ? 'Operational' : 
                     systemStatus === 'degraded' ? 'Degraded' : 'Checking...'}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
            >
              {isLoading ? 'Authenticating...' : 'Access A.R.I.A™ Systems'}
            </Button>
          </form>

          {systemStatus === 'degraded' && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                System performance may be reduced
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginGateway;
