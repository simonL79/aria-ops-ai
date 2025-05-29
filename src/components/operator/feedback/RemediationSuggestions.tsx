
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface RemediationSuggestion {
  id: string;
  command_id: string;
  suggestion: string;
  rationale: string;
  proposed_by: string;
  created_at: string;
}

interface RemediationSuggestionsProps {
  suggestions: RemediationSuggestion[];
}

export const RemediationSuggestions = ({ suggestions }: RemediationSuggestionsProps) => {
  const applySuggestion = async (suggestion: RemediationSuggestion) => {
    toast.info(`Applied suggestion: ${suggestion.suggestion}`);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black border-yellow-500/30">
      <CardHeader>
        <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          AI Remediation Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-40 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <div className="text-sm text-yellow-200 mb-2">{suggestion.suggestion}</div>
            <div className="text-xs text-yellow-400/70 mb-2">{suggestion.rationale}</div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">by {suggestion.proposed_by}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applySuggestion(suggestion)}
                className="text-xs bg-yellow-600 hover:bg-yellow-700"
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
