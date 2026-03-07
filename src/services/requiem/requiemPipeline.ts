import { supabase } from "@/integrations/supabase/client";

// ── Types ──────────────────────────────────────────────────
export interface RequiemJobConfig {
  urls: string[];
  variantCount?: number;
}

export interface RequiemJob {
  id: string;
  job_type: string;
  status: string;
  urls: string[];
  variant_count: number;
  scan_results: any[];
  generated_pages: any[];
  deployed_domains: any[];
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface RequiemScanResult {
  id: string;
  job_id: string;
  url: string;
  title: string;
  content_text: string;
  is_negative: boolean;
  authority_score: number;
  entity_identity: any;
  paragraphs: string[];
  image_url: string;
}

export interface RequiemPayload {
  id: string;
  job_id: string;
  scan_result_id: string;
  filename: string;
  title: string;
  author_name: string;
  pub_date: string;
  html_content: string;
  variant_index: number;
  deployed_url: string | null;
}

// ── API ────────────────────────────────────────────────────

/** Launch the full Requiem pipeline (scan → generate) */
export async function launchRequiemPipeline(config: RequiemJobConfig) {
  const { data, error } = await supabase.functions.invoke("requiem-pipeline", {
    body: {
      urls: config.urls,
      variantCount: config.variantCount ?? 20,
    },
  });

  if (error) throw new Error(`Pipeline failed: ${error.message}`);
  if (data?.error) throw new Error(data.error);
  return data as {
    success: boolean;
    jobId: string;
    scanned: number;
    payloadsGenerated: number;
    meshSize: number;
  };
}

/** List all Requiem jobs */
export async function listRequiemJobs() {
  const { data, error } = await (supabase
    .from("requiem_jobs") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as RequiemJob[];
}

/** Get scan results for a job */
export async function getJobScanResults(jobId: string) {
  const { data, error } = await (supabase
    .from("requiem_scan_results") as any)
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as RequiemScanResult[];
}

/** Get generated payloads for a job */
export async function getJobPayloads(jobId: string) {
  const { data, error } = await (supabase
    .from("requiem_payloads") as any)
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as RequiemPayload[];
}

/** Get a single job by ID */
export async function getRequiemJob(jobId: string) {
  const { data, error } = await (supabase
    .from("requiem_jobs") as any)
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) throw error;
  return data as RequiemJob;
}
