
-- Tighten all remaining permissive RLS policies to admin-only
-- Tables with "Allow all access" USING(true) policies

-- prospect_alerts
DROP POLICY IF EXISTS "Allow all access to prospect_alerts" ON public.prospect_alerts;
CREATE POLICY "Admin only access to prospect_alerts" ON public.prospect_alerts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- aria_notifications
DROP POLICY IF EXISTS "Allow all access to aria_notifications" ON public.aria_notifications;
CREATE POLICY "Admin only access to aria_notifications" ON public.aria_notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- aria_ops_log
DROP POLICY IF EXISTS "Allow all access to aria_ops_log" ON public.aria_ops_log;
CREATE POLICY "Admin only access to aria_ops_log" ON public.aria_ops_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- scanner_query_log
DROP POLICY IF EXISTS "Allow all access to scanner_query_log" ON public.scanner_query_log;
CREATE POLICY "Admin only access to scanner_query_log" ON public.scanner_query_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- system_config
DROP POLICY IF EXISTS "Allow all access to system_config" ON public.system_config;
CREATE POLICY "Admin only access to system_config" ON public.system_config FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- entities
DROP POLICY IF EXISTS "Allow all access to entities" ON public.entities;
CREATE POLICY "Admin only access to entities" ON public.entities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- rsi_queue
DROP POLICY IF EXISTS "Allow all access to rsi_queue" ON public.rsi_queue;
CREATE POLICY "Admin only access to rsi_queue" ON public.rsi_queue FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- content_sources
DROP POLICY IF EXISTS "Allow all access to content_sources" ON public.content_sources;
CREATE POLICY "Admin only access to content_sources" ON public.content_sources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- narrative_clusters
DROP POLICY IF EXISTS "Allow all access to narrative_clusters" ON public.narrative_clusters;
CREATE POLICY "Admin only access to narrative_clusters" ON public.narrative_clusters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- suppression_assets
DROP POLICY IF EXISTS "Allow all access to suppression_assets" ON public.suppression_assets;
CREATE POLICY "Admin only access to suppression_assets" ON public.suppression_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- live_status
DROP POLICY IF EXISTS "Allow all access to live_status" ON public.live_status;
CREATE POLICY "Admin only access to live_status" ON public.live_status FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- strategy_responses
DROP POLICY IF EXISTS "Allow all access to strategy_responses" ON public.strategy_responses;
CREATE POLICY "Admin only access to strategy_responses" ON public.strategy_responses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- monitoring_status
DROP POLICY IF EXISTS "Allow all access to monitoring_status" ON public.monitoring_status;
CREATE POLICY "Admin only access to monitoring_status" ON public.monitoring_status FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- entity_fingerprints_advanced
DROP POLICY IF EXISTS "Allow all access to entity_fingerprints_advanced" ON public.entity_fingerprints_advanced;
CREATE POLICY "Admin only access to entity_fingerprints_advanced" ON public.entity_fingerprints_advanced FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- entity_precision_stats
DROP POLICY IF EXISTS "Allow all access to entity_precision_stats" ON public.entity_precision_stats;
CREATE POLICY "Admin only access to entity_precision_stats" ON public.entity_precision_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- threats
DROP POLICY IF EXISTS "Allow all access to threats" ON public.threats;
CREATE POLICY "Admin only access to threats" ON public.threats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- monitored_platforms
DROP POLICY IF EXISTS "Allow all access to monitored_platforms" ON public.monitored_platforms;
CREATE POLICY "Admin only access to monitored_platforms" ON public.monitored_platforms FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- anubis_pattern_log
DROP POLICY IF EXISTS "Allow all access to anubis_pattern_log" ON public.anubis_pattern_log;
CREATE POLICY "Admin only access to anubis_pattern_log" ON public.anubis_pattern_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- multilingual_threats
DROP POLICY IF EXISTS "Allow all access to multilingual_threats" ON public.multilingual_threats;
CREATE POLICY "Admin only access to multilingual_threats" ON public.multilingual_threats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- darkweb_agents
DROP POLICY IF EXISTS "Allow all access to darkweb_agents" ON public.darkweb_agents;
CREATE POLICY "Admin only access to darkweb_agents" ON public.darkweb_agents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- llm_watchdog_logs
DROP POLICY IF EXISTS "Allow all access to llm_watchdog_logs" ON public.llm_watchdog_logs;
CREATE POLICY "Admin only access to llm_watchdog_logs" ON public.llm_watchdog_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- dpia_records
DROP POLICY IF EXISTS "Allow all access to dpia_records" ON public.dpia_records;
CREATE POLICY "Admin only access to dpia_records" ON public.dpia_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- anubis_entity_memory
DROP POLICY IF EXISTS "Allow all access to anubis_entity_memory" ON public.anubis_entity_memory;
CREATE POLICY "Admin only access to anubis_entity_memory" ON public.anubis_entity_memory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- aria_client_intakes
DROP POLICY IF EXISTS "Allow all access to aria_client_intakes" ON public.aria_client_intakes;
CREATE POLICY "Admin only access to aria_client_intakes" ON public.aria_client_intakes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- strike_requests
DROP POLICY IF EXISTS "Allow all access to strike_requests" ON public.strike_requests;
CREATE POLICY "Admin only access to strike_requests" ON public.strike_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- system_health_checks
DROP POLICY IF EXISTS "Allow all access to system_health_checks" ON public.system_health_checks;
CREATE POLICY "Admin only access to system_health_checks" ON public.system_health_checks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- counter_narratives
DROP POLICY IF EXISTS "Allow all access to counter_narratives" ON public.counter_narratives;
CREATE POLICY "Admin only access to counter_narratives" ON public.counter_narratives FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- data_retention_schedule
DROP POLICY IF EXISTS "Allow all access to data_retention_schedule" ON public.data_retention_schedule;
CREATE POLICY "Admin only access to data_retention_schedule" ON public.data_retention_schedule FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- lia_records
DROP POLICY IF EXISTS "Allow all access to lia_records" ON public.lia_records;
CREATE POLICY "Admin only access to lia_records" ON public.lia_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- memory_footprints
DROP POLICY IF EXISTS "Allow all access to memory_footprints" ON public.memory_footprints;
CREATE POLICY "Admin only access to memory_footprints" ON public.memory_footprints FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- memory_decay_profiles
DROP POLICY IF EXISTS "Allow all access to memory_decay_profiles" ON public.memory_decay_profiles;
CREATE POLICY "Admin only access to memory_decay_profiles" ON public.memory_decay_profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- employee_scan_queue
DROP POLICY IF EXISTS "Allow all access to employee_scan_queue" ON public.employee_scan_queue;
CREATE POLICY "Admin only access to employee_scan_queue" ON public.employee_scan_queue FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- memory_recalibrators
DROP POLICY IF EXISTS "Allow all access to memory_recalibrators" ON public.memory_recalibrators;
CREATE POLICY "Admin only access to memory_recalibrators" ON public.memory_recalibrators FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- executive_reports
DROP POLICY IF EXISTS "Allow all access to executive_reports" ON public.executive_reports;
CREATE POLICY "Admin only access to executive_reports" ON public.executive_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- privacy_notices
DROP POLICY IF EXISTS "Allow all access to privacy_notices" ON public.privacy_notices;
CREATE POLICY "Admin only access to privacy_notices" ON public.privacy_notices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- entity_graph
DROP POLICY IF EXISTS "Allow all access to entity_graph" ON public.entity_graph;
CREATE POLICY "Admin only access to entity_graph" ON public.entity_graph FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- threat_ingestion_queue
DROP POLICY IF EXISTS "Allow all access to threat_ingestion_queue" ON public.threat_ingestion_queue;
CREATE POLICY "Admin only access to threat_ingestion_queue" ON public.threat_ingestion_queue FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- eris_attack_simulations
DROP POLICY IF EXISTS "Allow all access to eris_attack_simulations" ON public.eris_attack_simulations;
CREATE POLICY "Admin only access to eris_attack_simulations" ON public.eris_attack_simulations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- eris_response_strategies
DROP POLICY IF EXISTS "Allow all access to eris_response_strategies" ON public.eris_response_strategies;
CREATE POLICY "Admin only access to eris_response_strategies" ON public.eris_response_strategies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- operator_command_log
DROP POLICY IF EXISTS "Allow all access to operator_command_log" ON public.operator_command_log;
CREATE POLICY "Admin only access to operator_command_log" ON public.operator_command_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- operator_response_log
DROP POLICY IF EXISTS "Allow all access to operator_response_log" ON public.operator_response_log;
CREATE POLICY "Admin only access to operator_response_log" ON public.operator_response_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- panoptica_sensor_events
DROP POLICY IF EXISTS "Allow all access to panoptica_sensor_events" ON public.panoptica_sensor_events;
CREATE POLICY "Admin only access to panoptica_sensor_events" ON public.panoptica_sensor_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- panoptica_system_health
DROP POLICY IF EXISTS "Allow all access to panoptica_system_health" ON public.panoptica_system_health;
CREATE POLICY "Admin only access to panoptica_system_health" ON public.panoptica_system_health FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- sentience_memory_log
DROP POLICY IF EXISTS "Allow all access to sentience_memory_log" ON public.sentience_memory_log;
CREATE POLICY "Admin only access to sentience_memory_log" ON public.sentience_memory_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- sentience_recalibration_decisions
DROP POLICY IF EXISTS "Allow all access to sentience_recalibration_decisions" ON public.sentience_recalibration_decisions;
CREATE POLICY "Admin only access to sentience_recalibration_decisions" ON public.sentience_recalibration_decisions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- genesis_entities
DROP POLICY IF EXISTS "Allow all access to genesis_entities" ON public.genesis_entities;
CREATE POLICY "Admin only access to genesis_entities" ON public.genesis_entities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- graveyard_simulations
DROP POLICY IF EXISTS "Allow all access to graveyard_simulations" ON public.graveyard_simulations;
CREATE POLICY "Admin only access to graveyard_simulations" ON public.graveyard_simulations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

-- eidetic_footprint_queue
DROP POLICY IF EXISTS "Allow all access to eidetic_footprint_queue" ON public.eidetic_footprint_queue;
CREATE POLICY "Admin only access to eidetic_footprint_queue" ON public.eidetic_footprint_queue FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::text)) WITH CHECK (public.has_role(auth.uid(), 'admin'::text));
