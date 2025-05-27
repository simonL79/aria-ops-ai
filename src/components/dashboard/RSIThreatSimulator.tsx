
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, Zap } from "lucide-react";
import { triggerRSISimulation } from '@/services/rsi/rsiService';
import { toast } from "sonner";

interface ThreatSimulationForm {
  threat_topic: string;
  predicted_keywords: string[];
  threat_level: number;
  likelihood_score: number;
  threat_source: string;
  geographical_scope: string[];
}

const RSIThreatSimulator = () => {
  const [form, setForm] = useState<ThreatSimulationForm>({
    threat_topic: '',
    predicted_keywords: [],
    threat_level: 1,
    likelihood_score: 0.5,
    threat_source: '',
    geographical_scope: []
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [scopeInput, setScopeInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addKeyword = () => {
    if (keywordInput.trim() && !form.predicted_keywords.includes(keywordInput.trim())) {
      setForm(prev => ({
        ...prev,
        predicted_keywords: [...prev.predicted_keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setForm(prev => ({
      ...prev,
      predicted_keywords: prev.predicted_keywords.filter(k => k !== keyword)
    }));
  };

  const addScope = () => {
    if (scopeInput.trim() && !form.geographical_scope.includes(scopeInput.trim())) {
      setForm(prev => ({
        ...prev,
        geographical_scope: [...prev.geographical_scope, scopeInput.trim()]
      }));
      setScopeInput('');
    }
  };

  const removeScope = (scope: string) => {
    setForm(prev => ({
      ...prev,
      geographical_scope: prev.geographical_scope.filter(s => s !== scope)
    }));
  };

  const calculateUrgency = () => {
    return (form.threat_level * 0.6) + (form.likelihood_score * 4 * 0.4);
  };

  const submitThreatSimulation = async () => {
    if (!form.threat_topic.trim()) {
      toast.error('Please enter a threat topic');
      return;
    }

    setLoading(true);
    try {
      const simulation = await triggerRSISimulation(form.threat_topic);
      
      if (simulation) {
        toast.success('Threat simulation created successfully');
        
        // Reset form
        setForm({
          threat_topic: '',
          predicted_keywords: [],
          threat_level: 1,
          likelihood_score: 0.5,
          threat_source: '',
          geographical_scope: []
        });

        // Show activation message if threshold met
        if (form.threat_level >= 4 && form.likelihood_score >= 0.75) {
          toast.success('🚨 High-priority threat detected! RSI auto-activation triggered.', {
            duration: 5000
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const urgencyScore = calculateUrgency();
  const urgencyLevel = urgencyScore >= 4 ? 'Critical' : urgencyScore >= 3 ? 'High' : urgencyScore >= 2 ? 'Medium' : 'Low';
  const urgencyColor = urgencyScore >= 4 ? 'text-red-600' : urgencyScore >= 3 ? 'text-orange-600' : urgencyScore >= 2 ? 'text-yellow-600' : 'text-green-600';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          RSI Threat Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="threat_topic">Threat Topic *</Label>
              <Input
                id="threat_topic"
                value={form.threat_topic}
                onChange={(e) => setForm(prev => ({ ...prev, threat_topic: e.target.value }))}
                placeholder="e.g., Negative product reviews spreading"
              />
            </div>

            <div>
              <Label htmlFor="threat_source">Threat Source</Label>
              <Select value={form.threat_source} onValueChange={(value) => setForm(prev => ({ ...prev, threat_source: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select threat source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="news_media">News Media</SelectItem>
                  <SelectItem value="forums">Forums</SelectItem>
                  <SelectItem value="review_sites">Review Sites</SelectItem>
                  <SelectItem value="competitor">Competitor</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="threat_level">Threat Level (1-5)</Label>
              <Select value={form.threat_level.toString()} onValueChange={(value) => setForm(prev => ({ ...prev, threat_level: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Low</SelectItem>
                  <SelectItem value="2">2 - Medium</SelectItem>
                  <SelectItem value="3">3 - High</SelectItem>
                  <SelectItem value="4">4 - Critical</SelectItem>
                  <SelectItem value="5">5 - Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="likelihood_score">Likelihood Score</Label>
              <Input
                id="likelihood_score"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={form.likelihood_score}
                onChange={(e) => setForm(prev => ({ ...prev, likelihood_score: parseFloat(e.target.value) || 0 }))}
              />
              <p className="text-xs text-gray-500 mt-1">Value between 0.00 and 1.00 (e.g., 0.75 = 75% likely)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Predicted Keywords</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add keyword"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button onClick={addKeyword} variant="outline" size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.predicted_keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Geographical Scope</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={scopeInput}
                  onChange={(e) => setScopeInput(e.target.value)}
                  placeholder="e.g., US, UK, EU"
                  onKeyPress={(e) => e.key === 'Enter' && addScope()}
                />
                <Button onClick={addScope} variant="outline" size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.geographical_scope.map((scope) => (
                  <Badge key={scope} variant="outline" className="cursor-pointer" onClick={() => removeScope(scope)}>
                    {scope} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Urgency Calculator */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Threat Urgency Analysis
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Urgency Score:</span>
                  <span className={`text-sm font-medium ${urgencyColor}`}>
                    {urgencyScore.toFixed(2)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Priority Level:</span>
                  <Badge className={urgencyScore >= 4 ? 'bg-red-500' : urgencyScore >= 3 ? 'bg-orange-500' : urgencyScore >= 2 ? 'bg-yellow-500' : 'bg-green-500'}>
                    {urgencyLevel}
                  </Badge>
                </div>
                {form.threat_level >= 4 && form.likelihood_score >= 0.75 && (
                  <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                    <Zap className="h-4 w-4" />
                    Auto-activation threshold met!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={submitThreatSimulation} disabled={loading} className="w-full">
          {loading ? 'Creating Simulation...' : 'Create Threat Simulation'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RSIThreatSimulator;
