
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FieldSuggestion {
  field: string;
  value: string;
  confidence: number;
  source: string;
}

interface SmartFieldAutofillProps {
  entityName: string;
  onSuggestions: (suggestions: Record<string, string>) => void;
}

export const SmartFieldAutofill = ({ entityName, onSuggestions }: SmartFieldAutofillProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [autoAnalyzed, setAutoAnalyzed] = useState(false);

  // Auto-analyze when entity name changes
  useEffect(() => {
    if (entityName && entityName.length > 2 && !autoAnalyzed) {
      const timer = setTimeout(() => {
        analyzePotentialFields();
        setAutoAnalyzed(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [entityName, autoAnalyzed]);

  const analyzePotentialFields = async () => {
    if (!entityName || entityName.length < 2) return;

    setIsAnalyzing(true);
    try {
      console.log(`💡 A.R.I.A™ Smart Field Analysis: ${entityName}`);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fieldSuggestions = generateSmartSuggestions(entityName);
      setSuggestions(fieldSuggestions);
      
    } catch (error) {
      console.error('Smart field analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSmartSuggestions = (name: string): FieldSuggestion[] => {
    const suggestions: FieldSuggestion[] = [];
    const nameLower = name.toLowerCase();
    
    // Industry detection based on name patterns
    const industryPatterns = {
      'Technology': /\b(tech|software|digital|app|ai|data|cyber|cloud|saas)\b/i,
      'Healthcare': /\b(health|medical|pharma|bio|clinic|hospital|care)\b/i,
      'Finance': /\b(bank|financial|invest|capital|fund|trading|fintech)\b/i,
      'Retail': /\b(store|shop|retail|fashion|clothing|brand|consumer)\b/i,
      'Consulting': /\b(consulting|advisory|solutions|services|group)\b/i,
      'Real Estate': /\b(real estate|property|development|construction)\b/i,
      'Manufacturing': /\b(manufacturing|industrial|factory|production)\b/i,
      'Entertainment': /\b(entertainment|media|studio|production|gaming)\b/i
    };
    
    for (const [industry, pattern] of Object.entries(industryPatterns)) {
      if (pattern.test(name)) {
        suggestions.push({
          field: 'industry',
          value: industry,
          confidence: 0.8,
          source: 'Name Pattern Analysis'
        });
        break;
      }
    }
    
    // Website prediction
    const cleanName = name.replace(/\b(inc|corp|llc|ltd|group|company)\b/gi, '').trim();
    const websiteBase = cleanName.toLowerCase().replace(/\s+/g, '');
    if (websiteBase && websiteBase.length > 2) {
      suggestions.push({
        field: 'website',
        value: `https://www.${websiteBase}.com`,
        confidence: 0.6,
        source: 'Domain Prediction'
      });
    }
    
    // Special cases for well-known entities
    if (nameLower.includes('tesla')) {
      suggestions.push(
        {
          field: 'industry',
          value: 'Automotive/Technology',
          confidence: 0.95,
          source: 'Known Entity Database'
        },
        {
          field: 'website',
          value: 'https://www.tesla.com',
          confidence: 0.95,
          source: 'Known Entity Database'
        }
      );
    }
    
    if (nameLower.includes('google') || nameLower.includes('alphabet')) {
      suggestions.push(
        {
          field: 'industry',
          value: 'Technology',
          confidence: 0.95,
          source: 'Known Entity Database'
        },
        {
          field: 'website',
          value: 'https://www.google.com',
          confidence: 0.95,
          source: 'Known Entity Database'
        }
      );
    }
    
    return suggestions;
  };

  const applySuggestion = (suggestion: FieldSuggestion) => {
    const newApplied = new Set(appliedSuggestions);
    newApplied.add(suggestion.field);
    setAppliedSuggestions(newApplied);
    
    onSuggestions({ [suggestion.field]: suggestion.value });
  };

  const rejectSuggestion = (suggestion: FieldSuggestion) => {
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium">Smart Field Suggestions</span>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing entity for smart suggestions...</span>
          </div>
        )}
        
        {suggestions.length > 0 && !isAnalyzing && (
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{suggestion.field}:</span>
                    <span className="text-sm">{suggestion.value}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Source: {suggestion.source}
                  </div>
                </div>
                <div className="flex gap-1">
                  {appliedSuggestions.has(suggestion.field) ? (
                    <Badge variant="default" className="text-xs">
                      Applied
                    </Badge>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applySuggestion(suggestion)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => rejectSuggestion(suggestion)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!suggestions.length && !isAnalyzing && (
          <div className="text-sm text-muted-foreground">
            No smart suggestions available for this entity
          </div>
        )}
      </CardContent>
    </Card>
  );
};
