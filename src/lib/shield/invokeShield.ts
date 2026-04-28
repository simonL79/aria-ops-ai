import { supabase } from '@/integrations/supabase/client';
import {
  SHIELD_FUNCTION_ACTIONS,
  type ShieldAction,
  type ShieldFunctionName,
} from './actions';

// Tokens are now single-use server-side (jti replay protection).
// We mint fresh per call and do NOT cache across calls.
async function mint(action: ShieldAction): Promise<string> {
  const { data, error } = await supabase.functions.invoke('shield-mint-token', {
    body: { action },
  });
  if (error || !data?.token) throw new Error(error?.message || 'Failed to mint shield token');
  return data.token as string;
}

export async function invokeShield<T = any>(
  fn: ShieldFunctionName,
  body: Record<string, unknown>,
): Promise<{ data: T | null; error: Error | null }> {
  const action = SHIELD_FUNCTION_ACTIONS[fn];
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
