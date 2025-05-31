
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Archive, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AnubisGPTCockpit = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast.info('Anubis GPT has been archived. Use Genesis Sentinel for AI assistance.');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-900/10 to-indigo-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-purple-500" />
            Anubis GPT Cockpit
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Archived
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Anubis GPT Retired
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              The Anubis GPT chat interface has been archived. AI-powered intelligence 
              analysis is now integrated directly into Genesis Sentinel workflows.
            </p>
          </div>

          {/* Legacy Interface (Read-only) */}
          <Card className="bg-[#1C1C1E]/50 border-purple-500/10">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="This interface is archived - use Genesis Sentinel instead"
                  className="bg-gray-800/50 border-gray-600 text-gray-400"
                  disabled
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-500 text-white hover:bg-purple-600"
                  disabled
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Archive className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">AI Intelligence Available</h4>
                  <p className="text-sm text-gray-300">
                    Access AI-powered threat analysis and recommendations through Genesis Sentinel.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/admin/genesis-sentinel')}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <span>Go to Genesis Sentinel</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnubisGPTCockpit;
