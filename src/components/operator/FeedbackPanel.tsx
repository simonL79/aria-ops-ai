
import React from 'react';
import LuminoscorePanel from './LuminoscorePanel';
import CitadelPanel from './CitadelPanel';
import { SentinelgridPanel } from "./SentinelgridPanel";
import { ZeuslinkPanel } from "./ZeuslinkPanel";
import { PerimetrixPanel } from "./PerimetrixPanel";
import { TitanvaultPanel } from "./TitanvaultPanel";
import { PolarisPanel } from "./PolarisPanel";
import { VoxtracePanel } from "./VoxtracePanel";
import { ShadowvaultPanel } from "./ShadowvaultPanel";
import { StrikecorePanel } from "./StrikecorePanel";
import { CerebraPanel } from "./CerebraPanel";
import { IronvaultPanel } from "./IronvaultPanel";
import { HalcyonPanel } from "./HalcyonPanel";
import { ShieldhavenPanel } from "./ShieldhavenPanel";
import { MirrorspacePanel } from "./MirrorspacePanel";
import { PropheticVisionPanel } from "./PropheticVisionPanel";
import { SentinelShieldPanel } from "./SentinelShieldPanel";
import { NexusPanel } from "./NexusPanel";
import { PanopticaPanel } from './PanopticaPanel';
import { SelfHealingPanel } from './SelfHealingPanel';
import { StrategicResponsePanel } from "./StrategicResponsePanel";
import { AletheiaTruthPanel } from "./AletheiaTruthPanel";
import { ErisPanel } from "./ErisPanel";
import { SentiencePanel } from "./SentiencePanel";
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
      <LuminoscorePanel />
      <CitadelPanel />
      <SentinelgridPanel />
      <ZeuslinkPanel />
      <PerimetrixPanel />
      <TitanvaultPanel />
      <PolarisPanel />
      <VoxtracePanel />
      <ShadowvaultPanel />
      <StrikecorePanel />
      <CerebraPanel />
      <IronvaultPanel />
      <HalcyonPanel />
      <ShieldhavenPanel />
      <MirrorspacePanel />
      <PropheticVisionPanel />
      <SentinelShieldPanel />
      <NexusPanel />
      <PanopticaPanel />
      <SelfHealingPanel />
      <StrategicResponsePanel />
      <AletheiaTruthPanel />
      <ErisPanel />
      <SentiencePanel />
      <CommandExecutionFeedback feedback={feedback} />
      <RemediationSuggestions suggestions={suggestions} />
    </div>
  );
};
