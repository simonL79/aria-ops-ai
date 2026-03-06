
import { toast } from "sonner";

// Session-only in-memory storage for sensitive keys
// Keys are NEVER persisted to localStorage

type SecureKey = {
  value: string;
  expiresAt?: number;
};

const sessionKeyStore = new Map<string, SecureKey>();

const isValidOpenAIKey = (key: string): boolean => {
  return key.length >= 20;
};

export const storeSecureKey = (
  keyName: string, 
  keyValue: string,
  expirationMinutes?: number,
  _persistent: boolean = false // ignored — keys are never persisted
): void => {
  if (!keyValue) {
    console.warn("Attempted to store empty key");
    return;
  }

  if (keyName === 'openai_api_key' && !isValidOpenAIKey(keyValue)) {
    toast.warning("API Key Format Warning", {
      description: "The API key you provided seems unusually short. Most OpenAI keys are at least 40 characters long.",
      duration: 7000
    });
  }
  
  const expiresAt = expirationMinutes 
    ? Date.now() + (expirationMinutes * 60 * 1000) 
    : undefined;
  
  sessionKeyStore.set(keyName, { value: keyValue, expiresAt });
  
  toast.success("API key stored in memory", {
    description: expirationMinutes 
      ? `Key will expire in ${expirationMinutes} minutes` 
      : "Key will be cleared when you close the browser"
  });
};

export const getSecureKey = (keyName: string): string | null => {
  const key = sessionKeyStore.get(keyName);
  
  if (!key) return null;
  
  if (key.expiresAt && Date.now() > key.expiresAt) {
    clearSecureKey(keyName);
    toast.warning("API key has expired", {
      description: "Please enter your API key again"
    });
    return null;
  }
  
  return key.value;
};

export const clearSecureKey = (keyName: string): void => {
  sessionKeyStore.delete(keyName);
  toast.success("API key removed");
};

export const hasValidKey = (keyName: string): boolean => {
  return getSecureKey(keyName) !== null;
};

export const isSecureEnvironment = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};
