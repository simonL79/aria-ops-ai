
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';

interface RemediationSuggestion {
  id: string;
  type: string;
  suggestion: string;
  priority: string;
  timestamp: string;
}

interface RemediationSuggestionsProps {
  suggestions: RemediationSuggestion[];
}

export const RemediationSuggestions = ({ suggestions }: RemediationSuggestionsProps) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Lightbulb className="h-5 w-5" />
          AI Remediation Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{suggestion.type}</span>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(suggestion.priority)}
                    <Badge variant="secondary" className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">{suggestion.suggestion}</p>
                <div className="text-xs text-gray-500">
                  {new Date(suggestion.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No AI suggestions available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
