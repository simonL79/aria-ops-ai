
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SecuritySettings from "@/components/settings/SecuritySettings";
import { RoleProtected } from "@/hooks/useRbac";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Settings" 
        description="Manage your account settings and preferences"
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">General Settings</h3>
              <p>Configure general application settings</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
              <p>Manage your profile information</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              <p>Manage notification settings</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
