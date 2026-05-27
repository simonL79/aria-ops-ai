import React from 'react';
import { Award, Camera, Globe2, HeartHandshake, ShieldCheck, Trophy } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';
import ExternalAuthorityLinks from '@/components/seo/ExternalAuthorityLinks';

const cfg: StealthPageConfig = {
  path: '/athlete-reputation-management',
  title: 'Athlete Reputation Management | A.R.I.A™',
  metaDescription:
    'Sponsorship-grade reputation management for athletes — protect endorsements, manage crisis, suppress historic content and control how AI search describes you.',
  h1: 'Athlete Reputation Management',
  heroEyebrow: 'Sponsorship-grade protection',
  heroSubhead:
    'Sponsors don’t Google you anymore — they prompt an AI. A.R.I.A is the reputation operator for athletes whose deals, selection and legacy now depend on what models, journalists and federations see in seconds.',
  problem: {
    heading: 'One historic post can cost a career-defining deal.',
    body: [
      'Brand-safety teams run AI-assisted reputation checks before signing endorsement deals. A single decade-old tweet, a misreported court story, a tabloid pile-on or a hallucinated ChatGPT summary can quietly remove an athlete from a shortlist they never knew they were on.',
      'Traditional sports PR handles the headlines. Traditional ORM handles Google. Neither handles the AI layer that now decides whether a brand-safety officer recommends signing you.',
      'A.R.I.A operates across all three — sponsor-grade due diligence, historic content suppression, AI-search correction and live crisis response — built around the calendar of training camps, fight nights, fixtures, transfer windows and contract negotiations.',
    ],
  },
  capabilities: [
    { icon: Trophy, title: 'Sponsor-grade due diligence', body: 'Pre-emptive reputation audit modelled on what brand-safety teams actually run, so you know what they will find before they do.' },
    { icon: Camera, title: 'Historic content suppression', body: 'Old social posts, junior-career articles, dated press and misreported stories suppressed, delisted or push-down.' },
    { icon: ShieldCheck, title: 'AI search defence', body: 'ChatGPT, Gemini, Perplexity and Google AI Overviews shaped so they describe you the way your team would.' },
    { icon: HeartHandshake, title: 'Endorsement-deal protection', body: 'Live monitoring tied to your active sponsors so any reputation event is flagged to your team before it’s flagged to theirs.' },
    { icon: Globe2, title: 'Multi-market coverage', body: 'UK, US, Middle East, Asia and EU markets — search and AI surfaces monitored in the languages your sponsors and federations care about.' },
    { icon: Award, title: 'Federation & selection risk', body: 'Federation, governing body and selection-committee perception monitored separately from public sentiment.' },
  ],
  keywordClusters: [
    {
      title: 'Athletes & sports',
      items: [
        'Athlete reputation management',
        'Sports reputation management',
        'Boxer reputation management',
        'Footballer reputation management',
        'MMA reputation management',
        'Reputation protection for athletes',
        'Athlete digital protection',
        'Athlete privacy protection',
      ],
    },
    {
      title: 'Commercial protection',
      items: [
        'Sponsorship reputation protection',
        'Endorsement deal protection',
        'Brand-safety reputation audit',
        'Pre-deal reputation clearance',
        'Athlete commercial management',
        'Commercial reputation protection for athletes',
      ],
    },
    {
      title: 'Surfaces covered',
      items: [
        'Google reputation suppression for athletes',
        'AI reputation management for athletes',
        'ChatGPT visibility for athletes',
        'Social media reputation monitoring',
        'Tabloid story suppression',
        'Historic content cleanup',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Sponsor-grade audit', body: 'Reputation surface mapped exactly the way a brand-safety team would map it — Google, AI, social, news, federation press, historic forums.' },
    { step: '02', title: 'Historic cleanup', body: 'Old posts, dated articles and misreported stories triaged into legal removal, platform delisting, push-down or AI-source-correction.' },
    { step: '03', title: 'Sponsor & federation perception monitor', body: 'Targeted listening tuned to brand-safety officers, federation press, governing-body channels and selection-committee context.' },
    { step: '04', title: 'AI search engineering', body: 'Schema, Wikidata, official bios and authoritative profiles aligned so AI models describe the athlete consistently and accurately.' },
    { step: '05', title: 'Crisis playbook', body: 'A pre-built first-72-hours response plan tied to your team — manager, PR, lawyer, sponsor liaison — ready before any incident, not drafted during one.' },
    { step: '06', title: 'Continuous protection', body: 'Always-on monitoring with severity grading and direct escalation to the named contact on your team.' },
  ],
  comparison: {
    competitorLabel: 'Generic sports PR + consumer ORM',
    rows: [
      { feature: 'Press & headline management', competitor: true, aria: true },
      { feature: 'Sponsor-grade brand-safety audit', competitor: false, aria: true },
      { feature: 'Historic social cleanup', competitor: 'Limited', aria: 'Full' },
      { feature: 'AI search visibility management', competitor: false, aria: true },
      { feature: 'Federation & selection-committee perception monitor', competitor: false, aria: true },
      { feature: 'Pre-built first-72-hours playbook', competitor: 'Sometimes', aria: 'Always' },
      { feature: 'Always-on operator response', competitor: false, aria: true },
    ],
  },
  faqs: [
    { q: 'How is this different from a sports PR agency?', a: 'Sports PR shapes the narrative in the press. A.R.I.A shapes the reputation surface — Google, AI, historic content, federation perception, data brokers — that the press, sponsors and AI models pull from.' },
    { q: 'Will sponsors really run an AI reputation check?', a: 'Yes. Brand-safety teams across major endorsement categories now use AI-assisted reputation screening as the first filter. By the time it gets to a human, the AI has already shortlisted.' },
    { q: 'Can you clean up old social posts?', a: 'Yes — across platforms with mass-deletion tools, archival removal where possible, and SEO/AI suppression where deletion isn’t.' },
    { q: 'Do you work with the athlete’s existing manager?', a: 'Yes. A.R.I.A operates as the reputation layer inside an existing team — alongside management, PR, legal and sponsorship reps.' },
    { q: 'Do you cover combat sports?', a: 'Yes — boxing, MMA and combat-sport athletes are a core engagement type, given the visibility, sponsor sensitivity and historic-content profile of the sport.' },
  ],
  relatedLinks: [
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/founder-reputation-protection', label: 'Founder Reputation Protection' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/resources/athlete-reputation-protection-guide', label: 'Athlete Reputation Protection Guide' },
  ],
  serviceType: 'Athlete reputation management',
  breadcrumbName: 'Athlete Reputation Management',
};

export default function AthleteReputationManagementPage() {
  return (
    <>
      <StealthLandingPage cfg={cfg} />
      <ExternalAuthorityLinks />
    </>
  );
}
