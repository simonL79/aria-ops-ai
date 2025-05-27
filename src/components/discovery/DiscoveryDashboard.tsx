
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDiscoveryScanning } from "@/hooks/useDiscoveryScanning";
import DiscoveryScanPanel from './DiscoveryScanPanel';
import UKNewsScanPanel from './UKNewsScanPanel';

const DiscoveryDashboard = () => {
  const {
    isScanning,
    scanProgress,
    discoveredThreats,
    scanStats,
    startDiscoveryScan,
    stopDiscoveryScan,
  } = useDiscoveryScanning();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Discovery Intelligence</h1>
        <p className="text-gray-500">
          Proactively discover and identify threats across multiple channels and sources
        </p>
      </div>
      
      <Tabs defaultValue="zero-input">
        <TabsList className="mb-4">
          <TabsTrigger value="zero-input">Zero-Input Discovery</TabsTrigger>
          <TabsTrigger value="uk-news">UK News Monitoring</TabsTrigger>
          <TabsTrigger value="analysis">Entity Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zero-input" className="space-y-6">
          <DiscoveryScanPanel 
            isScanning={isScanning}
            discoveredThreats={discoveredThreats}
            onStartScan={startDiscoveryScan}
          />
        </TabsContent>
        
        <TabsContent value="uk-news" className="space-y-6">
          <UKNewsScanPanel />
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-500">Entity Analysis Coming Soon</h3>
            <p className="text-gray-400 mt-2">Advanced entity relationship mapping and narrative tracking for UK-focused media</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscoveryDashboard;
