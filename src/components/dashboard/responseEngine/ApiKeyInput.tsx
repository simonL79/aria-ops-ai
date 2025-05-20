
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storeSecureKey, hasValidKey } from "@/utils/secureKeyStorage";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeyChange?: (hasKey: boolean) => void;
}

const ApiKeyInput = ({ onApiKeyChange }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyMasked, setApiKeyMasked] = useState<boolean>(hasValidKey('openai_api_key'));
  
  useEffect(() => {
    // Notify parent component about key status
    if (onApiKeyChange) {
      onApiKeyChange(apiKeyMasked);
    }
  }, [apiKeyMasked, onApiKeyChange]);

  const handleStoreKey = () => {
    if (apiKey) {
      // Check if the key follows OpenAI's typical format but be permissive
      if (!apiKey.startsWith('sk-') && apiKey.length < 40) {
        toast.warning("API Key Format Warning", {
          description: "Your key doesn't match the typical OpenAI format, but we'll save it anyway. OpenAI keys usually start with 'sk-' and are 40+ characters long.",
          duration: 5000
        });
      }
      
      storeSecureKey('openai_api_key', apiKey, 60); // Store for 60 minutes
      setApiKey('');
      setApiKeyMasked(true);
      
      toast.success("API key saved", {
        description: "The key will be available for the next 60 minutes"
      });
    } else {
      toast.error("Please enter an API key");
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">OpenAI API Key</label>
      {apiKeyMasked ? (
        <div className="flex space-x-2">
          <Input
            type="password"
            value="••••••••••••••••••••••"
            disabled
            className="font-mono text-sm flex-1"
          />
          <Button 
            variant="outline" 
            onClick={() => {
              setApiKeyMasked(false);
              setApiKey('');
            }}
          >
            Change
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
            className="font-mono text-sm flex-1"
          />
          <Button onClick={handleStoreKey}>Save</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        Your API key is stored securely in memory and will be cleared when your session ends.
      </p>
    </div>
  );
};

export default ApiKeyInput;
