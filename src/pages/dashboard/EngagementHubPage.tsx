
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Share2, Bell } from "lucide-react";

const EngagementHubPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Engagement Hub"
        description="Manage all communication and engagement activities for your clients"
      />

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="mentions">Social Mentions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Direct Messages
              </CardTitle>
              <CardDescription>
                Manage direct messages from various platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No new messages to display.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Comment Management
              </CardTitle>
              <CardDescription>
                Monitor and respond to comments across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No new comments to moderate.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mentions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="mr-2 h-5 w-5" />
                Social Media Mentions
              </CardTitle>
              <CardDescription>
                Track all social media mentions and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No new social media mentions detected.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Center
              </CardTitle>
              <CardDescription>
                Manage notification settings and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No new notifications available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default EngagementHubPage;
