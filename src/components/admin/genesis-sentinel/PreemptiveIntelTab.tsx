
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';

const PreemptiveIntelTab = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [entityName, setEntityName] = useState('');
  const [verificationType, setVerificationType] = useState('');
  const [knownDetails, setKnownDetails] = useState('');

  const mockVerificationResults = [
    {
      id: '1',
      entityName: 'TechVenture AI Ltd',
      verificationType: 'M&A Due Diligence',
      status: 'flagged',
      riskScore: 75,
      completedAt: '2024-01-15 14:30:00',
      flags: ['Director litigation history', 'Regulatory scrutiny', 'Sector volatility'],
      recommendation: 'Monitor - Proceed with enhanced due diligence'
    },
    {
      id: '2',
      entityName: 'John Smith',
      verificationType: 'Executive Hiring',
      status: 'clean',
      riskScore: 25,
      completedAt: '2024-01-15 13:15:00',
      flags: [],
      recommendation: 'Clean - No significant risk indicators found'
    },
    {
      id: '3',
      entityName: 'CryptoFlow Holdings',
      verificationType: 'Partnership Check',
      status: 'flagged',
      riskScore: 90,
      completedAt: '2024-01-15 12:00:00',
      flags: ['Offshore structure risk', 'Anonymous ownership', 'Regulatory violations'],
      recommendation: 'Escalate - High risk, recommend avoiding partnership'
    }
  ];

  const handleStartVerification = () => {
    setIsScanning(true);
    // Simulate verification process
    setTimeout(() => setIsScanning(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'bg-green-600';
      case 'flagged': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return <CheckCircle className="h-4 w-4" />;
      case 'flagged': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Preemptive Verification Form */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Search className="h-5 w-5 text-corporate-accent" />
            Preemptive Intel Check
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Run comprehensive background verification before engagement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entityName" className="text-corporate-lightGray">Entity Name</Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Company name, person name, etc."
                className="bg-corporate-darkTertiary border-corporate-border text-white"
              />
            </div>

            <div>
              <Label className="text-corporate-lightGray">Verification Type</Label>
              <Select value={verificationType} onValueChange={setVerificationType}>
                <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                  <SelectValue placeholder="Select verification purpose" />
                </SelectTrigger>
                <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
                  <SelectItem value="ma_diligence" className="text-white hover:bg-corporate-darkSecondary">M&A Due Diligence</SelectItem>
                  <SelectItem value="executive_hiring" className="text-white hover:bg-corporate-darkSecondary">Executive Hiring</SelectItem>
                  <SelectItem value="partnership_check" className="text-white hover:bg-corporate-darkSecondary">Partnership Check</SelectItem>
                  <SelectItem value="vendor_verification" className="text-white hover:bg-corporate-darkSecondary">Vendor Verification</SelectItem>
                  <SelectItem value="investment_check" className="text-white hover:bg-corporate-darkSecondary">Investment Due Diligence</SelectItem>
                  <SelectItem value="competitive_intel" className="text-white hover:bg-corporate-darkSecondary">Competitive Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="knownDetails" className="text-corporate-lightGray">Known Details (Optional)</Label>
            <Textarea
              id="knownDetails"
              value={knownDetails}
              onChange={(e) => setKnownDetails(e.target.value)}
              placeholder="Company location, role, industry, or any additional context..."
              className="bg-corporate-darkTertiary border-corporate-border text-white min-h-[80px]"
            />
          </div>

          <Button
            onClick={handleStartVerification}
            disabled={!entityName || !verificationType || isScanning}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
          >
            {isScanning ? (
              <>
                <Play className="h-4 w-4 mr-2 animate-spin" />
                Running Genesis Check...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Run Genesis Check
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Verification Results */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Recent Verification Results
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Intelligence dossiers and risk assessments
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVerificationResults.map((result) => (
              <div key={result.id} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{result.entityName}</h3>
                      <Badge className={getStatusColor(result.status)} size="sm">
                        {getStatusIcon(result.status)}
                        <span className="ml-1 capitalize">{result.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-2">
                      <div>
                        <span className="text-corporate-gray">Type:</span>
                        <span className="text-corporate-lightGray ml-1">{result.verificationType}</span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Risk Score:</span>
                        <span className={`ml-1 font-semibold ${getRiskColor(result.riskScore)}`}>
                          {result.riskScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Completed:</span>
                        <span className="text-corporate-lightGray ml-1">{result.completedAt}</span>
                      </div>
                    </div>

                    {result.flags.length > 0 && (
                      <div className="mb-2">
                        <span className="text-corporate-gray text-sm">Risk Flags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.flags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-red-500 text-red-400">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="text-corporate-gray">Recommendation:</span>
                      <span className="text-corporate-lightGray ml-1">{result.recommendation}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <FileText className="h-3 w-3 mr-1" />
                      View Dossier
                    </Button>
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <Download className="h-3 w-3 mr-1" />
                      Export PDF
                    </Button>
                    {result.status === 'flagged' && (
                      <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                        <Shield className="h-3 w-3 mr-1" />
                        Activate Guardian
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-corporate-accent" />
              <div>
                <div className="text-lg font-semibold text-white">127</div>
                <div className="text-xs text-corporate-gray">Verifications (30d)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-lg font-semibold text-white">89</div>
                <div className="text-xs text-corporate-gray">Clean results</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <div>
                <div className="text-lg font-semibold text-white">38</div>
                <div className="text-xs text-corporate-gray">Flagged entities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-corporate-accent" />
              <div>
                <div className="text-lg font-semibold text-white">12</div>
                <div className="text-xs text-corporate-gray">Guardian activations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreemptiveIntelTab;
