
import { useState, useEffect } from 'react';
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
import { Shield, Lock, Key, AlertTriangle, Clock } from "lucide-react";
import { storeSecureKey, getSecureKey, clearSecureKey, hasValidKey } from "@/utils/secureKeyStorage";

const SecuritySettings = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyMask, setApiKeyMask] = useState<string>('');
  const [contentFiltering, setContentFiltering] = useState<boolean>(true);
  const [rateLimiting, setRateLimiting] = useState<boolean>(true);
  const [encryptStorage, setEncryptStorage] = useState<boolean>(true);
  const [autoLogout, setAutoLogout] = useState<number>(30);
  const [keyExpiration, setKeyExpiration] = useState<number>(60); // Default 60 minutes
  
  const { userRoles } = useRbac();
  const isAdmin = userRoles.includes('admin');
  
  // When component mounts, check if API key exists and mask it
  useEffect(() => {
    const securedKey = getSecureKey('openai_api_key');
    if (securedKey) {
      setApiKeyMask('•'.repeat(20) + securedKey.slice(-5));
    }
    
    // Load other settings from sessionStorage
    const contentFilteringValue = sessionStorage.getItem('content_filtering_enabled');
    if (contentFilteringValue !== null) {
      setContentFiltering(contentFilteringValue === 'true');
    }
    
    const rateLimitingValue = sessionStorage.getItem('rate_limiting_enabled');
    if (rateLimitingValue !== null) {
      setRateLimiting(rateLimitingValue === 'true');
    }
    
    const encryptStorageValue = sessionStorage.getItem('encrypt_storage');
    if (encryptStorageValue !== null) {
      setEncryptStorage(encryptStorageValue === 'true');
    }
    
    const autoLogoutValue = sessionStorage.getItem('auto_logout_minutes');
    if (autoLogoutValue !== null) {
      setAutoLogout(parseInt(autoLogoutValue));
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      // Store API key in secure storage with expiration
      storeSecureKey('openai_api_key', apiKey, keyExpiration);
      
      setApiKey('');
      setApiKeyMask('•'.repeat(20) + apiKey.slice(-5));
    }
  };
  
  const handleClearApiKey = () => {
    clearSecureKey('openai_api_key');
    setApiKey('');
    setApiKeyMask('');
  };
  
  const handleToggleContentFiltering = () => {
    setContentFiltering(!contentFiltering);
    sessionStorage.setItem('content_filtering_enabled', (!contentFiltering).toString());
    
    toast.success("Settings updated", {
      description: `Content filtering ${!contentFiltering ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleToggleRateLimiting = () => {
    setRateLimiting(!rateLimiting);
    sessionStorage.setItem('rate_limiting_enabled', (!rateLimiting).toString());
    
    toast.success("Settings updated", {
      description: `Rate limiting ${!rateLimiting ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleToggleEncryption = () => {
    setEncryptStorage(!encryptStorage);
    sessionStorage.setItem('encrypt_storage', (!encryptStorage).toString());
    
    toast.success("Settings updated", {
      description: `Data encryption ${!encryptStorage ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleAutoLogoutChange = (minutes: number) => {
    setAutoLogout(minutes);
    sessionStorage.setItem('auto_logout_minutes', minutes.toString());
    
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
          <div className="flex flex-col space-y-4">
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
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Key expires after:</span>
                <select 
                  value={keyExpiration}
                  onChange={(e) => setKeyExpiration(parseInt(e.target.value))}
                  className="bg-background border rounded px-2 py-1"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
            </div>
            
            {apiKeyMask && (
              <Button variant="outline" onClick={handleClearApiKey} size="sm">
                Clear API Key
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground">
              Your API key is stored securely in memory and will be cleared when your session ends
            </p>
          </div>
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
