create table if not exists public.shield_used_jtis (
  jti text primary key,
  user_id uuid,
  action text not null,
  consumed_by_function text not null,
  minted_at timestamptz,
  expires_at timestamptz not null,
  consumed_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);
alter table public.shield_used_jtis enable row level security;
create policy "admins read shield_used_jtis" on public.shield_used_jtis for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create index if not exists shield_used_jtis_expires_at_idx on public.shield_used_jtis (expires_at);

create table if not exists public.shield_token_audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  user_id uuid,
  action text,
  jti text,
  function_name text,
  success boolean not null,
  failure_reason text,
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.shield_token_audit_events enable row level security;
create policy "admins read shield_token_audit_events" on public.shield_token_audit_events for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create index if not exists shield_token_audit_events_created_at_idx on public.shield_token_audit_events (created_at desc);
create index if not exists shield_token_audit_events_user_created_idx on public.shield_token_audit_events (user_id, created_at desc);

CREATE POLICY "restrict insert user_roles to admins" ON public.user_roles AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "restrict update user_roles to admins" ON public.user_roles AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "restrict delete user_roles to admins" ON public.user_roles AS RESTRICTIVE FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can view resurfacing events" on public.eidetic_resurfacing_events;
drop policy if exists "Admins can insert resurfacing events" on public.eidetic_resurfacing_events;
drop policy if exists "Admins can update resurfacing events" on public.eidetic_resurfacing_events;
drop policy if exists "Admins can delete resurfacing events" on public.eidetic_resurfacing_events;
create policy "Admins can view resurfacing events" on public.eidetic_resurfacing_events for select to authenticated using (public.is_current_user_admin());
create policy "Admins can insert resurfacing events" on public.eidetic_resurfacing_events for insert to authenticated with check (public.is_current_user_admin());
create policy "Admins can update resurfacing events" on public.eidetic_resurfacing_events for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());
create policy "Admins can delete resurfacing events" on public.eidetic_resurfacing_events for delete to authenticated using (public.is_current_user_admin());