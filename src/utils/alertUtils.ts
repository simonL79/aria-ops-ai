
import { ContentThreatType } from "@/types/intelligence";
import { Ban, Shield, Eye, Flag, AlertTriangle, MessageSquareWarning, Globe, Users } from "lucide-react";
import React from "react";
import type { AlertSeverity } from "@/types/intelligence";

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-alert-negative text-white';
    case 'medium': return 'bg-alert-warning text-white';
    case 'low': return 'bg-brand-light text-white';
    default: return 'bg-gray-200';
  }
};

export const getThreatTypeIcon = (threatType?: string) => {
  if (!threatType) return null;
  
  switch (threatType) {
    case 'falseReviews': 
      return React.createElement(MessageSquareWarning, { className: "h-4 w-4 text-yellow-600" });
    case 'coordinatedAttack': 
      return React.createElement(Users, { className: "h-4 w-4 text-red-600" });
    case 'competitorSmear': 
      return React.createElement(Ban, { className: "h-4 w-4 text-purple-600" });
    case 'botActivity': 
      return React.createElement(Eye, { className: "h-4 w-4 text-blue-600" });
    case 'misinformation': 
      return React.createElement(AlertTriangle, { className: "h-4 w-4 text-orange-600" });
    case 'legalRisk': 
      return React.createElement(Shield, { className: "h-4 w-4 text-red-800" });
    case 'viralThreat': 
      return React.createElement(Globe, { className: "h-4 w-4 text-pink-600" });
    default: 
      return React.createElement(Flag, { className: "h-4 w-4 text-gray-600" });
  }
};

export const getSourceTypeLabel = (sourceType?: string) => {
  if (!sourceType) return null;
  
  const colors: Record<string, string> = {
    social: 'bg-blue-100 text-blue-800',
    review: 'bg-green-100 text-green-800',
    news: 'bg-purple-100 text-purple-800',
    forum: 'bg-amber-100 text-amber-800',
    darkweb: 'bg-red-100 text-red-800'
  };
  
  return React.createElement(
    'span',
    { 
      className: `text-xs px-2 py-0.5 rounded-full ${colors[sourceType] || 'bg-gray-100 text-gray-800'}`
    },
    sourceType.charAt(0).toUpperCase() + sourceType.slice(1)
  );
};

export const formatThousands = (num?: number) => {
  if (num === undefined) return '';
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
};

export const getRecommendedActions = (severity: string) => {
  if (severity === 'high') {
    return [
      'Immediate response required',
      'Escalate to communications team',
      'Monitor for spread across platforms'
    ];
  } else if (severity === 'medium') {
    return [
      'Prepare response within 24 hours',
      'Track engagement metrics'
    ];
  } else {
    return [
      'Monitor for changes in engagement',
      'No immediate action required'
    ];
  }
};
