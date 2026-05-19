
CREATE TABLE IF NOT EXISTS public.keyword_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  entity text NOT NULL,
  category text NOT NULL,
  priority int NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  sentiment_target text NOT NULL DEFAULT 'monitor',
  intent_type text,
  assigned_module text NOT NULL DEFAULT 'serp_monitor',
  active boolean NOT NULL DEFAULT false,
  suppression_page_path text,
  notes text,
  last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (keyword, entity)
);

CREATE INDEX IF NOT EXISTS idx_keyword_targets_entity ON public.keyword_targets(entity);
CREATE INDEX IF NOT EXISTS idx_keyword_targets_module_active ON public.keyword_targets(assigned_module, active);
CREATE INDEX IF NOT EXISTS idx_keyword_targets_priority ON public.keyword_targets(priority DESC);

ALTER TABLE public.keyword_targets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage keyword_targets" ON public.keyword_targets;
CREATE POLICY "Admins manage keyword_targets"
ON public.keyword_targets
FOR ALL
TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

DROP TRIGGER IF EXISTS update_keyword_targets_updated_at ON public.keyword_targets;
CREATE TRIGGER update_keyword_targets_updated_at
BEFORE UPDATE ON public.keyword_targets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.keyword_targets (keyword, entity, category, priority, sentiment_target, assigned_module, active, suppression_page_path) VALUES
-- Top 10 negatives (active, suppression pages assigned)
('Simon Lindsay Glasgow','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/glasgow'),
('Simon Lindsay KSL','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/ksl'),
('Simon Lindsay KSL Hair','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/ksl-hair'),
('Simon Lindsay bankruptcy','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/bankruptcy'),
('Simon Lindsay reviews','Simon Lindsay','review',1,'suppress','requiem',true,'/simon-lindsay/reviews'),
('KSL Hair reviews','KSL Hair','review',1,'suppress','requiem',true,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair complaints','KSL Hair','review',1,'suppress','requiem',true,'/simon-lindsay/ksl-hair-complaints'),
('Simon Lindsay scam','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/reputation-intelligence'),
('KSL Hair scam','KSL Hair','negative',1,'suppress','requiem',true,'/simon-lindsay/ksl-hair-complaints'),
('Simon Lindsay fraud','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/reputation-intelligence'),
('simon lindsay glasgow kslhair the truth','Simon Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/ksl-hair-complaints'),
('Kayleigh Lindsay KSL','Kayleigh Lindsay','negative',1,'suppress','requiem',true,'/simon-lindsay/ksl'),

-- Remaining negatives (monitored)
('Simon Lindsay complaints','Simon Lindsay','review',2,'suppress','serp_monitor',false,'/simon-lindsay/reviews'),
('Simon Lindsay conman','Simon Lindsay','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay investigation','Simon Lindsay','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay exposed','Simon Lindsay','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay debts','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/bankruptcy'),
('Simon Lindsay liquidation','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/bankruptcy'),
('Simon Lindsay failed business','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/bankruptcy'),
('Simon Lindsay hair transplant','Simon Lindsay','legacy',3,'monitor','serp_monitor',false,'/simon-lindsay/ksl-hair'),

('KSL Hair Simon Lindsay','KSL Hair','negative',1,'suppress','requiem',false,'/simon-lindsay/ksl-hair'),
('KSL Hair Glasgow','KSL Hair','location',2,'monitor','serp_monitor',false,'/simon-lindsay/glasgow'),
('KSL Hair bankruptcy','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/bankruptcy'),
('KSL Hair closure','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair failed','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair truth','KSL Hair','negative',1,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Clinics The Truth','KSL Hair','negative',1,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair botched','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair bad results','KSL Hair','review',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair donor damage','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair scarring','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair unlicensed surgeon','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair investigation','KSL Hair','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),

('Simon Lindsay review','Simon Lindsay','review',2,'suppress','serp_monitor',false,'/simon-lindsay/reviews'),
('Simon Lindsay trustpilot','Simon Lindsay','review',2,'suppress','serp_monitor',false,'/simon-lindsay/reviews'),
('Simon Lindsay Reddit','Simon Lindsay','review',2,'monitor','serp_monitor',false,'/simon-lindsay/reviews'),
('Simon Lindsay Facebook','Simon Lindsay','review',3,'monitor','serp_monitor',false,'/simon-lindsay/reviews'),
('Simon Lindsay forum','Simon Lindsay','review',3,'monitor','serp_monitor',false,'/simon-lindsay/reviews'),
('Simon Lindsay scam reviews','Simon Lindsay','review',2,'suppress','serp_monitor',false,'/simon-lindsay/reviews'),
('KSL Hair Reddit','KSL Hair','review',2,'monitor','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair forum','KSL Hair','review',3,'monitor','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('KSL Hair before and after','KSL Hair','review',3,'monitor','serp_monitor',false,'/simon-lindsay/ksl-hair'),
('KSL Hair bad reviews','KSL Hair','review',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),

('Simon Lindsay Scotland','Simon Lindsay','location',3,'monitor','serp_monitor',false,'/simon-lindsay/glasgow'),
('Simon Lindsay Spain','Simon Lindsay','location',3,'monitor','serp_monitor',false,null),
('Simon Lindsay Sotogrande','Simon Lindsay','location',3,'monitor','serp_monitor',false,null),
('Simon Lindsay Marbella','Simon Lindsay','location',3,'monitor','serp_monitor',false,null),
('KSL Hair Scotland','KSL Hair','location',3,'monitor','serp_monitor',false,'/simon-lindsay/glasgow'),

('Kayleigh Lindsay','Kayleigh Lindsay','negative',2,'monitor','serp_monitor',false,null),
('Kayleigh Susan Lindsay','Kayleigh Lindsay','negative',2,'monitor','serp_monitor',false,null),
('Kayleigh Gobey','Kayleigh Lindsay','negative',2,'monitor','serp_monitor',false,null),
('Kayleigh Susan Gobey','Kayleigh Lindsay','negative',2,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay scam','Kayleigh Lindsay','negative',2,'suppress','serp_monitor',false,null),
('Kayleigh Lindsay fraud','Kayleigh Lindsay','negative',2,'suppress','serp_monitor',false,null),
('Kayleigh Lindsay bankruptcy','Kayleigh Lindsay','negative',2,'suppress','serp_monitor',false,null),
('Kayleigh Lindsay director','Kayleigh Lindsay','negative',3,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay assets','Kayleigh Lindsay','negative',3,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay companies','Kayleigh Lindsay','negative',3,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay KSL Hair','Kayleigh Lindsay','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair'),
('Kayleigh Gobey KSL','Kayleigh Lindsay','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/ksl'),
('Kayleigh Gobey Simon Lindsay','Kayleigh Lindsay','negative',2,'monitor','serp_monitor',false,null),

('Simon Lindsay family','Simon Lindsay','family-safety',2,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay family','Kayleigh Lindsay','family-safety',2,'monitor','serp_monitor',false,null),
('Simon Lindsay children','Simon Lindsay','family-safety',1,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay Spain','Kayleigh Lindsay','family-safety',2,'monitor','serp_monitor',false,null),
('Simon Lindsay address','Simon Lindsay','family-safety',1,'monitor','serp_monitor',false,null),
('Simon Lindsay whereabouts','Simon Lindsay','family-safety',1,'monitor','serp_monitor',false,null),
('Kayleigh Lindsay location','Kayleigh Lindsay','family-safety',1,'monitor','serp_monitor',false,null),

('Simon Lindsay The Sun','Simon Lindsay','media',2,'monitor','serp_monitor',false,null),
('Simon Lindsay Daily Mail','Simon Lindsay','media',2,'monitor','serp_monitor',false,null),
('Simon Lindsay Glasgow Times','Simon Lindsay','media',2,'monitor','serp_monitor',false,null),
('Simon Lindsay Guardian','Simon Lindsay','media',2,'monitor','serp_monitor',false,null),
('Simon Lindsay bankruptcy article','Simon Lindsay','media',2,'monitor','serp_monitor',false,'/simon-lindsay/bankruptcy'),
('Simon Lindsay news','Simon Lindsay','media',3,'monitor','serp_monitor',false,null),

('Simon Lindsay collapse','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/bankruptcy'),
('Simon Lindsay victim','Simon Lindsay','negative',3,'monitor','serp_monitor',false,null),
('Simon Lindsay ripped off','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay lies','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay deception','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay cheating','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay dangerous','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay ruined','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay botched','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/ksl-hair-complaints'),
('Simon Lindsay fake','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay unlawful','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay misleading','Simon Lindsay','negative',3,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay criminal','Simon Lindsay','negative',2,'suppress','serp_monitor',false,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay warning','Simon Lindsay','negative',3,'monitor','serp_monitor',false,null),
('Simon Lindsay avoid','Simon Lindsay','negative',3,'monitor','serp_monitor',false,null),
('Simon Lindsay beware','Simon Lindsay','negative',3,'monitor','serp_monitor',false,null),

-- Top 10 positives (active in autoseo)
('Simon Lindsay A.R.I.A','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/aria'),
('Simon Lindsay AI','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/ai'),
('Simon Lindsay commercial strategist','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/commercial-strategist'),
('Simon Lindsay entrepreneur','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/entrepreneur'),
('Simon Lindsay reputation intelligence','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/reputation-intelligence'),
('Simon Lindsay boxing','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/boxing'),
('Simon Lindsay media strategist','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/commercial-strategist'),
('Simon Lindsay founder','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/entrepreneur'),
('Simon Lindsay MAINA','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/aria'),
('Simon Lindsay SAS','Simon Lindsay','positive',1,'promote','autoseo',true,'/simon-lindsay/aria'),
('Simon Lindsay digital strategist','Simon Lindsay','positive',2,'promote','autoseo',false,'/simon-lindsay/commercial-strategist'),

('Kayleigh Lindsay entrepreneur','Kayleigh Lindsay','positive',2,'promote','autoseo',false,null),
('Kayleigh Lindsay business','Kayleigh Lindsay','positive',2,'promote','autoseo',false,null),
('Kayleigh Lindsay philanthropy','Kayleigh Lindsay','positive',2,'promote','autoseo',false,null),
('Kayleigh Lindsay family office','Kayleigh Lindsay','positive',2,'promote','autoseo',false,null),
('Kayleigh Lindsay projects','Kayleigh Lindsay','positive',2,'promote','autoseo',false,null)
ON CONFLICT (keyword, entity) DO NOTHING;
