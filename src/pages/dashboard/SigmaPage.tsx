
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, RefreshCw, Search, Zap, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSigmaData } from '@/hooks/useSigmaData';

const SigmaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entityName, setEntityName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedThreatLevel, setSelectedThreatLevel] = useState('moderate');

  const {
    sigmaResults,
    threatProfiles,
    fixPaths,
    loading,
    error,
    runSigmaScan,
    generateFixPath
  } = useSigmaData();

  React.useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
  }, [user, navigate]);

  const handleSigmaScan = async () => {
    setIsScanning(true);
    try {
      await runSigmaScan(entityName);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateFixPath = async () => {
    if (!entityName) return;
    await generateFixPath(entityName, selectedThreatLevel);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (!user) return null;

  if (loading && sigmaResults.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Loading A.R.I.A™ SIGMA...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              A.R.I.A™ SIGMA
            </h1>
            <p className="text-gray-600 mt-2">Live-Only OSINT Intelligence & Strategic Response</p>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SIGMA Control Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter entity name for targeted scan..."
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSigmaScan}
                disabled={isScanning}
                className="gap-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Run SIGMA Scan
                  </>
                )}
              </Button>
              <Button
                onClick={handleGenerateFixPath}
                disabled={!entityName}
                variant="outline"
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Generate Fix Path
              </Button>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">Threat Level:</span>
              {['low', 'moderate', 'high', 'critical'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedThreatLevel(level)}
                  className={`px-3 py-1 text-xs rounded ${
                    selectedThreatLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SIGMA Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Live Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Intelligence ({sigmaResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sigmaResults.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No live intelligence data</p>
                    <p className="text-sm text-gray-500">Run a SIGMA scan to gather intelligence</p>
                  </div>
                ) : (
                  sigmaResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={getSeverityColor(result.severity)}>
                          {result.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">{result.platform}</span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{result.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Confidence: {Math.round(result.confidence_score * 100)}%</span>
                        <span>Sentiment: {result.sentiment.toFixed(2)}</span>
                      </div>
                      {result.detected_entities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {result.detected_entities.map((entity, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {entity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fix Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Fix Paths ({fixPaths.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fixPaths.length === 0 ? (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No fix paths generated</p>
                    <p className="text-sm text-gray-500">Generate strategic response plans</p>
                  </div>
                ) : (
                  fixPaths.map((fixPath) => (
                    <div key={fixPath.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{fixPath.entity_name}</h4>
                        <Badge variant={getSeverityColor(fixPath.threat_level)}>
                          {fixPath.threat_level.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {fixPath.steps?.steps?.length || 0} strategic steps
                      </p>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(fixPath.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sigmaResults.length}</div>
                <div className="text-sm text-gray-600">Live Signals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{threatProfiles.length}</div>
                <div className="text-sm text-gray-600">Threat Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{fixPaths.length}</div>
                <div className="text-sm text-gray-600">Fix Paths</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {sigmaResults.filter(r => r.severity === 'critical' || r.severity === 'high').length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SigmaPage;
