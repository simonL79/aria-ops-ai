import { Linkedin, Twitter, Link2, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/schema";

interface SocialShareProps {
  path: string;
  title: string;
  className?: string;
}

/** Share controls for an intelligence brief. */
export function SocialShare({ path, title, className }: SocialShareProps) {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const enc = encodeURIComponent;

  const links = [
    { icon: Linkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { icon: Twitter, label: "Share on X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { icon: Mail, label: "Share via email", href: `mailto:?subject=${enc(title)}&body=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <l.icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <Link2 className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export default SocialShare;
