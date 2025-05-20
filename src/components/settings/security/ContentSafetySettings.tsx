
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Protected } from "@/hooks/useRbac";
import { AppRole } from "@/services/api/userService";
import { AccessDenied } from "@/components/ui/access-denied";
import { toast } from "sonner";

const ContentSafetySettings = () => {
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [hateSpeechDetection, setHateSpeechDetection] = useState(false);
  const [threatDetection, setThreatDetection] = useState(true);
  
  const handleProfanityFilterChange = (checked: boolean) => {
    setProfanityFilter(checked);
    toast.success("Settings updated", {
      description: `Profanity filter ${checked ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleHateSpeechDetectionChange = (checked: boolean) => {
    setHateSpeechDetection(checked);
    toast.success("Settings updated", {
      description: `Hate speech detection ${checked ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleThreatDetectionChange = (checked: boolean) => {
    setThreatDetection(checked);
    toast.success("Settings updated", {
      description: `Threat detection ${checked ? 'enabled' : 'disabled'}`
    });
  };

  const allowedRoles: AppRole[] = ["admin", "security"];

  return (
    <Protected roles={allowedRoles} fallback={<AccessDenied />}>
      <Card>
        <CardHeader>
          <CardTitle>Content Safety Settings</CardTitle>
          <CardDescription>
            Configure content moderation and threat detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="profanity">Profanity Filter</Label>
            <Switch 
              id="profanity" 
              checked={profanityFilter}
              onCheckedChange={handleProfanityFilterChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="hateSpeech">Hate Speech Detection</Label>
            <Switch 
              id="hateSpeech"
              checked={hateSpeechDetection}
              onCheckedChange={handleHateSpeechDetectionChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="threatDetection">Threat Detection</Label>
            <Switch 
              id="threatDetection"
              checked={threatDetection}
              onCheckedChange={handleThreatDetectionChange}
            />
          </div>
        </CardContent>
      </Card>
    </Protected>
  );
};

export default ContentSafetySettings;
