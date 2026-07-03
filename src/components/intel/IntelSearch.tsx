// Intelligence search component with predictive suggestions
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { INTELLIGENCE_CATEGORIES, getCategoryDef, filterItems, itemHref } from "@/lib/content/queries";
import type { ContentItem } from "@/lib/content/types";
import { Link } from "react-router-dom";

interface IntelSearchProps {
  items: ContentItem[];
  onFilter?: (filtered: ContentItem[]) => void;
  className?: string;
}

export function IntelSearch({ items, onFilter, className }: IntelSearchProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return filterItems(items, query, null).slice(0, 5);
  }, [items, query]);

  const handleFilter = (q: string, cat: string | null) => {
    setQuery(q);
    setCategory(cat);
    if (onFilter) {
      onFilter(filterItems(items, q, cat));
    }
    setShowSuggestions(false);
  };

  const clearFilters = () => handleFilter("", null);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search Intelligence…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            if (onFilter) onFilter(filterItems(items, e.target.value, category));
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-9 pr-10 bg-card/60 border-border"
        />
        {(query || category) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
            {suggestions.map((item) => (
              <Link
                key={item.id}
                to={itemHref(item)}
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-xs font-medium text-primary/80 uppercase">{item.type}</span>
                <span className="truncate text-sm text-foreground">{item.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {INTELLIGENCE_CATEGORIES.slice(0, 8).map((cat) => (
          <Badge
            key={cat.slug}
            variant={category === cat.slug ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors",
              category === cat.slug && "bg-primary text-primary-foreground",
            )}
            onClick={() => handleFilter(query, category === cat.slug ? null : cat.slug)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default IntelSearch;
