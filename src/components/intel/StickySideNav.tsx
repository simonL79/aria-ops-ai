import { cn } from "@/lib/utils";

interface StickySideNavProps {
  children: React.ReactNode;
  className?: string;
  /** top offset in rem to clear a fixed header */
  offset?: number;
}

/** Sticky sidebar container for TOC, share and related-intel rails. */
export function StickySideNav({ children, className, offset = 6 }: StickySideNavProps) {
  return (
    <aside
      className={cn("hidden lg:block", className)}
      style={{ position: "sticky", top: `${offset}rem`, alignSelf: "flex-start" }}
    >
      <div className="space-y-6">{children}</div>
    </aside>
  );
}

export default StickySideNav;
