
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Search,
  Lightbulb,
  History,
  BarChart3
} from 'lucide-react';
import { IntelligenceMemoryManager } from '@/services/ariaCore/intelligenceMemoryManager';
import { toast } from 'sonner';

interface IntelligenceLearningHubProps {
  entityName: string;
}

const IntelligenceLearningHub: React.FC<IntelligenceLearningHubProps> = ({ entityName }) => {
  const [memories, setMemories] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('memory');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    action: '',
    effectiveness: 5,
    outcome: '',
    notes: '',
    threatId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIntelligenceData();
  }, [entityName]);

  const loadIntelligenceData = async () => {
    setLoading(true);
    try {
      // Load intelligence memories
      const memoryData = await IntelligenceMemoryManager.recallIntelligenceMemory(entityName);
      setMemories(memoryData);

      // Generate recommendations
      const recs = await IntelligenceMemoryManager.generateIntelligenceRecommendations(entityName);
      setRecommendations(recs);

    } catch (error) {
      console.error('Error loading intelligence data:', error);
      toast.error('Failed to load intelligence data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMemories = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await IntelligenceMemoryManager.recallIntelligenceMemory(
        entityName, 
        searchQuery
      );
      setMemories(searchResults);
      toast.success(`Found ${searchResults.length} related memories`);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.action || !feedbackForm.outcome) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const success = await IntelligenceMemoryManager.learnFromFeedback(entityName, {
        action: feedbackForm.action,
        effectiveness: feedbackForm.effectiveness / 10,
        outcome: feedbackForm.outcome,
        notes: feedbackForm.notes,
        threatId: feedbackForm.threatId
      });

      if (success) {
        setFeedbackForm({
          action: '',
          effectiveness: 5,
          outcome: '',
          notes: '',
          threatId: ''
        });
        await loadIntelligenceData(); // Reload to show new learning
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const getMemoryTypeColor = (type: string) => {
    const colors = {
      threat: 'bg-red-100 text-red-800',
      response: 'bg-green-100 text-green-800',
      pattern: 'bg-blue-100 text-blue-800',
      feedback: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Intelligence Learning Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                Persistent intelligence memory with cross-session learning and pattern recognition
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <History className="h-4 w-4 text-corporate-accent" />
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                    Memory
                  </Badge>
                </div>
                <div className="text-lg font-bold text-white">{memories.length}</div>
                <div className="text-corporate-lightGray text-xs">Stored Memories</div>
              </div>

              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Lightbulb className="h-4 w-4 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    AI
                  </Badge>
                </div>
                <div className="text-lg font-bold text-white">{recommendations.length}</div>
                <div className="text-corporate-lightGray text-xs">Recommendations</div>
              </div>

              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Target className="h-4 w-4 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                    Learning
                  </Badge>
                </div>
                <div className="text-lg font-bold text-white">
                  {memories.filter(m => m.memoryType === 'feedback').length}
                </div>
                <div className="text-corporate-lightGray text-xs">Learning Events</div>
              </div>

              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <BarChart3 className="h-4 w-4 text-corporate-accent" />
                  <Badge className="bg-corporate-accent text-black text-xs">
                    Avg
                  </Badge>
                </div>
                <div className="text-lg font-bold text-white">
                  {memories.length > 0 
                    ? Math.round(memories.reduce((sum, m) => sum + m.confidence, 0) / memories.length * 100)
                    : 0}%
                </div>
                <div className="text-corporate-lightGray text-xs">Avg Confidence</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full bg-corporate-darkSecondary">
          <TabsTrigger 
            value="memory"
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Memory Store
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger 
            value="learning"
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Learning
          </TabsTrigger>
          <TabsTrigger 
            value="patterns"
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memory" className="space-y-4">
          {/* Memory Search */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search intelligence memories..."
                  className="bg-corporate-darkSecondary border-corporate-border text-white"
                />
                <Button 
                  onClick={handleSearchMemories}
                  disabled={loading}
                  className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Memory List */}
          <div className="space-y-3">
            {memories.map((memory) => (
              <Card key={memory.id} className="bg-corporate-dark border-corporate-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getMemoryTypeColor(memory.memoryType)}>
                        {memory.memoryType}
                      </Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">
                        {memory.sourceModule}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getConfidenceColor(memory.confidence)}`}>
                        {Math.round(memory.confidence * 100)}% confidence
                      </div>
                      <div className="text-xs text-corporate-lightGray">
                        Correlation: {Math.round(memory.correlationScore * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">{memory.summary}</h4>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-corporate-lightGray">
                      Context: {memory.contextReference}
                    </span>
                    <span className="text-corporate-lightGray">
                      {new Date(memory.timestamp).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {memories.length === 0 && !loading && (
              <Card className="bg-corporate-dark border-corporate-border">
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
                  <p className="text-corporate-lightGray">No intelligence memories found</p>
                  <p className="text-sm text-corporate-lightGray mt-2">
                    Start analyzing threats to build intelligence memory
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="bg-corporate-dark border-corporate-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-corporate-accent" />
                      <Badge className="bg-corporate-accent text-black">
                        {rec.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                      {Math.round(rec.confidence * 100)}% confidence
                    </div>
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">{rec.title}</h4>
                  <p className="text-corporate-lightGray text-sm mb-3">{rec.description}</p>
                  
                  <div className="space-y-2">
                    <h5 className="text-white text-sm font-medium">Recommended Actions:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {rec.actionItems.map((action: string, index: number) => (
                        <li key={index} className="text-corporate-lightGray text-sm">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {recommendations.length === 0 && !loading && (
              <Card className="bg-corporate-dark border-corporate-border">
                <CardContent className="p-8 text-center">
                  <Lightbulb className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
                  <p className="text-corporate-lightGray">No recommendations available</p>
                  <p className="text-sm text-corporate-lightGray mt-2">
                    Build more intelligence memory to generate AI recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          {/* Feedback Form */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-corporate-accent" />
                Submit Learning Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Action Taken
                  </label>
                  <Input
                    value={feedbackForm.action}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, action: e.target.value }))}
                    placeholder="e.g., Applied counter-narrative strategy"
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Effectiveness (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={feedbackForm.effectiveness}
                    onChange={(e) => setFeedbackForm(prev => ({ 
                      ...prev, 
                      effectiveness: parseInt(e.target.value) 
                    }))}
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Outcome
                </label>
                <Input
                  value={feedbackForm.outcome}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, outcome: e.target.value }))}
                  placeholder="e.g., Threat neutralized, reputation stabilized"
                  className="bg-corporate-darkSecondary border-corporate-border text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Additional Notes
                </label>
                <Textarea
                  value={feedbackForm.notes}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional context or lessons learned..."
                  className="bg-corporate-darkSecondary border-corporate-border text-white"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleSubmitFeedback}
                disabled={loading || !feedbackForm.action || !feedbackForm.outcome}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
              <p className="text-corporate-lightGray">Pattern Analysis</p>
              <p className="text-sm text-corporate-lightGray mt-2">
                Advanced pattern recognition coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceLearningHub;
