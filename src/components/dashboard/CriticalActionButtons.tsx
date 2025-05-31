
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Zap, 
  Activity, 
  FileText, 
  Play, 
  Scan,
  Target,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

const CriticalActionButtons: React.FC<CriticalActionButtonsProps> = ({
  onLiveThreatScan,
  onLiveIntelligenceSweep,
  onGuardianToggle,
  onGenerateReport,
  onActivateRealTime,
  onRunManualScan,
  isScanning = false,
  isGuardianActive = false,
  isRealTimeActive = false
}) => {
  const navigate = useNavigate();

  const handleLiveThreatScan = () => {
    if (onLiveThreatScan) {
      onLiveThreatScan();
    } else {
      toast.info('Initiating Live Threat Scan...');
      // Default implementation
      console.log('Live Threat Scan executed');
    }
  };

  const handleLiveIntelligenceSweep = () => {
    if (onLiveIntelligenceSweep) {
      onLiveIntelligenceSweep();
    } else {
      toast.info('Starting Live Intelligence Sweep...');
      // Default implementation
      console.log('Live Intelligence Sweep executed');
    }
  };

  const handleGuardianToggle = () => {
    if (onGuardianToggle) {
      onGuardianToggle();
    } else {
      const newState = !isGuardianActive;
      toast.success(`Guardian Mode ${newState ? 'Activated' : 'Deactivated'}`);
      console.log(`Guardian Mode ${newState ? 'activated' : 'deactivated'}`);
    }
  };

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport();
    } else {
      toast.info('Generating Executive Report...');
      navigate('/reports/executive');
    }
  };

  const handleActivateRealTime = () => {
    if (onActivateRealTime) {
      onActivateRealTime();
    } else {
      const newState = !isRealTimeActive;
      toast.success(`Real-Time Monitoring ${newState ? 'Activated' : 'Deactivated'}`);
      console.log(`Real-Time Monitoring ${newState ? 'activated' : 'deactivated'}`);
    }
  };

  const handleRunManualScan = () => {
    if (onRunManualScan) {
      onRunManualScan();
    } else {
      toast.info('Running Manual Scan...');
      console.log('Manual Scan executed');
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Target className="h-5 w-5 text-corporate-accent" />
          Critical Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Live Threat Scan */}
          <Button
            onClick={handleLiveThreatScan}
            disabled={isScanning}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            data-testid="live-threat-scan-button"
          >
            <Scan className="h-4 w-4" />
            {isScanning ? 'Scanning...' : 'Live Threat Scan'}
          </Button>

          {/* Live Intelligence Sweep */}
          <Button
            onClick={handleLiveIntelligenceSweep}
            disabled={isScanning}
            className="w-full bg-corporate-accent hover:bg-corporate-accentDark text-black flex items-center gap-2"
            data-testid="live-intelligence-sweep-button"
          >
            <Zap className="h-4 w-4" />
            Live Intelligence Sweep
          </Button>

          {/* Guardian Mode */}
          <Button
            onClick={handleGuardianToggle}
            variant={isGuardianActive ? "destructive" : "default"}
            className="w-full flex items-center gap-2"
            data-testid="guardian-button"
          >
            <Shield className="h-4 w-4" />
            Guardian {isGuardianActive ? 'ON' : 'OFF'}
            {isGuardianActive && (
              <Badge className="bg-green-500 text-white ml-1">ACTIVE</Badge>
            )}
          </Button>

          {/* Generate Report */}
          <Button
            onClick={handleGenerateReport}
            variant="outline"
            className="w-full border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary flex items-center gap-2"
            data-testid="generate-report-button"
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>

          {/* Activate Real-Time */}
          <Button
            onClick={handleActivateRealTime}
            variant={isRealTimeActive ? "destructive" : "default"}
            className="w-full flex items-center gap-2"
            data-testid="activate-real-time-button"
          >
            <Activity className="h-4 w-4" />
            {isRealTimeActive ? 'Stop Real-Time' : 'Activate Real-Time'}
          </Button>

          {/* Run Manual Scan */}
          <Button
            onClick={handleRunManualScan}
            variant="outline"
            disabled={isScanning}
            className="w-full border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary flex items-center gap-2"
            data-testid="run-manual-scan-button"
          >
            <AlertTriangle className="h-4 w-4" />
            {isScanning ? 'Scanning...' : 'Run Manual Scan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalActionButtons;
