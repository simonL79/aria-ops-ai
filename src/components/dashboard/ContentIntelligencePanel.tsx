
import { useState } from "react";
import { Shield } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { IntelligenceLevel, getIntelligenceLevelColor } from "@/types/intelligence";

// Import our new components
import ThreatsTab from "./intelligence/ThreatsTab";
import StrategiesTab from "./intelligence/StrategiesTab";
import SettingsTab from "./intelligence/SettingsTab";

const ContentIntelligencePanel = () => {
  const [level, setLevel] = useState<IntelligenceLevel>('basic');
  
  const handleActivateIntelligence = () => {
    toast.success(`${level.charAt(0).toUpperCase() + level.slice(1)} intelligence activated`, {
      description: "Analyzing content patterns and identifying threats..."
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`${getIntelligenceLevelColor(level)} text-white`}>
          <Shield className="mr-2 h-4 w-4" />
          Intelligence
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Tabs defaultValue="threats" className="w-full">
          <div className="border-b px-3">
            <TabsList className="grid grid-cols-3 mt-2 mb-2">
              <TabsTrigger value="threats">Threats</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="threats">
            <ThreatsTab onActivate={handleActivateIntelligence} />
          </TabsContent>
          
          <TabsContent value="strategies">
            <StrategiesTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab 
              level={level} 
              setLevel={setLevel} 
              onActivate={handleActivateIntelligence} 
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ContentIntelligencePanel;
