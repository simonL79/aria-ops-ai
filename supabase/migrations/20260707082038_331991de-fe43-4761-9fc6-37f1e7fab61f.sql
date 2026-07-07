CREATE OR REPLACE FUNCTION public.portal_resurfacing_event_action(
  _event_id uuid,
  _action text,
  _hours numeric DEFAULT NULL,
  _notes text DEFAULT NULL
)
RETURNS public.eidetic_resurfacing_events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _ev public.eidetic_resurfacing_events;
  _allowed boolean := false;
  _now timestamptz := now();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO _ev FROM public.eidetic_resurfacing_events WHERE id = _event_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;

  _allowed := public.has_role(_uid, 'admin');
  IF NOT _allowed AND _ev.client_id IS NOT NULL THEN
    _allowed := public.user_owns_client(_uid, _ev.client_id);
  END IF;
  IF NOT _allowed THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  IF _action = 'acknowledge' THEN
    UPDATE public.eidetic_resurfacing_events
      SET acknowledged = true, acknowledged_at = _now, acknowledged_by = _uid, status = 'acknowledged'
      WHERE id = _event_id RETURNING * INTO _ev;

  ELSIF _action = 'snooze' THEN
    IF _hours IS NULL OR _hours <= 0 OR _hours > 24 * 90 THEN
      RAISE EXCEPTION 'Invalid snooze duration' USING ERRCODE = '22023';
    END IF;
    UPDATE public.eidetic_resurfacing_events
      SET snoozed_until = _now + (_hours || ' hours')::interval, status = 'snoozed'
      WHERE id = _event_id RETURNING * INTO _ev;

  ELSIF _action = 'resolve' THEN
    UPDATE public.eidetic_resurfacing_events
      SET resolved_at = _now, resolved_by = _uid, status = 'resolved',
          resolution_notes = COALESCE(left(_notes, 2000), resolution_notes)
      WHERE id = _event_id RETURNING * INTO _ev;

  ELSIF _action = 'reopen' THEN
    UPDATE public.eidetic_resurfacing_events
      SET status = 'active', resolved_at = NULL, resolved_by = NULL, snoozed_until = NULL
      WHERE id = _event_id RETURNING * INTO _ev;

  ELSE
    RAISE EXCEPTION 'Invalid action' USING ERRCODE = '22023';
  END IF;

  RETURN _ev;
END;
$$;

REVOKE ALL ON FUNCTION public.portal_resurfacing_event_action(uuid, text, numeric, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.portal_resurfacing_event_action(uuid, text, numeric, text) TO authenticated;