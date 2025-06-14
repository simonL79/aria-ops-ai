
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import ProfileTestPanel from "@/components/dashboard/ProfileTestPanel";
import ContentIntelligencePanel from "@/components/dashboard/ContentIntelligencePanel";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardControlsProps {
  isScanning: boolean;
  onScan: () => void;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
  onSelectTestProfile: (profile: any) => void;
}

const DashboardControls = ({
  isScanning,
  onScan,
  onDateRangeChange,
  onSelectTestProfile
}: DashboardControlsProps) => {
  const navigate = useNavigate();
  
  // Prevent default behavior when scanning
  const handleScan = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Track scan in analytics
    try {
      // Log scan to Supabase
      fetch('/api/log-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'live_scan', timestamp: new Date().toISOString() })
      }).catch(err => console.error('Error logging scan:', err));
    } catch (error) {
      console.error("Error tracking scan:", error);
    }
    
    onScan();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <DateRangePicker onDateRangeChange={onDateRangeChange} />
        <ProfileTestPanel onSelectTestProfile={onSelectTestProfile} />
        <ContentIntelligencePanel />
      </div>
      <Button 
        onClick={handleScan} 
        disabled={isScanning}
        className="w-full md:w-auto shadow-md bg-[#247CFF] hover:bg-[#1c63cc] text-white"
        type="button"
      >
        {isScanning ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Running Live Intelligence Sweep...
          </>
        ) : (
          "Live Intelligence Sweep"
        )}
      </Button>
    </div>
  );
};

export default DashboardControls;
