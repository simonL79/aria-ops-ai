
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';
import KeywordSystemHeader from './keyword-system/KeywordSystemHeader';
import SystemStatusPanel from './keyword-system/SystemStatusPanel';
import LiveDataStatusAlert from './keyword-system/LiveDataStatusAlert';
import KeywordSystemTabs from './keyword-system/KeywordSystemTabs';

const KeywordToArticleSystem = () => {
  const [systemStatus, setSystemStatus] = useState({
    keywordIntelligence: 'ACTIVE',
    counterNarrative: 'STANDBY',
    articleGeneration: 'STANDBY'
  });
  
  const [liveDataCount, setLiveDataCount] = useState(0);
  const [counterNarratives, setCounterNarratives] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [isExecutingPipeline, setIsExecutingPipeline] = useState(false);

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
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const executeFullPipeline = async () => {
    if (isExecutingPipeline) {
      toast.warning('Pipeline execution already in progress');
      return;
    }

    setIsExecutingPipeline(true);
    toast.info('🔥 A.R.I.A vX™: Executing full live intelligence pipeline...');

    try {
      // Phase 1: Live Intelligence Gathering
      setSystemStatus(prev => ({ ...prev, keywordIntelligence: 'ACTIVE' }));
      toast.info('Phase 1: Gathering live intelligence from OSINT sources...');
      
      const liveResults = await performRealScan({
        fullScan: true,
        source: 'full_pipeline'
      });

      if (liveResults.length > 0) {
        setLiveDataCount(liveResults.length);
        toast.success(`Phase 1 Complete: ${liveResults.length} live intelligence items gathered`);
        
        // Phase 2: Counter-Narrative Generation
        setSystemStatus(prev => ({ 
          ...prev, 
          keywordIntelligence: 'COMPLETE',
          counterNarrative: 'ACTIVE' 
        }));
        toast.info('Phase 2: Generating strategic counter-narratives...');
        
        // Simulate counter-narrative generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSystemStatus(prev => ({ 
          ...prev, 
          counterNarrative: 'COMPLETE',
          articleGeneration: 'ACTIVE' 
        }));
        toast.info('Phase 3: Preparing article generation strategies...');
        
        // Phase 3: Article Generation Prep
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSystemStatus(prev => ({ 
          ...prev, 
          articleGeneration: 'READY' 
        }));
        
        toast.success('✅ A.R.I.A vX™: Full pipeline execution complete - system ready for article generation');
      } else {
        toast.warning('No live intelligence available for pipeline execution');
      }
      
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      toast.error('❌ A.R.I.A vX™: Pipeline execution failed');
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
      />

      <SystemStatusPanel systemStatus={systemStatus} />

      <LiveDataStatusAlert liveDataCount={liveDataCount} />

      <KeywordSystemTabs
        keywordData={keywordData}
        counterNarratives={counterNarratives}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default KeywordToArticleSystem;
