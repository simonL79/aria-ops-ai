import { supabase } from "@/integrations/supabase/client";

export interface RequiemJob {
  id: string;
  client_id: string | null;
  entity_name: string;
  query: string;
  status: "pending" | "running" | "completed" | "failed";
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  result_summary: any;
  error_message: string | null;
  created_at: string;
}

export interface RequiemSnapshot {
  id: string;
  job_id: string;
  query: string;
  search_engine: string;
  parsed_results: ParsedResult[];
  total_results: number;
  captured_at: string;
}

export interface ParsedResult {
  position: number;
  title?: string;
  link?: string;
  displayed_link?: string;
  snippet?: string;
  source?: string;
  domain?: string | null;
}

export async function listRequiemJobs(limit = 50): Promise<RequiemJob[]> {
  const { data, error } = await supabase
    .from("requiem_jobs" as any)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as RequiemJob[];
}

export async function getJobSnapshots(jobId: string): Promise<RequiemSnapshot[]> {
  const { data, error } = await supabase
    .from("requiem_serp_snapshots" as any)
    .select("*")
    .eq("job_id", jobId)
    .order("captured_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as RequiemSnapshot[];
}

export async function runRequiemScan(input: {
  entity_name: string;
  query: string;
  client_id?: string | null;
}) {
  const { data, error } = await supabase.functions.invoke("requiem-scan", {
    body: input,
  });
  if (error) throw error;
  return data;
}

export async function rerunRequiemJob(jobId: string) {
  const { data, error } = await supabase.functions.invoke("requiem-scan", {
    body: { job_id: jobId },
  });
  if (error) throw error;
  return data;
}
