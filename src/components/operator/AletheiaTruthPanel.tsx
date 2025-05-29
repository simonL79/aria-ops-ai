
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Eye, Search, Anchor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TruthClaim {
  id: string;
  entity_id: string | null;
  claim_text: string;
  source_url: string | null;
  credibility_score: number;
  corroborating_sources: string[];
  refuted_sources: string[];
  created_at: string;
}

interface VerificationLog {
  id: string;
  claim_id: string;
  verified_by: string | null;
  verification_status: 'verified' | 'refuted' | 'uncertain';
  notes: string | null;
  verified_at: string;
}

export const AletheiaTruthPanel = () => {
  const [truthClaims, setTruthClaims] = useState<TruthClaim[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTruthData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('aletheia-truth-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'aletheia_truth_graph' },
        () => loadTruthData()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'aletheia_verification_log' },
        () => loadVerificationLogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadTruthData = async () => {
    try {
      const { data, error } = await supabase
        .from('aletheia_truth_graph')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setTruthClaims(data || []);
    } catch (error) {
      console.error('Error loading truth claims:', error);
    }
  };

  const loadVerificationLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('aletheia_verification_log')
        .select('*')
        .order('verified_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      // Type assertion to ensure proper typing
      const typedData = (data || []).map(log => ({
        ...log,
        verification_status: log.verification_status as 'verified' | 'refuted' | 'uncertain'
      }));
      setVerificationLogs(typedData);
    } catch (error) {
      console.error('Error loading verification logs:', error);
    }
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (score >= 0.5) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (score >= 0.5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'refuted':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'uncertain':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'refuted':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'uncertain':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const triggerTruthAnalysis = async () => {
    setIsLoading(true);
    try {
      // Simulate adding a new truth claim for analysis
      await supabase
        .from('aletheia_truth_graph')
        .insert({
          claim_text: 'AI-generated claim requiring truth verification',
          source_url: 'https://example.com/claim',
          credibility_score: 0.65,
          corroborating_sources: ['https://source1.com'],
          refuted_sources: []
        });

      toast.success('Truth analysis initiated');
      loadTruthData();
    } catch (error) {
      console.error('Error triggering truth analysis:', error);
      toast.error('Failed to initiate truth analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Truth Graph Claims */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            Aletheia™ Truth Graph
            <Button
              size="sm"
              onClick={triggerTruthAnalysis}
              disabled={isLoading}
              className="ml-auto text-xs bg-cyan-600 hover:bg-cyan-700"
            >
              <Search className="h-3 w-3 mr-1" />
              Analyze Truth
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {truthClaims.length === 0 ? (
            <div className="text-gray-500 text-sm">No truth claims recorded</div>
          ) : (
            truthClaims.map((claim) => (
              <div key={claim.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getCredibilityIcon(claim.credibility_score)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{claim.claim_text}</div>
                  {claim.source_url && (
                    <div className="text-xs text-cyan-300 mb-1">
                      Source: {claim.source_url}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(claim.created_at).toLocaleTimeString()}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {claim.corroborating_sources.length > 0 && (
                      <span className="text-xs text-green-400">
                        +{claim.corroborating_sources.length} sources
                      </span>
                    )}
                    {claim.refuted_sources.length > 0 && (
                      <span className="text-xs text-red-400">
                        -{claim.refuted_sources.length} refuted
                      </span>
                    )}
                  </div>
                </div>
                <Badge className={getCredibilityColor(claim.credibility_score)}>
                  {Math.round(claim.credibility_score * 100)}%
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Verification Logs */}
      <Card className="bg-black border-indigo-500/30">
        <CardHeader>
          <CardTitle className="text-indigo-400 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Verification Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {verificationLogs.length === 0 ? (
            <div className="text-gray-500 text-sm">No verification logs available</div>
          ) : (
            verificationLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                {getVerificationIcon(log.verification_status)}
                <div className="flex-1">
                  <div className="text-sm text-white">
                    Verified by {log.verified_by || 'Unknown'}
                  </div>
                  {log.notes && (
                    <div className="text-xs text-indigo-300">{log.notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(log.verified_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getVerificationColor(log.verification_status)}>
                  {log.verification_status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
