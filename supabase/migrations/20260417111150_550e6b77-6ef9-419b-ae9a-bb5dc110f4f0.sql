-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Additive columns on memory_footprints
ALTER TABLE public.memory_footprints
  ADD COLUMN IF NOT EXISTS embedding vector(1536),
  ADD COLUMN IF NOT EXISTS narrative_summary text,
  ADD COLUMN IF NOT EXISTS content_hash text,
  ADD COLUMN IF NOT EXISTS cluster_id uuid,
  ADD COLUMN IF NOT EXISTS embedded_at timestamptz;

-- New clusters table
CREATE TABLE IF NOT EXISTS public.memory_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name text,
  narrative_theme text,
  centroid_embedding vector(1536),
  footprint_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.memory_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to memory_clusters"
  ON public.memory_clusters
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_memory_clusters_updated_at
  BEFORE UPDATE ON public.memory_clusters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- HNSW index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS memory_footprints_embedding_hnsw
  ON public.memory_footprints
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS memory_clusters_centroid_hnsw
  ON public.memory_clusters
  USING hnsw (centroid_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS memory_footprints_cluster_id_idx
  ON public.memory_footprints(cluster_id);

CREATE INDEX IF NOT EXISTS memory_footprints_content_hash_idx
  ON public.memory_footprints(content_hash);

-- Semantic search RPC
CREATE OR REPLACE FUNCTION public.match_memories(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  content_url text,
  memory_context text,
  narrative_summary text,
  memory_type text,
  decay_score numeric,
  cluster_id uuid,
  similarity float
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    mf.id,
    mf.content_url,
    mf.memory_context,
    mf.narrative_summary,
    mf.memory_type,
    mf.decay_score,
    mf.cluster_id,
    1 - (mf.embedding <=> query_embedding) AS similarity
  FROM public.memory_footprints mf
  WHERE mf.embedding IS NOT NULL
    AND 1 - (mf.embedding <=> query_embedding) > match_threshold
  ORDER BY mf.embedding <=> query_embedding
  LIMIT match_count;
$$;