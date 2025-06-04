
import { Brain, FileText, Shield, Target, AlertTriangle, BarChart, Settings } from 'lucide-react';
import StrategyBrain from './StrategyBrain';
import NarrativeBuilder from './NarrativeBuilder';
import ThreatTracker from './ThreatTracker';
import OpportunityRadar from './OpportunityRadar';
import ShieldhLegal from './ShieldhLegal';
import CommandReview from './CommandReview';
import SystemDiagnostics from './SystemDiagnostics';

export const modules = [
  {
    id: 'strategy-brain',
    label: 'Strategy Brain',
    icon: Brain,
    description: 'Pattern log, AI responses, tone control center',
    component: StrategyBrain
  },
  {
    id: 'narrative-builder',
    label: 'Narrative Builder',
    icon: FileText,
    description: 'Auto-loads keywords, AI themes, and saturation tools',
    component: NarrativeBuilder
  },
  {
    id: 'threat-tracker',
    label: 'Threat Tracker',
    icon: AlertTriangle,
    description: 'Real-time monitoring with priority ranking',
    component: ThreatTracker
  },
  {
    id: 'opportunity-radar',
    label: 'Opportunity Radar',
    icon: Target,
    description: 'Lead scanner + alert builder for proactive outreach',
    component: OpportunityRadar
  },
  {
    id: 'shieldh-legal',
    label: 'SHIELDHAVEN™',
    icon: Shield,
    description: 'Legal generator, compliance check, and strike commands',
    component: ShieldhLegal
  },
  {
    id: 'command-review',
    label: 'Command Review',
    icon: BarChart,
    description: 'Executive metrics, impact graphs, effectiveness audit',
    component: CommandReview
  },
  {
    id: 'system-diagnostics',
    label: 'System Diagnostics',
    icon: Settings,
    description: 'Service map and system health monitoring',
    component: SystemDiagnostics
  }
];
