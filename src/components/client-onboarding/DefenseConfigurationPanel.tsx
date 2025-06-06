
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, Settings, Zap, Bell, Eye } from "lucide-react";

interface DefenseConfigurationPanelProps {
  clientData: any;
  entityData: any[];
  threatData: any[];
  onComplete: () => void;
  isProcessing: boolean;
}

const DefenseConfigurationPanel = ({ clientData, entityData, threatData, onComplete, isProcessing }: DefenseConfigurationPanelProps) => {
  const [defenseConfig, setDefenseConfig] = useState({
    sentinelGuardian: true,
    realTimeAlerts: true,
    autoResponse: false,
    executiveReports: true,
    legalDefense: true,
    narrativeCounters: true
  });

  const handleConfigChange = (key: string, value: boolean) => {
    setDefenseConfig(prev => ({ ...prev, [key]: value }));
  };

  const totalThreats = threatData.reduce((acc, t) => acc + t.liveThreats.length, 0);
  const highRiskEntities = threatData.filter(t => t.riskLevel === 'high').length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Defense System Configuration</h3>
        <p className="text-corporate-lightGray">
          Configure A.R.I.A™ defense systems based on live threat assessment
        </p>
      </div>

      {/* Threat Summary */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-corporate-accent">Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{entityData.length}</div>
              <div className="text-xs text-corporate-lightGray">Entities Configured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{totalThreats}</div>
              <div className="text-xs text-corporate-lightGray">Live Threats Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{highRiskEntities}</div>
              <div className="text-xs text-corporate-lightGray">High Risk Entities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Defense System Configuration */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">Defense System Modules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-corporate-border rounded">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-corporate-accent" />
              <div>
                <Label className="text-white">Sentinel Guardian Monitoring</Label>
                <p className="text-xs text-corporate-lightGray">24/7 live threat monitoring and detection</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig.sentinelGuardian}
              onCheckedChange={(value) => handleConfigChange('sentinelGuardian', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-corporate-border rounded">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-corporate-accent" />
              <div>
                <Label className="text-white">Real-Time Alerts</Label>
                <p className="text-xs text-corporate-lightGray">Instant notifications for critical threats</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig.realTimeAlerts}
              onCheckedChange={(value) => handleConfigChange('realTimeAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-corporate-border rounded">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-corporate-accent" />
              <div>
                <Label className="text-white">Automated Response</Label>
                <p className="text-xs text-corporate-lightGray">AI-powered counter-narrative deployment</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig.autoResponse}
              onCheckedChange={(value) => handleConfigChange('autoResponse', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-corporate-border rounded">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-corporate-accent" />
              <div>
                <Label className="text-white">Executive Reports</Label>
                <p className="text-xs text-corporate-lightGray">Regular threat intelligence briefings</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig.executiveReports}
              onCheckedChange={(value) => handleConfigChange('executiveReports', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-corporate-border rounded">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-corporate-accent" />
              <div>
                <Label className="text-white">Legal Defense Protocols</Label>
                <p className="text-xs text-corporate-lightGray">Automated legal document generation</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig.legalDefense}
              onCheckedChange={(value) => handleConfigChange('legalDefense', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-corporate-border rounded">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-corporate-accent" />
              <div>
                <Label className="text-white">Narrative Counter-Strategies</Label>
                <p className="text-xs text-corporate-lightGray">Strategic narrative deployment and SEO optimization</p>
              </div>
            </div>
            <Switch
              checked={defenseConfig.narrativeCounters}
              onCheckedChange={(value) => handleConfigChange('narrativeCounters', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">Deployment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-corporate-lightGray">Active Defense Modules</span>
              <span className="text-white">
                {Object.values(defenseConfig).filter(Boolean).length} / {Object.keys(defenseConfig).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-corporate-lightGray">Entities Under Protection</span>
              <span className="text-white">{entityData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-corporate-lightGray">Live Data Sources Connected</span>
              <span className="text-green-400">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-corporate-lightGray">Threat Response Capability</span>
              <Badge variant={defenseConfig.autoResponse ? 'default' : 'secondary'}>
                {defenseConfig.autoResponse ? 'Automated' : 'Manual Approval'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-green-400">Ready to deploy live defense systems with real-time intelligence</span>
        </div>

        <Button 
          onClick={onComplete}
          disabled={isProcessing}
          className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          {isProcessing ? 'Activating Defense Systems...' : 'Complete Onboarding & Activate Defense Systems'}
        </Button>
      </div>
    </div>
  );
};

export default DefenseConfigurationPanel;
