
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ComprehensiveQADashboard from '@/components/qa/ComprehensiveQADashboard';
import CriticalActionButtons from '@/components/dashboard/CriticalActionButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Monitor, Zap } from 'lucide-react';
import { toast } from 'sonner';

const QATestingPage = () => {
  // Critical action button handlers for QA testing
  const handleLiveThreatScan = () => {
    toast.info('🔍 QA Test: Live Threat Scan initiated');
  };

  const handleLiveIntelligenceSweep = () => {
    toast.info('🔍 QA Test: Live Intelligence Sweep initiated');
  };

  const handleGuardianToggle = () => {
    toast.info('🛡️ QA Test: Guardian Mode toggled');
  };

  const handleGenerateReport = () => {
    toast.info('📊 QA Test: Report generation initiated');
  };

  const handleActivateRealTime = () => {
    toast.info('📡 QA Test: Real-Time monitoring toggled');
  };

  const handleRunManualScan = () => {
    toast.info('🔄 QA Test: Manual scan initiated');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-corporate-dark min-h-screen">
        {/* Critical Action Buttons - Required for QA Testing */}
        <CriticalActionButtons
          onLiveThreatScan={handleLiveThreatScan}
          onLiveIntelligenceSweep={handleLiveIntelligenceSweep}
          onGuardianToggle={handleGuardianToggle}
          onGenerateReport={handleGenerateReport}
          onActivateRealTime={handleActivateRealTime}
          onRunManualScan={handleRunManualScan}
          isScanning={false}
          isGuardianActive={true}
          isRealTimeActive={false}
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Shield className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Comprehensive QA Master Plan
            </h1>
            <p className="corporate-subtext mt-1">
              Complete Quality Assurance & System Validation for Genesis Sentinel
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <CheckCircle className="h-3 w-3" />
              Production Ready
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              QA Certified
            </Badge>
          </div>
        </div>

        {/* QA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Monitor className="h-4 w-4 text-corporate-accent" />
                UI & Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4 Tests</div>
              <p className="text-xs corporate-subtext">Interface validation</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Zap className="h-4 w-4 text-corporate-accent" />
                Functional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">5 Tests</div>
              <p className="text-xs corporate-subtext">Core features</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Shield className="h-4 w-4 text-corporate-accent" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4 Tests</div>
              <p className="text-xs corporate-subtext">Security validation</p>
            </CardContent>
          </Card>
        </div>

        {/* Main QA Dashboard */}
        <ComprehensiveQADashboard />

        {/* QA Process Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <CheckCircle className="h-5 w-5 text-corporate-accent" />
                QA Testing Categories
              </CardTitle>
              <CardDescription className="corporate-subtext">Comprehensive testing approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-corporate-accent" />
                  <span className="font-medium">UI & Navigation Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-6">Button visibility, navigation flow, responsive design, interactive elements</p>
                
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-corporate-accent" />
                  <span className="font-medium">Functional Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-6">Live threat scan, entity management, guardian mode, report generation</p>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-corporate-accent" />
                  <span className="font-medium">Performance Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-6">Page load time, scan performance, memory usage, concurrent users</p>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-corporate-accent" />
                  <span className="font-medium">Security Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-6">Input validation, authentication, data encryption, session management</p>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-corporate-accent" />
                  <span className="font-medium">Regression Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-6">Core functionality, integration points, database operations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <AlertTriangle className="h-5 w-5 text-corporate-accent" />
                Quality Assurance Process
              </CardTitle>
              <CardDescription className="corporate-subtext">Systematic validation approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>
                  <div className="font-medium text-white">1. Automated Test Execution</div>
                  <p className="text-xs corporate-subtext">Comprehensive test suite runs all categories automatically</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">2. Real-time Results</div>
                  <p className="text-xs corporate-subtext">Immediate feedback on test status and performance metrics</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">3. Defect Tracking</div>
                  <p className="text-xs corporate-subtext">Critical defects flagged for immediate attention</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">4. Recommendations</div>
                  <p className="text-xs corporate-subtext">Actionable insights for deployment readiness</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">5. Documentation</div>
                  <p className="text-xs corporate-subtext">Detailed logging of all test results and system status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deployment Readiness */}
        <Card className="border-corporate-accent bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Deployment Readiness Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-corporate-lightGray space-y-2 text-sm">
              <p><strong className="text-white">✓ All Critical Tests Pass:</strong> No critical defects detected</p>
              <p><strong className="text-white">✓ Security Validation:</strong> All security tests must pass</p>
              <p><strong className="text-white">✓ Performance Benchmarks:</strong> Load times under 3 seconds</p>
              <p><strong className="text-white">✓ Functional Integrity:</strong> Core features operational</p>
              <p><strong className="text-white">✓ UI/UX Standards:</strong> Interface elements responsive and accessible</p>
              <p><strong className="text-white">✓ Regression Clearance:</strong> No existing functionality broken</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default QATestingPage;
