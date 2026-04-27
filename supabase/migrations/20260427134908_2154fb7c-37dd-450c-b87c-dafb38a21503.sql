-- Unschedule any prior version (safe if it doesn't exist)
DO $$
BEGIN
  PERFORM cron.unschedule('requiem-cron-15min');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Schedule requiem-cron every 15 minutes
SELECT cron.schedule(
  'requiem-cron-15min',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://nphqcwigrxcguztkscak.supabase.co/functions/v1/requiem-cron',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waHFjd2lncnhjZ3V6dGtzY2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTEzOTksImV4cCI6MjA4ODMyNzM5OX0.3Dz8zvUOybcnLXyPJ6t9jzk1gdFa9V-tJQS9hLd6d04"}'::jsonb,
    body := jsonb_build_object('triggered_at', now())
  ) AS request_id;
  $$
);