import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Protected } from "@/hooks/useRbac";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const AdvancedSecuritySettings = () => {
  const [autoLogout, setAutoLogout] = useState<number>(30);
  
  useEffect(() => {
    const autoLogoutValue = sessionStorage.getItem('auto_logout_minutes');
    if (autoLogoutValue !== null) {
      setAutoLogout(parseInt(autoLogoutValue));
    }
  }, []);
  
  const handleAutoLogoutChange = (minutes: number) => {
    setAutoLogout(minutes);
    sessionStorage.setItem('auto_logout_minutes', minutes.toString());
    
    toast.success("Settings updated", {
      description: `Auto logout set to ${minutes} minutes`
    });
  };

  return (
    <Protected requiredRoles="admin">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Advanced Security Settings</CardTitle>
          </div>
          <CardDescription>
            Admin-only security configuration options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Auto Logout Time (minutes)</h4>
            <div className="flex space-x-2 items-center">
              <Input 
                type="number" 
                value={autoLogout} 
                min={5}
                max={240}
                onChange={(e) => setAutoLogout(parseInt(e.target.value) || 30)}
                className="w-24"
              />
              <Button onClick={() => handleAutoLogoutChange(autoLogout)}>Set</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically log users out after inactivity (5-240 minutes)
            </p>
          </div>
        </CardContent>
      </Card>
    </Protected>
  );
};

export default AdvancedSecuritySettings;
