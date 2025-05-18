
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentsManagement from "@/components/dashboard/intelligence/AgentsManagement";
import MemorySystem from "@/components/dashboard/intelligence/MemorySystem";
import PredictiveAnalysis from "@/components/dashboard/intelligence/PredictiveAnalysis";

interface AdvancedIntelligencePanelProps {
  className?: string;
}

const AdvancedIntelligencePanel = ({ className }: AdvancedIntelligencePanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("agents");

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Advanced Reputation Intelligence</CardTitle>
        <CardDescription>Autonomous agents with memory, prediction and collaboration</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="memory">Memory System</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="agents" className="mt-0">
              <AgentsManagement />
            </TabsContent>
            
            <TabsContent value="memory" className="mt-0">
              <MemorySystem />
            </TabsContent>
            
            <TabsContent value="predictive" className="mt-0">
              <PredictiveAnalysis />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedIntelligencePanel;
