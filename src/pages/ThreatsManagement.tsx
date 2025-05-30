
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Eye,
  Calendar,
  MapPin,
  User,
  Link,
  FileText,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Shield,
  Brain,
  Target,
  AlertCircle
} from 'lucide-react';

interface ThreatDetails {
  id: string;
  platform: string;
  content: string;
  url: string;
  severity: string;
  status: string;
  threat_type: string;
  sentiment: number;
  confidence_score: number;
  potential_reach: number;
  detected_entities: string[];
  source_type: string;
  entity_name: string;
  source_credibility_score: number;
  media_is_ai_generated: boolean;
  ai_detection_confidence: number;
  created_at: string;
  updated_at: string;
  freshness_window?: string;
}

const ThreatsManagement = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [threats, setThreats] = useState<ThreatDetails[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatDetails | null>(null);
  const [isLoadingThreats, setIsLoadingThreats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D]">
        <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    loadThreats();
  }, []);

  const loadThreats = async () => {
    try {
      setIsLoadingThreats(true);
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setThreats(data || []);
    } catch (error) {
      console.error('Failed to load threats:', error);
      toast.error('Failed to load threats');
    } finally {
      setIsLoadingThreats(false);
    }
  };

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         threat.entity_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         threat.platform.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || threat.severity === severityFilter;
    const matchesPlatform = platformFilter === 'all' || threat.platform === platformFilter;
    
    return matchesSearch && matchesSeverity && matchesPlatform;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'investigating': return 'bg-purple-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'false_positive': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateThreatAge = (dateString: string) => {
    const now = new Date();
    const threatDate = new Date(dateString);
    const diffMs = now.getTime() - threatDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-400 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              Threats Management
            </h1>
            <p className="text-gray-300 mt-2">
              Comprehensive threat intelligence and investigation dashboard
            </p>
          </div>
          <Button
            onClick={loadThreats}
            className="bg-amber-600 hover:bg-amber-700 text-black"
          >
            <Eye className="mr-2 h-4 w-4" />
            Refresh Threats
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="bg-[#1A1B1E] border-amber-600/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-amber-400 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search threats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#0A0B0D] border-amber-600/50 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-amber-400 mb-2">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full p-2 bg-[#0A0B0D] border border-amber-600/50 rounded text-white"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-amber-400 mb-2">Platform</label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full p-2 bg-[#0A0B0D] border border-amber-600/50 rounded text-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="Reddit">Reddit</option>
                  <option value="Twitter">Twitter</option>
                  <option value="News">News</option>
                  <option value="Google">Google</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <div className="text-sm text-gray-400">
                  <div>Total: {threats.length}</div>
                  <div>Filtered: {filteredThreats.length}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Threats List */}
          <Card className="bg-[#1A1B1E] border-amber-600/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Threats ({filteredThreats.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {isLoadingThreats ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading threats...</p>
                  </div>
                ) : filteredThreats.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No threats found matching your criteria
                  </div>
                ) : (
                  filteredThreats.map((threat) => (
                    <div
                      key={threat.id}
                      onClick={() => setSelectedThreat(threat)}
                      className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-[#0A0B0D] transition-colors ${
                        selectedThreat?.id === threat.id ? 'bg-[#0A0B0D] border-l-4 border-l-amber-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {threat.platform}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400">
                          {calculateThreatAge(threat.created_at)}
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-white mb-1">
                        {threat.entity_name || 'Unknown Entity'}
                      </h3>
                      
                      <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                        {threat.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Reach: {threat.potential_reach || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          Confidence: {threat.confidence_score || 0}%
                        </span>
                        <Badge className={getStatusColor(threat.status)}>
                          {threat.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Threat Details */}
          <Card className="bg-[#1A1B1E] border-amber-600/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Threat Intelligence Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedThreat ? (
                <div className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-amber-400">Threat ID</label>
                      <p className="text-white font-mono text-sm">{selectedThreat.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-400">Entity</label>
                      <p className="text-white">{selectedThreat.entity_name || 'Unknown'}</p>
                    </div>
                  </div>

                  {/* Timing Information */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timeline Intelligence
                    </h3>
                    <div className="grid grid-cols-1 gap-3 bg-[#0A0B0D] p-4 rounded">
                      <div className="flex justify-between">
                        <span className="text-amber-400">First Detected:</span>
                        <span className="text-white">{formatDate(selectedThreat.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-400">Last Updated:</span>
                        <span className="text-white">{formatDate(selectedThreat.updated_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-400">Threat Age:</span>
                        <span className="text-white">{calculateThreatAge(selectedThreat.created_at)}</span>
                      </div>
                      {selectedThreat.freshness_window && (
                        <div className="flex justify-between">
                          <span className="text-amber-400">Freshness Window:</span>
                          <span className="text-white">{selectedThreat.freshness_window}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Source Intelligence */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Source Intelligence
                    </h3>
                    <div className="grid grid-cols-1 gap-3 bg-[#0A0B0D] p-4 rounded">
                      <div className="flex justify-between">
                        <span className="text-amber-400">Platform:</span>
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          {selectedThreat.platform}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-400">Source Type:</span>
                        <span className="text-white">{selectedThreat.source_type || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-400">Source Credibility:</span>
                        <span className="text-white">{selectedThreat.source_credibility_score || 0}%</span>
                      </div>
                      {selectedThreat.url && (
                        <div className="space-y-1">
                          <span className="text-amber-400">Source URL:</span>
                          <a 
                            href={selectedThreat.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {selectedThreat.url.substring(0, 60)}...
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Risk Assessment
                    </h3>
                    <div className="grid grid-cols-2 gap-3 bg-[#0A0B0D] p-4 rounded">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-amber-400">Severity:</span>
                          <Badge className={getSeverityColor(selectedThreat.severity)}>
                            {selectedThreat.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-400">Threat Type:</span>
                          <span className="text-white">{selectedThreat.threat_type || 'General'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-400">Status:</span>
                          <Badge className={getStatusColor(selectedThreat.status)}>
                            {selectedThreat.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-amber-400">Confidence:</span>
                          <span className="text-white">{selectedThreat.confidence_score || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-400">Potential Reach:</span>
                          <span className="text-white">{selectedThreat.potential_reach || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-400">Sentiment:</span>
                          <span className={`${selectedThreat.sentiment < 0 ? 'text-red-400' : selectedThreat.sentiment > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                            {selectedThreat.sentiment ? selectedThreat.sentiment.toFixed(2) : 'Neutral'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Analysis
                    </h3>
                    <div className="bg-[#0A0B0D] p-4 rounded space-y-3">
                      <div className="flex justify-between">
                        <span className="text-amber-400">AI Generated Content:</span>
                        <Badge className={selectedThreat.media_is_ai_generated ? 'bg-orange-500' : 'bg-green-500'}>
                          {selectedThreat.media_is_ai_generated ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      {selectedThreat.media_is_ai_generated && (
                        <div className="flex justify-between">
                          <span className="text-amber-400">AI Detection Confidence:</span>
                          <span className="text-white">{selectedThreat.ai_detection_confidence || 0}%</span>
                        </div>
                      )}
                      {selectedThreat.detected_entities && selectedThreat.detected_entities.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-amber-400">Detected Entities:</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedThreat.detected_entities.map((entity, index) => (
                              <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Analysis */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Content Analysis
                    </h3>
                    <div className="bg-[#0A0B0D] p-4 rounded">
                      <div className="space-y-2">
                        <span className="text-amber-400">Full Content:</span>
                        <div className="bg-gray-800 p-3 rounded text-sm text-gray-300 max-h-40 overflow-y-auto">
                          {selectedThreat.content}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Select a threat from the list to view detailed intelligence
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ThreatsManagement;
