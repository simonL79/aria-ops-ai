
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, FileText, Activity, Play, Search } from 'lucide-react';

interface CriticalActionButtonsProps {
  onLiveThreatScan?: () => void;
  onLiveIntelligenceSweep?: () => void;
  onGuardianToggle?: () => void;
  onGenerateReport?: () => void;
  onActivateRealTime?: () => void;
  onRunManualScan?: () => void;
  isScanning?: boolean;
  isGuardianActive?: boolean;
  isRealTimeActive?: boolean;
}

const CriticalActionButtons: React.FC<CriticalActionButtonsProps> = React.memo(({
  onLiveThreatScan = () => {},
  onLiveIntelligenceSweep = () => {},
  onGuardianToggle = () => {},
  onGenerateReport = () => {},
  onActivateRealTime = () => {},
  onRunManualScan = () => {},
  isScanning = false,
  isGuardianActive = false,
  isRealTimeActive = false
}) => {
  return (
    <Card className="corporate-card mb-4 w-full" data-testid="critical-action-buttons">
      <CardContent className="p-2 sm:p-3 lg:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2 lg:gap-3 w-full">
          <Button
            onClick={onLiveThreatScan}
            disabled={isScanning}
            data-testid="live-threat-scan-button"
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-1 sm:px-2 lg:px-3 py-2 sm:py-3 lg:py-4 h-auto flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] w-full transition-colors duration-200"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center leading-tight font-medium text-[10px] sm:text-xs lg:text-sm">
              Live Threat Scan
            </span>
          </Button>

          <Button
            onClick={onLiveIntelligenceSweep}
            disabled={isScanning}
            data-testid="live-intelligence-sweep-button"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-1 sm:px-2 lg:px-3 py-2 sm:py-3 lg:py-4 h-auto flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] w-full transition-colors duration-200"
          >
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center leading-tight font-medium text-[10px] sm:text-xs lg:text-sm">
              Live Intelligence Sweep
            </span>
          </Button>

          <Button
            onClick={onGuardianToggle}
            data-testid="guardian-toggle-button"
            className={`text-white text-xs sm:text-sm px-1 sm:px-2 lg:px-3 py-2 sm:py-3 lg:py-4 h-auto flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] w-full transition-colors duration-200 ${
              isGuardianActive 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center leading-tight font-medium text-[10px] sm:text-xs lg:text-sm">
              Guardian
            </span>
          </Button>

          <Button
            onClick={onGenerateReport}
            data-testid="generate-report-button"
            className="bg-corporate-accent hover:bg-corporate-accentDark text-black text-xs sm:text-sm px-1 sm:px-2 lg:px-3 py-2 sm:py-3 lg:py-4 h-auto flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] w-full transition-colors duration-200"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center leading-tight font-medium text-[10px] sm:text-xs lg:text-sm">
              Generate Report
            </span>
          </Button>

          <Button
            onClick={onActivateRealTime}
            data-testid="activate-realtime-button"
            className={`text-white text-xs sm:text-sm px-1 sm:px-2 lg:px-3 py-2 sm:py-3 lg:py-4 h-auto flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] w-full transition-colors duration-200 ${
              isRealTimeActive 
                ? 'bg-corporate-accent hover:bg-corporate-accentDark text-black' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center leading-tight font-medium text-[10px] sm:text-xs lg:text-sm">
              Activate Real-Time
            </span>
          </Button>

          <Button
            onClick={onRunManualScan}
            disabled={isScanning}
            data-testid="run-manual-scan-button"
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm px-1 sm:px-2 lg:px-3 py-2 sm:py-3 lg:py-4 h-auto flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] w-full transition-colors duration-200"
          >
            <Play className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center leading-tight font-medium text-[10px] sm:text-xs lg:text-sm">
              Run Manual Scan
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

CriticalActionButtons.displayName = 'CriticalActionButtons';

export default CriticalActionButtons;
