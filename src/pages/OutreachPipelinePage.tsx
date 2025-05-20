
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, User, Building, Send, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OutreachPipelinePage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Outreach Pipeline</h1>
        <p className="text-muted-foreground">
          Manage your outreach campaigns to potential clients and media contacts
        </p>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-end">
            <Button className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  NewCo Outreach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Target new company registrations in the technology sector.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    145 contacts
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Started May 15
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Crisis Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Focused on companies recently featured in negative press.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    78 contacts
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    32 responses
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  SERP Defense Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Targeted at businesses with negative SERP results on page 1.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    56 contacts
                  </span>
                  <span className="flex items-center">
                    <Building className="mr-1 h-3 w-3" />
                    Enterprise focus
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Contact management system with 278 active contacts across industries
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                12 outreach templates available for different scenarios
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Outreach analytics and campaign performance metrics
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default OutreachPipelinePage;
