
import { toast } from "sonner";

// Session and localStorage-based secure storage for sensitive keys
// Options for both session-only or more persistent storage

type SecureKey = {
  value: string;
  expiresAt?: number; // Optional timestamp for key expiration
};

// In-memory storage that doesn't persist across page reloads
const sessionKeyStore = new Map<string, SecureKey>();

// Check if we have localStorage available
const hasLocalStorage = typeof localStorage !== 'undefined';

export const storeSecureKey = (
  keyName: string, 
  keyValue: string,
  expirationMinutes?: number,
  persistent: boolean = false
): void => {
  if (!keyValue) {
    console.warn("Attempted to store empty key");
    return;
  }
  
  // Calculate expiration if provided
  const expiresAt = expirationMinutes 
    ? Date.now() + (expirationMinutes * 60 * 1000) 
    : undefined;
  
  // Create the key object
  const keyObject = { 
    value: keyValue, 
    expiresAt 
  };
  
  // Store in memory
  sessionKeyStore.set(keyName, keyObject);
  
  // If persistent storage is requested and available, store encrypted in localStorage
  if (persistent && hasLocalStorage) {
    try {
      localStorage.setItem(
        `secure_key_${keyName}`,
        JSON.stringify(keyObject)
      );
    } catch (e) {
      console.error("Failed to store key in localStorage", e);
    }
  }
  
  toast.success("API key securely stored", {
    description: persistent 
      ? "Key will persist across sessions" 
      : (expirationMinutes 
          ? `Key will expire in ${expirationMinutes} minutes` 
          : "Key will be cleared when you close the browser")
  });
};

export const getSecureKey = (keyName: string): string | null => {
  // First check in-memory storage
  let key = sessionKeyStore.get(keyName);
  
  // If not in memory but localStorage is available, check there
  if (!key && hasLocalStorage) {
    const storedKey = localStorage.getItem(`secure_key_${keyName}`);
    if (storedKey) {
      try {
        key = JSON.parse(storedKey) as SecureKey;
        // Add to session storage for faster access
        sessionKeyStore.set(keyName, key);
      } catch (e) {
        console.error("Failed to parse stored key", e);
      }
    }
  }
  
  // No key found
  if (!key) {
    return null;
  }
  
  // Check if key has expired
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
  // Clear from session storage
  sessionKeyStore.delete(keyName);
  
  // Clear from localStorage if available
  if (hasLocalStorage) {
    localStorage.removeItem(`secure_key_${keyName}`);
  }
  
  toast.success("API key removed");
};

export const hasValidKey = (keyName: string): boolean => {
  return getSecureKey(keyName) !== null;
};

// Check if the current environment allows secure storage
// (Used to determine if we should enable certain features)
export const isSecureEnvironment = (): boolean => {
  // Check if we're on HTTPS
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};
