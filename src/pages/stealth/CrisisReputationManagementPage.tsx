import React from 'react';
import { AlarmClock, Flame, Megaphone, PhoneCall, ShieldAlert, Timer } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/crisis-reputation-management',
  title: 'Crisis Reputation Management | 24/7 Response | A.R.I.A™',
  metaDescription:
    '24/7 crisis reputation management. Live operator-led response across Google, AI search, social, news and legal — for founders, athletes, executives and brands.',
  h1: 'Crisis Reputation Management',
  heroEyebrow: 'When the next 72 hours decide everything',
  heroSubhead:
    'A live, operator-led response to reputation crises — across Google, ChatGPT, Gemini, social, news, legal and stakeholder channels. Not a dashboard. A team that picks up.',
  problem: {
    heading: 'A modern reputation crisis happens in four places at once.',
    body: [
      'A bad story now lands on Google, gets summarised inside ChatGPT and Gemini, spreads on social, and gets called by a journalist — all within hours. The classic PR playbook addresses the press release. It does not address the AI summary that has already shaped half the readers’ first impression.',
      'A.R.I.A’s crisis practice runs all four lanes in parallel: search-surface containment, AI-search correction, social and platform escalation, and direct stakeholder communication — with legal coordination where required.',
      'Engagements are operator-led. There is a named lead on call, a defined first-72-hours playbook, and quantified reporting back to your board, sponsor, investor or governing body for as long as the incident is live.',
    ],
  },
  capabilities: [
    { icon: AlarmClock, title: '24/7 activation', body: 'Single phone line, single named operator lead, on-call until the incident is contained.' },
    { icon: Timer, title: 'First-72-hours playbook', body: 'A pre-built sequence covering hour 0 through hour 72 — not improvised under pressure.' },
    { icon: Flame, title: 'Search-surface containment', body: 'Negative URLs delisted, push-down launched, knowledge panel corrected and outdated content tools exhausted within the first cycle.' },
    { icon: ShieldAlert, title: 'AI-search correction', body: 'ChatGPT, Gemini, Perplexity and AI Overviews actively corrected so they stop confidently summarising the wrong version.' },
    { icon: Megaphone, title: 'Platform & social escalation', body: 'Direct platform escalation routes for trust & safety, defamation, harassment, doxxing, and coordinated inauthentic behaviour.' },
    { icon: PhoneCall, title: 'Stakeholder comms', body: 'Direct briefing of sponsors, investors, board, federation or partners so they hear it from you first, framed correctly.' },
  ],
  keywordClusters: [
    {
      title: 'Crisis response',
      items: [
        'Crisis reputation management',
        'Reputation crisis response',
        'Online crisis management',
        'PR crisis management',
        'Reputation crisis consultant',
        '24/7 reputation response',
        'Emergency reputation defence',
      ],
    },
    {
      title: 'Threat types',
      items: [
        'Defamation crisis',
        'Smear campaign response',
        'Doxxing response',
        'Online harassment response',
        'Cancel-campaign response',
        'Activist campaign defence',
        'Hostile journalism response',
        'Coordinated review-bomb response',
      ],
    },
    {
      title: 'Channels worked',
      items: [
        'Google delisting',
        'AI search correction',
        'Knowledge panel correction',
        'Social platform escalation',
        'Defamation pre-action',
        'Stakeholder briefing',
        'Sponsor & investor comms',
      ],
    },
  ],
  methodology: [
    { step: '00', title: 'Activation call', body: 'Single phone call activates a named operator lead, briefs your team, and starts the clock on the first-72-hours playbook.' },
    { step: '01', title: 'Hour 0–6: containment', body: 'Surface scan, severity grading, immediate platform escalations, legal triggers prepared, knowledge panel correction filed.' },
    { step: '02', title: 'Hour 6–24: correction', body: 'AI-search correction, push-down launched, RTBF/defamation pre-action issued, stakeholder briefing pack drafted.' },
    { step: '03', title: 'Hour 24–48: counter-narrative', body: 'Authoritative content published on owned and earned surfaces, sponsor/investor/board briefings delivered, social platform escalations followed up.' },
    { step: '04', title: 'Hour 48–72: stabilisation', body: 'Resurfacing monitor active across Google and AI surfaces, severity trend reported, longer-arc plan agreed with your team.' },
    { step: '05', title: 'Beyond 72h: durable defence', body: 'Engagement transitions into ongoing monitoring and defence so the same story can’t come back through a different door.' },
  ],
  comparison: {
    competitorLabel: 'Traditional PR crisis agencies',
    rows: [
      { feature: 'Press strategy & spokesperson briefing', competitor: true, aria: true },
      { feature: 'Search-surface containment (Google)', competitor: 'Limited', aria: 'Full' },
      { feature: 'AI-search correction (ChatGPT/Gemini/AI Overviews)', competitor: false, aria: true },
      { feature: 'Platform escalation (trust & safety)', competitor: 'Sometimes', aria: 'Always' },
      { feature: 'Defamation pre-action & RTBF', competitor: 'Via referral', aria: 'Integrated' },
      { feature: 'Stakeholder briefing pack', competitor: true, aria: true },
      { feature: 'Quantified reputation telemetry', competitor: false, aria: true },
      { feature: 'Post-crisis durable defence', competitor: 'Optional', aria: 'Built-in' },
    ],
  },
  faqs: [
    { q: 'How fast can you activate?', a: 'Crisis engagements activate within one hour of the initial call, 24/7. A named operator lead is on the line and the first-72-hours playbook starts immediately.' },
    { q: 'Do you replace my PR agency?', a: 'No. A.R.I.A runs the reputation-surface, AI-search, platform and legal lanes alongside whatever PR or comms team you already have.' },
    { q: 'What if the story is already in ChatGPT?', a: 'AI-search correction is a core part of the playbook. We address the underlying source contamination so the models stop repeating the story as fact.' },
    { q: 'Can you coordinate with my lawyers?', a: 'Yes — and we can also coordinate specialist UK defamation and privacy solicitors if you do not already have them.' },
    { q: 'How is success measured?', a: 'Quantified telemetry: SERP composition, AI-output diffs vs baseline, citation counts, sentiment trajectory and resurfacing rates — reported daily during a live incident.' },
    { q: 'Do you work with families and protected individuals?', a: 'Yes. Family and protected-individual crises are handled with discretion and an explicit privacy-first protocol.' },
  ],
  relatedLinks: [
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/founder-reputation-protection', label: 'Founder Reputation Protection' },
    { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
    { to: '/resources/crisis-reputation-response-checklist', label: 'Crisis Reputation Response Checklist' },
  ],
  serviceType: 'Crisis reputation management',
  breadcrumbName: 'Crisis Reputation Management',
};

export default function CrisisReputationManagementPage() {
  return <StealthLandingPage cfg={cfg} />;
}
