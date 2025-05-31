
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 w-full">
          <Button
            onClick={onLiveThreatScan}
            disabled={isScanning}
            data-testid="live-threat-scan-button"
            id="live-threat-scan-btn"
            aria-label="Live Threat Scan"
            className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 h-auto flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] w-full transition-all duration-200 text-xs sm:text-sm lg:text-base opacity-100 visible"
            style={{ display: 'flex', visibility: 'visible' }}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            <span className="text-center leading-tight font-medium">
              Live Threat Scan
            </span>
          </Button>

          <Button
            onClick={onLiveIntelligenceSweep}
            disabled={isScanning}
            data-testid="live-intelligence-sweep-button"
            id="live-intelligence-sweep-btn"
            aria-label="Live Intelligence Sweep"
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 h-auto flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] w-full transition-all duration-200 text-xs sm:text-sm lg:text-base opacity-100 visible"
            style={{ display: 'flex', visibility: 'visible' }}
          >
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            <span className="text-center leading-tight font-medium">
              Live Intelligence Sweep
            </span>
          </Button>

          <Button
            onClick={onGuardianToggle}
            data-testid="guardian-toggle-button"
            id="guardian-toggle-btn"
            aria-label="Guardian Mode Toggle"
            className={`text-white px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 h-auto flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] w-full transition-all duration-200 text-xs sm:text-sm lg:text-base opacity-100 visible ${
              isGuardianActive 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            style={{ display: 'flex', visibility: 'visible' }}
          >
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            <span className="text-center leading-tight font-medium">
              Guardian
            </span>
          </Button>

          <Button
            onClick={onGenerateReport}
            data-testid="generate-report-button"
            id="generate-report-btn"
            aria-label="Generate Report"
            className="bg-corporate-accent hover:bg-corporate-accentDark text-black px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 h-auto flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] w-full transition-all duration-200 text-xs sm:text-sm lg:text-base opacity-100 visible"
            style={{ display: 'flex', visibility: 'visible' }}
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            <span className="text-center leading-tight font-medium">
              Generate Report
            </span>
          </Button>

          <Button
            onClick={onActivateRealTime}
            data-testid="activate-realtime-button"
            id="activate-realtime-btn"
            aria-label="Activate Real-Time Monitoring"
            className={`text-white px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 h-auto flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] w-full transition-all duration-200 text-xs sm:text-sm lg:text-base opacity-100 visible ${
              isRealTimeActive 
                ? 'bg-corporate-accent hover:bg-corporate-accentDark text-black' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            style={{ display: 'flex', visibility: 'visible' }}
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            <span className="text-center leading-tight font-medium">
              Activate Real-Time
            </span>
          </Button>

          <Button
            onClick={onRunManualScan}
            disabled={isScanning}
            data-testid="run-manual-scan-button"
            id="run-manual-scan-btn"
            aria-label="Run Manual Scan"
            className="bg-orange-600 hover:bg-orange-700 text-white px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-5 h-auto flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] w-full transition-all duration-200 text-xs sm:text-sm lg:text-base opacity-100 visible"
            style={{ display: 'flex', visibility: 'visible' }}
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            <span className="text-center leading-tight font-medium">
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
