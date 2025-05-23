
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useMonitoringSources } from './monitoringSourcesManager/hooks/useMonitoringSources';
import SourceTabs from './monitoringSourcesManager/components/SourceTabs';
import AutomationPanel from './monitoringSourcesManager/components/AutomationPanel';

const MonitoringSourcesManager = () => {
  const {
    sources,
    isLoading,
    scanResults,
    triggerScan,
    toggleSource,
    addSource,
    filterByType
  } = useMonitoringSources();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            UK Celebrity & Sports Monitoring Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SourceTabs
            sources={sources}
            scanResults={scanResults}
            isLoading={isLoading}
            onToggle={toggleSource}
            onScan={triggerScan}
            onAddSource={addSource}
            filterByType={filterByType}
          />
        </CardContent>
      </Card>

      <AutomationPanel scanResults={scanResults} sources={sources} />
    </div>
  );
};

export default MonitoringSourcesManager;
