
import React from 'react';
import { LuminoscorePanel } from './LuminoscorePanel';
import { CortextracePanel } from './CortextracePanel';
import { SentinelgridPanel } from './SentinelgridPanel';
import { ZeuslinkPanel } from './ZeuslinkPanel';
import { PerimetrixPanel } from './PerimetrixPanel';
import { TitanvaultPanel } from './TitanvaultPanel';
import { PolarisPanel } from './PolarisPanel';
import { VoxtracePanel } from './VoxtracePanel';
import { ShadowvaultPanel } from './ShadowvaultPanel';
import { StrikecorePanel } from './StrikecorePanel';
import { CerebraPanel } from './CerebraPanel';
import { IronvaultPanel } from './IronvaultPanel';
import { HalcyonPanel } from './HalcyonPanel';
import { ShieldhavenPanel } from './ShieldhavenPanel';
import { MirrorspacePanel } from './MirrorspacePanel';
import { CitadelPanel } from './CitadelPanel';
import { PropheticVisionPanel } from './PropheticVisionPanel';
import { SentinelShieldPanel } from './SentinelShieldPanel';
import { NexusPanel } from './NexusPanel';
import { PanopticaPanel } from './PanopticaPanel';
import { SelfHealingPanel } from './SelfHealingPanel';
import { StrategicResponsePanel } from './StrategicResponsePanel';
import { AletheiaTruthPanel } from './AletheiaTruthPanel';
import { ErisPanel } from './ErisPanel';
import { SentiencePanel } from './SentiencePanel';
import { CommandExecutionFeedback } from './feedback/CommandExecutionFeedback';
import { RemediationSuggestions } from './feedback/RemediationSuggestions';
import { useFeedbackData } from './feedback/useFeedbackData';

interface FeedbackPanelProps {
  commandHistory: any[];
}

export const FeedbackPanel = ({ commandHistory }: FeedbackPanelProps) => {
  const { feedback, suggestions } = useFeedbackData();

  return (
    <div className="space-y-4">
      {/* LUMINOSCORE™ Influence, Impact & Exposure Scoring System Panel */}
      <LuminoscorePanel />

      {/* CORTEXTRACE™ Strategic Memory & Trajectory Engine Panel */}
      <CortextracePanel />

      {/* SENTINELGRID™ Global Risk Sentinel Mesh Panel */}
      <SentinelgridPanel />

      {/* ZEUSLINK™ Federated OSINT Signal Bridge Panel */}
      <ZeuslinkPanel />

      {/* PERIMETRIX™ Network Perimeter Intelligence Panel */}
      <PerimetrixPanel />

      {/* TITANVAULT™ Legal & Compliance Fortress Panel */}
      <TitanvaultPanel />

      {/* POLARIS™ Counter-Narrative Generator & Deployment Hub Panel */}
      <PolarisPanel />

      {/* VOXTRACE™ Audio Threat Detection & Forensic Logging Panel */}
      <VoxtracePanel />

      {/* SHADOWVAULT™ Dark Web Threat Monitoring & Risk Indexing Panel */}
      <ShadowvaultPanel />

      {/* STRIKECORE™ Reputation Strike & Recovery Analytics Panel */}
      <StrikecorePanel />

      {/* CEREBRA™ AI Bias & Influence Detection Engine Panel */}
      <CerebraPanel />

      {/* IRONVAULT™ Document Leak & Surveillance System Panel */}
      <IronvaultPanel />

      {/* HALCYON™ Media Manipulation & Propaganda Detection Panel */}
      <HalcyonPanel />

      {/* SHIELDHAVEN™ Legal & Regulatory AI Defense Panel */}
      <ShieldhavenPanel />

      {/* MIRRORSPACE™ Behavioral Surveillance & Influence Index Panel */}
      <MirrorspacePanel />

      {/* CITADEL™ Infrastructure Reinforcement & Policy Vaulting Panel */}
      <CitadelPanel />

      {/* PROPHETIC VISION™ Predictive Threat Intelligence Panel */}
      <PropheticVisionPanel />

      {/* SENTINEL SHIELD™ Autonomous Perimeter Defense Panel */}
      <SentinelShieldPanel />

      {/* NEXUS CORE™ Inter-Agent Collaboration Panel */}
      <NexusPanel />

      {/* PANOPTICA™ Sensor Fusion Panel */}
      <PanopticaPanel />

      {/* Self-Healing Panel */}
      <SelfHealingPanel />

      {/* Strategic Response Panel */}
      <StrategicResponsePanel />

      {/* Aletheia Truth Panel */}
      <AletheiaTruthPanel />

      {/* Eris Adversarial Defense Panel */}
      <ErisPanel />

      {/* Sentience Loop Panel */}
      <SentiencePanel />

      {/* Command Execution Feedback */}
      <CommandExecutionFeedback feedback={feedback} />

      {/* AI Remediation Suggestions */}
      <RemediationSuggestions suggestions={suggestions} />
    </div>
  );
};
