
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import ProfileTestPanel from "@/components/dashboard/ProfileTestPanel";
import ContentIntelligencePanel from "@/components/dashboard/ContentIntelligencePanel";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { hasOpenAIKey } from "@/services/api/openaiClient";

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
    
    // Check if API key is available before scanning
    if (!hasOpenAIKey()) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel before scanning",
        action: {
          label: "Settings",
          onClick: () => navigate("/settings")
        },
        duration: 7000
      });
      return;
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
        className="w-full md:w-auto"
        type="button" // Explicitly set type to button
        variant="action"
      >
        {isScanning ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Running Intelligence Sweep...
          </>
        ) : (
          "Intelligence Sweep"
        )}
      </Button>
    </div>
  );
};

export default DashboardControls;
