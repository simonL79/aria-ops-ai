import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent, initConsentedTrackers } from "@/lib/cookieConsent";

/**
 * GDPR/PECR cookie consent banner.
 * Non-essential trackers stay blocked until the user explicitly accepts.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Honour a previously stored choice (and re-arm trackers if accepted).
    initConsentedTrackers();
    if (getConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (value: "accepted" | "rejected") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] p-4"
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            We use essential cookies to run this site. With your consent we also use
            non-essential cookies for analytics and marketing. Non-essential cookies
            stay off until you accept. See our{" "}
            <Link to="/cookie-policy" className="text-primary underline hover:no-underline">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-3">
            <Button variant="outline" onClick={() => decide("rejected")}>
              Reject non-essential
            </Button>
            <Button onClick={() => decide("accepted")}>Accept all</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
