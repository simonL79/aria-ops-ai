import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';
import { KeywordCIAIntegration } from '@/services/intelligence/keywordCIAIntegration';
import KeywordSystemHeader from './keyword-system/KeywordSystemHeader';
import SystemStatusPanel from './keyword-system/SystemStatusPanel';
import LiveDataStatusAlert from './keyword-system/LiveDataStatusAlert';
import KeywordSystemTabs from './keyword-system/KeywordSystemTabs';

const KeywordToArticleSystem = () => {
  const [systemStatus, setSystemStatus] = useState({
    keywordIntelligence: 'ACTIVE',
    counterNarrative: 'STANDBY',
    articleGeneration: 'STANDBY',
    ciaPrecision: 'STANDBY',
    pipelineCommunication: 'READY'
  });
  
  const [liveDataCount, setLiveDataCount] = useState(0);
  const [counterNarratives, setCounterNarratives] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [isExecutingPipeline, setIsExecutingPipeline] = useState(false);
  const [isTestingCIAPrecision, setIsTestingCIAPrecision] = useState(false);
  const [clientCount, setClientCount] = useState(0);

  const refreshData = async () => {
    try {
      // Fetch counter narratives
      const { data: narratives } = await supabase
        .from('counter_narratives')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      setCounterNarratives(narratives || []);

      // Get live data count from scan results
      const { data: scanResults } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setLiveDataCount(scanResults?.length || 0);

      // Get client count
      const { data: clients } = await supabase
        .from('clients')
        .select('id')
        .order('created_at', { ascending: false });
      
      setClientCount(clients?.length || 0);
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const testCIAPrecision = async () => {
    if (isTestingCIAPrecision) {
      toast.warning('CIA precision test already in progress');
      return;
    }

    setIsTestingCIAPrecision(true);
    setSystemStatus(prev => ({ ...prev, ciaPrecision: 'TESTING' }));
    
    toast.info('🎯 Testing CIA-level precision against known false positives...');

    try {
      // Test precision against known false positives
      const testResult = await KeywordCIAIntegration.testPrecisionAgainstKnownFalsePositives('Simon Lindsay');
      
      if (testResult.passed) {
        setSystemStatus(prev => ({ ...prev, ciaPrecision: 'ACTIVE' }));
        toast.success(`✅ CIA Precision Test PASSED: ${(testResult.score * 100).toFixed(1)}% accuracy`);
        toast.success(`🚫 Blocked ${testResult.blockedFalsePositives.length} false positives: Lindsay Lohan, Simon Cowell, etc.`);
      } else {
        setSystemStatus(prev => ({ ...prev, ciaPrecision: 'FAILED' }));
        toast.error(`❌ CIA Precision Test FAILED: ${(testResult.score * 100).toFixed(1)}% accuracy (needs 75%+)`);
      }

      // Show detailed results
      console.log('🎯 CIA Precision Test Results:', testResult);
      
    } catch (error) {
      console.error('CIA precision test failed:', error);
      setSystemStatus(prev => ({ ...prev, ciaPrecision: 'ERROR' }));
      toast.error('❌ CIA precision test failed');
    } finally {
      setIsTestingCIAPrecision(false);
    }
  };

  const executeFullPipeline = async () => {
    if (isExecutingPipeline) {
      toast.warning('Pipeline execution already in progress');
      return;
    }

    setIsExecutingPipeline(true);
    setSystemStatus(prev => ({ ...prev, pipelineCommunication: 'ACTIVE' }));
    toast.info(`🔥 A.R.I.A vX™: Executing coordinated pipeline for ${clientCount} registered clients...`);

    try {
      // Get all registered clients
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id, name, keywordtargets')
        .order('created_at', { ascending: false });

      if (clientError) throw clientError;

      if (!clients || clients.length === 0) {
        toast.warning('No clients found in database. Add clients using the Entity Scan tab first.');
        return;
      }

      // Execute coordinated pipeline for each client using the new IntelligencePipeline
      const { IntelligencePipeline } = await import('@/services/intelligence/intelligencePipeline');
      
      let totalResults = 0;
      let avgPrecisionScore = 0;
      let totalNarratives = 0;
      let totalArticles = 0;

      for (const client of clients) {
        try {
          toast.info(`🔍 Executing coordinated pipeline for: ${client.name}`);
          
          const pipelineResult = await IntelligencePipeline.executeFullPipeline(client.name);
          
          totalResults += pipelineResult.entityScan.threats_detected;
          avgPrecisionScore += pipelineResult.ciaPrecision.precision_score;
          totalNarratives += pipelineResult.counterNarratives.narratives_generated;
          totalArticles += pipelineResult.articleGeneration.articles_suggested;

          toast.success(`✅ ${client.name}: Pipeline complete - ${pipelineResult.entityScan.threats_detected} threats → ${pipelineResult.ciaPrecision.verified_results.length} verified → ${pipelineResult.counterNarratives.narratives_generated} strategies → ${pipelineResult.articleGeneration.articles_suggested} articles`);

        } catch (error) {
          console.error(`Error processing client ${client.name}:`, error);
          toast.error(`❌ Failed to process ${client.name}`);
        }
      }

      if (totalResults > 0) {
        setLiveDataCount(totalResults);
        const finalAvgPrecision = avgPrecisionScore / clients.length;
        
        // Update system status to reflect coordinated completion
        setSystemStatus(prev => ({ 
          ...prev,
          keywordIntelligence: 'COMPLETE',
          ciaPrecision: 'ACTIVE',
          counterNarrative: 'COMPLETE',
          articleGeneration: 'READY',
          pipelineCommunication: 'COMPLETE'
        }));
        
        // Show coordinated pipeline success
        toast.success(`🎯 Coordinated Pipeline Complete: ${totalResults} threats → ${finalAvgPrecision.toFixed(2)} avg precision → ${totalNarratives} strategies → ${totalArticles} articles`);
        toast.info(`📊 All components now communicating: Entity Scan ↔ CIA Precision ↔ Counter Narratives ↔ Article Generation`);
        
      } else {
        toast.warning(`No coordinated intelligence found for ${clients.length} registered clients`);
      }
      
    } catch (error) {
      console.error('Coordinated pipeline execution failed:', error);
      toast.error('❌ A.R.I.A vX™: Coordinated pipeline execution failed');
    } finally {
      setIsExecutingPipeline(false);
      refreshData();
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="space-y-6 relative z-0">
      <KeywordSystemHeader
        liveDataCount={liveDataCount}
        isExecutingPipeline={isExecutingPipeline}
        onExecutePipeline={executeFullPipeline}
        isTestingCIAPrecision={isTestingCIAPrecision}
        onTestCIAPrecision={testCIAPrecision}
        clientCount={clientCount}
      />

      <SystemStatusPanel 
        systemStatus={systemStatus} 
        ciaPrecisionEnabled={true}
      />

      <LiveDataStatusAlert 
        liveDataCount={liveDataCount} 
        ciaPrecisionActive={systemStatus.ciaPrecision === 'ACTIVE'}
      />

      <KeywordSystemTabs
        keywordData={keywordData}
        counterNarratives={counterNarratives}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default KeywordToArticleSystem;
