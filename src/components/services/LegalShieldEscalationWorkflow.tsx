import React from 'react';
import { ArrowDown, Shield, Scale, Gavel, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const StepNode = ({
  icon: Icon,
  label,
  sub,
  tone = 'primary',
  className = '',
}: {
  icon: React.ElementType;
  label: string;
  sub?: string;
  tone?: 'primary' | 'amber' | 'green' | 'muted';
  className?: string;
}) => {
  const toneClasses = {
    primary: 'bg-primary/15 text-primary border-primary/40',
    amber: 'bg-amber-500/15 text-amber-500 border-amber-500/40',
    green: 'bg-green-500/15 text-green-500 border-green-500/40',
    muted: 'bg-card text-muted-foreground border-border',
  };

  return (
    <div
      className={`relative z-10 flex flex-col items-center text-center rounded-xl border px-5 py-4 w-56 sm:w-64 ${toneClasses[tone]} ${className}`}
    >
      <div className="mb-2">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-sm font-semibold leading-snug">{label}</div>
      {sub && <div className="text-xs mt-1 opacity-80 leading-snug">{sub}</div>}
    </div>
  );
};

const Connector = ({ className = '' }: { className?: string }) => (
  <div className={`h-8 w-px bg-gradient-to-b from-primary/60 to-primary/20 my-1 ${className}`} />
);

const BranchLabel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${className}`}>
    {children}
  </div>
);

const LegalShieldEscalationWorkflow = () => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Phase 1 — Intake */}
      <StepNode
        icon={Shield}
        label="1. Guided Legal Shield Intake"
        sub="You answer structured questions about the issue and upload evidence."
      />
      <Connector />

      {/* Phase 2 — Preparation */}
      <StepNode
        icon={FileCheck}
        label="2. AI Case Preparation"
        sub="Timeline, evidence index, risk flags, draft letters and plain-English summary."
      />
      <Connector />

      {/* Decision diamond */}
      <div className="relative flex flex-col items-center">
        <div className="rotate-45 w-24 h-24 sm:w-28 sm:h-28 border-2 border-amber-500/40 bg-amber-500/10 rounded-lg flex items-center justify-center">
          <div className="-rotate-45 text-center px-2">
            <div className="text-xs uppercase tracking-wider text-amber-500 font-semibold mb-1">Triage</div>
            <div className="text-xs font-medium text-foreground leading-tight">Takedown or regulatory action needed?</div>
          </div>
        </div>
      </div>

      {/* Branching paths */}
      <div className="w-full max-w-4xl mt-6 grid md:grid-cols-2 gap-8 md:gap-4">
        {/* Standard path */}
        <div className="flex flex-col items-center">
          <BranchLabel className="mb-4">No — standard legal matter</BranchLabel>
          <StepNode
            icon={Scale}
            label="Solicitor-Ready Case Pack"
            sub="Downloadable PDF with organised evidence, summary and draft documents."
            tone="green"
          />
          <Connector className="from-green-500/60 to-green-500/20" />
          <StepNode
            icon={CheckCircle}
            label="Instruct a solicitor"
            sub="You remain in control. If needed, escalate later."
            tone="green"
          />
        </div>

        {/* Escalation path */}
        <div className="flex flex-col items-center">
          <BranchLabel className="mb-4">Yes — hostile content or data breach</BranchLabel>
          <StepNode
            icon={AlertTriangle}
            label="Escalate to Legal Defence & Compliance"
            sub="The statutory layer of reputation protection takes over."
            tone="amber"
          />
          <Connector className="from-amber-500/60 to-amber-500/20" />
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="bg-card border border-border rounded-lg px-3 py-3 text-center text-xs text-muted-foreground">
              <Gavel className="h-4 w-4 text-primary mx-auto mb-1" />
              Defamation pre-action
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-3 text-center text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary mx-auto mb-1" />
              GDPR / RTBF takedown
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-3 text-center text-xs text-muted-foreground">
              <FileCheck className="h-4 w-4 text-primary mx-auto mb-1" />
              Cease & desist
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-3 text-center text-xs text-muted-foreground">
              <Scale className="h-4 w-4 text-primary mx-auto mb-1" />
              ICO / regulator escalation
            </div>
          </div>
          <Connector className="from-amber-500/60 to-amber-500/20" />
          <StepNode
            icon={CheckCircle}
            label="Removal, suppression or litigation handoff"
            sub="Outcome logged to a compliance audit trail."
            tone="green"
          />
        </div>
      </div>

      {/* Bottom bridge */}
      <div className="mt-8 max-w-2xl text-center text-sm text-muted-foreground">
        Both paths feed back into the same A.R.I.A™ record. If a standard matter later becomes a
        takedown or regulatory issue, it can be escalated at any time.
      </div>
    </div>
  );
};

export default LegalShieldEscalationWorkflow;
