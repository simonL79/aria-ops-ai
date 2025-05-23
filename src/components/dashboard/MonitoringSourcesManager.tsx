
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import SourceCard from './monitoringSourcesManager/SourceCard';
import CustomRSSForm from './monitoringSourcesManager/CustomRSSForm';
import { useMonitoringSources } from './monitoringSourcesManager/useMonitoringSources';
import { getStatusBadge } from './monitoringSourcesManager/utils';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          UK Celebrity & Sports Monitoring Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="news">UK News & Entertainment</TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {sources.map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            {filterByType('social').map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="news" className="space-y-4">
            {filterByType('news').map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            {filterByType('review').map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <CustomRSSForm onAddSource={addSource} />
            
            {sources.filter(s => s.id.startsWith('custom-')).map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MonitoringSourcesManager;
