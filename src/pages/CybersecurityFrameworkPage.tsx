import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Shield, Database, KeyRound, ServerCog, Brain, Activity,
  UserCheck, AlertTriangle, Network, Award, ArrowLeft, CheckCircle2
} from 'lucide-react';
import Footer from '@/components/layout/Footer';

interface Section {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  intro?: string;
  groups: Array<{
    heading?: string;
    items: string[];
  }>;
}

const sections: Section[] = [
  {
    id: 'governance',
    number: '01',
    title: 'Governance',
    icon: Shield,
    intro: 'Control model aligned to ISO 27001, NCSC Cyber Assessment Framework, Cyber Essentials Plus, and UK GDPR.',
    groups: [
      {
        heading: 'Core Policies',
        items: [
          'Information Security Policy',
          'Acceptable Use Policy',
          'Access Control Policy',
          'Data Protection and Privacy Policy',
          'Incident Response Policy',
          'Supplier Security Policy',
          'AI Governance and Model Risk Policy',
          'Client Confidentiality and Crisis Handling Policy',
        ],
      },
      {
        heading: 'Named Owners',
        items: [
          'Security Lead',
          'Data Protection Lead',
          'Incident Response Lead',
          'AI Governance Lead',
          'Supplier / Vendor Risk Owner',
        ],
      },
    ],
  },
  {
    id: 'data-classification',
    number: '02',
    title: 'Data Classification',
    icon: Database,
    intro: 'A.R.I.A™ handles sensitive client reputation, executive, family, social, threat, and dark-web intelligence data. A four-tier model governs handling.',
    groups: [
      {
        items: [
          'Public — marketing material and public reports',
          'Internal — operational procedures and playbooks',
          'Confidential — client names, monitoring reports, risk assessments',
          'Restricted — executive/family data, legal matters, crisis files, credentials, dark-web findings, identity documents, private communications',
        ],
      },
      {
        heading: 'Restricted Tier Controls',
        items: [
          'Encryption in transit and at rest',
          'Strict role-based access',
          'Comprehensive access logging',
          'Defined retention limits',
        ],
      },
    ],
  },
  {
    id: 'identity-access',
    number: '03',
    title: 'Identity & Access',
    icon: KeyRound,
    groups: [
      {
        heading: 'Minimum Controls',
        items: [
          'MFA for all users',
          'SSO for internal systems where possible',
          'Role-based access control',
          'Least privilege by default',
          'Separate administrative accounts',
          'Quarterly access reviews',
          'Immediate access removal for leavers',
          'No shared accounts',
          'Mandatory password manager',
        ],
      },
      {
        heading: 'High-Risk Areas',
        items: [
          'Client case files',
          'Monitoring dashboards',
          'Dark-web alerts',
          'AI prompt and history logs',
        ],
      },
    ],
  },
  {
    id: 'platform-security',
    number: '04',
    title: 'Platform Security',
    icon: ServerCog,
    groups: [
      {
        items: [
          'TLS 1.2+ for all data in transit',
          'Encryption of data at rest',
          'Audit logs for all client data access',
          'Secure cloud configuration baselines',
          'Monthly vulnerability scans',
          'Critical vulnerabilities patched within 72 hours',
          'High vulnerabilities patched within 14 days',
          'Separate development, test, and production environments',
          'Secure secrets management',
          'Annual penetration testing',
        ],
      },
    ],
  },
  {
    id: 'ai-security',
    number: '05',
    title: 'AI Security',
    icon: Brain,
    intro: 'Because A.R.I.A™ is AI-powered, model-specific controls protect client data, prevent misuse, and contain hallucination risk.',
    groups: [
      {
        items: [
          'No model training on client data without contractual agreement',
          'Segregation of client prompts, outputs, and case notes',
          'Logging of AI decisions affecting client strategy',
          'Mandatory human review for crisis-response recommendations',
          'Prompt-injection prevention via input filtering and context boundaries',
          'Red-teaming for data leakage, hallucination, and unsafe recommendations',
          'Approved prompt and response template library',
          'AI output labelled as assisted analysis — never final truth',
        ],
      },
    ],
  },
  {
    id: 'monitoring',
    number: '06',
    title: 'Monitoring & Threat Intelligence',
    icon: Activity,
    intro: 'A.R.I.A™ monitors its own environment with the same rigour applied to client reputations.',
    groups: [
      {
        items: [
          'Centralised logging across all systems',
          'Security alerting for unusual access patterns',
          'Dark-web monitoring for A.R.I.A™ domains, staff emails, API keys, and client exposure',
          'Brand and domain spoofing detection',
          'Phishing detection and reporting workflows',
          'Defined alert escalation process',
          '24/7 critical incident route for client crisis operations',
        ],
      },
    ],
  },
  {
    id: 'client-data',
    number: '07',
    title: 'Client Data Protection',
    icon: UserCheck,
    intro: 'For executive, family, and reputation-protection clients, data handling exceeds regulatory minimums.',
    groups: [
      {
        items: [
          'Client-specific workspaces',
          'Logical separation of client data',
          'NDA and confidentiality controls for all staff and contractors',
          'Minimised collection of personal data',
          'Per-client retention periods',
          'Secure deletion at end of engagement',
          'Documented lawful basis for processing under UK GDPR',
          'DPIAs for high-risk monitoring activities',
          'No unnecessary storage of scraped or sensitive third-party data',
        ],
      },
    ],
  },
  {
    id: 'incident-response',
    number: '08',
    title: 'Incident Response',
    icon: AlertTriangle,
    intro: 'A documented incident response plan covers data breach, platform compromise, leaked client report, harmful AI recommendation, credential compromise, supplier breach, impersonation, and coordinated attacks.',
    groups: [
      {
        heading: 'Severity Levels & Response Targets',
        items: [
          'P1 Critical — Restricted client data exposed, active compromise, regulatory impact. Triage within 15 minutes; executive notification within 1 hour.',
          'P2 High — Unauthorised access attempt, malware, supplier issue. Response within 4 hours.',
          'P3 Medium — Suspicious activity requiring investigation. Response within 1 business day.',
          'P4 Low — Policy breach or minor operational issue. Response within 5 business days.',
        ],
      },
    ],
  },
  {
    id: 'supplier-security',
    number: '09',
    title: 'Supplier & Tooling Security',
    icon: Network,
    intro: 'A.R.I.A™ depends on AI providers, social monitoring tools, cloud services, email, analytics, and data sources. All are governed.',
    groups: [
      {
        items: [
          'Supplier security review prior to onboarding',
          'Data Processing Agreements in place',
          'Confirmed data residency',
          'SOC 2 / ISO 27001 evidence where available',
          'Breach notification clauses',
          'Annual supplier reassessment',
          'No client data uploaded to unapproved AI tools',
        ],
      },
    ],
  },
  {
    id: 'compliance',
    number: '10',
    title: 'Compliance Baseline',
    icon: Award,
    intro: 'Recommended certifications and evidence held or pursued.',
    groups: [
      {
        items: [
          'Cyber Essentials Plus — minimum UK trust signal',
          'ISO 27001 — enterprise credibility',
          'UK GDPR compliance pack',
          'DPIA templates',
          'Incident response runbooks',
          'Penetration test reports',
          'AI governance statement',
          'Client data handling statement',
        ],
      },
    ],
  },
];

