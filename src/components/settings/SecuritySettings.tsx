
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRbac, RoleProtected } from "@/hooks/useRbac";
import { Shield, Lock, Key, AlertTriangle } from "lucide-react";
import { encryptData } from "@/services/secureApiService";

const SecuritySettings = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyMask, setApiKeyMask] = useState<string>('');
  const [contentFiltering, setContentFiltering] = useState<boolean>(true);
  const [rateLimiting, setRateLimiting] = useState<boolean>(true);
  const [encryptStorage, setEncryptStorage] = useState<boolean>(true);
  const [autoLogout, setAutoLogout] = useState<number>(30);
  
  const { userRoles } = useRbac();
  const isAdmin = userRoles.includes('admin');
  
  // When component mounts, check if API key exists and mask it
  useState(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKeyMask('•'.repeat(20) + storedKey.slice(-5));
    }
  });
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      // Encrypt API key before storing
      if (encryptStorage) {
        localStorage.setItem('openai_api_key', encryptData(apiKey));
        localStorage.setItem('openai_api_key_encrypted', 'true');
      } else {
        localStorage.setItem('openai_api_key', apiKey);
        localStorage.setItem('openai_api_key_encrypted', 'false');
      }
      
      setApiKey('');
      setApiKeyMask('•'.repeat(20) + apiKey.slice(-5));
      
      toast.success("API Key saved successfully", {
        description: "Your API key has been securely saved"
      });
    }
  };
  
  const handleToggleContentFiltering = () => {
    setContentFiltering(!contentFiltering);
    localStorage.setItem('content_filtering_enabled', (!contentFiltering).toString());
    
    toast.success("Settings updated", {
      description: `Content filtering ${!contentFiltering ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleToggleRateLimiting = () => {
    setRateLimiting(!rateLimiting);
    localStorage.setItem('rate_limiting_enabled', (!rateLimiting).toString());
    
    toast.success("Settings updated", {
      description: `Rate limiting ${!rateLimiting ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleToggleEncryption = () => {
    setEncryptStorage(!encryptStorage);
    localStorage.setItem('encrypt_storage', (!encryptStorage).toString());
    
    toast.success("Settings updated", {
      description: `Local storage encryption ${!encryptStorage ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleAutoLogoutChange = (minutes: number) => {
    setAutoLogout(minutes);
    localStorage.setItem('auto_logout_minutes', minutes.toString());
    
    toast.success("Settings updated", {
      description: `Auto logout set to ${minutes} minutes`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>API Key Management</CardTitle>
          </div>
          <CardDescription>
            Securely store your OpenAI API key for A.R.I.A. functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              type="password" 
              placeholder={apiKeyMask || "Enter your OpenAI API key"} 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey}>Save</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your API key is encrypted and stored locally on your device
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Content Safety Settings</CardTitle>
          </div>
          <CardDescription>
            Configure content safety and filtering options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Content Filtering</h4>
              <p className="text-sm text-muted-foreground">
                Filter potentially unsafe content before processing
              </p>
            </div>
            <Switch 
              checked={contentFiltering} 
              onCheckedChange={handleToggleContentFiltering} 
            />
          </div>
          
          <RoleProtected requiredRoles={['admin', 'manager']} fallback={
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-yellow-800 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Additional settings require manager or admin role</span>
            </div>
          }>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">API Rate Limiting</h4>
                <p className="text-sm text-muted-foreground">
                  Limit API requests to prevent abuse
                </p>
              </div>
              <Switch 
                checked={rateLimiting} 
                onCheckedChange={handleToggleRateLimiting} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Encrypt Local Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Encrypt sensitive data stored locally
                </p>
              </div>
              <Switch 
                checked={encryptStorage} 
                onCheckedChange={handleToggleEncryption} 
              />
            </div>
          </RoleProtected>
        </CardContent>
      </Card>

      <RoleProtected requiredRoles="admin">
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
      </RoleProtected>
    </div>
  );
};

export default SecuritySettings;
