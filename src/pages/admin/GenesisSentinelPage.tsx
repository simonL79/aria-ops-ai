
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GenesisSentinelPanel from '@/components/admin/GenesisSentinelPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, TrendingUp, Globe, AlertTriangle, Zap, Activity, Target, Brain, Cpu, Database } from 'lucide-react';

const GenesisSentinelPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Shield className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Genesis Sentinel - Intelligence Command Center
            </h1>
            <p className="corporate-subtext mt-1">
              Week 2 Active: Intelligence & Automation deployment with advanced AI integration
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Brain className="h-3 w-3 animate-pulse" />
              Week 2: Intelligence Active
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              AI Automation Enabled
            </Badge>
          </div>
        </div>

        {/* Week 2 Intelligence Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Brain className="h-4 w-4 text-blue-400" />
                AI Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">4/4</div>
              <p className="text-xs corporate-subtext">AI modules active</p>
            </CardContent>
          </Card>

          <Card className="corporate-card border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Cpu className="h-4 w-4 text-purple-400" />
                Auto-Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">7/7</div>
              <p className="text-xs corporate-subtext">Automation engines</p>
            </CardContent>
          </Card>

          <Card className="corporate-card border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Target className="h-4 w-4 text-green-400" />
                Precision Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">94.2%</div>
              <p className="text-xs corporate-subtext">Entity targeting</p>
            </CardContent>
          </Card>

          <Card className="corporate-card border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Database className="h-4 w-4 text-orange-400" />
                Intelligence DB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">100%</div>
              <p className="text-xs corporate-subtext">Knowledge sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Genesis Sentinel Panel */}
        <GenesisSentinelPanel />

        {/* Week 2 Deployment Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="corporate-card border-corporate-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <TrendingUp className="h-5 w-5 text-corporate-accent" />
                Week 2 Intelligence Deployment
              </CardTitle>
              <CardDescription className="corporate-subtext">Advanced AI & Automation Phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-corporate-lightGray">✅ Week 1: Foundation & Trust</span>
                  <Badge className="bg-green-500">COMPLETE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-corporate-lightGray">🧠 Week 2: Intelligence & Automation</span>
                  <Badge className="bg-corporate-accent text-black">ACTIVE</Badge>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-corporate-lightGray mb-1">Overall Progress</div>
                  <div className="w-full bg-corporate-darkTertiary rounded-full h-2">
                    <div className="bg-corporate-accent h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-xs text-corporate-lightGray mt-1">65% Complete (Week 2 Active)</div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-corporate-accent">Week 2 Active Components:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-corporate-lightGray">CIA Precision AI</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-corporate-lightGray">Counter-Narrative Engine</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-corporate-lightGray">Auto Response System</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-corporate-lightGray">Intelligence Memory</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Brain className="h-5 w-5 text-corporate-accent" />
                Week 2 Intelligence Targets
              </CardTitle>
              <CardDescription className="corporate-subtext">Advanced automation objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">AI Threat Classification</span>
                  <span className="text-blue-400 font-medium">TARGET: 95% accuracy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Automated Response Rate</span>
                  <span className="text-purple-400 font-medium">TARGET: 80% auto-handled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Counter-Narrative Generation</span>
                  <span className="text-green-400 font-medium">TARGET: &lt;5min response</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Intelligence Memory Retention</span>
                  <span className="text-orange-400 font-medium">TARGET: 100% learning</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Entity Recognition Precision</span>
                  <span className="text-white font-medium">TARGET: 98% accuracy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Intelligence Features */}
        <Card className="border-corporate-accent bg-gradient-to-r from-corporate-darkSecondary to-corporate-dark">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Brain className="h-5 w-5" />
              A.R.I.A vX™ Week 2 Intelligence & Automation Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  AI-Powered Intelligence
                </h4>
                <ul className="space-y-1 text-corporate-lightGray">
                  <li>• CIA-level precision filtering with AI</li>
                  <li>• Advanced threat classification engine</li>
                  <li>• Predictive threat pattern analysis</li>
                  <li>• Entity relationship mapping</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  Automated Response Systems
                </h4>
                <ul className="space-y-1 text-corporate-lightGray">
                  <li>• Instant counter-narrative generation</li>
                  <li>• Automated threat escalation routing</li>
                  <li>• Smart response recommendation engine</li>
                  <li>• Multi-platform deployment automation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-400" />
                  Intelligence Memory & Learning
                </h4>
                <ul className="space-y-1 text-corporate-lightGray">
                  <li>• Persistent threat pattern memory</li>
                  <li>• Adaptive learning from responses</li>
                  <li>• Cross-entity intelligence correlation</li>
                  <li>• Continuous accuracy improvement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GenesisSentinelPage;
