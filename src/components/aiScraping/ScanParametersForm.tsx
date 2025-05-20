
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScanParameters, defaultScanParameters } from "@/services/aiScraping/mockScanner";
import { Search, Settings, X, Loader } from "lucide-react";

// Available platforms for scanning
const AVAILABLE_PLATFORMS = [
  'Twitter', 'Reddit', 'News Article', 'Review Site', 
  'LinkedIn', 'TikTok', 'YouTube', 'Facebook', 'Blog'
];

interface ScanParametersFormProps {
  onStartScan: (params: ScanParameters) => void;
  isScanning: boolean;
}

const ScanParametersForm = ({ onStartScan, isScanning }: ScanParametersFormProps) => {
  const [parameters, setParameters] = useState<ScanParameters>({...defaultScanParameters});
  const [keyword, setKeyword] = useState("");
  
  const handleAddKeyword = () => {
    if (keyword.trim() && !parameters.keywordFilters?.includes(keyword.trim())) {
      setParameters(prev => ({
        ...prev,
        keywordFilters: [...(prev.keywordFilters || []), keyword.trim()]
      }));
      setKeyword("");
    }
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
  
  const handleStartScan = () => {
    onStartScan(parameters);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
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
        <div className="space-y-2">
          <Label>Platforms to Scan</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AVAILABLE_PLATFORMS.map(platform => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox 
                  id={`platform-${platform}`} 
                  checked={parameters.platforms?.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformToggle(platform, !!checked)}
                />
                <Label 
                  htmlFor={`platform-${platform}`} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {platform}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {parameters.platforms && parameters.platforms.length > 0 
              ? `Selected: ${parameters.platforms.length} platforms` 
              : "Leave empty to scan all platforms"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Keyword Filters</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add keyword to filter by..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleAddKeyword} type="button" variant="outline">Add</Button>
          </div>
          
          {parameters.keywordFilters && parameters.keywordFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {parameters.keywordFilters.map(kw => (
                <Badge key={kw} variant="secondary" className="flex items-center gap-1">
                  {kw}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveKeyword(kw)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Priority Level</Label>
          <Select 
            value={parameters.prioritizeSeverity || "none"}
            onValueChange={(value) => setParameters(prev => ({
              ...prev, 
              prioritizeSeverity: value === "none" ? undefined : value as "high" | "medium" | "low"
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Maximum Results</Label>
          <Input 
            type="number"
            min="1"
            max="10"
            value={parameters.maxResults}
            onChange={(e) => setParameters(prev => ({ 
              ...prev, 
              maxResults: parseInt(e.target.value) || 3 
            }))}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="customer-enquiries"
            checked={parameters.includeCustomerEnquiries}
            onCheckedChange={(checked) => setParameters(prev => ({ 
              ...prev, 
              includeCustomerEnquiries: checked 
            }))}
          />
          <Label htmlFor="customer-enquiries">Include Customer Enquiries</Label>
        </div>
        
        <Button 
          onClick={handleStartScan} 
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
      </CardContent>
    </Card>
  );
};

export default ScanParametersForm;
