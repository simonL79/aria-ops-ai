
import React from 'react';

// Define alert severity
export type AlertSeverity = 'high' | 'medium' | 'low';

// Define intelligence levels
export type IntelligenceLevel = 
  'basic' | 
  'advanced' | 
  'enterprise' | 
  'expert';

// Source types
export type SourceType = 
  'social' | 
  'news' | 
  'review' | 
  'forum' | 
  'darkweb';

// Helper function for Intelligence level colors
export const getIntelligenceLevelColor = (level: IntelligenceLevel): string => {
  switch(level) {
    case 'basic':
      return 'bg-blue-500';
    case 'advanced':
      return 'bg-green-500';
    case 'enterprise':
      return 'bg-purple-500';
    case 'expert':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

// Update dashboard.ts ContentAlert interface to include 'read' status
export interface ContentAlertUpdate {
  status: 'read' | 'new' | 'reviewing' | 'actioned';
}
