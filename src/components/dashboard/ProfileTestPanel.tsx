
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, User, UserCheck, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Sample profile data for testing different scenarios
const testProfiles = [
  {
    id: "good-profile",
    name: "High Reputation Business",
    reputationScore: 87,
    previousScore: 81,
    alerts: [
      {
        id: '1g',
        platform: 'Twitter',
        content: 'Great customer service experience with @company! They resolved my issue in minutes. #impressed',
        date: '2 hours ago',
        severity: 'low' as const,
        status: 'new' as const
      },
      {
        id: '2g',
        platform: 'Yelp',
        content: 'Five star service! The staff was incredibly helpful and the products are top quality. Highly recommend!',
        date: '1 day ago',
        severity: 'low' as const,
        status: 'new' as const
      },
    ],
    sources: [
      { name: 'Twitter', status: 'good' as const, positiveRatio: 92, total: 120 },
      { name: 'Facebook', status: 'good' as const, positiveRatio: 89, total: 230 },
      { name: 'Reddit', status: 'good' as const, positiveRatio: 78, total: 45 },
      { name: 'Yelp', status: 'good' as const, positiveRatio: 95, total: 65 }
    ],
    metrics: {
      monitoredSources: 67,
      negativeContent: 3,
      removedContent: 2
    }
  },
  {
    id: "medium-profile",
    name: "Mixed Reputation Business",
    reputationScore: 64,
    previousScore: 68,
    alerts: [
      {
        id: '1m',
        platform: 'Twitter',
        content: 'This company has decent service, but their prices are a bit high compared to competitors. #feedback',
        date: '3 hours ago',
        severity: 'medium' as const,
        status: 'new' as const
      },
      {
        id: '2m',
        platform: 'Reddit',
        content: 'Mixed experience with their product. Quality is good but customer service could be improved.',
        date: '2 days ago',
        severity: 'medium' as const,
        status: 'new' as const
      },
      {
        id: '3m',
        platform: 'Yelp',
        content: 'Three stars. Good but not great. There's definitely room for improvement.',
        date: '4 days ago',
        severity: 'medium' as const,
        status: 'reviewing' as const
      }
    ],
    sources: [
      { name: 'Twitter', status: 'warning' as const, positiveRatio: 65, total: 150 },
      { name: 'Facebook', status: 'good' as const, positiveRatio: 75, total: 190 },
      { name: 'Reddit', status: 'warning' as const, positiveRatio: 58, total: 110 },
      { name: 'Yelp', status: 'warning' as const, positiveRatio: 60, total: 75 }
    ],
    metrics: {
      monitoredSources: 62,
      negativeContent: 18,
      removedContent: 5
    }
  },
  {
    id: "poor-profile",
    name: "Concerning Reputation Business",
    reputationScore: 35,
    previousScore: 42,
    alerts: [
      {
        id: '1p',
        platform: 'Twitter',
        content: 'Terrible experience with @company. They ignored my complaints and refused a refund. #awful #scam',
        date: '1 hour ago',
        severity: 'high' as const,
        status: 'new' as const
      },
      {
        id: '2p',
        platform: 'Reddit',
        content: 'AVOID THIS BUSINESS! They overcharged me and then ghosted me. Customer service doesn't exist.',
        date: '5 hours ago',
        severity: 'high' as const,
        status: 'new' as const
      },
      {
        id: '3p',
        platform: 'Yelp',
        content: 'One star. Disappointing product quality and they were rude when I tried to return it.',
        date: '2 days ago',
        severity: 'high' as const,
        status: 'reviewing' as const
      },
      {
        id: '4p',
        platform: 'Facebook',
        content: 'This business is a complete scam. They sell defective products and don't honor warranties.',
        date: '3 days ago',
        severity: 'high' as const,
        status: 'new' as const
      }
    ],
    sources: [
      { name: 'Twitter', status: 'critical' as const, positiveRatio: 28, total: 180 },
      { name: 'Facebook', status: 'critical' as const, positiveRatio: 32, total: 210 },
      { name: 'Reddit', status: 'critical' as const, positiveRatio: 25, total: 95 },
      { name: 'Yelp', status: 'warning' as const, positiveRatio: 45, total: 60 }
    ],
    metrics: {
      monitoredSources: 58,
      negativeContent: 42,
      removedContent: 7
    }
  }
];

export interface TestProfileData {
  id: string;
  name: string;
  reputationScore: number;
  previousScore: number;
  alerts: Array<{
    id: string;
    platform: string;
    content: string;
    date: string;
    severity: 'high' | 'medium' | 'low';
    status: 'new' | 'reviewing' | 'actioned';
  }>;
  sources: Array<{
    name: string;
    status: 'good' | 'warning' | 'critical';
    positiveRatio: number;
    total: number;
  }>;
  metrics: {
    monitoredSources: number;
    negativeContent: number;
    removedContent: number;
  };
}

interface ProfileTestPanelProps {
  onSelectTestProfile: (profile: TestProfileData) => void;
}

const ProfileTestPanel = ({ onSelectTestProfile }: ProfileTestPanelProps) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const handleProfileSelection = (profileId: string) => {
    setSelectedProfileId(profileId);
  };

  const handleApplyTest = () => {
    if (!selectedProfileId) {
      toast.error("Please select a profile to test");
      return;
    }
    
    const selectedProfile = testProfiles.find(p => p.id === selectedProfileId);
    if (selectedProfile) {
      onSelectTestProfile(selectedProfile);
      setOpen(false);
      toast.success(`Loaded test profile: ${selectedProfile.name}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserCheck className="h-4 w-4" />
          Test Service Levels
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test Service Levels</DialogTitle>
          <DialogDescription>
            Select a sample profile to test different reputation scenarios and service levels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right">
              Profile
            </Label>
            <Select
              value={selectedProfileId}
              onValueChange={handleProfileSelection}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select test profile" />
              </SelectTrigger>
              <SelectContent>
                {testProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center gap-2">
                      {profile.id === "good-profile" ? (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      ) : profile.id === "medium-profile" ? (
                        <User className="h-4 w-4 text-amber-500" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-500" />
                      )}
                      <span>{profile.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Score: {profile.reputationScore})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleApplyTest} className="gap-2">
            <Check className="h-4 w-4" /> Apply Test Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileTestPanel;
