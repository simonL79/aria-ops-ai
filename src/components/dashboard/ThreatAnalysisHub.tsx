
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ThreatClassifier from "@/components/dashboard/ThreatClassifier";
import StrategicResponseEngine from "@/components/dashboard/responseEngine";
import AdvancedIntelligencePanel from "@/components/dashboard/AdvancedIntelligencePanel";
import ThreatResponsePanel from "@/components/dashboard/ThreatResponsePanel";

interface ThreatAnalysisHubProps {
  initialContent?: string;
  threatType?: string;
  severity?: string;
  platform?: string;
}

const ThreatAnalysisHub = ({ 
  initialContent = "",
  threatType,
  severity,
  platform
}: ThreatAnalysisHubProps) => {
  return (
    <Card className="w-full">
      <Tabs defaultValue="classify" className="w-full">
        <TabsList className="grid grid-cols-4 mb-2 w-full">
          <TabsTrigger value="classify" className="px-2 py-1.5 text-sm">Live Threat Classification</TabsTrigger>
          <TabsTrigger value="respond" className="px-2 py-1.5 text-sm">Live Response Engine</TabsTrigger>
          <TabsTrigger value="strategic" className="px-2 py-1.5 text-sm">Strategic Response</TabsTrigger>
          <TabsTrigger value="advanced" className="px-2 py-1.5 text-sm">Advanced Intelligence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classify" className="mt-0 p-3">
          <ThreatClassifier initialContent={initialContent} />
        </TabsContent>
        
        <TabsContent value="respond" className="mt-0 p-3">
          <StrategicResponseEngine 
            initialContent={initialContent}
            threatType={threatType}
            severity={severity}
            platform={platform}
          />
        </TabsContent>
        
        <TabsContent value="strategic" className="mt-0 p-3">
          <ThreatResponsePanel />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0 p-3">
          <AdvancedIntelligencePanel />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ThreatAnalysisHub;
