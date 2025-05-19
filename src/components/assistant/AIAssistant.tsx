
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, X, Maximize2, Minimize2, PanelRightOpen, Bell, AlertTriangle, 
  Clock, FileText, Shield, MessageSquare, Volume 
} from "lucide-react";
import { toast } from "sonner";
import { callOpenAI } from "@/services/api/openaiClient";
import { hasOpenAIKey } from "@/services/api/openaiClient";
import { OpenAIMessage } from "@/services/api/openaiClient";
import { useClientChanges } from "@/hooks/useClientChanges";
import { ThreatClassificationResult } from "@/types/intelligence";
import { Badge } from "@/components/ui/badge";
import { classifyThreat } from "@/services/intelligence/threatClassifier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface ClientUpdate {
  id: string;
  clientName: string;
  changeType: string;
  description: string;
  timestamp: Date;
  severity?: number;
  platform?: string;
  read: boolean; // This is now required to match our hook
}

interface AIAssistantProps {
  clientUpdates?: ClientUpdate[];
  className?: string;
}

interface TimelineEntry {
  date: string;
  client: string;
  sentiment: number;
  change: number;
}

interface LogbookEntry {
  id: string;
  clientName: string;
  date: string;
  threatType: string;
  impact: 'high' | 'medium' | 'low';
  status: 'resolved' | 'ongoing' | 'monitoring';
  summary: string;
}

