
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Clock, LogOut, Shield } from 'lucide-react';

const AdminSessionManager = () => {
  const { user, signOut } = useAuth();
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

  const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
  const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (!user) return;

    // Calculate session expiry based on login time
    const loginTime = new Date(user.last_sign_in_at || Date.now()).getTime();
    const expiryTime = loginTime + SESSION_DURATION;

    const updateSessionTimer = () => {
      const now = Date.now();
      const timeLeft = expiryTime - now;

      setSessionTimeLeft(Math.max(0, timeLeft));

      if (timeLeft <= 0) {
        toast.error('Session expired for security. Please login again.');
        signOut();
        return;
      }

      if (timeLeft <= WARNING_THRESHOLD && !showWarning) {
        setShowWarning(true);
        toast.warning('Session expiring soon. Save your work!', {
          duration: 10000,
          action: {
            label: 'Extend Session',
            onClick: () => {
              // In production, this would refresh the token
              window.location.reload();
            }
          }
        });
      }
    };

    const interval = setInterval(updateSessionTimer, 1000);
    updateSessionTimer(); // Initial call

    return () => clearInterval(interval);
  }, [user, signOut, showWarning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSecureLogout = async () => {
    toast.success('Logging out securely...');
    await signOut();
  };

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-4 w-4 text-green-400" />
          <div className="text-white">
            <div className="font-medium">Admin Session</div>
            <div className="text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(sessionTimeLeft)}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSecureLogout}
            className="text-gray-400 hover:text-white h-8 w-8 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSessionManager;
