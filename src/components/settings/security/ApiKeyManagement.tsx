
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
import { Key, Clock } from "lucide-react";
import { storeSecureKey, getSecureKey, clearSecureKey, hasValidKey } from "@/utils/secureKeyStorage";
import { toast } from "sonner";

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyMask, setApiKeyMask] = useState<string>('');
  const [keyExpiration, setKeyExpiration] = useState<number>(60); // Default 60 minutes
  
  // When component mounts, check if API key exists and mask it
  useEffect(() => {
    const securedKey = getSecureKey('openai_api_key');
    if (securedKey) {
      setApiKeyMask('•'.repeat(20) + securedKey.slice(-5));
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      // Store API key in secure storage with expiration
      storeSecureKey('openai_api_key', apiKey, keyExpiration);
      
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
  );
};

export default ApiKeyManagement;
