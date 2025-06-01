
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Calendar, 
  Target, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Rocket
} from 'lucide-react';
import BulkDeploymentManager from './deployment/BulkDeploymentManager';
import PlatformConfiguration from './deployment/PlatformConfiguration';
import DeploymentScheduler from './deployment/DeploymentScheduler';
import CustomTargetsManager from './deployment/CustomTargetsManager';
import PerformanceAnalytics from './deployment/PerformanceAnalytics';

const AdvancedDeploymentPanel = () => {
  const [activeDeployments, setActiveDeployments] = useState(3);
  const [scheduledDeployments, setScheduledDeployments] = useState(12);
  const [successRate, setSuccessRate] = useState(98.5);
  const [totalPlatforms, setTotalPlatforms] = useState(15);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <Rocket className="h-4 w-4 text-corporate-accent" />
              Active Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeDeployments}</div>
            <p className="text-xs corporate-subtext">Currently running</p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <Clock className="h-4 w-4 text-corporate-accent" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{scheduledDeployments}</div>
            <p className="text-xs corporate-subtext">Next 24 hours</p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{successRate}%</div>
            <p className="text-xs corporate-subtext">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <Target className="h-4 w-4 text-corporate-accent" />
              Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPlatforms}</div>
            <p className="text-xs corporate-subtext">Connected targets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bulk" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
          <TabsTrigger value="bulk" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Globe className="h-4 w-4 mr-2" />
            Bulk Deploy
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Settings className="h-4 w-4 mr-2" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduler
          </TabsTrigger>
          <TabsTrigger value="targets" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Target className="h-4 w-4 mr-2" />
            Targets
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulk">
          <BulkDeploymentManager />
        </TabsContent>

        <TabsContent value="platforms">
          <PlatformConfiguration />
        </TabsContent>

        <TabsContent value="scheduler">
          <DeploymentScheduler />
        </TabsContent>

        <TabsContent value="targets">
          <CustomTargetsManager />
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDeploymentPanel;
