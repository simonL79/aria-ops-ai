
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface CommandFeedback {
  id: string;
  command: string;
  status: string;
  message: string;
  timestamp: string;
}

interface CommandExecutionFeedbackProps {
  feedback: CommandFeedback[];
}

export const CommandExecutionFeedback = ({ feedback }: CommandExecutionFeedbackProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <CheckCircle className="h-5 w-5" />
          Command Execution Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {feedback.length > 0 ? (
            feedback.map((item) => (
              <div key={item.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{item.command}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Badge variant="secondary" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">{item.message}</p>
                <div className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No command feedback available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
