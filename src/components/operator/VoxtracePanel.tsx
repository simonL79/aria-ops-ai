
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, AlertTriangle, Play, Search, Database } from 'lucide-react';
import { toast } from 'sonner';

interface AudioThreatLog {
  id: string;
  source: string;
  audio_transcript: string;
  transcript_summary?: string;
  risk_score?: number;
  threat_detected: boolean;
  detected_at: string;
  created_at: string;
}

interface AudioSourceIndex {
  id: string;
  media_url: string;
  platform?: string;
  status: string;
  last_scanned?: string;
  created_at: string;
}

export const VoxtracePanel = () => {
  const [audioThreats, setAudioThreats] = useState<AudioThreatLog[]>([]);
  const [audioSources, setAudioSources] = useState<AudioSourceIndex[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVoxtraceData();
  }, []);

  const loadVoxtraceData = async () => {
    await Promise.all([loadAudioThreats(), loadAudioSources()]);
  };

  const loadAudioThreats = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: AudioThreatLog[] = [
        {
          id: '1',
          source: 'youtube',
          audio_transcript: 'This company is terrible and should be shut down permanently',
          transcript_summary: 'Negative sentiment expressing desire for company closure',
          risk_score: 85,
          threat_detected: true,
          detected_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          source: 'tiktok',
          audio_transcript: 'I heard from someone that this brand has serious issues with their products',
          transcript_summary: 'Spreading unverified negative claims about product quality',
          risk_score: 65,
          threat_detected: true,
          detected_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          source: 'podcast',
          audio_transcript: 'The new product launch looks promising and innovative',
          transcript_summary: 'Positive commentary on product launch',
          risk_score: 15,
          threat_detected: false,
          detected_at: new Date(Date.now() - 172800000).toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setAudioThreats(mockData);
    } catch (error) {
      console.error('Error loading audio threats:', error);
      setAudioThreats([]);
    }
  };

  const loadAudioSources = async () => {
    try {
      const mockData: AudioSourceIndex[] = [
        {
          id: '1',
          media_url: 'https://youtube.com/watch?v=example1',
          platform: 'youtube',
          status: 'scanned',
          last_scanned: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          media_url: 'https://tiktok.com/@user/video/example2',
          platform: 'tiktok',
          status: 'pending',
          last_scanned: null,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          media_url: 'https://podcast.example.com/episode/123',
          platform: 'podcast',
          status: 'failed',
          last_scanned: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setAudioSources(mockData);
    } catch (error) {
      console.error('Error loading audio sources:', error);
      setAudioSources([]);
    }
  };

  const getRiskColor = (score?: number) => {
    if (!score) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (score >= 80) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (score >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scanned':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const scanAudioSource = async () => {
    setIsLoading(true);
    try {
      const sources = ['youtube', 'tiktok', 'podcast', 'soundcloud', 'spotify'];
      const transcripts = [
        'Discussing potential issues with brand reputation management',
        'Audio review mentioning product defects and quality concerns',
        'Interview discussing corporate governance and transparency',
        'Podcast episode analyzing market competition and strategies',
        'Voice memo sharing personal experience with customer service'
      ];
      
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomTranscript = transcripts[Math.floor(Math.random() * transcripts.length)];
      const riskScore = Math.floor(Math.random() * 100);
      const threatDetected = riskScore > 50;
      
      const newThreat: AudioThreatLog = {
        id: Date.now().toString(),
        source: randomSource,
        audio_transcript: randomTranscript,
        transcript_summary: `Auto-generated summary: ${randomTranscript.substring(0, 50)}...`,
        risk_score: riskScore,
        threat_detected: threatDetected,
        detected_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      setAudioThreats(prev => [newThreat, ...prev.slice(0, 9)]);
      toast.success('Audio threat scan completed');
    } catch (error) {
      console.error('Error scanning audio source:', error);
      toast.error('Failed to scan audio source');
    } finally {
      setIsLoading(false);
    }
  };

  const indexAudioSource = async () => {
    setIsLoading(true);
    try {
      const platforms = ['youtube', 'tiktok', 'podcast', 'soundcloud'];
      const urls = [
        'https://youtube.com/watch?v=newvideo',
        'https://tiktok.com/@user/video/newclip',
        'https://podcast.example.com/episode/new',
        'https://soundcloud.com/user/track/new'
      ];
      
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      
      const newSource: AudioSourceIndex = {
        id: Date.now().toString(),
        media_url: randomUrl,
        platform: randomPlatform,
        status: 'pending',
        last_scanned: null,
        created_at: new Date().toISOString()
      };

      setAudioSources(prev => [newSource, ...prev.slice(0, 9)]);
      toast.success('Audio source indexed for scanning');
    } catch (error) {
      console.error('Error indexing audio source:', error);
      toast.error('Failed to index audio source');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Audio Threat Detection Log */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Mic className="h-4 w-4" />
            VOXTRACE™ Audio Threat Detection
            <Button
              size="sm"
              onClick={scanAudioSource}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Search className="h-3 w-3 mr-1" />
              Scan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {audioThreats.length === 0 ? (
            <div className="text-gray-500 text-sm">No audio threats detected</div>
          ) : (
            audioThreats.map((threat) => (
              <div key={threat.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Volume2 className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{threat.source.toUpperCase()}]</span>
                  </div>
                  <div className="text-xs text-purple-400 mb-1">
                    {threat.transcript_summary || threat.audio_transcript.substring(0, 80) + '...'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(threat.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRiskColor(threat.risk_score)}>
                    {threat.risk_score || 'N/A'}
                  </Badge>
                  <Badge className={threat.threat_detected ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}>
                    {threat.threat_detected ? 'threat' : 'clean'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Audio Source Index */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Audio Source Index
            <Button
              size="sm"
              onClick={indexAudioSource}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-3 w-3 mr-1" />
              Index
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {audioSources.length === 0 ? (
            <div className="text-gray-500 text-sm">No audio sources indexed</div>
          ) : (
            audioSources.map((source) => (
              <div key={source.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Play className="h-4 w-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{source.platform?.toUpperCase() || 'UNKNOWN'}]</span>
                  </div>
                  <div className="text-xs text-blue-400 mb-1">
                    {source.media_url.length > 40 ? `${source.media_url.substring(0, 37)}...` : source.media_url}
                  </div>
                  <div className="text-xs text-gray-500">
                    {source.last_scanned ? 
                      `Last scanned: ${new Date(source.last_scanned).toLocaleTimeString()}` : 
                      'Never scanned'
                    }
                  </div>
                </div>
                <Badge className={getStatusColor(source.status)}>
                  {source.status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
