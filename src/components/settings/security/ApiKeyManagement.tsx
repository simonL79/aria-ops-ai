
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
import { Key, Clock, Save, Lock } from "lucide-react";
import { storeSecureKey, getSecureKey, clearSecureKey, hasValidKey } from "@/utils/secureKeyStorage";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyMask, setApiKeyMask] = useState<string>('');
  const [keyExpiration, setKeyExpiration] = useState<number>(0); // 0 means no expiration (persistent)
  const [persistentStorage, setPersistentStorage] = useState<boolean>(true);
  
  // When component mounts, check if API key exists and mask it
  useEffect(() => {
    const securedKey = getSecureKey('openai_api_key');
    if (securedKey) {
      setApiKeyMask('•'.repeat(20) + securedKey.slice(-5));
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      // Store API key with or without expiration based on settings
      storeSecureKey(
        'openai_api_key', 
        apiKey, 
        keyExpiration > 0 ? keyExpiration : undefined,
        persistentStorage
      );
      
      setApiKey('');
      setApiKeyMask('•'.repeat(20) + apiKey.slice(-5));
      toast.success("API key saved successfully");
    } else {
      toast.error("Please enter an API key");
    }
  };
  
  const handleClearApiKey = () => {
    clearSecureKey('openai_api_key');
    setApiKey('');
    setApiKeyMask('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle>API Key</CardTitle>
        </div>
        <CardDescription>
          Set your OpenAI API key for A.R.I.A. functionality
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
            <Button onClick={handleSaveApiKey}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Store permanently</span>
            </div>
            <Switch 
              checked={persistentStorage} 
              onCheckedChange={setPersistentStorage}
            />
          </div>
          
          {!persistentStorage && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Key expires after:</span>
                <select 
                  value={keyExpiration}
                  onChange={(e) => setKeyExpiration(parseInt(e.target.value))}
                  className="bg-background border rounded px-2 py-1"
                >
                  <option value="0">Never</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                  <option value="1440">24 hours</option>
                </select>
              </div>
            </div>
          )}
          
          {apiKeyMask && (
            <Button variant="outline" onClick={handleClearApiKey} size="sm">
              Clear API Key
            </Button>
          )}
          
          <p className="text-sm text-muted-foreground">
            {persistentStorage 
              ? "Your API key is stored securely on this device and will be available next time you use the app."
              : "Your API key is stored securely in memory and will be cleared when the expiration time is reached."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManagement;
