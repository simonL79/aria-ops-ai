
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ThreatClassifier from "@/components/dashboard/ThreatClassifier";
import StrategicResponseEngine from "@/components/dashboard/StrategicResponseEngine";

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
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="classify">Threat Classification</TabsTrigger>
          <TabsTrigger value="respond">Response Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classify" className="mt-0">
          <ThreatClassifier initialContent={initialContent} />
        </TabsContent>
        
        <TabsContent value="respond" className="mt-0">
          <StrategicResponseEngine 
            initialContent={initialContent}
            threatType={threatType}
            severity={severity}
            platform={platform}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ThreatAnalysisHub;