const nextSteps = [
  'Build the policy pack',
  'Create a data map for client, monitoring, AI, and supplier flows',
  'Complete a DPIA for reputation and dark-web monitoring',
  'Implement MFA, SSO, logging, encryption, and access reviews',
  'Prepare a client-facing security statement for due diligence',
];

const CybersecurityFrameworkPage = () => {
  return (
    <>
      <Helmet>
        <title>Cybersecurity Framework | A.R.I.A™</title>
        <meta
          name="description"
          content="A.R.I.A™ Cybersecurity Framework — governance, AI security, client data protection, and incident response aligned to ISO 27001, NCSC CAF, Cyber Essentials Plus, and UK GDPR."
        />
        <link rel="canonical" href="https://ariaops.co.uk/cybersecurity-framework" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto max-w-6xl px-6 py-16 relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-orange-500 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-orange-500" />
              <span className="text-xs uppercase tracking-[0.2em] text-orange-500 font-medium">
                Trust & Compliance
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              A.R.I.A™ Cybersecurity Framework
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed">
              The control model governing how A.R.I.A™ protects client intelligence,
              executive data, and platform integrity — aligned to ISO 27001, NCSC CAF,
              Cyber Essentials Plus, and UK GDPR.
            </p>
          </div>
        </div>

        {/* TOC */}
        <div className="container mx-auto max-w-6xl px-6 py-10 border-b border-white/10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Contents</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-start gap-2 p-3 rounded-lg border border-white/5 hover:border-orange-500/40 hover:bg-white/[0.02] transition-all"
              >
                <span className="text-xs font-mono text-orange-500/70 mt-0.5">{s.number}</span>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="container mx-auto max-w-4xl px-6 py-16 space-y-20">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-orange-500/70 mb-1">
                      Section {section.number}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
                  </div>
                </div>

                {section.intro && (
                  <p className="text-white/70 leading-relaxed mb-8 text-lg">
                    {section.intro}
                  </p>
                )}

                <div className="space-y-8">
                  {section.groups.map((group, gi) => (
                    <div key={gi}>
                      {group.heading && (
                        <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4 font-medium">
                          {group.heading}
                        </h3>
                      )}
                      <ul className="space-y-3">
                        {group.items.map((item, ii) => (
                          <li
                            key={ii}
                            className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5"
                          >
                            <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-white/85 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Next Steps */}
          <section id="next-steps" className="scroll-mt-24">
            <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent p-8 md:p-10">
              <div className="text-xs uppercase tracking-[0.2em] text-orange-500 mb-3">
                Roadmap
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Immediate Next Steps</h2>
              <ol className="space-y-4">
                {nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-black font-bold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-white/90 leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Compliance badges */}
          <section className="text-center pt-8 border-t border-white/10">
            <p className="text-sm text-white/50 mb-6">
              Aligned to internationally recognised standards
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['ISO 27001', 'NCSC CAF', 'Cyber Essentials Plus', 'UK GDPR', 'SOC II'].map((b) => (
                <div
                  key={b}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-sm text-white/80"
                >
                  {b}
                </div>
              ))}
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CybersecurityFrameworkPage;
