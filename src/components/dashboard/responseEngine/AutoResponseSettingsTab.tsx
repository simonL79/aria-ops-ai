
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutoResponseSettings } from "./types";
import { toneOptions, defaultAutoResponseSettings } from "./constants";

const AutoResponseSettingsTab = () => {
  const [autoResponseSettings, setAutoResponseSettings] = useState<AutoResponseSettings>(defaultAutoResponseSettings);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="auto-respond">Enable Auto-Response</Label>
          <p className="text-xs text-muted-foreground">
            Automatically generate responses to new content
          </p>
        </div>
        <Switch
          id="auto-respond"
          checked={autoResponseSettings.enabled}
          onCheckedChange={(checked) => 
            setAutoResponseSettings({...autoResponseSettings, enabled: checked})
          }
        />
      </div>
      
      <div>
        <Label>Response Threshold</Label>
        <Select 
          value={autoResponseSettings.threshold}
          onValueChange={(val: any) => 
            setAutoResponseSettings({...autoResponseSettings, threshold: val})
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select threshold" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="high">High Severity Only</SelectItem>
            <SelectItem value="medium">Medium & High Severity</SelectItem>
            <SelectItem value="none">Disable Auto-Response</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Choose what severity levels will trigger auto-responses
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="review-required">Require Review</Label>
          <p className="text-xs text-muted-foreground">
            Review responses before they are sent
          </p>
        </div>
        <Switch
          id="review-required"
          checked={autoResponseSettings.reviewRequired}
          onCheckedChange={(checked) => 
            setAutoResponseSettings({...autoResponseSettings, reviewRequired: checked})
          }
        />
      </div>
      
      <div>
        <Label>Default Tone</Label>
        <Select 
          value={autoResponseSettings.defaultTone}
          onValueChange={(val: any) => 
            setAutoResponseSettings({...autoResponseSettings, defaultTone: val})
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select default tone" />
          </SelectTrigger>
          <SelectContent>
            {toneOptions.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button className="w-full" disabled={!autoResponseSettings.enabled}>
        <Settings className="h-4 w-4 mr-2" />
        Save Auto-Response Settings
      </Button>
    </div>
  );
};

export default AutoResponseSettingsTab;
