export const SHIELD_ALERT_TYPES = [
  'impersonation','spoofed_domain','phishing','scam_ad','fake_endorsement',
  'deepfake','data_leak','doxxing','harassment','defamation_risk',
  'misinformation','hostile_narrative','account_takeover','dark_web_exposure',
  'search_result_risk','unknown',
] as const;
export type ShieldAlertType = typeof SHIELD_ALERT_TYPES[number];

export const SHIELD_ALERT_STATUSES = [
  'new','triaged','evidence_required','evidence_captured','action_required',
  'takedown_opened','legal_review','law_enforcement_review','monitoring',
  'resolved','false_positive',
] as const;
export type ShieldAlertStatus = typeof SHIELD_ALERT_STATUSES[number];

export const SHIELD_SEVERITIES = ['p1_critical','p2_high','p3_medium','p4_low'] as const;
export type ShieldSeverity = typeof SHIELD_SEVERITIES[number];

export const ALLOWED_TRANSITIONS: Record<ShieldAlertStatus, ShieldAlertStatus[]> = {
  new: ['triaged','false_positive'],
  triaged: ['evidence_required','monitoring','false_positive'],
  evidence_required: ['evidence_captured'],
  evidence_captured: ['action_required'],
  action_required: ['takedown_opened','legal_review','law_enforcement_review','monitoring'],
  takedown_opened: ['monitoring','resolved'],
  legal_review: ['takedown_opened','monitoring'],
  law_enforcement_review: ['monitoring'],
  monitoring: ['action_required','resolved'],
  resolved: [],
  false_positive: [],
};

export const SEVERITY_LABEL: Record<ShieldSeverity,string> = {
  p1_critical: 'P1 Critical', p2_high: 'P2 High', p3_medium: 'P3 Medium', p4_low: 'P4 Low',
};

export const SEVERITY_COLOR: Record<ShieldSeverity,string> = {
  p1_critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  p2_high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  p3_medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  p4_low: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};

export const STATUS_LABEL: Record<ShieldAlertStatus,string> = {
  new: 'New', triaged: 'Triaged', evidence_required: 'Evidence Required',
  evidence_captured: 'Evidence Captured', action_required: 'Action Required',
  takedown_opened: 'Takedown Opened', legal_review: 'Legal Review',
  law_enforcement_review: 'Law Enforcement Review', monitoring: 'Monitoring',
  resolved: 'Resolved', false_positive: 'False Positive',
};

export const TYPE_LABEL: Record<ShieldAlertType,string> = {
  impersonation: 'Impersonation', spoofed_domain: 'Spoofed Domain', phishing: 'Phishing',
  scam_ad: 'Scam / Fake Ad', fake_endorsement: 'Fake Endorsement', deepfake: 'Deepfake',
  data_leak: 'Data Leak', doxxing: 'Doxxing', harassment: 'Harassment',
  defamation_risk: 'Defamation Risk', misinformation: 'Misinformation',
  hostile_narrative: 'Hostile Narrative', account_takeover: 'Account Takeover',
  dark_web_exposure: 'Dark Web Exposure', search_result_risk: 'Search Result Risk', unknown: 'Unknown',
};
