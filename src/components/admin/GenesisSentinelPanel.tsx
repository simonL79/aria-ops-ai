
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import EntityDiscoveryTab from './genesis-sentinel/EntityDiscoveryTab';
import RiskIntelligenceTab from './genesis-sentinel/RiskIntelligenceTab';
import LeadGenerationTab from './genesis-sentinel/LeadGenerationTab';
import StrategicMappingTab from './genesis-sentinel/StrategicMappingTab';
import PreemptiveIntelTab from './genesis-sentinel/PreemptiveIntelTab';

const GenesisSentinelPanel = () => {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Shield className="h-5 w-5 text-corporate-accent" />
          Genesis Sentinel Early Warning System
        </CardTitle>
        <p className="text-sm corporate-subtext">
          Proactive intelligence platform for threat detection and prospect identification
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Entity Discovery
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Risk Intelligence
            </TabsTrigger>
            <TabsTrigger value="preemptive" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Preemptive Intel
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Lead Generation
            </TabsTrigger>
            <TabsTrigger value="mapping" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Strategic Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-4 mt-6">
            <EntityDiscoveryTab />
          </TabsContent>

          <TabsContent value="intelligence" className="mt-6">
            <RiskIntelligenceTab />
          </TabsContent>

          <TabsContent value="preemptive" className="mt-6">
            <PreemptiveIntelTab />
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <LeadGenerationTab />
          </TabsContent>

          <TabsContent value="mapping" className="mt-6">
            <StrategicMappingTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GenesisSentinelPanel;
