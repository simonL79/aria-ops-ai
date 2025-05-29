
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface CommandFeedback {
  id: string;
  command_id: string;
  execution_status: string;
  summary: string;
  error_message?: string;
  evaluated_at: string;
  created_by: string;
}

interface CommandExecutionFeedbackProps {
  feedback: CommandFeedback[];
}

export const CommandExecutionFeedback = ({ feedback }: CommandExecutionFeedbackProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'fail':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Command Execution Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
        {feedback.length === 0 ? (
          <div className="text-gray-500 text-sm">No feedback data available</div>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
              {getStatusIcon(item.execution_status)}
              <div className="flex-1">
                <div className="text-sm text-white">{item.summary}</div>
                {item.error_message && (
                  <div className="text-xs text-red-400 mt-1">{item.error_message}</div>
                )}
                <div className="text-xs text-gray-500">
                  {new Date(item.evaluated_at).toLocaleTimeString()} by {item.created_by}
                </div>
              </div>
              <Badge className={getStatusColor(item.execution_status)}>
                {item.execution_status}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
