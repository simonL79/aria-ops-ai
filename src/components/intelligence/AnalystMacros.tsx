
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Plus, Play, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface MacroAction {
  type: 'escalate' | 'assign' | 'tag' | 'status_change' | 'notify' | 'archive';
  parameters: Record<string, any>;
  description: string;
}

interface AnalystMacro {
  id: string;
  name: string;
  description: string;
  actions: MacroAction[];
  trigger: 'manual' | 'auto_severity' | 'auto_classification';
  triggerConditions?: Record<string, any>;
}

interface AnalystMacrosProps {
  selectedThreats: string[];
  onMacroExecuted?: (macroId: string, threats: string[]) => void;
}

const AnalystMacros = ({ selectedThreats, onMacroExecuted }: AnalystMacrosProps) => {
  const [macros, setMacros] = useState<AnalystMacro[]>([
    {
      id: 'escalate_high',
      name: 'Escalate High Severity',
      description: 'Escalate threat, assign to senior analyst, and log incident',
      actions: [
        { type: 'escalate', parameters: { level: 'senior' }, description: 'Escalate to senior analyst' },
        { type: 'assign', parameters: { role: 'senior_analyst' }, description: 'Assign to senior analyst' },
        { type: 'tag', parameters: { tags: ['escalated', 'high_priority'] }, description: 'Add escalation tags' },
        { type: 'notify', parameters: { channel: 'ops_alert' }, description: 'Send ops alert' }
      ],
      trigger: 'manual'
    },
    {
      id: 'archive_resolved',
      name: 'Archive & Auto-Reply',
      description: 'Archive resolved threats and draft standard reply',
      actions: [
        { type: 'status_change', parameters: { status: 'resolved' }, description: 'Mark as resolved' },
        { type: 'archive', parameters: {}, description: 'Archive threat' },
        { type: 'notify', parameters: { type: 'auto_reply_draft' }, description: 'Generate reply draft' }
      ],
      trigger: 'manual'
    },
    {
      id: 'coordinated_attack',
      name: 'Coordinated Attack Response',
      description: 'Full response protocol for coordinated attacks',
      actions: [
        { type: 'escalate', parameters: { level: 'urgent' }, description: 'Urgent escalation' },
        { type: 'tag', parameters: { tags: ['coordinated', 'campaign', 'urgent'] }, description: 'Campaign tags' },
        { type: 'assign', parameters: { team: 'threat_response' }, description: 'Assign to threat response team' },
        { type: 'notify', parameters: { channels: ['slack', 'email', 'sms'] }, description: 'Multi-channel alert' }
      ],
      trigger: 'auto_classification',
      triggerConditions: { threat_type: 'coordinated_attack', confidence: 0.8 }
    }
  ]);

  const [isCreatingMacro, setIsCreatingMacro] = useState(false);
  const [newMacro, setNewMacro] = useState<Partial<AnalystMacro>>({
    name: '',
    description: '',
    actions: [],
    trigger: 'manual'
  });

  const executeMacro = async (macro: AnalystMacro) => {
    if (selectedThreats.length === 0) {
      toast.error('No threats selected');
      return;
    }

    try {
      // Execute each action in the macro
      for (const action of macro.actions) {
        await executeAction(action, selectedThreats);
      }

      toast.success(`Macro "${macro.name}" executed successfully`, {
        description: `Applied to ${selectedThreats.length} threats`
      });

      onMacroExecuted?.(macro.id, selectedThreats);
    } catch (error) {
      console.error('Macro execution failed:', error);
      toast.error('Macro execution failed');
    }
  };

  const executeAction = async (action: MacroAction, threatIds: string[]) => {
    // Mock action execution - in real implementation, these would call actual services
    console.log(`Executing action: ${action.type}`, {
      parameters: action.parameters,
      threats: threatIds
    });

    // Simulate action delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action.type) {
      case 'escalate':
        // Call escalation service
        break;
      case 'assign':
        // Call assignment service
        break;
      case 'tag':
        // Call tagging service
        break;
      case 'status_change':
        // Call status update service
        break;
      case 'notify':
        // Call notification service
        break;
      case 'archive':
        // Call archival service
        break;
    }
  };

  const getActionIcon = (type: MacroAction['type']) => {
    switch (type) {
      case 'escalate': return '🚨';
      case 'assign': return '👤';
      case 'tag': return '🏷️';
      case 'status_change': return '📊';
      case 'notify': return '📢';
      case 'archive': return '📁';
      default: return '⚙️';
    }
  };

  const getTriggerBadgeVariant = (trigger: AnalystMacro['trigger']) => {
    switch (trigger) {
      case 'manual': return 'outline';
      case 'auto_severity': return 'default';
      case 'auto_classification': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Analyst Macros
            </CardTitle>
            <CardDescription>
              Pre-configured action sets for rapid threat response
            </CardDescription>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCreatingMacro(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Macro
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedThreats.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              {selectedThreats.length} threats selected for macro execution
            </p>
          </div>
        )}

        <div className="space-y-3">
          {macros.map((macro) => (
            <div key={macro.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{macro.name}</h4>
                    <Badge variant={getTriggerBadgeVariant(macro.trigger)}>
                      {macro.trigger.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{macro.description}</p>
                </div>
                
                <Button
                  onClick={() => executeMacro(macro)}
                  disabled={selectedThreats.length === 0}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Execute
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Actions ({macro.actions.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {macro.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                      <span>{getActionIcon(action.type)}</span>
                      <span>{action.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {macros.length === 0 && (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No macros configured</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsCreatingMacro(true)}
            >
              Create Your First Macro
            </Button>
          </div>
        )}

        {isCreatingMacro && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3">Create New Macro</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="macro-name">Macro Name</Label>
                  <Input
                    id="macro-name"
                    placeholder="Enter macro name"
                    value={newMacro.name || ''}
                    onChange={(e) => setNewMacro(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="macro-trigger">Trigger Type</Label>
                  <Select 
                    value={newMacro.trigger || 'manual'} 
                    onValueChange={(value) => setNewMacro(prev => ({ ...prev, trigger: value as AnalystMacro['trigger'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="auto_severity">Auto (Severity)</SelectItem>
                      <SelectItem value="auto_classification">Auto (Classification)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="macro-description">Description</Label>
                <Input
                  id="macro-description"
                  placeholder="Describe what this macro does"
                  value={newMacro.description || ''}
                  onChange={(e) => setNewMacro(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => {
                    // Save macro logic here
                    setIsCreatingMacro(false);
                    setNewMacro({});
                    toast.success('Macro created successfully');
                  }}
                  disabled={!newMacro.name || !newMacro.description}
                >
                  Create Macro
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsCreatingMacro(false);
                    setNewMacro({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalystMacros;