const AIAssistant = ({ clientUpdates = [], className }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(hasOpenAIKey());
  const [activeTab, setActiveTab] = useState('assistant');
  const [notificationCount, setNotificationCount] = useState(0);
  const [alerts, setAlerts] = useState<ClientUpdate[]>([]);
  const clientChangesList = useClientChanges();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voiceCommandActive, setVoiceCommandActive] = useState(false);
  const [escalationCriteria, setEscalationCriteria] = useState({
    severity: 8,
    clients: ['LuxeSkin', 'TechGiant Inc'],
    threatTypes: ['legal', 'virality']
  });
  
  // Timeline data
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([
    { date: '5/12', client: 'LuxeSkin', sentiment: 72, change: -3 },
    { date: '5/13', client: 'LuxeSkin', sentiment: 68, change: -4 },
    { date: '5/14', client: 'LuxeSkin', sentiment: 65, change: -3 },
    { date: '5/15', client: 'LuxeSkin', sentiment: 69, change: 4 },
    { date: '5/16', client: 'LuxeSkin', sentiment: 73, change: 4 },
    { date: '5/17', client: 'LuxeSkin', sentiment: 65, change: -8 },
    { date: '5/18', client: 'LuxeSkin', sentiment: 60, change: -5 },
    { date: '5/19', client: 'LuxeSkin', sentiment: 58, change: -2 },
  ]);

  // Threat logbook entries
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([
    {
      id: 'log-1',
      clientName: 'LuxeSkin',
      date: '2025-05-17',
      threatType: 'Product Criticism',
      impact: 'high',
      status: 'ongoing',
      summary: 'Reddit post claiming chemical burns from eye cream product gained significant traction. PR team notified and customer outreach initiated.'
    },
    {
      id: 'log-2',
      clientName: 'TechGiant Inc',
      date: '2025-05-15',
      threatType: 'Data Privacy',
      impact: 'medium',
      status: 'resolved',
      summary: 'News article alleging improper data handling. Legal team provided statement clarifying compliance with regulations.'
    },
    {
      id: 'log-3',
      clientName: 'Global Foods',
      date: '2025-05-10',
      threatType: 'Product Quality',
      impact: 'low',
      status: 'monitoring',
      summary: 'Isolated complaints about packaging quality on Twitter. Quality control team investigating.'
    }
  ]);
  
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your ARIA assistant. I can help you understand client profile changes, monitor reputation threats, and provide insights on brand intelligence. How can I assist you today?'
    }
  ]);

  // Process client changes from the hook
  useEffect(() => {
    if (clientChangesList.length > 0) {
      // Process new client changes
      const newChanges = clientChangesList.filter(
        change => !alerts.some(alert => alert.id === change.id)
      );
      
      if (newChanges.length > 0) {
        // Add new changes to alerts
        setAlerts(prev => [...newChanges, ...prev]);
        setNotificationCount(prev => prev + newChanges.length);
        
        // Process the most recent update for the assistant
        const latestUpdate = newChanges[0];
        
        // Check for escalation criteria
        const needsEscalation = checkEscalationCriteria(latestUpdate);
        
        // Analyze the change for potential threat
        analyzeClientChange(latestUpdate);
        
        // Show a toast to notify user
        toast.info(`Client update detected: ${latestUpdate.clientName}`, {
          description: latestUpdate.description,
          action: {
            label: "View",
            onClick: () => {
              setIsOpen(true);
              setActiveTab('alerts');
            }
          }
        });
        
        // Show escalation notification if needed
        if (needsEscalation) {
          toast.error(`URGENT: High-risk alert for ${latestUpdate.clientName}`, {
            description: "This alert matches your escalation criteria and requires immediate attention.",
            duration: 8000,
          });
          
          // Add to logbook if high severity
          if ((latestUpdate.severity || 0) >= 8) {
            addToLogbook(latestUpdate);
          }
        }
      }
    }
  }, [clientChangesList]);

  // Check if an alert meets escalation criteria
  const checkEscalationCriteria = (alert: ClientUpdate): boolean => {
    if ((alert.severity || 0) >= escalationCriteria.severity) {
      return true;
    }
    
    if (escalationCriteria.clients.includes(alert.clientName)) {
      return true;
    }
    
    // Check if description contains any threat types
    for (const threatType of escalationCriteria.threatTypes) {
      if (alert.description.toLowerCase().includes(threatType.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  };
  
  // Add significant events to the threat logbook
  const addToLogbook = (alert: ClientUpdate) => {
    const newEntry: LogbookEntry = {
      id: `log-${Date.now()}`,
      clientName: alert.clientName,
      date: new Date().toISOString().split('T')[0],
      threatType: alert.changeType || 'General Threat',
      impact: (alert.severity || 0) >= 8 ? 'high' : (alert.severity || 0) >= 5 ? 'medium' : 'low',
      status: 'ongoing',
      summary: alert.description
    };
    
    setLogbookEntries(prev => [newEntry, ...prev]);
  };

  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const analyzeClientChange = async (clientChange: ClientUpdate) => {
    try {
      // Only analyze if we have content to analyze
      if (!clientChange.description) return;
      
      // Classify the threat using our existing threat classifier
      const threatData = await classifyThreat({
        content: clientChange.description,
        platform: clientChange.platform || "internal",
        brand: clientChange.clientName
      });
      
      // Update timeline data with new sentiment based on severity
      const newSentimentValue = 100 - ((threatData?.severity || 0) * 10);
      const prevSentiment = timelineData.length > 0 
        ? timelineData[0].sentiment 
        : newSentimentValue;
      
      const newTimelineEntry: TimelineEntry = {
        date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }).replace('/', '/'),
        client: clientChange.clientName,
        sentiment: newSentimentValue,
        change: newSentimentValue - prevSentiment
      };
      
      setTimelineData(prev => [newTimelineEntry, ...prev].slice(0, 8));
      
      if (threatData && threatData.severity > 5) {
        // For high severity threats, add an assistant message
        const threatMessage = `
          ⚠️ **Potential Reputation Risk Detected**
          
          Client: ${clientChange.clientName}
          Change Type: ${clientChange.changeType}
          Severity: ${threatData.severity}/10
          Category: ${threatData.category}
          
          ${threatData.ai_reasoning}
          
          Recommended action: ${threatData.recommendation}
          
          Would you like me to help formulate a response strategy?
        `;
        
        setConversation(prev => [
          ...prev,
          {
            role: 'assistant',
            content: threatMessage
          }
        ]);
        
        // AI suggestion
        if (threatData.severity >= 7) {
          setTimeout(() => {
            setConversation(prev => [
              ...prev,
              {
                role: 'assistant',
                content: `I suggest posting a response to this ${clientChange.clientName} issue. Would you like me to draft a response template?`
              }
            ]);
          }, 3000);
        }
      } else {
        // For regular updates, add simpler message
        const updateMessage = `
          I've detected a change in client "${clientChange.clientName}".
          Type: ${clientChange.changeType}
          ${clientChange.description}
          
          Would you like me to analyze this change for potential reputation impacts?
        `;
        
        setConversation(prev => [
          ...prev,
          {
            role: 'assistant',
            content: updateMessage
          }
        ]);
      }
    } catch (error) {
      console.error("Error analyzing client change:", error);
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    } else {
      // Reset notification count when opening
      setNotificationCount(0);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'alerts') {
      // Reset notification count when viewing alerts
      setNotificationCount(0);
    }
  };
  
  const clearAlerts = () => {
    setAlerts([]);
    setNotificationCount(0);
  };
  
  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, read: true } 
          : alert
      )
    );
  };

  const toggleVoiceCommand = () => {
    setVoiceCommandActive(!voiceCommandActive);
    
    if (!voiceCommandActive) {
      toast.info("Voice command activated", {
        description: "You can now speak commands to the assistant"
      });
      
      // Simulating voice command recognition (would be implemented with Web Speech API)
      setTimeout(() => {
        setQuery("Show me all high severity threats today");
        
        // Simulate processing the voice command
        setTimeout(() => {
          handleSubmit(new Event('submit') as React.FormEvent);
          setVoiceCommandActive(false);
          
          toast.success("Voice command processed", {
            description: "Showing high severity threats"
          });
        }, 1500);
      }, 2000);
    } else {
      toast.info("Voice command deactivated");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    if (!hasApiKey) {
      toast.error("Please set your OpenAI API key in settings", {
        description: "The AI assistant requires an API key to function"
      });
      return;
    }
    
    // Add user message to conversation
    const userMessage = query.trim();
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery("");
    setIsLoading(true);

    try {
      // Create context for the AI with previous messages
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are ARIA's AI Assistant, an expert in reputation management and brand intelligence.
          Your goal is to assist the user by providing helpful insights about client profile changes,
          reputation threats, and suggesting appropriate responses.
          Be concise, professional, and focus on actionable advice related to reputation management.
          If asked about something outside your expertise, kindly redirect to reputation management topics.`
        },
        ...conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Call OpenAI
      const aiResponse = await callOpenAI({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7
      });

      // Extract response
      const assistantResponse = aiResponse.choices[0].message.content;
      
      // Update conversation with AI response
      setConversation(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response", {
        description: "There was an error communicating with the AI assistant"
      });
      // Add error message to conversation
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please check your API key or try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return "bg-red-500";
    if (severity >= 5) return "bg-orange-500";
    if (severity >= 3) return "bg-yellow-500";
    return "bg-blue-500";
  };

  // Render the floating assistant button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={toggleAssistant}
          className="h-12 w-12 rounded-full p-0 shadow-lg relative"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-6 w-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {notificationCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  // Render the minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card rounded-md shadow-lg flex items-center p-2 border">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">ARIA Assistant</span>
          {notificationCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {notificationCount}
            </Badge>
          )}
          <div className="ml-4 flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleMinimize}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleAssistant}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render the full assistant
  return (
    <Card className={`fixed bottom-4 right-4 w-80 sm:w-96 z-50 shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg">ARIA Assistant</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className={`h-7 w-7 ${voiceCommandActive ? 'bg-primary/20' : ''}`} 
              onClick={toggleVoiceCommand}
              title="Voice Command"
            >
              {voiceCommandActive ? <Volume className="h-4 w-4 text-primary" /> : <Volume className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleMinimize}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleAssistant}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="assistant">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="relative">
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Alerts</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {notificationCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="logbook">
              <FileText className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logbook</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <TabsContent value="assistant" className="m-0">
          <div className="px-4 pt-2">
            <CardDescription>
              Ask about client changes and reputation management
            </CardDescription>
          </div>
          <div className="max-h-72 overflow-y-auto space-y-3 p-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-foreground/70 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-foreground/70 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-foreground/70 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <CardFooter className="pt-2 pb-4 px-4">
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <Textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the ARIA assistant..."
                className="min-h-[40px] max-h-[120px] resize-none"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !query.trim()}
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="alerts" className="m-0">
          <div className="px-4 py-2 flex justify-between items-center">
            <CardDescription>Recent client updates and alerts</CardDescription>
            {alerts.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7" onClick={clearAlerts}>
                Clear all
              </Button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No alerts to display</p>
              </div>
            ) : (
              <div className="divide-y">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 hover:bg-muted/50 cursor-pointer ${alert.read ? 'opacity-70' : ''}`}
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge className={alert.severity ? getSeverityColor(alert.severity) : "bg-blue-500"}>
                        {alert.changeType}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <p className="font-medium text-sm">{alert.clientName}</p>
                    <p className="text-sm truncate text-muted-foreground">{alert.description}</p>
                    <div className="flex justify-end mt-1 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add AI suggestion
                          setConversation(prev => [
                            ...prev,
                            { 
                              role: 'assistant', 
                              content: `Would you like to post a response to this ${alert.clientName} issue?` 
                            }
                          ]);
                          // Switch to assistant tab
                          setActiveTab('assistant');
                        }}
                      >
                        Suggest Response
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add alert content to conversation
                          setConversation(prev => [
                            ...prev,
                            { 
                              role: 'user', 
                              content: `Tell me about the change to ${alert.clientName}: ${alert.description}` 
                            }
                          ]);
                          // Switch to assistant tab
                          setActiveTab('assistant');
                        }}
                      >
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="m-0">
          <div className="p-4">
            <CardDescription className="mb-3">Sentiment trends over time</CardDescription>
            <div className="space-y-2">
              {timelineData.map((entry, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{entry.date} - {entry.client}</span>
                    <span className={entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : ''}>
                      {entry.change > 0 ? '+' : ''}{entry.change}
                    </span>
                  </div>
                  <Progress value={entry.sentiment} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sentiment: {entry.sentiment}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="logbook" className="m-0">
          <div className="px-4 py-2">
            <CardDescription>AI-curated history of major incidents</CardDescription>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {logbookEntries.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No major incidents recorded</p>
              </div>
            ) : (
              <div className="divide-y">
                {logbookEntries.map((entry) => (
                  <div key={entry.id} className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <Badge className={
                        entry.impact === 'high' ? 'bg-red-500' : 
                        entry.impact === 'medium' ? 'bg-orange-500' : 
                        'bg-blue-500'
                      }>
                        {entry.threatType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">{entry.clientName}</p>
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{entry.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
