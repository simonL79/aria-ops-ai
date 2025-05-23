
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SourceCard from '../SourceCard';
import CustomRSSForm from '../CustomRSSForm';
import { MonitoringSource, ScanResult } from '../types';
import { getStatusBadge } from '../utils';

interface SourceTabsProps {
  sources: MonitoringSource[];
  scanResults: Record<string, ScanResult>;
  isLoading: boolean;
  onToggle: (sourceId: string, enabled: boolean) => void;
  onScan: (sourceId: string) => void;
  onAddSource: (newSource: MonitoringSource) => void;
  filterByType: (type: string) => MonitoringSource[];
}

const SourceTabs: React.FC<SourceTabsProps> = ({
  sources,
  scanResults,
  isLoading,
  onToggle,
  onScan,
  onAddSource,
  filterByType
}) => {
  return (
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
            onToggle={onToggle}
            onScan={onScan}
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
            onToggle={onToggle}
            onScan={onScan}
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
            onToggle={onToggle}
            onScan={onScan}
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
            onToggle={onToggle}
            onScan={onScan}
            isLoading={isLoading}
            scanResult={scanResults[source.id]}
            getStatusBadge={getStatusBadge}
          />
        ))}
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4">
        <CustomRSSForm onAddSource={onAddSource} />
        
        {sources.filter(s => s.id.startsWith('custom-')).map(source => (
          <SourceCard 
            key={source.id} 
            source={source} 
            onToggle={onToggle}
            onScan={onScan}
            isLoading={isLoading}
            scanResult={scanResults[source.id]}
            getStatusBadge={getStatusBadge}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default SourceTabs;
