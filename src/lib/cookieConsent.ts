// Lightweight cookie-consent state. Non-essential trackers (analytics,
// marketing pixels) must NOT fire until the user grants consent here.

export type ConsentValue = "accepted" | "rejected";

const STORAGE_KEY = "aria_cookie_consent_v1";

export const CONSENT_EVENT = "aria-cookie-consent-change";

export function getConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore storage failures */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }
  if (value === "accepted") loadNonEssentialTrackers();
}

export function hasConsented(): boolean {
  return getConsent() === "accepted";
}

let trackersLoaded = false;

// Only invoked after explicit opt-in. Non-essential scripts are loaded
// here so nothing tracks the user before consent is granted (PECR/GDPR).
export function loadNonEssentialTrackers(): void {
  if (trackersLoaded || typeof window === "undefined") return;
  trackersLoaded = true;

  const pixelId = import.meta.env.VITE_FB_PIXEL_ID;
  // Guard against unconfigured/placeholder IDs.
  if (pixelId && pixelId !== "YOUR_PIXEL_ID_HERE") {
    /* eslint-disable */
    (function (f: any, b, e, v, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    (window as any).fbq("init", pixelId);
    (window as any).fbq("track", "PageView");
  }
}

// Re-arm trackers on a normal page load if consent was already granted earlier.
export function initConsentedTrackers(): void {
  if (hasConsented()) loadNonEssentialTrackers();
}
