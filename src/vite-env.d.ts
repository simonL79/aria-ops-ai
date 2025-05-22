
/// <reference types="vite/client" />

interface Window {
  fbq?: (event: string, eventName: string, options?: any) => void;
  gtag?: (event: string, action: string, options?: any) => void;
}
