import { supabase } from '@/integrations/supabase/client';

export type BlackVertexActionType = 'counter_content' | 'suppression_boost' | 'notify_only' | 'manual_review';

export const blackVertexApi = {
  queue: (input: { client_id?: string; action_type: BlackVertexActionType; target_url?: string; payload?: Record<string, unknown> }) =>
    supabase.functions.invoke('black-vertex-queue', { body: input }),
  approve: (action_id: string, decision: 'approve' | 'reject') =>
    supabase.functions.invoke('black-vertex-approve', { body: { action_id, decision } }),
};

export type TakedownPlatform = 'youtube' | 'google' | 'x' | 'reddit' | 'facebook' | 'other';
export type TakedownRequestType = 'gdpr_erasure' | 'dmca' | 'defamation' | 'harassment' | 'impersonation';

export const oblivionApi = {
  draft: (input: {
    client_id?: string;
    target_url: string;
    platform: TakedownPlatform;
    request_type: TakedownRequestType;
    legal_basis?: string;
    evidence?: Array<{ url: string; description: string }>;
  }) => supabase.functions.invoke('oblivion-draft', { body: input }),
  submit: (takedown_id: string) =>
    supabase.functions.invoke('oblivion-submit', { body: { takedown_id } }),
  updateStatus: (takedown_id: string, status: string, resolution_notes?: string) =>
    supabase.functions.invoke('oblivion-status-update', { body: { takedown_id, status, resolution_notes } }),
};
