
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, AlertTriangle, CheckCircle, Gavel, Shield } from 'lucide-react';

const LegalOpsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-corporate-dark min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Scale className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Legal + Tactical Ops
            </h1>
            <p className="corporate-subtext mt-1">
              Authoritative Response with Legal Precision
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Gavel className="h-3 w-3" />
              Legal Authority
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Tactical Response
            </Badge>
          </div>
        </div>

        {/* Legal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <FileText className="h-4 w-4 text-corporate-accent" />
                Legal Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-xs corporate-subtext">Generated this month</p>
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
              <div className="text-2xl font-bold text-green-400">94%</div>
              <p className="text-xs corporate-subtext">Positive outcomes</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">23</div>
              <p className="text-xs corporate-subtext">Under legal review</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Shield className="h-4 w-4 text-corporate-accent" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">&lt; 4hrs</div>
              <p className="text-xs corporate-subtext">Legal action initiated</p>
            </CardContent>
          </Card>
        </div>

        {/* Legal Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <FileText className="h-5 w-5 text-corporate-accent" />
                Automated Legal Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• Cease & Desist letter generation</div>
                <div>• DMCA takedown notice creation</div>
                <div>• Defamation demand letters</div>
                <div>• Retraction notice templates</div>
                <div>• Copyright infringement claims</div>
                <div>• Privacy violation notifications</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Gavel className="h-5 w-5 text-corporate-accent" />
                Escalation Protocols
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• Soft approach: Polite correction requests</div>
                <div>• Firm response: Formal legal notices</div>
                <div>• Nuclear option: Litigation preparation</div>
                <div>• Multi-jurisdiction coordination</div>
                <div>• Evidence preservation protocols</div>
                <div>• Legal counsel integration</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Frameworks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="corporate-card border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Soft Response
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-400 text-xs">DIPLOMATIC</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-corporate-lightGray">
                <div>• Polite correction requests</div>
                <div>• Educational content sharing</div>
                <div>• Collaborative fact-checking</div>
                <div>• Relationship preservation</div>
                <div>• Community engagement</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Firm Response
              </CardTitle>
              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">AUTHORITATIVE</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-corporate-lightGray">
                <div>• Formal cease & desist letters</div>
                <div>• Platform takedown requests</div>
                <div>• Legal precedent citations</div>
                <div>• Professional enforcement</div>
                <div>• Deadline-driven action</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Scale className="h-5 w-5 text-red-400" />
                Nuclear Response
              </CardTitle>
              <Badge className="bg-red-500/20 text-red-400 text-xs">LITIGATION</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-corporate-lightGray">
                <div>• Litigation threat assessment</div>
                <div>• Court filing preparation</div>
                <div>• Asset investigation</div>
                <div>• Injunctive relief pursuit</div>
                <div>• Damages calculation</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <Card className="border-corporate-accent bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Legal Authority in Digital Defense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-corporate-lightGray space-y-2 text-sm">
              <p><strong className="text-white">Immediate Authority:</strong> Professional legal documents within hours</p>
              <p><strong className="text-white">Graduated Response:</strong> Escalation ladder from diplomatic to nuclear</p>
              <p><strong className="text-white">Evidence Preservation:</strong> Complete audit trail for legal proceedings</p>
              <p><strong className="text-white">Multi-Jurisdiction:</strong> Global legal framework understanding</p>
              <p><strong className="text-white">Cost Effective:</strong> 90% less expensive than traditional legal routes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LegalOpsPage;
