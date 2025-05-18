
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ContentFilterBar from "@/components/monitor/ContentFilterBar";
import ContentList from "@/components/monitor/ContentList";
import { mockContent, getSentimentColor, getImpactColor } from "@/data/monitorData";
import { useContentFilter } from "@/hooks/useContentFilter";

const Monitor = () => {
  const {
    filtered,
    selectedPlatform,
    setSelectedPlatform,
    selectedSentiment,
    setSelectedSentiment,
    filterContent
  } = useContentFilter(mockContent);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Content Monitor</h1>
        <p className="text-muted-foreground">
          Track and filter content across all platforms to identify potential reputation issues.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Analysis</CardTitle>
          <CardDescription>
            View and filter content from all monitored platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
            </TabsList>
            
            <ContentFilterBar
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              selectedSentiment={selectedSentiment}
              setSelectedSentiment={setSelectedSentiment}
              onFilter={filterContent}
            />
            
            <TabsContent value="all" className="mt-0">
              <ContentList 
                items={filtered}
                getSentimentColor={getSentimentColor}
                getImpactColor={getImpactColor}
              />
            </TabsContent>
            
            <TabsContent value="negative" className="mt-0">
              <ContentList 
                items={filtered}
                getSentimentColor={getSentimentColor}
                getImpactColor={getImpactColor}
                filterBySentiment="negative"
              />
            </TabsContent>
            
            <TabsContent value="neutral" className="mt-0">
              <ContentList 
                items={filtered}
                getSentimentColor={getSentimentColor}
                getImpactColor={getImpactColor}
                filterBySentiment="neutral"
              />
            </TabsContent>
            
            <TabsContent value="positive" className="mt-0">
              <ContentList 
                items={filtered}
                getSentimentColor={getSentimentColor}
                getImpactColor={getImpactColor}
                filterBySentiment="positive"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Monitor;
