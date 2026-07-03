import React from 'react';
import { AlarmClock, MessageSquareWarning, Megaphone, PhoneCall, ShieldAlert, Users } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/crisis-communications',
  title: 'Crisis Communications | 24/7 Response Team | A.R.I.A™',
  metaDescription:
    'Operator-led crisis communications across press, Google, AI search, social and stakeholders. A crisis communication plan and 24/7 response team for founders, executives and brands.',
  h1: 'Crisis Communications',
  heroEyebrow: 'Say the right thing, in the right place, fast',
  heroSubhead:
    'A live crisis communications team that manages your message across press, Google, ChatGPT, Gemini, social and stakeholder channels — with a pre-built plan, not an improvised statement.',
  problem: {
    heading: 'Crisis communication is no longer just a press statement.',
    body: [
      'The moment an incident breaks, your message has to land in several places at once: to journalists, to your own staff, to customers and partners, and — increasingly — inside the AI tools and search results that summarise the story for everyone else. A single holding statement to the press no longer controls the narrative.',
      'A.R.I.A’s crisis communications practice builds and runs a coordinated message across every channel that shapes opinion: press and spokesperson strategy, Google and AI-search correction, social and platform escalation, and direct stakeholder briefing — all from one operator-led command line.',
      'Every engagement gets a named lead, a defined crisis communication plan covering the first 72 hours, approved messaging templates, and quantified reporting to your board, investors, sponsors or governing body for as long as the incident is live.',
    ],
  },
  capabilities: [
    { icon: AlarmClock, title: '24/7 activation', body: 'A single line reaches a named operator lead, on call until the incident is stabilised.' },
    { icon: MessageSquareWarning, title: 'Message architecture', body: 'Approved holding statements, spokesperson lines, Q&A and channel-specific messaging drafted before you speak.' },
    { icon: Megaphone, title: 'Press & spokesperson strategy', body: 'Media handling, spokesperson briefing and statement sequencing coordinated with any PR team you already use.' },
    { icon: ShieldAlert, title: 'Search & AI correction', body: 'Google results and AI-search summaries (ChatGPT, Gemini, Perplexity, AI Overviews) corrected so they stop repeating the wrong version.' },
    { icon: Users, title: 'Stakeholder briefing', body: 'Staff, customers, partners, sponsors, investors and board briefed directly so they hear it from you first, framed correctly.' },
    { icon: PhoneCall, title: 'Live command line', body: 'One channel to run the incident — decisions, approvals and updates in one place instead of scattered threads.' },
  ],
  keywordClusters: [
    {
      title: 'Crisis communication',
      items: [
        'Crisis communication',
        'Crisis communications',
        'Crisis communication plan',
        'Crisis communication strategy',
        'Crisis communications management',
        'Crisis communications consultant',
        'Crisis communications agency',
      ],
    },
    {
      title: 'Message & channels',
      items: [
        'Holding statement',
        'Spokesperson briefing',
        'Media crisis response',
        'Stakeholder communication',
        'Internal crisis communication',
        'Social media crisis response',
        'AI search correction',
      ],
    },
    {
      title: 'Scenarios',
      items: [
        'Corporate crisis communication',
        'Executive crisis communication',
        'Data breach communication',
        'Product recall communication',
        'Reputational incident response',
        'Emergency communications',
      ],
    },
  ],
  methodology: [
    { step: '00', title: 'Activation call', body: 'One call activates a named operator lead, briefs your team, and starts the crisis communication plan.' },
    { step: '01', title: 'Hour 0–6: message lock', body: 'Severity graded, holding statement and spokesperson lines approved, channel plan set, first stakeholder alerts sent.' },
    { step: '02', title: 'Hour 6–24: press & search', body: 'Media strategy executed, Google and AI-search correction started, social escalation routes opened.' },
    { step: '03', title: 'Hour 24–48: stakeholder rounds', body: 'Staff, customers, partners, sponsors, investors and board briefed with consistent, approved messaging.' },
    { step: '04', title: 'Hour 48–72: stabilisation', body: 'Message consistency monitored across press, search and AI surfaces; sentiment and coverage reported.' },
    { step: '05', title: 'Beyond 72h: durable posture', body: 'Transition into ongoing monitoring, refreshed messaging library, and a debrief that hardens you for next time.' },
  ],
  comparison: {
    competitorLabel: 'Traditional crisis comms agencies',
    rows: [
      { feature: 'Press strategy & spokesperson briefing', competitor: true, aria: true },
      { feature: 'Approved multi-channel message architecture', competitor: 'Partial', aria: 'Full' },
      { feature: 'Google search-surface correction', competitor: 'Limited', aria: 'Full' },
      { feature: 'AI-search correction (ChatGPT/Gemini/AI Overviews)', competitor: false, aria: true },
      { feature: 'Social & platform escalation', competitor: 'Sometimes', aria: 'Always' },
      { feature: 'Direct stakeholder briefing packs', competitor: true, aria: true },
      { feature: 'Quantified sentiment & coverage telemetry', competitor: false, aria: true },
      { feature: 'Post-incident debrief & readiness', competitor: 'Optional', aria: 'Built-in' },
    ],
  },
  faqs: [
    { q: 'What is crisis communication?', a: 'Crisis communication is the practice of managing what an organisation says — and where it says it — when an event threatens its reputation. It covers press statements, spokesperson messaging, internal and stakeholder communication, and today the correction of Google and AI-search results. A.R.I.A runs all of these in parallel from a single operator-led command line rather than issuing one press statement and hoping it holds.' },
    { q: 'What is a crisis communication plan?', a: 'A crisis communication plan is a pre-built playbook that defines who speaks, what they say, which channels are used and in what order during the critical first hours of an incident. A.R.I.A’s plan covers hour 0 through hour 72 with approved holding statements, spokesperson lines, Q&A and stakeholder briefing packs, so nothing is improvised under pressure.' },
    { q: 'How is crisis communications different from crisis PR?', a: 'Crisis PR focuses on press and media handling. Crisis communications is broader — it also covers internal staff messaging, stakeholder and customer communication, and the search and AI surfaces that now shape opinion. A.R.I.A treats them as one coordinated operation.' },
    { q: 'How fast can you activate?', a: 'Crisis communications engagements activate within one hour of the first call, 24/7, with a named operator lead on the line and the crisis communication plan starting immediately.' },
    { q: 'Do you replace my PR or comms team?', a: 'No. A.R.I.A coordinates with any existing PR or comms team and adds the search-surface, AI-search, platform and stakeholder lanes they typically do not cover.' },
    { q: 'Can you handle internal and stakeholder messaging too?', a: 'Yes. Staff, customers, partners, sponsors, investors and board are all briefed with consistent, approved messaging so the story is framed correctly everywhere at once.' },
    { q: 'How is success measured?', a: 'Quantified telemetry: message consistency across channels, media coverage tone, SERP and AI-output composition, sentiment trajectory and resurfacing rates — reported daily during a live incident.' },
  ],
  relatedLinks: [
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management UK' },
    { to: '/corporate-reputation-management', label: 'Corporate Reputation Management' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
  ],
  serviceType: 'Crisis communications',
  breadcrumbName: 'Crisis Communications',
};

export default function CrisisCommunicationsPage() {
  return <StealthLandingPage cfg={cfg} />;
}
