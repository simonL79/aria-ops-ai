import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PortalNoAccess = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/40">
          <Shield className="h-7 w-7 text-orange-500" />
        </div>
        <h1 className="text-2xl font-semibold">Portal access pending</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Your account ({user?.email}) is not yet linked to a client profile. An A.R.I.A™ operator will activate your portal access shortly. If you believe this is in error, please contact your account manager.
        </p>
        <Button variant="outline" onClick={handleSignOut} className="border-white/20">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default PortalNoAccess;
