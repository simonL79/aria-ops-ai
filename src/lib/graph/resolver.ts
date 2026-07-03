// Knowledge-graph resolver for the A.R.I.A content engine (Phase 1).
// Guarantees "no dead ends": every content item resolves to a set of related
// items via explicit graph edges, with tag/category fallbacks so a page always
// has onward links.

import { supabase } from "@/integrations/supabase/client";
import type { ContentItem } from "@/lib/content/types";

// Supabase generated types don't yet include the new tables in every build;
// cast the client to bypass deep-instantiation / unknown-table errors (project convention).
const db = supabase as any;

const ITEM_COLUMNS =
  "id,slug,type,category_id,author_id,title,subtitle,excerpt,cover_image,status,published_at,featured,threat_level,executive_risk,detection_confidence,reviewed,verified,tags,reading_minutes,view_count,created_at,updated_at";

function normalise(rows: any[] | null | undefined): ContentItem[] {
  return (rows ?? []) as ContentItem[];
}

/** Related items via the explicit knowledge graph, ordered by edge weight. */
export async function getGraphRelated(itemId: string, limit = 6): Promise<ContentItem[]> {
  const { data: edges } = await db
    .from("content_links")
    .select("target_id,weight,relation")
    .eq("source_id", itemId)
    .order("weight", { ascending: false })
    .limit(limit * 2);

  const ids = Array.from(new Set((edges ?? []).map((e: any) => e.target_id))).slice(0, limit);
  if (!ids.length) return [];

  const { data } = await db
    .from("content_items")
    .select(ITEM_COLUMNS)
    .in("id", ids)
    .eq("status", "published");
  return normalise(data);
}

/** Fallback related items by shared tags / category when graph edges are sparse. */
export async function getFallbackRelated(item: ContentItem, limit = 6): Promise<ContentItem[]> {
  let query = db
    .from("content_items")
    .select(ITEM_COLUMNS)
    .eq("status", "published")
    .neq("id", item.id)
    .limit(limit);

  if (item.tags?.length) {
    query = query.overlaps("tags", item.tags);
  } else if (item.category_id) {
    query = query.eq("category_id", item.category_id);
  }
  const { data } = await query;
  return normalise(data);
}

/**
 * The "no dead ends" resolver: graph edges first, topped up with tag/category
 * fallbacks, then newest published as a last resort. Always returns something.
 */
export async function getRelatedIntel(item: ContentItem, limit = 6): Promise<ContentItem[]> {
  const seen = new Set<string>([item.id]);
  const out: ContentItem[] = [];

  const push = (items: ContentItem[]) => {
    for (const it of items) {
      if (out.length >= limit) break;
      if (seen.has(it.id)) continue;
      seen.add(it.id);
      out.push(it);
    }
  };

  push(await getGraphRelated(item.id, limit));
  if (out.length < limit) push(await getFallbackRelated(item, limit));
  if (out.length < limit) push(await getNewest(limit + 1));
  return out.slice(0, limit);
}

export async function getNewest(limit = 6): Promise<ContentItem[]> {
  const { data } = await db
    .from("content_items")
    .select(ITEM_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return normalise(data);
}

export async function getPopular(limit = 6): Promise<ContentItem[]> {
  const { data } = await db
    .from("content_items")
    .select(ITEM_COLUMNS)
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(limit);
  return normalise(data);
}

export async function getFeatured(limit = 3): Promise<ContentItem[]> {
  const { data } = await db
    .from("content_items")
    .select(ITEM_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return normalise(data);
}

/** Build an in-memory adjacency graph for a set of items (for EntityGraph viz). */
export interface GraphNode {
  id: string;
  label: string;
  type: string;
}
export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}
export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function buildKnowledgeGraph(rootId?: string, limit = 40): Promise<KnowledgeGraph> {
  const { data: items } = await db
    .from("content_items")
    .select("id,title,type")
    .eq("status", "published")
    .limit(limit);

  const nodes: GraphNode[] = (items ?? []).map((i: any) => ({ id: i.id, label: i.title, type: i.type }));
  const nodeIds = new Set(nodes.map((n) => n.id));

  let edgeQuery = db.from("content_links").select("source_id,target_id,relation,weight");
  if (rootId) edgeQuery = edgeQuery.or(`source_id.eq.${rootId},target_id.eq.${rootId}`);
  const { data: edges } = await edgeQuery;

  const graphEdges: GraphEdge[] = (edges ?? [])
    .filter((e: any) => nodeIds.has(e.source_id) && nodeIds.has(e.target_id))
    .map((e: any) => ({ source: e.source_id, target: e.target_id, relation: e.relation, weight: e.weight }));

  return { nodes, edges: graphEdges };
}
