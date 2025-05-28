
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, Loader } from "lucide-react";

interface ScanControlsProps {
  maxResults: number;
  includeCustomerEnquiries: boolean;
  isScanning: boolean;
  onMaxResultsChange: (value: number) => void;
  onCustomerEnquiriesChange: (checked: boolean) => void;
  onStartScan: () => void;
}

const ScanControls = ({
  maxResults,
  includeCustomerEnquiries,
  isScanning,
  onMaxResultsChange,
  onCustomerEnquiriesChange,
  onStartScan
}: ScanControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Maximum Results</Label>
        <Input 
          type="number"
          min="1"
          max="10"
          value={maxResults}
          onChange={(e) => onMaxResultsChange(parseInt(e.target.value) || 3)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="customer-enquiries"
          checked={includeCustomerEnquiries}
          onCheckedChange={onCustomerEnquiriesChange}
        />
        <Label htmlFor="customer-enquiries">Include Customer Enquiries</Label>
      </div>
      
      <Button 
        onClick={onStartScan} 
        className="w-full" 
        disabled={isScanning}
        variant="scan"
      >
        {isScanning ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Start Manual Scan
          </>
        )}
      </Button>
    </div>
  );
};

export default ScanControls;
