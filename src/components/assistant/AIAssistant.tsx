import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, User, Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Protected } from "@/hooks/useRbac";
import { AppRole } from '@/services/api/userService';
import { useAuth } from '@/hooks/useAuth';
import { AccessDenied } from '../ui/access-denied';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: `This is a simulated response to: ${input}. I am still under development and learning to provide helpful answers.`
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  const adminAndStaffRoles: AppRole[] = ['admin', 'staff'];
  
  return (
    <Protected roles={adminAndStaffRoles} fallback={<AccessDenied />}>
      <div className="flex flex-col h-full">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <Card className={message.role === 'user' ? 'bg-blue-100 text-blue-800 ml-auto w-fit max-w-md' : 'bg-gray-100 text-gray-800 mr-auto w-fit max-w-md'}>
                <CardContent className="p-3">
                  <div className="flex items-start">
                    {message.role === 'assistant' && <Bot className="mr-2 h-4 w-4 shrink-0" />}
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'user' && <User className="ml-2 h-4 w-4 shrink-0" />}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="text-left">
              <Card className="bg-gray-100 text-gray-800 mr-auto w-fit max-w-md">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </Protected>
  );
}
