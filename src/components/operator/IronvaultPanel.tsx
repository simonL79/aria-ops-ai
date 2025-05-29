
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, FileText, Eye, Search, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface IronvaultDocument {
  id: string;
  title: string;
  document_hash: string;
  content_excerpt?: string;
  leak_detected: boolean;
  leak_detected_at?: string;
  source?: string;
  sensitivity_level?: string;
  tags?: string[];
  created_at: string;
}

interface IronvaultSource {
  id: string;
  platform: string;
  leak_link: string;
  detected_at: string;
  verified: boolean;
  verification_notes?: string;
}

interface DocumentLeak {
  id: string;
  document_id: string;
  source_id: string;
  risk_score?: number;
  verified: boolean;
  flagged_by?: string;
}

export const IronvaultPanel = () => {
  const [documents, setDocuments] = useState<IronvaultDocument[]>([]);
  const [sources, setSources] = useState<IronvaultSource[]>([]);
  const [leaks, setLeaks] = useState<DocumentLeak[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadIronvaultData();
  }, []);

  const loadIronvaultData = async () => {
    await Promise.all([loadDocuments(), loadSources(), loadLeaks()]);
  };

  const loadDocuments = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: IronvaultDocument[] = [
        {
          id: '1',
          title: 'Corporate Financial Reports Q4',
          document_hash: 'sha256:a1b2c3d4e5f6',
          content_excerpt: 'Confidential quarterly financial data and projections',
          leak_detected: true,
          leak_detected_at: new Date().toISOString(),
          source: 'Internal Database',
          sensitivity_level: 'critical',
          tags: ['financial', 'quarterly', 'confidential'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Employee Personal Data Export',
          document_hash: 'sha256:f6e5d4c3b2a1',
          content_excerpt: 'Database export containing employee PII',
          leak_detected: false,
          source: 'HR System',
          sensitivity_level: 'high',
          tags: ['hr', 'personal-data', 'gdpr'],
          created_at: new Date().toISOString()
        }
      ];
      setDocuments(mockData);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };

  const loadSources = async () => {
    try {
      // Use mock data for leak sources
      const mockData: IronvaultSource[] = [
        {
          id: '1',
          platform: 'Pastebin',
          leak_link: 'https://pastebin.com/example123',
          detected_at: new Date().toISOString(),
          verified: true,
          verification_notes: 'Confirmed leak of financial data'
        },
        {
          id: '2',
          platform: 'Dark Web Forum',
          leak_link: 'tor://hidden-service/leaked-docs',
          detected_at: new Date().toISOString(),
          verified: false,
          verification_notes: 'Requires further investigation'
        }
      ];
      setSources(mockData);
    } catch (error) {
      console.error('Error loading sources:', error);
      setSources([]);
    }
  };

  const loadLeaks = async () => {
    try {
      // Use mock data for document leaks
      const mockData: DocumentLeak[] = [
        {
          id: '1',
          document_id: '1',
          source_id: '1',
          risk_score: 95,
          verified: true,
          flagged_by: 'IRONVAULT™ AI Scanner'
        },
        {
          id: '2',
          document_id: '2',
          source_id: '2',
          risk_score: 67,
          verified: false,
          flagged_by: 'Automated Detection'
        }
      ];
      setLeaks(mockData);
    } catch (error) {
      console.error('Error loading leaks:', error);
      setLeaks([]);
    }
  };

  const getSensitivityColor = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getLeakIcon = (detected: boolean) => {
    return detected ? 
      <AlertTriangle className="h-4 w-4 text-red-400" /> : 
      <Shield className="h-4 w-4 text-green-400" />;
  };

  const getRiskColor = (score?: number) => {
    if (!score) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (score >= 80) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (score >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const simulateLeakDetection = async () => {
    setIsLoading(true);
    try {
      const documentTitles = [
        'Strategic Business Plan 2024',
        'Customer Database Backup',
        'Legal Settlement Documents',
        'Executive Compensation Report',
        'Product Development Roadmap'
      ];
      
      const platforms = ['Pastebin', 'GitHub', 'Dark Web Forum', 'Telegram', 'Discord'];
      const sensitivities = ['low', 'medium', 'high', 'critical'];
      
      const randomTitle = documentTitles[Math.floor(Math.random() * documentTitles.length)];
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      const randomSensitivity = sensitivities[Math.floor(Math.random() * sensitivities.length)];
      const riskScore = Math.floor(Math.random() * 100);
      
      const newDocument: IronvaultDocument = {
        id: Date.now().toString(),
        title: randomTitle,
        document_hash: `sha256:${Math.random().toString(36).substring(2, 15)}`,
        content_excerpt: `Potential leak detected: ${randomTitle}`,
        leak_detected: Math.random() > 0.3, // 70% chance of leak
        leak_detected_at: new Date().toISOString(),
        source: 'IRONVAULT™ Scanner',
        sensitivity_level: randomSensitivity,
        tags: ['detected', 'surveillance', randomSensitivity],
        created_at: new Date().toISOString()
      };

      setDocuments(prev => [newDocument, ...prev.slice(0, 9)]);
      toast.success('Document leak scan completed');
    } catch (error) {
      console.error('Error simulating leak detection:', error);
      toast.error('Failed to simulate leak detection');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLeak = async () => {
    setIsLoading(true);
    try {
      const platforms = ['Pastebin', 'GitHub Gist', 'Discord', 'Telegram Channel', 'Dark Web'];
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      const verified = Math.random() > 0.4; // 60% chance of verification
      
      const newSource: IronvaultSource = {
        id: Date.now().toString(),
        platform: randomPlatform,
        leak_link: `https://${randomPlatform.toLowerCase()}.com/leak-${Date.now()}`,
        detected_at: new Date().toISOString(),
        verified: verified,
        verification_notes: verified ? 
          'Leak confirmed by IRONVAULT™ verification system' : 
          'Requires manual verification - potential false positive'
      };

      setSources(prev => [newSource, ...prev.slice(0, 9)]);
      toast.success('Leak source verification completed');
    } catch (error) {
      console.error('Error verifying leak:', error);
      toast.error('Failed to verify leak source');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Document Registry */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Lock className="h-4 w-4" />
            IRONVAULT™ Document Registry
            <Button
              size="sm"
              onClick={simulateLeakDetection}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <Search className="h-3 w-3 mr-1" />
              Scan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {documents.length === 0 ? (
            <div className="text-gray-500 text-sm">No documents in registry</div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getLeakIcon(doc.leak_detected)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[{doc.title}]</span>
                  </div>
                  {doc.content_excerpt && (
                    <div className="text-xs text-red-400 mb-1">{doc.content_excerpt}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Hash: {doc.document_hash.substring(0, 16)}... | 
                    {doc.leak_detected_at ? 
                      ` Leaked: ${new Date(doc.leak_detected_at).toLocaleTimeString()}` :
                      ` Created: ${new Date(doc.created_at).toLocaleTimeString()}`
                    }
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getSensitivityColor(doc.sensitivity_level)}>
                    {doc.sensitivity_level || 'unknown'}
                  </Badge>
                  <Badge className={doc.leak_detected ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}>
                    {doc.leak_detected ? 'leaked' : 'secure'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Leak Sources */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Leak Source Monitor
            <Button
              size="sm"
              onClick={verifyLeak}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <Shield className="h-3 w-3 mr-1" />
              Verify
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {sources.length === 0 ? (
            <div className="text-gray-500 text-sm">No leak sources detected</div>
          ) : (
            sources.map((source) => (
              <div key={source.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Eye className="h-4 w-4 text-orange-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{source.platform}]</span> Leak Detected
                  </div>
                  <div className="text-xs text-orange-400 mb-1">
                    {source.leak_link.length > 50 ? 
                      `${source.leak_link.substring(0, 47)}...` : 
                      source.leak_link
                    }
                  </div>
                  {source.verification_notes && (
                    <div className="text-xs text-gray-400 mb-1">{source.verification_notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(source.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={source.verified ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'}>
                  {source.verified ? 'verified' : 'pending'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Leak Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {leaks.length === 0 ? (
            <div className="text-gray-500 text-sm">No leak assessments available</div>
          ) : (
            leaks.map((leak) => {
              const doc = documents.find(d => d.id === leak.document_id);
              const source = sources.find(s => s.id === leak.source_id);
              return (
                <div key={leak.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                  <AlertTriangle className="h-4 w-4 text-purple-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">
                      <span className="text-purple-300">[{doc?.title || 'Unknown Document'}]</span>
                    </div>
                    <div className="text-xs text-purple-400 mb-1">
                      Source: {source?.platform || 'Unknown'} | Flagged by: {leak.flagged_by}
                    </div>
                    <div className="text-xs text-gray-500">
                      Risk Score: {leak.risk_score || 'N/A'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getRiskColor(leak.risk_score)}>
                      {leak.risk_score ? `${leak.risk_score}%` : 'N/A'}
                    </Badge>
                    <Badge className={leak.verified ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'}>
                      {leak.verified ? 'confirmed' : 'investigating'}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
