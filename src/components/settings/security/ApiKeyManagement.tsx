
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
import { Key, Clock, Save, Lock, AlertCircle, Check, TestTube } from "lucide-react";
import { storeSecureKey, getSecureKey, clearSecureKey, hasValidKey } from "@/utils/secureKeyStorage";
import { testOpenAIConnection } from "@/services/api/openaiClient";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyMask, setApiKeyMask] = useState<string>('');
  const [keyExpiration, setKeyExpiration] = useState<number>(0);
  const [persistentStorage, setPersistentStorage] = useState<boolean>(true);
  const [isValidFormat, setIsValidFormat] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  
  // Check if API key exists and mask it on mount
  useEffect(() => {
    const securedKey = getSecureKey('openai_api_key');
    if (securedKey) {
      setApiKeyMask('••••••••••••••••••••' + securedKey.slice(-6));
    }
  }, []);
  
  // Validate OpenAI API key format
  const validateApiKeyFormat = (key: string): boolean => {
    // OpenAI keys start with "sk-" and are typically 51+ characters
    return key.startsWith('sk-') && key.length >= 40;
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    
    if (newKey && newKey.length > 5) {
      setIsValidFormat(validateApiKeyFormat(newKey));
    } else {
      setIsValidFormat(true);
    }
  };
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      if (!apiKey.startsWith('sk-')) {
        toast.warning("API Key Format Warning", {
          description: "OpenAI API keys typically start with 'sk-'. Please verify this is correct.",
          duration: 7000
        });
      }
      
      storeSecureKey(
        'openai_api_key', 
        apiKey, 
        keyExpiration > 0 ? keyExpiration : undefined,
        persistentStorage
      );
      
      setApiKey('');
      setApiKeyMask('••••••••••••••••••••' + apiKey.slice(-6));
      
      toast.success("OpenAI API key saved successfully", {
        description: "AI capabilities are now enabled"
      });
    } else {
      toast.error("Please enter an API key");
    }
  };
  
  const handleClearApiKey = () => {
    clearSecureKey('openai_api_key');
    setApiKey('');
    setApiKeyMask('');
    toast.success("API key cleared");
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const isConnected = await testOpenAIConnection();
      
      if (isConnected) {
        toast.success("OpenAI Connection Successful", {
          description: "Your API key is working correctly and AI features are ready to use.",
          duration: 5000
        });
      } else {
        toast.error("OpenAI Connection Failed", {
          description: "Please check your API key and try again.",
          duration: 7000
        });
      }
    } catch (error) {
      toast.error("Connection Test Failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        duration: 7000
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle>OpenAI API Configuration</CardTitle>
        </div>
        <CardDescription>
          Configure your OpenAI API key for AI-powered search, analysis, and intelligence features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input 
                type="password" 
                placeholder={apiKeyMask || "Enter your OpenAI API key (sk-...)"} 
                value={apiKey}
                onChange={handleApiKeyChange}
                className={`flex-1 ${!isValidFormat && apiKey.length > 5 ? 'border-red-300' : ''}`}
              />
              <Button onClick={handleSaveApiKey} disabled={!apiKey}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            
            {!isValidFormat && apiKey.length > 5 && (
              <div className="flex items-center text-red-500 text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>OpenAI API keys should start with "sk-" and be at least 40 characters long</span>
              </div>
            )}
            
            {isValidFormat && apiKey.length > 5 && (
              <div className="flex items-center text-green-500 text-xs mt-1">
                <Check className="h-3 w-3 mr-1" />
                <span>Valid OpenAI API key format</span>
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
          
          <div className="flex space-x-2">
            {apiKeyMask && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection} 
                  disabled={isTesting}
                  className="flex-1"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
                <Button variant="outline" onClick={handleClearApiKey}>
                  Clear Key
                </Button>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {persistentStorage 
                ? "Your API key is stored securely on this device and will persist across sessions."
                : "Your API key is stored securely in memory and will be cleared based on your expiration settings."}
            </p>
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm">
              <p className="font-medium text-blue-800 mb-2">How to get your OpenAI API Key:</p>
              <ol className="text-blue-700 text-xs pl-5 list-decimal space-y-1">
                <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                <li>Sign in to your OpenAI account</li>
                <li>Click "Create new secret key"</li>
                <li>Copy the key (starts with "sk-") and paste it above</li>
                <li>Make sure your account has sufficient credits for API usage</li>
              </ol>
            </div>
            
            {hasValidKey('openai_api_key') && (
              <div className="bg-green-50 p-3 rounded-md border border-green-200 text-sm">
                <div className="flex items-center text-green-800">
                  <Check className="h-4 w-4 mr-2" />
                  <span className="font-medium">OpenAI API key is configured</span>
                </div>
                <p className="text-green-700 text-xs mt-1">
                  AI search, threat analysis, and intelligence features are now available.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManagement;
