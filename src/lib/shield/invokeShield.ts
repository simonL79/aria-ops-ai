import { supabase } from '@/integrations/supabase/client';

export type ShieldAction = 'promote' | 'transition' | 'capture';

const FN_TO_ACTION: Record<string, ShieldAction> = {
  'shield-promote-threat': 'promote',
  'shield-transition-alert': 'transition',
  'shield-capture-url-metadata': 'capture',
};

let cached: { action: ShieldAction; token: string; expires_at: number } | null = null;

async function mint(action: ShieldAction): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.action === action && cached.expires_at - 30 > now) {
    return cached.token;
  }
  const { data, error } = await supabase.functions.invoke('shield-mint-token', {
    body: { action },
  });
  if (error || !data?.token) throw new Error(error?.message || 'Failed to mint shield token');
  cached = { action, token: data.token as string, expires_at: data.expires_at as number };
  return cached.token;
}

export async function invokeShield<T = any>(
  fn: keyof typeof FN_TO_ACTION,
  body: Record<string, unknown>,
): Promise<{ data: T | null; error: Error | null }> {
  const action = FN_TO_ACTION[fn];
  if (!action) return { data: null, error: new Error(`Unknown shield function: ${fn}`) };
  try {
    const token = await mint(action);
    const { data, error } = await supabase.functions.invoke(fn, {
      body,
      headers: { 'x-shield-token': token },
    });
    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as T, error: null };
  } catch (e: any) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
