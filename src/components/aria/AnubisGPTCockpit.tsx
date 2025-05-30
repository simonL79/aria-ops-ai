import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Brain, Zap, MessageSquare, Target, Lock, Mic, Send, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import VoiceCommandButton from './VoiceCommandButton';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { getVoiceLogs, VoiceLogEntry } from '@/services/aria/voiceLogService';
import { anubisService } from '@/services/aria/anubisService';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  created_at: string;
}

interface GraveyardSimulation {
  id: string;
  leak_title: string;
  synthetic_link: string;
  expected_trigger_module: string;
  suppression_status: string;
  injected_at: string;
  completed_at?: string;
}

const AnubisGPTCockpit = () => {
  const { user, isAdmin } = useAuth();
  const { speak, isSpeaking } = useVoiceCommand();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [graveyardSims, setGraveyardSims] = useState<GraveyardSimulation[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLogEntry[]>([]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [newSim, setNewSim] = useState({
    leak_title: '',
    synthetic_link: '',
    expected_trigger_module: ''
  });
  const [loading, setLoading] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsError, setDiagnosticsError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadChatHistory();
      loadGraveyardSimulations();
      loadVoiceLogs();
    }
  }, [isAdmin]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('anubis_chat_memory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setChatHistory(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadGraveyardSimulations = async () => {
    try {
      const { data, error } = await supabase
        .from('graveyard_simulations')
        .select('*')
        .order('injected_at', { ascending: false });

      if (error) throw error;
      setGraveyardSims(data || []);
    } catch (error) {
      console.error('Error loading graveyard simulations:', error);
    }
  };

  const loadVoiceLogs = async () => {
    try {
      const logs = await getVoiceLogs(20);
      setVoiceLogs(logs);
    } catch (error) {
      console.error('Error loading voice logs:', error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || currentMessage;
    if (!messageToSend.trim() || loading) return;

    setLoading(true);
    try {
      // Simulate GPT response (in production, this would call OpenAI API)
      const response = `A.R.I.A™ Analysis: ${messageToSend}. System status: Operational. Threat assessment: Low-Medium. Recommended actions: Continue monitoring.`;

      const { error } = await supabase
        .from('anubis_chat_memory')
        .insert({
          user_id: user?.id,
          message: messageToSend,
          response: response
        });

      if (error) throw error;

      setCurrentMessage('');
      loadChatHistory();
      toast.success('Message processed by A.R.I.A™');

      // Auto-speak response if enabled
      if (autoSpeak && response) {
        speak(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to process message');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      setCurrentMessage(transcript);
      // Auto-send voice commands
      setTimeout(() => sendMessage(transcript), 500);
    }
  };

  const runEnhancedDiagnostics = async () => {
    setDiagnosticsRunning(true);
    setDiagnosticsError(null);
    
    try {
      console.log('🔍 Starting enhanced A.R.I.A™ diagnostics...');
      
      // Try the database function first
      const { data, error } = await supabase.rpc('admin_trigger_anubis');
      
      if (error) {
        console.error('Database function error:', error);
        
        // If database function fails, fall back to service-based diagnostics
        console.log('⚠️ Database function failed, falling back to service diagnostics...');
        
        const fallbackResult = await anubisService.runDiagnostics();
        
        if (fallbackResult) {
          toast.success('A.R.I.A™ diagnostics completed (fallback mode)');
          setDiagnosticsError(`Database function error: ${error.message}. Used fallback diagnostics.`);
        } else {
          throw new Error(`Database function failed: ${error.message}. Fallback diagnostics also failed.`);
        }
        
        return;
      }

      toast.success('Enhanced A.R.I.A™ diagnostics completed successfully');
      console.log('✅ Diagnostics result:', data);
      
    } catch (error) {
      console.error('Complete diagnostics failure:', error);
      setDiagnosticsError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      if (error instanceof Error && error.message.includes('DELETE requires a WHERE clause')) {
        toast.error('Database function needs repair - contact system administrator');
      } else if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: Admin privileges required');
      } else {
        toast.error('Diagnostics system failure - check system logs');
      }
    } finally {
      setDiagnosticsRunning(false);
    }
  };

  const createGraveyardSimulation = async () => {
    if (!newSim.leak_title.trim()) {
      toast.error('Leak title is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('graveyard_simulations')
        .insert({
          leak_title: newSim.leak_title,
          synthetic_link: newSim.synthetic_link,
          expected_trigger_module: newSim.expected_trigger_module
        });

      if (error) throw error;

      setNewSim({ leak_title: '', synthetic_link: '', expected_trigger_module: '' });
      loadGraveyardSimulations();
      toast.success('Graveyard simulation created');
    } catch (error) {
      console.error('Error creating simulation:', error);
      toast.error('Failed to create simulation');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Access Denied: Anubis GPT Cockpit requires admin privileges
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Anubis GPT Cockpit
          </h1>
          <p className="text-muted-foreground">
            Elite AI-powered command center with voice control
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin Mode
          </Badge>
          <Button 
            onClick={runEnhancedDiagnostics} 
            disabled={diagnosticsRunning}
            className="flex items-center gap-2"
            variant={diagnosticsError ? "destructive" : "default"}
          >
            <Zap className={`h-4 w-4 ${diagnosticsRunning ? 'animate-spin' : ''}`} />
            {diagnosticsRunning ? 'Running...' : 'Run Diagnostics'}
          </Button>
        </div>
      </div>

      {/* Diagnostics Error Alert */}
      {diagnosticsError && (
        <Alert className="border-amber-500 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            <strong>Diagnostics Issue:</strong> {diagnosticsError}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">AI Chat Interface</TabsTrigger>
          <TabsTrigger value="graveyard">Graveyard Operations</TabsTrigger>
          <TabsTrigger value="voice-logs">Voice Commands</TabsTrigger>
          <TabsTrigger value="history">Command History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  A.R.I.A™ Command Interface
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className="flex items-center gap-1"
                >
                  {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {autoSpeak ? 'Auto-speak On' : 'Auto-speak Off'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {chatHistory.length > 0 ? (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline">User</Badge>
                        <p className="text-sm">{chat.message}</p>
                      </div>
                      <div className="flex items-start gap-2 ml-4">
                        <Badge className="bg-purple-600">A.R.I.A™</Badge>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{chat.response}</p>
                          {autoSpeak && !isSpeaking && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speak(chat.response)}
                              className="mt-1 h-6 px-2 text-xs"
                            >
                              <Volume2 className="h-3 w-3 mr-1" />
                              Speak
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No chat history yet. Start a conversation with A.R.I.A™</p>
                    <p className="text-xs mt-2">Use voice commands or type your message</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Enter command or query for A.R.I.A™..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={loading}
                />
                <Button onClick={() => sendMessage()} disabled={loading || !currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
                <VoiceCommandButton 
                  onTranscript={handleVoiceTranscript}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Voice Command Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {voiceLogs.length > 0 ? (
                  voiceLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={log.processed ? 'default' : 'secondary'}>
                          {log.source === 'mic' ? '🎤 Voice Input' : '🔊 TTS Output'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <strong>Transcript:</strong> {log.transcript}
                      </div>
                      {log.response && (
                        <div className="text-sm mt-2 text-muted-foreground">
                          <strong>Response:</strong> {log.response}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No voice commands logged yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graveyard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Graveyard™ Simulation Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create New Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newSim.leak_title}
                  onChange={(e) => setNewSim({...newSim, leak_title: e.target.value})}
                  placeholder="Leak title..."
                />
                <Input
                  value={newSim.synthetic_link}
                  onChange={(e) => setNewSim({...newSim, synthetic_link: e.target.value})}
                  placeholder="Synthetic link..."
                />
                <div className="flex gap-2">
                  <Input
                    value={newSim.expected_trigger_module}
                    onChange={(e) => setNewSim({...newSim, expected_trigger_module: e.target.value})}
                    placeholder="Target module..."
                  />
                  <Button onClick={createGraveyardSimulation}>
                    Create
                  </Button>
                </div>
              </div>

              {/* Active Simulations */}
              <div className="space-y-2">
                <h3 className="font-semibold">Active Simulations</h3>
                {graveyardSims.length > 0 ? (
                  graveyardSims.map((sim) => (
                    <div key={sim.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{sim.leak_title}</span>
                        <Badge variant={
                          sim.suppression_status === 'completed' ? 'default' :
                          sim.suppression_status === 'active' ? 'secondary' :
                          'outline'
                        }>
                          {sim.suppression_status}
                        </Badge>
                      </div>
                      {sim.expected_trigger_module && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Target: {sim.expected_trigger_module}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Injected: {new Date(sim.injected_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No simulations created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Command History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="border-l-4 border-purple-600 pl-4 py-2">
                    <div className="text-sm font-medium">{chat.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(chat.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisGPTCockpit;
