
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, X, Maximize2, Minimize2, PanelRightOpen } from "lucide-react";
import { toast } from "sonner";
import { callOpenAI } from "@/services/api/openaiClient";
import { hasOpenAIKey } from "@/services/api/openaiClient";

interface AIAssistantProps {
  clientUpdates?: Array<{
    id: string;
    clientName: string;
    changeType: string;
    description: string;
    timestamp: Date;
  }>;
  className?: string;
}

const AIAssistant = ({ clientUpdates = [], className }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(hasOpenAIKey());
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your ARIA assistant. I can help you understand client profile changes and provide insights on reputation management. How can I assist you today?'
    }
  ]);

  useEffect(() => {
    // If we have new client updates, process them and add assistant messages
    if (clientUpdates.length > 0) {
      // Only process the most recent update
      const latestUpdate = clientUpdates[0];
      
      const updateMessage = `
        I've detected a change in client "${latestUpdate.clientName}".
        Type: ${latestUpdate.changeType}
        ${latestUpdate.description}
        
        Would you like me to analyze this change for potential reputation impacts?
      `;
      
      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          content: updateMessage
        }
      ]);
      
      // Show a toast to notify user
      toast.info(`Client update detected: ${latestUpdate.clientName}`, {
        description: latestUpdate.description,
        action: {
          label: "View",
          onClick: () => setIsOpen(true)
        }
      });
    }
  }, [clientUpdates]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
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
      const messages = [
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

  // Render the floating assistant button when closed
  if (!isOpen) {
    return (
      <Button 
        onClick={toggleAssistant}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  // Render the minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card rounded-md shadow-lg flex items-center p-2 border">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">ARIA Assistant</span>
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
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleMinimize}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleAssistant}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Ask about client changes and reputation management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
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
        </div>
      </CardContent>
      <CardFooter>
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
    </Card>
  );
};

export default AIAssistant;
