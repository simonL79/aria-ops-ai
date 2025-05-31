
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Network, Activity, Database, Cpu, Shield } from 'lucide-react';
import ThreatAnalysisPanel from '@/components/intelligence/ThreatAnalysisPanel';
import EntityGraphViewer from '@/components/intelligence/EntityGraphViewer';

const IntelligenceCorePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Brain className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Intelligence Core
            </h1>
            <p className="corporate-subtext mt-1">
              Shared Infrastructure Powering Sentinel & Watchtower
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Cpu className="h-3 w-3" />
              Neural Engine
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Core Infrastructure
            </Badge>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Activity className="h-4 w-4 text-green-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">LIVE</div>
              <p className="text-xs corporate-subtext">All systems operational</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Database className="h-4 w-4 text-corporate-accent" />
                Data Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1.2M</div>
              <p className="text-xs corporate-subtext">Records/day</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Network className="h-4 w-4 text-corporate-accent" />
                Entity Graph
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45K</div>
              <p className="text-xs corporate-subtext">Mapped relationships</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Shield className="h-4 w-4 text-corporate-accent" />
                Security Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">MAX</div>
              <p className="text-xs corporate-subtext">Enterprise grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Intelligence Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatAnalysisPanel />
          <EntityGraphViewer />
        </div>

        {/* Core Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Network className="h-5 w-5 text-corporate-accent" />
                Entity Graph Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• Real-time relationship mapping</div>
                <div>• Multi-dimensional entity linking</div>
                <div>• Historical pattern analysis</div>
                <div>• Cross-platform identity resolution</div>
                <div>• Behavioral clustering algorithms</div>
                <div>• Predictive relationship modeling</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Activity className="h-5 w-5 text-corporate-accent" />
                Action Orchestration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• Automated response triggers</div>
                <div>• Mission chain execution</div>
                <div>• Multi-system coordination</div>
                <div>• Escalation pathway management</div>
                <div>• Audit trail maintenance</div>
                <div>• Performance optimization</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Database className="h-5 w-5 text-corporate-accent" />
                Intelligence Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• High-velocity data ingestion</div>
                <div>• Real-time indexing & search</div>
                <div>• Temporal data modeling</div>
                <div>• Encrypted storage systems</div>
                <div>• Backup & recovery protocols</div>
                <div>• Data retention compliance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntelligenceCorePage;
