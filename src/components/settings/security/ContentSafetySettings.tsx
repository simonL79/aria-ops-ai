
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RoleProtected } from "@/hooks/useRbac";
import { Shield, AlertTriangle } from "lucide-react";

const ContentSafetySettings = () => {
  const [contentFiltering, setContentFiltering] = useState<boolean>(true);
  const [rateLimiting, setRateLimiting] = useState<boolean>(true);
  const [encryptStorage, setEncryptStorage] = useState<boolean>(true);

  useEffect(() => {
    // Load settings from sessionStorage
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
  }, []);
  
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

  return (
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
  );
};

export default ContentSafetySettings;
