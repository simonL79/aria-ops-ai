
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
import { Key, Clock, Save, Lock, AlertCircle, Check } from "lucide-react";
import { storeSecureKey, getSecureKey, clearSecureKey, hasValidKey } from "@/utils/secureKeyStorage";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyMask, setApiKeyMask] = useState<string>('');
  const [keyExpiration, setKeyExpiration] = useState<number>(0); // 0 means no expiration (persistent)
  const [persistentStorage, setPersistentStorage] = useState<boolean>(true);
  const [isValidFormat, setIsValidFormat] = useState<boolean>(true);
  
  // When component mounts, check if API key exists and mask it
  useEffect(() => {
    const securedKey = getSecureKey('openai_api_key');
    if (securedKey) {
      setApiKeyMask('•'.repeat(20) + securedKey.slice(-5));
    }
  }, []);
  
  // Validate OpenAI API key format
  const validateApiKeyFormat = (key: string): boolean => {
    // OpenAI API keys typically start with "sk-" and are 51 characters long
    // But we should be flexible with the validation to account for different key formats
    return key.length >= 20; // Just check for a reasonable length
  };

  // Update validation state when API key changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    
    if (newKey && newKey.length > 5) {
      setIsValidFormat(validateApiKeyFormat(newKey));
    } else {
      setIsValidFormat(true); // Don't show validation error for empty/short keys
    }
  };
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      // We'll warn if the key doesn't follow the typical format, but still allow saving
      if (!apiKey.startsWith('sk-')) {
        toast.warning("API Key Format Warning", {
          description: "The key doesn't start with 'sk-' which is typical for OpenAI API keys. It may still work if you're using a different format."
        });
      }
      
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
          <CardTitle>OpenAI API Key</CardTitle>
        </div>
        <CardDescription>
          Set your OpenAI API key for A.R.I.A. functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input 
                type="password" 
                placeholder={apiKeyMask || "Enter your OpenAI API key"} 
                value={apiKey}
                onChange={handleApiKeyChange}
                className={`flex-1 ${!isValidFormat && apiKey.length > 5 ? 'border-red-300' : ''}`}
              />
              <Button onClick={handleSaveApiKey}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            
            {!isValidFormat && apiKey.length > 5 && (
              <div className="flex items-center text-red-500 text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>API key seems too short. OpenAI keys are typically at least 20 characters.</span>
              </div>
            )}
            
            {isValidFormat && apiKey.length > 5 && (
              <div className="flex items-center text-green-500 text-xs mt-1">
                <Check className="h-3 w-3 mr-1" />
                <span>Valid API key format</span>
              </div>
            )}
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
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm">
            <p className="font-medium text-amber-800 mb-1">Need an OpenAI API Key?</p>
            <ol className="text-amber-700 text-xs pl-5 list-decimal">
              <li>Sign in to your OpenAI account</li>
              <li>Go to API Keys in your account settings</li>
              <li>Create a new secret key and copy it</li>
              <li>Paste the key above (typically starts with "sk-")</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManagement;
