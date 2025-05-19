import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { callOpenAI } from '@/services/api/openaiClient';
import { Protected } from '@/hooks/useRbac';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface AIAssistantProps {
  initialPrompt?: string;
  initialContext?: string;
  showAvatar?: boolean;
  showTitle?: boolean;
  height?: string;
  className?: string;
}

const AIAssistant = ({
  initialPrompt = '',
  initialContext = '',
  showAvatar = true,
  showTitle = true,
  height = '500px',
  className = ''
}: AIAssistantProps) => {
  const [input, setInput] = useState<string>(initialPrompt);
  const [context, setContext] = useState<string>(initialContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('chat');
  
  // Initialize with system message if context is provided
  useEffect(() => {
    if (initialContext) {
      setMessages([
        {
          role: 'system',
          content: initialContext,
          timestamp: new Date()
        }
      ]);
    }
  }, [initialContext]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare messages for API
      const apiMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add system message if context exists
      if (context) {
        apiMessages.unshift({
          role: 'system',
          content: context
        });
      }
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: userMessage.content
      });
      
      // Call OpenAI API
      const response = await callOpenAI({
        model: 'gpt-4o',
        messages: apiMessages,
        temperature: 0.7
      });
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error('Failed to get response', {
        description: 'Please try again or check your API key settings.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const clearConversation = () => {
    setMessages(context ? [{
      role: 'system',
      content: context,
      timestamp: new Date()
    }] : []);
    toast.info('Conversation cleared');
  };
  
  const formatTimestamp = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className={`flex flex-col ${className}`} style={{ height }}>
      <CardHeader className="p-4 pb-0">
        {showTitle && (
          <CardTitle className="text-lg font-medium flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>AI Assistant</span>
            </div>
            <Protected roles={['admin', 'manager']}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </Tabs>
            </Protected>
          </CardTitle>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 p-4 pt-2 flex flex-col overflow-hidden">
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pt-2">
              {messages.filter(msg => msg.role !== 'system').map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {showAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.role === 'user' ? <User size={16} /> : <Bot size={16} />}</AvatarFallback>
                        {message.role === 'assistant' && <AvatarImage src="/ai-avatar.png" />}
                      </Avatar>
                    )}
                    <div>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    {showAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={16} /></AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className="rounded-lg p-3 bg-muted">
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="mt-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearConversation}
                className="text-xs h-7 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
              <Badge variant="outline" className="text-xs">
                AI-powered assistant
              </Badge>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-0 data-[state=inactive]:hidden">
          <div>
            <h3 className="text-sm font-medium mb-2">System Context</h3>
            <Textarea
              placeholder="Set context for the AI assistant..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This context helps guide the AI's responses but isn't shown in the chat.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Model Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs">Temperature</label>
                <Input type="number" min="0" max="2" step="0.1" defaultValue="0.7" />
              </div>
              <div>
                <label className="text-xs">Max Tokens</label>
                <Input type="number" min="100" max="4000" step="100" defaultValue="1000" />
              </div>
            </div>
          </div>
          
          <Button className="w-full" onClick={() => setActiveTab('chat')}>
            Apply Settings
          </Button>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
