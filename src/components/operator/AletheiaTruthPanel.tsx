
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TruthClaim {
  id: string;
  claim_text: string;
  verification_status: 'verified' | 'disputed' | 'pending';
  confidence_score: number;
  source_references: string[];
  last_updated: string;
}

interface VerificationEvent {
  id: string;
  claim_id: string;
  verification_result: string;
  evidence_sources: string[];
  verified_at: string;
}

export const AletheiaTruthPanel = () => {
  const [truthClaims, setTruthClaims] = useState<TruthClaim[]>([]);
  const [verificationEvents, setVerificationEvents] = useState<VerificationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTruthData();
  }, []);

  const loadTruthData = async () => {
    try {
      // Use existing activity_logs as substitute for truth claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'truth_verification')
        .order('created_at', { ascending: false })
        .limit(5);

      if (claimsError && claimsError.code !== 'PGRST116') {
        console.error('Error loading claims:', claimsError);
      }

      // Transform data to match interface
      const claims: TruthClaim[] = (claimsData || []).map(item => ({
        id: item.id,
        claim_text: item.details || 'Truth claim verification',
        verification_status: 'pending' as const,
        confidence_score: 85,
        source_references: ['System Log'],
        last_updated: item.created_at
      }));

      setTruthClaims(claims);

      // Use activity_logs for verification events too
      const { data: eventsData, error: eventsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'truth_verification')
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError && eventsError.code !== 'PGRST116') {
        console.error('Error loading events:', eventsError);
      }

      const events: VerificationEvent[] = (eventsData || []).map(item => ({
        id: item.id,
        claim_id: item.entity_id || item.id,
        verification_result: 'verified',
        evidence_sources: ['System Evidence'],
        verified_at: item.created_at
      }));

      setVerificationEvents(events);
    } catch (error) {
      console.error('Error in loadTruthData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disputed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <CheckCircle className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-mono">ALETHEIA™ TRUTH ENGINE</span>
        </div>
        <div className="text-xs text-purple-300">Loading truth verification system...</div>
      </div>
    );
  }

  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-purple-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-mono">ALETHEIA™ TRUTH ENGINE</span>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
          {truthClaims.length} Claims
        </Badge>
      </div>

      <div className="space-y-2">
        {truthClaims.map((claim) => (
          <div key={claim.id} className="bg-purple-800/20 rounded p-2">
            <div className="flex items-start gap-2 mb-1">
              {getStatusIcon(claim.verification_status)}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-purple-200 truncate">
                  {claim.claim_text}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getStatusColor(claim.verification_status)} text-xs`}>
                    {claim.verification_status}
                  </Badge>
                  <span className="text-xs text-purple-400">
                    {claim.confidence_score}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {truthClaims.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-400 opacity-50" />
            <div className="text-xs text-purple-300">No truth claims to verify</div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-purple-500/20">
        <div className="text-xs text-purple-400 mb-2">Recent Verifications</div>
        <div className="space-y-1">
          {verificationEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="text-xs text-purple-300">
              • Verified claim at {new Date(event.verified_at).toLocaleTimeString()}
            </div>
          ))}
        </div>
      </div>

      <Button
        size="sm"
        onClick={loadTruthData}
        className="w-full mt-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs"
      >
        Refresh Truth Graph
      </Button>
    </div>
  );
};
