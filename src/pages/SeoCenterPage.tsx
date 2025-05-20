
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Search, Globe, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SerpDefense from "@/components/dashboard/SerpDefense";
import SeoSuppressionPipeline from "@/components/dashboard/SeoSuppressionPipeline";

const SeoCenterPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">SEO Defense Center</h1>
        <p className="text-muted-foreground">
          Manage search engine results and suppress negative content from SERPs
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="serp-control">SERP Control</TabsTrigger>
          <TabsTrigger value="content">Content Strategy</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SerpDefense />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Keywords Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Monitored Keywords</span>
                    </div>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-2 text-red-500" />
                      <span>Negative Keywords</span>
                    </div>
                    <span className="font-semibold">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-green-500" />
                      <span>Positive Content Published</span>
                    </div>
                    <span className="font-semibold">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Content Drafts</span>
                    </div>
                    <span className="font-semibold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <SeoSuppressionPipeline />
        </TabsContent>
        
        <TabsContent value="serp-control">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">SERP Management Tools</h3>
              <p>Tools for monitoring and managing search engine results pages</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Content Generation</h3>
              <p>Strategic content creation for search engine optimization</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">SEO Reports</h3>
              <p>Comprehensive reports on SEO performance and results</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SeoCenterPage;
