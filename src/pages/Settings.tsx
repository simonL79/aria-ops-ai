
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { hasValidKey } from "@/utils/secureKeyStorage";
import SecuritySettings from "@/components/settings/SecuritySettings";
import GDPRSettings from "@/components/settings/GDPRSettings";
import { Key, Shield } from "lucide-react";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("general");
  const hasApiKey = hasValidKey('openai_api_key');
  
  // Set active tab based on URL
  useEffect(() => {
    if (location.pathname.includes("/security")) {
      setActiveTab("security");
    } else if (location.pathname.includes("/gdpr")) {
      setActiveTab("gdpr");
    } else if (!hasApiKey) {
      // Auto-select security tab if no API key is set
      setActiveTab("security");
    } else {
      setActiveTab("general");
    }
  }, [location.pathname, hasApiKey]);
  
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
          <TabsTrigger value="security" className={!hasApiKey ? "relative font-bold text-primary" : ""}>
            {!hasApiKey && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
            Security
            {!hasApiKey && <Key className="ml-1 h-3 w-3 text-primary" />}
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            GDPR
          </TabsTrigger>
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
        
        <TabsContent value="gdpr" className="mt-4">
          <GDPRSettings />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
