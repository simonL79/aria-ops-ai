
-- Tighten RLS on sensitive PII tables
-- Replace permissive USING(true) with admin-only access

-- client_intake_submissions
DROP POLICY IF EXISTS "Allow all access to client_intake_submissions" ON public.client_intake_submissions;
CREATE POLICY "Admin only access to client_intake_submissions"
  ON public.client_intake_submissions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- reputation_scan_submissions
DROP POLICY IF EXISTS "Allow all access to reputation_scan_submissions" ON public.reputation_scan_submissions;
CREATE POLICY "Admin only access to reputation_scan_submissions"
  ON public.reputation_scan_submissions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- clients
DROP POLICY IF EXISTS "Allow all access to clients" ON public.clients;
CREATE POLICY "Admin only access to clients"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- client_entities
DROP POLICY IF EXISTS "Allow all access to client_entities" ON public.client_entities;
CREATE POLICY "Admin only access to client_entities"
  ON public.client_entities
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- contact_submissions
DROP POLICY IF EXISTS "Allow all access to contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admin only access to contact_submissions"
  ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous INSERT for public contact form
CREATE POLICY "Allow public contact form submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- activity_logs
DROP POLICY IF EXISTS "Allow all access to activity_logs" ON public.activity_logs;
CREATE POLICY "Admin only access to activity_logs"
  ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- scan_results
DROP POLICY IF EXISTS "Allow all access to scan_results" ON public.scan_results;
CREATE POLICY "Admin only access to scan_results"
  ON public.scan_results
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- lead_magnets - allow anonymous insert for lead capture forms
DROP POLICY IF EXISTS "Allow all access to lead_magnets" ON public.lead_magnets;
CREATE POLICY "Admin only access to lead_magnets"
  ON public.lead_magnets
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow public lead magnet submissions"
  ON public.lead_magnets
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- persona_saturation_campaigns
DROP POLICY IF EXISTS "Allow all access to persona_saturation_campaigns" ON public.persona_saturation_campaigns;
CREATE POLICY "Admin only access to persona_saturation_campaigns"
  ON public.persona_saturation_campaigns
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- data_subject_requests
DROP POLICY IF EXISTS "Allow all access to data_subject_requests" ON public.data_subject_requests;
CREATE POLICY "Admin only access to data_subject_requests"
  ON public.data_subject_requests
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- data_breach_incidents
DROP POLICY IF EXISTS "Allow all access to data_breach_incidents" ON public.data_breach_incidents;
CREATE POLICY "Admin only access to data_breach_incidents"
  ON public.data_breach_incidents
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
