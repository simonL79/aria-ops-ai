// Shared executor logic for EIDETIC dispatched responses.
// Used by both eidetic-dispatch-response (auto) and eidetic-approve-dispatch (manual).
//
// Contract: each executor first inserts an audit/artifact row (so we always have a paper trail),
// then invokes the live downstream edge function. Returns a structured result object.
//
// Result shape:
//   { ok: boolean, data?: { artifact_id, downstream: { function, ok, data?, error? } }, error?: string }

const LOG = '[EIDETIC-EXEC]';

export interface ExecResult {
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export async function executeAction(
  supabase: any,
  action: string,
  payload: any,
  event: any,
): Promise<ExecResult> {
  console.log(`${LOG} executing action=${action} event=${event?.id}`);
  try {
    switch (action) {
      case 'requiem':
        return await executeRequiem(supabase, payload, event);
      case 'legal_erasure':
        return await executeLegalErasure(supabase, payload, event);
      case 'counter_narrative':
        return await executeCounterNarrative(supabase, payload, event);
      default:
        return { ok: false, error: `Unknown action: ${action}` };
    }
  } catch (e) {
    console.error(`${LOG} unhandled error`, e);
    return { ok: false, error: (e as Error).message };
  }
}

// ─── REQUIEM ──────────────────────────────────────────────────────────────
export async function executeRequiem(supabase: any, payload: any, event: any): Promise<ExecResult> {
  const cfg = payload?.config ?? {};
  const entityName = event?.narrative_category ?? 'unknown';

  // 1. Audit row
  const { data: campaign, error: cErr } = await supabase
    .from('persona_saturation_campaigns')
    .insert({
      campaign_name: `EIDETIC: ${event?.event_type} ${(event?.id ?? '').slice(0, 8)}`,
      entity_name: entityName,
      status: 'dispatched',
      content: { source_event: event?.id, url: event?.content_url, excerpt: event?.content_excerpt },
      platforms: cfg.platforms ?? ['blog'],
    })
    .select()
    .single();
  if (cErr) {
    console.error(`${LOG} requiem audit insert failed`, cErr);
    return { ok: false, error: `audit_insert_failed: ${cErr.message}` };
  }

  // 2. Live invoke
  if (!event?.content_url) {
    return {
      ok: false,
      data: { artifact_id: campaign.id, downstream: { function: 'requiem-pipeline', ok: false, error: 'missing content_url' } },
      error: 'missing content_url',
    };
  }

  const { data: invokeData, error: invokeErr } = await supabase.functions.invoke('requiem-pipeline', {
    body: { urls: [event.content_url], variantCount: cfg.variantCount ?? 10 },
  });

  if (invokeErr) {
    console.error(`${LOG} requiem-pipeline invoke failed`, invokeErr);
    return {
      ok: false,
      data: { artifact_id: campaign.id, downstream: { function: 'requiem-pipeline', ok: false, error: invokeErr.message } },
      error: invokeErr.message,
    };
  }

  console.log(`${LOG} requiem-pipeline ok jobId=${invokeData?.jobId}`);
  return {
    ok: true,
    data: {
      artifact_id: campaign.id,
      campaign_id: campaign.id,
      downstream: {
        function: 'requiem-pipeline',
        ok: true,
        data: {
          jobId: invokeData?.jobId,
          payloadsGenerated: invokeData?.payloadsGenerated,
          meshSize: invokeData?.meshSize,
        },
      },
    },
  };
}

// ─── LEGAL ERASURE ────────────────────────────────────────────────────────
export async function executeLegalErasure(supabase: any, payload: any, event: any): Promise<ExecResult> {
  const cfg = payload?.config ?? {};
  const entityName = event?.narrative_category ?? 'unknown';

  // 1. DSR row
  const { data: dsr, error: dErr } = await supabase
    .from('data_subject_requests')
    .insert({
      request_type: 'erasure',
      status: 'pending',
      priority: event?.severity === 'critical' ? 'high' : 'medium',
      request_details: `EIDETIC erasure. Source URL: ${event?.content_url ?? 'n/a'}\n\nExcerpt: ${event?.content_excerpt ?? ''}`,
      metadata: { source: 'eidetic', event_id: event?.id, footprint_id: event?.footprint_id },
    })
    .select()
    .single();
  if (dErr) {
    console.error(`${LOG} dsr audit insert failed`, dErr);
    return { ok: false, error: `audit_insert_failed: ${dErr.message}` };
  }

  // 2. Generate legal document
  const { data: invokeData, error: invokeErr } = await supabase.functions.invoke('legal-document-generator', {
    body: {
      action: 'generate_document',
      entityName,
      documentType: cfg.documentType ?? 'privacy_violation',
      details: {
        sourceUrl: event?.content_url,
        excerpt: event?.content_excerpt,
        eventId: event?.id,
        dsrId: dsr.id,
      },
    },
  });

  if (invokeErr) {
    console.error(`${LOG} legal-document-generator invoke failed`, invokeErr);
    return {
      ok: false,
      data: { artifact_id: dsr.id, dsr_id: dsr.id, downstream: { function: 'legal-document-generator', ok: false, error: invokeErr.message } },
      error: invokeErr.message,
    };
  }

  // Link doc back to DSR metadata
  await supabase
    .from('data_subject_requests')
    .update({ metadata: { source: 'eidetic', event_id: event?.id, footprint_id: event?.footprint_id, document_id: invokeData?.document_id, document: invokeData } })
    .eq('id', dsr.id);

  console.log(`${LOG} legal doc generated for dsr=${dsr.id}`);
  return {
    ok: true,
    data: {
      artifact_id: dsr.id,
      dsr_id: dsr.id,
      downstream: {
        function: 'legal-document-generator',
        ok: true,
        data: { document_id: invokeData?.document_id, document_type: invokeData?.document_type ?? cfg.documentType },
      },
    },
  };
}

// ─── COUNTER NARRATIVE ────────────────────────────────────────────────────
export async function executeCounterNarrative(supabase: any, payload: any, event: any): Promise<ExecResult> {
  const cfg = payload?.config ?? {};
  const entityName = event?.narrative_category ?? 'unknown';
  const title = `Response: ${event?.event_type ?? 'narrative'} — ${entityName}`;
  const content = `Auto-generated counter for ${event?.content_url ?? 'unknown source'}:\n\n${event?.content_excerpt ?? ''}`;

  // 1. Narrative draft row
  const { data: narrative, error: nErr } = await supabase
    .from('counter_narratives')
    .insert({
      entity_name: entityName,
      narrative_type: 'auto_response',
      theme: event?.event_type,
      status: 'draft',
      content,
      metadata: { source: 'eidetic', event_id: event?.id, title },
    })
    .select()
    .single();
  if (nErr) {
    console.error(`${LOG} counter narrative audit insert failed`, nErr);
    return { ok: false, error: `audit_insert_failed: ${nErr.message}` };
  }

  // 2. Deploy via persona-saturation
  const platforms: string[] = cfg.platforms ?? ['github-pages'];
  const { data: invokeData, error: invokeErr } = await supabase.functions.invoke('persona-saturation', {
    body: {
      title,
      content,
      deploymentTargets: platforms,
      liveDeployment: true,
      entityName,
    },
  });

  if (invokeErr) {
    console.error(`${LOG} persona-saturation invoke failed`, invokeErr);
    return {
      ok: false,
      data: { artifact_id: narrative.id, narrative_id: narrative.id, downstream: { function: 'persona-saturation', ok: false, error: invokeErr.message } },
      error: invokeErr.message,
    };
  }

  // Mark narrative as published if any deployment succeeded
  const deployments = invokeData?.deploymentResults ?? [];
  const anyOk = Array.isArray(deployments) && deployments.some((d: any) => d?.success);
  if (anyOk) {
    await supabase
      .from('counter_narratives')
      .update({ status: 'published', metadata: { source: 'eidetic', event_id: event?.id, title, deployments } })
      .eq('id', narrative.id);
  }

  console.log(`${LOG} counter_narrative deployed: anyOk=${anyOk}`);
  return {
    ok: anyOk,
    data: {
      artifact_id: narrative.id,
      narrative_id: narrative.id,
      downstream: {
        function: 'persona-saturation',
        ok: anyOk,
        data: { deployments },
        ...(anyOk ? {} : { error: 'no_platform_succeeded' }),
      },
    },
    ...(anyOk ? {} : { error: 'no_platform_succeeded' }),
  };
}
