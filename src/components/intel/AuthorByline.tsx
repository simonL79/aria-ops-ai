import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { formatDate } from "./authority";
import { cn } from "@/lib/utils";
import type { ContentAuthor } from "@/lib/content/types";

interface AuthorBylineProps {
  author?: ContentAuthor | null;
  publishedAt?: string | null;
  readingMinutes?: number | null;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Analyst byline with credentials — reinforces authority signals. */
export function AuthorByline({ author, publishedAt, readingMinutes, className }: AuthorBylineProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {author ? (
        <>
          <Avatar className="h-9 w-9 border border-border">
            {author.avatar_url ? <AvatarImage src={author.avatar_url} alt={author.name} /> : null}
            <AvatarFallback className="bg-muted text-xs">{initials(author.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{author.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {author.title ?? "Intelligence Analyst"}
              {author.credentials?.length ? ` · ${author.credentials.join(", ")}` : ""}
            </p>
          </div>
        </>
      ) : (
        <div className="text-sm font-semibold text-foreground">A.R.I.A™ Intelligence Desk</div>
      )}
      <span className="text-xs text-muted-foreground">·</span>
      <span className="text-xs text-muted-foreground">{formatDate(publishedAt)}</span>
      {readingMinutes ? (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden /> {readingMinutes} min brief
        </span>
      ) : null}
    </div>
  );
}

export default AuthorByline;
