
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IngestJob {
  id: string;
  submissionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

interface IngestStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  isRunning: boolean;
}

const ThreatIngestWorker = () => {
  const [jobs, setJobs] = useState<IngestJob[]>([]);
  const [stats, setStats] = useState<IngestStats>({
    totalJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    averageProcessingTime: 0,
    isRunning: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIngestData();
    
    // Set up real-time subscription for new submissions
    const channel = supabase
      .channel('ingest-worker')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reputation_scan_submissions'
      }, (payload) => {
        handleNewSubmission(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadIngestData = async () => {
    try {
      // Load recent submissions
      const { data: submissions, error } = await supabase
        .from('reputation_scan_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Convert submissions to ingest jobs format
      const ingestJobs: IngestJob[] = (submissions || []).map(sub => ({
        id: `job_${sub.id}`,
        submissionId: sub.id,
        status: sub.status === 'completed' ? 'completed' : 
                sub.status === 'failed' ? 'failed' : 
                sub.status === 'processing' ? 'processing' : 'pending',
        progress: sub.status === 'completed' ? 100 : 
                 sub.status === 'processing' ? 50 : 0,
        startedAt: sub.created_at ? new Date(sub.created_at) : undefined,
        completedAt: sub.updated_at && sub.status === 'completed' ? new Date(sub.updated_at) : undefined
      }));

      setJobs(ingestJobs);

      // Calculate stats
      const totalJobs = ingestJobs.length;
      const completedJobs = ingestJobs.filter(job => job.status === 'completed').length;
      const failedJobs = ingestJobs.filter(job => job.status === 'failed').length;
      const runningJobs = ingestJobs.filter(job => job.status === 'processing').length;

      setStats({
        totalJobs,
        completedJobs,
        failedJobs,
        averageProcessingTime: 15000, // Mock: 15 seconds average
        isRunning: runningJobs > 0
      });

    } catch (error) {
      console.error('Failed to load ingest data:', error);
      toast.error('Failed to load ingest worker data');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSubmission = async (submission: any) => {
    console.log('New submission received:', submission);
    
    // Start the threat analysis process
    await processSubmission(submission);
    
    // Reload data to show the new job
    loadIngestData();
  };

  const processSubmission = async (submission: any) => {
    try {
      // Update submission status to processing
      await supabase
        .from('reputation_scan_submissions')
        .update({ status: 'processing' })
        .eq('id', submission.id);

      // Create a new scan result entry
      const { data: scanResult, error: scanError } = await supabase
        .from('scan_results')
        .insert({
          platform: 'Manual Submission',
          content: `Reputation scan for: ${submission.keywords}`,
          url: '',
          severity: 'medium',
          status: 'new',
          threat_type: 'reputation_scan',
          source_type: 'manual',
          confidence_score: 85,
          sentiment: 0
        })
        .select()
        .single();

      if (scanError) throw scanError;

      // Simulate AI threat analysis delay
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Run AI threat analysis
      const threatAnalysis = await runThreatAnalysis(submission, scanResult);

      // Update scan result with AI analysis
      await supabase
        .from('scan_results')
        .update({
          threat_type: threatAnalysis.threat_type,
          threat_summary: threatAnalysis.threat_summary,
          confidence_score: threatAnalysis.confidence_score,
          ai_detection_confidence: threatAnalysis.ai_detection_confidence,
          source_credibility_score: threatAnalysis.source_credibility_score
        })
        .eq('id', scanResult.id);

      // Update submission status to completed
      await supabase
        .from('reputation_scan_submissions')
        .update({ 
          status: 'completed',
          admin_notes: `Processed successfully. Threat level: ${threatAnalysis.threat_type}`
        })
        .eq('id', submission.id);

      toast.success('Threat analysis completed successfully');

    } catch (error) {
      console.error('Processing failed:', error);
      
      // Update submission status to failed
      await supabase
        .from('reputation_scan_submissions')
        .update({ 
          status: 'failed',
          admin_notes: `Processing failed: ${error.message}`
        })
        .eq('id', submission.id);

      toast.error('Threat analysis failed');
    }
  };

  const runThreatAnalysis = async (submission: any, scanResult: any) => {
    // Mock AI threat analysis - in production this would call OpenAI
    const threatTypes = ['reputation_damage', 'disinformation', 'harassment', 'competitive'];
    const randomThreatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    
    return {
      threat_type: randomThreatType,
      threat_summary: `Analysis of ${submission.keywords} reveals potential ${randomThreatType} concerns`,
      confidence_score: Math.floor(Math.random() * 30) + 70, // 70-100
      ai_detection_confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      source_credibility_score: Math.random() * 0.4 + 0.6 // 0.6-1.0
    };
  };

  const startWorker = async () => {
    toast.success('Ingest worker started');
    setStats(prev => ({ ...prev, isRunning: true }));
  };

  const stopWorker = async () => {
    toast.info('Ingest worker stopped');
    setStats(prev => ({ ...prev, isRunning: false }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Threat Ingest Worker
          </h2>
          <p className="text-muted-foreground">
            Automated threat analysis and processing pipeline
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {stats.isRunning ? (
            <Button variant="outline" onClick={stopWorker}>
              <Pause className="h-4 w-4 mr-2" />
              Stop Worker
            </Button>
          ) : (
            <Button onClick={startWorker}>
              <Play className="h-4 w-4 mr-2" />
              Start Worker
            </Button>
          )}
          
          <Button variant="outline" onClick={loadIngestData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalJobs > 0 ? Math.round((stats.completedJobs / stats.totalJobs) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalJobs > 0 ? Math.round((stats.failedJobs / stats.totalJobs) * 100) : 0}% failure rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg. Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.averageProcessingTime / 1000).toFixed(1)}s
            </div>
            <p className="text-xs text-muted-foreground">Per job</p>
          </CardContent>
        </Card>
      </div>

      {/* Worker Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Worker Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={stats.isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {stats.isRunning ? 'Running' : 'Stopped'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {stats.isRunning ? 'Actively processing new submissions' : 'Worker is idle'}
              </span>
            </div>
            
            {stats.isRunning && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>Latest threat analysis jobs processed by the worker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="font-medium">Job {job.submissionId}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.startedAt ? job.startedAt.toLocaleString() : 'Pending start'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {job.status === 'processing' && (
                      <Progress value={job.progress} className="w-20" />
                    )}
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent jobs found</p>
                <p className="text-sm text-muted-foreground">
                  Jobs will appear here when new submissions are processed
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatIngestWorker;
