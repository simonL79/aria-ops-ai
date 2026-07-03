import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Radar } from "lucide-react";

const db = supabase as any;

interface NewsletterSignupProps {
  source?: string;
  title?: string;
  description?: string;
  className?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Captures a lead into content_leads (anonymous INSERT allowed by RLS). */
export function NewsletterSignup({
  source = "newsletter",
  title = "Intelligence Briefings",
  description = "Receive A.R.I.A intelligence briefings on emerging reputation threats.",
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    setBusy(true);
    const { error } = await db.from("content_leads").insert({ email, source });
    setBusy(false);
    if (error) {
      toast.error("Could not subscribe. Please try again.");
      return;
    }
    setEmail("");
    toast.success("Subscribed — briefings inbound.");
  };

  return (
    <section className={cn("rounded-lg border border-border bg-card/60 p-6", className)} aria-label={title}>
      <div className="mb-3 flex items-center gap-2">
        <Radar className="h-5 w-5 text-primary" aria-hidden />
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@organisation.com"
          aria-label="Email address"
          required
        />
        <Button type="submit" disabled={busy}>
          {busy ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </section>
  );
}

export default NewsletterSignup;
