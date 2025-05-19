
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResponseGeneratorTab from "./ResponseGeneratorTab";
import ResponseTemplatesTab from "./ResponseTemplatesTab";
import AutoResponseSettingsTab from "./AutoResponseSettingsTab";
import { ContentThreatType } from "@/types/intelligence";

// Define props for the StrategicResponseEngine component
interface StrategicResponseEngineProps {
  initialContent?: string;
  threatType?: ContentThreatType | string;
  severity?: string;
  platform?: string;
}

const StrategicResponseEngine = ({ 
  initialContent = "", 
  threatType, 
  severity, 
  platform 
}: StrategicResponseEngineProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Strategic Response Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="generate">Generate Response</TabsTrigger>
            <TabsTrigger value="templates">Response Templates</TabsTrigger>
            <TabsTrigger value="settings">Auto-Response</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <ResponseGeneratorTab
              initialContent={initialContent}
              threatType={threatType}
              severity={severity}
              platform={platform}
            />
          </TabsContent>
          
          <TabsContent value="templates">
            <ResponseTemplatesTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <AutoResponseSettingsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StrategicResponseEngine;
