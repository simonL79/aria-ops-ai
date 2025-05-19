
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { useRbac } from '@/hooks/useRbac';
import { ClientChange } from '@/types/dashboard';

interface AIAssistantProps {
  clientUpdates: ClientChange[];
}

const AIAssistant = ({ clientUpdates }: AIAssistantProps) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AI', text: "Hi there! I'm ARIA, your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { hasPermission } = useRbac();
  
  useEffect(() => {
    // Scroll to bottom on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Notify on new client updates
    if (clientUpdates.length > 0) {
      const unreadUpdates = clientUpdates.filter(update => !update.read);
      if (unreadUpdates.length > 0) {
        toast({
          title: "New Client Updates",
          description: `You have ${unreadUpdates.length} new client updates. Check the dashboard for details.`,
        });
      }
    }
  }, [messages, clientUpdates, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage = { id: Date.now(), sender: 'User', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response (replace with actual AI logic)
    setTimeout(() => {
      const aiResponse = { id: Date.now() + 1, sender: 'AI', text: `Thanks for your message! Processing: "${input}"` };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <Card className="absolute bottom-4 right-4 w-96 shadow-lg border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ARIA Assistant</CardTitle>
      </CardHeader>
      <CardContent className="h-72 p-3">
        <ScrollArea className="h-full w-full rounded-md pr-2">
          <div className="space-y-2" ref={chatContainerRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'AI' ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center space-x-2">
                  {msg.sender === 'AI' && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-3 py-1 text-sm ${msg.sender === 'AI' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'User' && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleFormSubmit} className="w-full flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit" size="sm" disabled={!hasPermission('assistant.interact')}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
