import { supabase } from '@/integrations/supabase/client';

interface LogClientErrorOptions {
  /** Section name used to group entries in the admin error log. */
  section: string;
  /** The error (Error, Supabase error, or string). */
  error: unknown;
  /** Optional extra context, e.g. { action: 'acknowledge', eventId }. */
  context?: Record<string, unknown>;
}

const toMessage = (error: unknown): string => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  const anyErr = error as any;
  return anyErr?.message || anyErr?.error_description || anyErr?.details || 'Unknown error';
};

/**
 * Records a handled (non-crashing) error to `client_error_logs` so backend
 * failures from portal actions show up alongside UI crashes in /admin/error-log.
 * Never throws — logging must not break the calling flow.
 */
export async function logClientError({ section, error, context }: LogClientErrorOptions): Promise<void> {
  try {
    const anyErr = error as any;
    const { data } = await supabase.auth.getUser();

    const contextLine = context && Object.keys(context).length
      ? `context: ${JSON.stringify(context)}`
      : null;

    const details = [
      anyErr?.code ? `code: ${anyErr.code}` : null,
      anyErr?.status ? `status: ${anyErr.status}` : null,
      anyErr?.hint ? `hint: ${anyErr.hint}` : null,
      anyErr?.details && typeof anyErr.details === 'string' ? `details: ${anyErr.details}` : null,
      contextLine,
    ].filter(Boolean).join('\n');

    await supabase.from('client_error_logs').insert({
      section,
      route: typeof window !== 'undefined' ? window.location.pathname : null,
      message: toMessage(error).slice(0, 2000),
      stack: (anyErr?.stack ? String(anyErr.stack) : '').slice(0, 8000) || null,
      component_stack: details.slice(0, 8000) || null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      user_id: data?.user?.id ?? null,
    } as any);
  } catch (logErr) {
    console.error('Failed to record error log:', logErr);
  }
}
