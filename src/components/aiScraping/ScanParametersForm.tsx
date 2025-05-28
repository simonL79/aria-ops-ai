
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanParameters, defaultScanParameters } from "@/types/aiScraping";
import { Settings } from "lucide-react";
import PlatformSelector from "./scanParameters/PlatformSelector";
import KeywordFilters from "./scanParameters/KeywordFilters";
import PrioritySelector from "./scanParameters/PrioritySelector";
import ScanControls from "./scanParameters/ScanControls";

interface ScanParametersFormProps {
  onStartScan: (params: ScanParameters) => void;
  isScanning: boolean;
}

const ScanParametersForm = ({ onStartScan, isScanning }: ScanParametersFormProps) => {
  const [parameters, setParameters] = useState<ScanParameters>({...defaultScanParameters});
  
  const handleAddKeyword = (keyword: string) => {
    setParameters(prev => ({
      ...prev,
      keywordFilters: [...(prev.keywordFilters || []), keyword]
    }));
  };
  
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setParameters(prev => ({
      ...prev,
      keywordFilters: prev.keywordFilters?.filter(k => k !== keywordToRemove) || []
    }));
  };
  
  const handlePlatformToggle = (platform: string, checked: boolean) => {
    setParameters(prev => {
      const currentPlatforms = prev.platforms || [];
      
      if (checked && !currentPlatforms.includes(platform)) {
        return { ...prev, platforms: [...currentPlatforms, platform] };
      } else if (!checked && currentPlatforms.includes(platform)) {
        return { ...prev, platforms: currentPlatforms.filter(p => p !== platform) };
      }
      
      return prev;
    });
  };
  
  const handlePriorityChange = (priority?: 'high' | 'medium' | 'low') => {
    setParameters(prev => ({
      ...prev,
      prioritizeSeverity: priority
    }));
  };
  
  const handleStartScan = () => {
    onStartScan(parameters);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Scan Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlatformSelector 
          selectedPlatforms={parameters.platforms || []}
          onPlatformToggle={handlePlatformToggle}
        />
        
        <KeywordFilters
          keywords={parameters.keywordFilters || []}
          onAddKeyword={handleAddKeyword}
          onRemoveKeyword={handleRemoveKeyword}
        />
        
        <PrioritySelector
          priority={parameters.prioritizeSeverity}
          onPriorityChange={handlePriorityChange}
        />
        
        <ScanControls
          maxResults={parameters.maxResults}
          includeCustomerEnquiries={parameters.includeCustomerEnquiries}
          isScanning={isScanning}
          onMaxResultsChange={(value) => setParameters(prev => ({ ...prev, maxResults: value }))}
          onCustomerEnquiriesChange={(checked) => setParameters(prev => ({ ...prev, includeCustomerEnquiries: checked }))}
          onStartScan={handleStartScan}
        />
      </CardContent>
    </Card>
  );
};

export default ScanParametersForm;
