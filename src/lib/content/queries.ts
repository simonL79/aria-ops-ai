// Content queries for the A.R.I.A Intelligence Centre (Phase 2).
// Handles fetching from content_items, content_categories, content_authors.

import { supabase } from "@/integrations/supabase/client";
import type { ContentItem, ContentCategory, ContentAuthor, ContentType } from "./types";

// Cast to avoid TS deep instantiation issues with Supabase generated types (project convention)
const db = supabase as any;

// ─────────────────────────────────────────────────────────────────────────────
// Static category definitions (topical + format buckets)
// ─────────────────────────────────────────────────────────────────────────────
export interface CategoryDef {
  slug: string;
  name: string;
  description: string;
  kind: "topic" | "format";
  /** For format buckets, the matching content_items.type */
  typeMatch?: ContentType;
  icon?: string;
}

export const INTELLIGENCE_CATEGORIES: CategoryDef[] = [
  // Topical categories (match DB content_categories)
  { slug: "executive", name: "Executive Intelligence", description: "Reputation defence for C-suite and senior leaders.", kind: "topic", icon: "User" },
  { slug: "athlete", name: "Athlete Intelligence", description: "Protection for professional athletes and sports figures.", kind: "topic", icon: "Trophy" },
  { slug: "founder", name: "Founder Intelligence", description: "Reputation monitoring for founders and entrepreneurs.", kind: "topic", icon: "Rocket" },
  { slug: "corporate", name: "Corporate Intelligence", description: "Enterprise-wide reputation risk management.", kind: "topic", icon: "Building" },
  { slug: "deepfakes", name: "Deepfake Threats", description: "Detection and neutralisation of AI-generated disinformation.", kind: "topic", icon: "Scan" },
  { slug: "ai-monitoring", name: "AI Monitoring", description: "Tracking how LLMs describe and judge your reputation.", kind: "topic", icon: "Brain" },
  { slug: "crisis", name: "Crisis Intelligence", description: "Real-time response frameworks for reputation crises.", kind: "topic", icon: "AlertTriangle" },
  { slug: "search-reputation", name: "Search Reputation", description: "SERP control, suppression and optimisation.", kind: "topic", icon: "Search" },
  { slug: "digital-threat-intel", name: "Digital Threat Intel", description: "OSINT and dark web threat monitoring.", kind: "topic", icon: "Shield" },
  // Format buckets (match content_items.type)
  { slug: "guides", name: "Intelligence Guides", description: "Operational manuals and field guides.", kind: "format", typeMatch: "guide", icon: "BookOpen" },
  { slug: "reports", name: "Intelligence Reports", description: "In-depth reports and analysis.", kind: "format", typeMatch: "report", icon: "FileText" },
  { slug: "research", name: "Research Reports", description: "Original research and investigations.", kind: "format", typeMatch: "research", icon: "FlaskConical" },
  { slug: "case-studies", name: "Case Files", description: "Anonymised client engagements.", kind: "format", typeMatch: "case-study", icon: "FolderOpen" },
];

export function getCategoryDef(slug: string): CategoryDef | undefined {
  return INTELLIGENCE_CATEGORIES.find((c) => c.slug === slug);
}

/** Map content type to its format bucket slug for URL building */
export function formatBucketSlug(type: ContentType): string {
  switch (type) {
    case "guide": return "guides";
    case "report": return "reports";
    case "research": return "research";
    case "case-study": return "case-studies";
    default: return "brief";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Data fetching
// ─────────────────────────────────────────────────────────────────────────────
const ITEM_CARD_COLS =
  "id,slug,type,category_id,author_id,title,subtitle,excerpt,cover_image,status,published_at,featured,threat_level,executive_risk,detection_confidence,reviewed,verified,tags,reading_minutes,view_count,is_seed_content,noindex,created_at,updated_at";

const AUTHOR_COLS = "id,slug,name,title,bio,credentials,avatar_url";
const CATEGORY_COLS = "id,slug,name,description,kind,icon,sort_order";

function normaliseItems(rows: any[] | null | undefined): ContentItem[] {
  return (rows ?? []) as ContentItem[];
}

export async function getCategories(): Promise<ContentCategory[]> {
  const { data } = await db.from("content_categories").select(CATEGORY_COLS).order("sort_order");
  return (data ?? []) as ContentCategory[];
}

export async function getAuthors(): Promise<ContentAuthor[]> {
  const { data } = await db.from("content_authors").select(AUTHOR_COLS);
  return (data ?? []) as ContentAuthor[];
}

/** Fetch lightweight item list (for hub / search) */
export async function getPublishedItems(limit = 100): Promise<ContentItem[]> {
  const { data } = await db
    .from("content_items")
    .select(`${ITEM_CARD_COLS}, category:content_categories(${CATEGORY_COLS}), author:content_authors(${AUTHOR_COLS})`)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return normaliseItems(data);
}

export async function getFeaturedItems(limit = 6): Promise<ContentItem[]> {
  const { data } = await db
    .from("content_items")
    .select(`${ITEM_CARD_COLS}, category:content_categories(${CATEGORY_COLS})`)
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return normaliseItems(data);
}

export async function getItemsByCategory(categorySlug: string, limit = 50): Promise<ContentItem[]> {
  const catDef = getCategoryDef(categorySlug);
  let query = db
    .from("content_items")
    .select(`${ITEM_CARD_COLS}, category:content_categories(${CATEGORY_COLS}), author:content_authors(${AUTHOR_COLS})`)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (catDef?.kind === "format" && catDef.typeMatch) {
    // Format bucket — filter by type
    query = query.eq("type", catDef.typeMatch);
  } else {
    // Topic category — filter by category_id via join
    const { data: cat } = await db.from("content_categories").select("id").eq("slug", categorySlug).single();
    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    } else {
      return [];
    }
  }
  const { data } = await query;
  return normaliseItems(data);
}

/** Get a single item by slug with full data + joins */
export async function getItemBySlug(slug: string): Promise<ContentItem | null> {
  const { data, error } = await db
    .from("content_items")
    .select(`*, category:content_categories(${CATEGORY_COLS}), author:content_authors(${AUTHOR_COLS})`)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as ContentItem;
}

/** Increment view count on an item (fire-and-forget) */
export function recordView(itemId: string) {
  db.rpc("increment_content_view", { item_id: itemId }).then(() => {});
}

/** Client-side search/filter */
export function filterItems(items: ContentItem[], query: string, categorySlug?: string | null): ContentItem[] {
  let filtered = items;
  const q = query.toLowerCase().trim();
  if (q) {
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.excerpt?.toLowerCase().includes(q) ||
        i.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (categorySlug) {
    const catDef = getCategoryDef(categorySlug);
    if (catDef?.kind === "format" && catDef.typeMatch) {
      filtered = filtered.filter((i) => i.type === catDef.typeMatch);
    } else {
      filtered = filtered.filter((i) => i.category?.slug === categorySlug);
    }
  }
  return filtered;
}

/** Build item URL using category slug (topic or format bucket) */
export function itemHref(item: ContentItem): string {
  const catSlug = item.category?.slug ?? formatBucketSlug(item.type);
  return `/intelligence/${catSlug}/${item.slug}`;
}
