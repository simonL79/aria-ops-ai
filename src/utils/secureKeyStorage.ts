import { toast } from "sonner";

// Session-based secure storage for sensitive keys
// This keeps keys in memory only during the current session
// and doesn't persist them to localStorage

type SecureKey = {
  value: string;
  expiresAt?: number; // Optional timestamp for key expiration
};

// In-memory storage that doesn't persist across page reloads
const sessionKeyStore = new Map<string, SecureKey>();

export const storeSecureKey = (
  keyName: string, 
  keyValue: string,
  expirationMinutes?: number
): void => {
  if (!keyValue) {
    console.warn("Attempted to store empty key");
    return;
  }
  
  // Calculate expiration if provided
  const expiresAt = expirationMinutes 
    ? Date.now() + (expirationMinutes * 60 * 1000) 
    : undefined;
    
  // Store in memory only
  sessionKeyStore.set(keyName, { value: keyValue, expiresAt });
  
  toast.success("API key securely stored for this session", {
    description: expirationMinutes 
      ? `Key will expire in ${expirationMinutes} minutes` 
      : "Key will be cleared when you close the browser"
  });
};

export const getSecureKey = (keyName: string): string | null => {
  const key = sessionKeyStore.get(keyName);
  
  // No key found
  if (!key) {
    return null;
  }
  
  // Check if key has expired
  if (key.expiresAt && Date.now() > key.expiresAt) {
    sessionKeyStore.delete(keyName);
    toast.warning("API key has expired", {
      description: "Please enter your API key again"
    });
    return null;
  }
  
  return key.value;
};

export const clearSecureKey = (keyName: string): void => {
  if (sessionKeyStore.has(keyName)) {
    sessionKeyStore.delete(keyName);
    toast.success("API key removed");
  }
};

export const hasValidKey = (keyName: string): boolean => {
  return getSecureKey(keyName) !== null;
};

// Check if the current environment allows secure storage
// (Used to determine if we should enable certain features)
export const isSecureEnvironment = (): boolean => {
  // Check if we're on HTTPS
  return window.location.protocol === 'https:';
};
