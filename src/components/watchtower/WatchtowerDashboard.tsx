import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Satellite, Search, Users, Mail, TrendingUp, Target, AlertTriangle, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WatchtowerCandidate {
  id: string;
  entity_name: string;
  discovery_source: string;
  threat_summary: string;
  threat_score: number;
  confidence_score: number;
  potential_value: number;
  created_at: string;
  last_scanned: string;
  outreach_status: string;
  threat_details?: any;
  scan_results?: any;
}

interface ScanParameters {
  keywords: string[];
  industries: string[];
  maxCandidates: number;
  mode: 'auto' | 'manual';
}

const WatchtowerDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [candidates, setCandidates] = useState<WatchtowerCandidate[]>([]);
  const [scanParams, setScanParams] = useState<ScanParameters>({
    keywords: [],
    industries: [],
    maxCandidates: 50,
    mode: 'manual'
  });
  const [selectedCandidate, setSelectedCandidate] = useState<WatchtowerCandidate | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('watchtower_candidates')
        .select('*')
        .order('threat_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Type-safe conversion of the database response
      const typedCandidates: WatchtowerCandidate[] = (data || []).map(item => ({
        ...item,
        scan_results: Array.isArray(item.scan_results) ? item.scan_results : [],
        threat_details: item.threat_details || {}
      }));
      
      setCandidates(typedCandidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const startDiscoveryScan = async () => {
    setIsScanning(true);
    toast.info('Starting Watchtower discovery scan...');

    try {
      const { data, error } = await supabase.functions.invoke('watchtower-scan', {
        body: {
          mode: scanParams.mode,
          keywords: scanParams.keywords.length > 0 ? scanParams.keywords : undefined,
          industries: scanParams.industries.length > 0 ? scanParams.industries : undefined,
          maxCandidates: scanParams.maxCandidates
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Discovery scan completed! Found ${data.entitiesDiscovered} entities, ${data.candidatesStored} candidates stored.`);
        await loadCandidates();
      } else {
        toast.error('Discovery scan failed');
      }
    } catch (error) {
      console.error('Discovery scan error:', error);
      toast.error('Discovery scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !scanParams.keywords.includes(keywordInput.trim())) {
      setScanParams(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setScanParams(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addIndustry = () => {
    if (industryInput.trim() && !scanParams.industries.includes(industryInput.trim())) {
      setScanParams(prev => ({
        ...prev,
        industries: [...prev.industries, industryInput.trim()]
      }));
      setIndustryInput('');
    }
  };

  const removeIndustry = (industry: string) => {
    setScanParams(prev => ({
      ...prev,
      industries: prev.industries.filter(i => i !== industry)
    }));
  };

  const getThreatColor = (score: number) => {
    if (score > 0.8) return 'bg-red-500';
    if (score > 0.6) return 'bg-orange-500';
    if (score > 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getThreatLevel = (score: number) => {
    if (score > 0.8) return 'Critical';
    if (score > 0.6) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner">Discovery Scanner</TabsTrigger>
          <TabsTrigger value="candidates">Prospects ({candidates.length})</TabsTrigger>
          <TabsTrigger value="outreach">Outreach Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Satellite className="h-5 w-5 text-corporate-accent" />
                Autonomous Discovery Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-corporate-lightGray">Target Keywords</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. CEO controversy, data breach"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                    <Button onClick={addKeyword} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scanParams.keywords.map(keyword => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="bg-corporate-darkSecondary text-corporate-lightGray cursor-pointer"
                        onClick={() => removeKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-corporate-lightGray">Target Industries</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Technology, Finance"
                      value={industryInput}
                      onChange={(e) => setIndustryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                    <Button onClick={addIndustry} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scanParams.industries.map(industry => (
                      <Badge
                        key={industry}
                        variant="secondary"
                        className="bg-corporate-darkSecondary text-corporate-lightGray cursor-pointer"
                        onClick={() => removeIndustry(industry)}
                      >
                        {industry} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-corporate-lightGray">Scan Mode</label>
                  <Select value={scanParams.mode} onValueChange={(value: 'auto' | 'manual') => setScanParams(prev => ({ ...prev, mode: value }))}>
                    <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Scan</SelectItem>
                      <SelectItem value="auto">Autonomous Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-corporate-lightGray">Max Candidates</label>
                  <Input
                    type="number"
                    value={scanParams.maxCandidates}
                    onChange={(e) => setScanParams(prev => ({ ...prev, maxCandidates: parseInt(e.target.value) || 50 }))}
                    className="bg-corporate-dark border-corporate-border text-white"
                  />
                </div>
              </div>

              <Button
                onClick={startDiscoveryScan}
                disabled={isScanning}
                className="w-full bg-corporate-accent text-black hover:bg-corporate-accentDark"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Scanning in Progress...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Discovery Scan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          {candidates.length === 0 ? (
            <Card className="corporate-card">
              <CardContent className="text-center py-8">
                <Satellite className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold corporate-heading mb-2">No Prospects Found</h3>
                <p className="corporate-subtext mb-4">Run a discovery scan to find potential clients with threat exposure</p>
                <Button onClick={startDiscoveryScan} className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                  Start First Scan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="corporate-card hover:border-corporate-accent transition-colors cursor-pointer" onClick={() => setSelectedCandidate(candidate)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold corporate-heading">{candidate.entity_name}</h3>
                          <Badge className={`${getThreatColor(candidate.threat_score)} text-white`}>
                            {getThreatLevel(candidate.threat_score)}
                          </Badge>
                          <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                            {candidate.discovery_source}
                          </Badge>
                        </div>
                        <p className="text-sm corporate-subtext mb-2">{candidate.threat_summary}</p>
                        <div className="flex items-center gap-4 text-xs corporate-subtext">
                          <span>Source: {candidate.discovery_source}</span>
                          <span>Value: ${candidate.potential_value?.toLocaleString()}</span>
                          <span>Confidence: {Math.round(candidate.confidence_score * 100)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-corporate-accent">
                          {Math.round(candidate.threat_score * 100)}
                        </div>
                        <div className="text-xs corporate-subtext">Threat Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outreach" className="space-y-4">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Mail className="h-5 w-5 text-corporate-accent" />
                Intelligent Outreach Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCandidate ? (
                <div className="space-y-4">
                  <div className="p-4 border border-corporate-border rounded-lg bg-corporate-darkSecondary">
                    <h3 className="font-semibold corporate-heading mb-2">{selectedCandidate.entity_name}</h3>
                    <p className="corporate-subtext mb-2">{selectedCandidate.threat_summary}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-corporate-accent text-black">
                        Value: ${selectedCandidate.potential_value?.toLocaleString()}
                      </Badge>
                      <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                        {selectedCandidate.discovery_source}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-lightGray">Personalized Outreach Message</label>
                    <Textarea
                      className="bg-corporate-dark border-corporate-border text-white"
                      rows={8}
                      placeholder="Draft your personalized outreach message here..."
                      defaultValue={`Subject: Critical Threat Intelligence for ${selectedCandidate.entity_name}

Dear ${selectedCandidate.entity_name} Leadership Team,

Our automated threat detection systems have identified significant reputation risks affecting your organization. Based on our analysis:

• Threat Level: ${getThreatLevel(selectedCandidate.threat_score)}
• Potential Business Impact: ${selectedCandidate.potential_value ? `$${selectedCandidate.potential_value.toLocaleString()}` : 'Significant'}
• Discovery Source: ${selectedCandidate.discovery_source}

${selectedCandidate.threat_summary}

We specialize in neutralizing these exact threat vectors before they impact your business. Would you be available for a brief 15-minute call to discuss our findings?

Best regards,
A.R.I.A™ Threat Intelligence Team`}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Outreach
                    </Button>
                    <Button variant="outline" className="border-corporate-border text-corporate-lightGray">
                      Schedule Follow-up
                    </Button>
                    <Button variant="outline" className="border-corporate-border text-corporate-lightGray">
                      Add to CRM
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold corporate-heading mb-2">Select a Prospect</h3>
                  <p className="corporate-subtext">Choose a prospect from the Candidates tab to create a personalized outreach campaign</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WatchtowerDashboard;
