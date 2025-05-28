
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AVAILABLE_PLATFORMS = [
  'Twitter', 'Reddit', 'News Article', 'Review Site', 
  'LinkedIn', 'TikTok', 'YouTube', 'Facebook', 'Blog'
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string, checked: boolean) => void;
}

const PlatformSelector = ({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Platforms to Scan</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {AVAILABLE_PLATFORMS.map(platform => (
          <div key={platform} className="flex items-center space-x-2">
            <Checkbox 
              id={`platform-${platform}`} 
              checked={selectedPlatforms?.includes(platform)}
              onCheckedChange={(checked) => onPlatformToggle(platform, !!checked)}
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
        {selectedPlatforms && selectedPlatforms.length > 0 
          ? `Selected: ${selectedPlatforms.length} platforms` 
          : "Leave empty to scan all platforms"}
      </p>
    </div>
  );
};

export default PlatformSelector;
