
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, AlertTriangle, CheckCircle, Gavel, Shield } from 'lucide-react';
import DocumentGenerator from '@/components/legal/DocumentGenerator';
import ResponseFramework from '@/components/legal/ResponseFramework';

const LegalOpsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {/* Main Functionality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentGenerator />
          <ResponseFramework />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegalOpsPage;
