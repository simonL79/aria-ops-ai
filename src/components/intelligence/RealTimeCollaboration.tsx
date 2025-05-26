
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AnalystActivity {
  id: string;
  analyst: {
    id: string;
    email: string;
    name?: string;
  };
  activity: 'viewing' | 'analyzing' | 'responding' | 'escalating';
  threatId?: string;
  timestamp: Date;
  details?: string;
}

interface CollaborationNote {
  id: string;
  author: {
    id: string;
    email: string;
    name?: string;
  };
  threatId: string;
  message: string;
  timestamp: Date;
  type: 'note' | 'recommendation' | 'escalation';
}

interface RealTimeCollaborationProps {
  threatId?: string;
  selectedThreats?: string[];
}

const RealTimeCollaboration = ({ threatId, selectedThreats = [] }: RealTimeCollaborationProps) => {
  const { user } = useAuth();
  const [analysts, setAnalysts] = useState<AnalystActivity[]>([]);
  const [notes, setNotes] = useState<CollaborationNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    setupRealtimeConnection();
    loadExistingNotes();
    
    return () => {
      cleanupConnection();
    };
  }, [user, threatId, selectedThreats]);

  const setupRealtimeConnection = () => {
    // Simulate real-time presence (in a full implementation, this would use Supabase Realtime)
    setIsConnected(true);
    
    // Simulate other analysts presence
    const simulatedAnalysts: AnalystActivity[] = [
      {
        id: '1',
        analyst: { id: 'analyst1', email: 'sarah.chen@company.com', name: 'Sarah Chen' },
        activity: 'analyzing',
        threatId: threatId,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        details: 'Performing threat classification'
      },
      {
        id: '2',
        analyst: { id: 'analyst2', email: 'mike.torres@company.com', name: 'Mike Torres' },
        activity: 'viewing',
        threatId: threatId,
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      }
    ];
    
    setAnalysts(simulatedAnalysts);
    
    // Update presence
    updatePresence('viewing');
  };

  const updatePresence = async (activity: AnalystActivity['activity']) => {
    if (!user) return;
    
    try {
      // In a real implementation, this would update presence in Supabase
      const newActivity: AnalystActivity = {
        id: `${user.id}_${Date.now()}`,
        analyst: { id: user.id, email: user.email || '', name: user.user_metadata?.name },
        activity,
        threatId,
        timestamp: new Date(),
        details: activity === 'analyzing' ? 'AI-assisted analysis in progress' : undefined
      };
      
      setAnalysts(prev => {
        const filtered = prev.filter(a => a.analyst.id !== user.id);
        return [...filtered, newActivity];
      });
      
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  };

  const loadExistingNotes = async () => {
    if (!threatId && selectedThreats.length === 0) return;
    
    try {
      // Simulate loading notes from database
      const simulatedNotes: CollaborationNote[] = [
        {
          id: '1',
          author: { id: 'analyst1', email: 'sarah.chen@company.com', name: 'Sarah Chen' },
          threatId: threatId || selectedThreats[0],
          message: 'This appears to be part of a coordinated campaign. Similar language detected across 3 platforms.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          type: 'recommendation'
        },
        {
          id: '2',
          author: { id: 'analyst2', email: 'mike.torres@company.com', name: 'Mike Torres' },
          threatId: threatId || selectedThreats[0],
          message: 'Escalating to senior analyst - potential reputation damage if this spreads.',
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          type: 'escalation'
        }
      ];
      
      setNotes(simulatedNotes);
      
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !user) return;
    
    try {
      const note: CollaborationNote = {
        id: `note_${Date.now()}`,
        author: { id: user.id, email: user.email || '', name: user.user_metadata?.name },
        threatId: threatId || selectedThreats[0],
        message: newNote,
        timestamp: new Date(),
        type: 'note'
      };
      
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      
      // Update presence
      updatePresence('responding');
      
      toast.success('Note added to collaboration thread');
      
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    }
  };

  const escalateThreat = async () => {
    if (!user || (!threatId && selectedThreats.length === 0)) return;
    
    try {
      const escalationNote: CollaborationNote = {
        id: `escalation_${Date.now()}`,
        author: { id: user.id, email: user.email || '', name: user.user_metadata?.name },
        threatId: threatId || selectedThreats[0],
        message: `ESCALATION: ${selectedThreats.length > 1 ? `${selectedThreats.length} threats` : 'Threat'} requires immediate senior review`,
        timestamp: new Date(),
        type: 'escalation'
      };
      
      setNotes(prev => [escalationNote, ...prev]);
      updatePresence('escalating');
      
      toast.warning('Threat escalated to senior analysts');
      
    } catch (error) {
      console.error('Failed to escalate:', error);
      toast.error('Failed to escalate threat');
    }
  };

  const cleanupConnection = () => {
    setIsConnected(false);
    setAnalysts([]);
  };

  const getActivityIcon = (activity: AnalystActivity['activity']) => {
    switch (activity) {
      case 'viewing': return <Eye className="h-3 w-3" />;
      case 'analyzing': return <MessageSquare className="h-3 w-3" />;
      case 'responding': return <CheckCircle className="h-3 w-3" />;
      case 'escalating': return <AlertTriangle className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getActivityColor = (activity: AnalystActivity['activity']) => {
    switch (activity) {
      case 'viewing': return 'bg-blue-500';
      case 'analyzing': return 'bg-purple-500';
      case 'responding': return 'bg-green-500';
      case 'escalating': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getNoteTypeColor = (type: CollaborationNote['type']) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-800';
      case 'recommendation': return 'bg-green-100 text-green-800';
      case 'escalation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Real-Time Collaboration
            </CardTitle>
            <CardDescription>
              {isConnected ? 'Connected to analyst network' : 'Connecting...'}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {analysts.length} analyst{analysts.length !== 1 ? 's' : ''} active
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Active Analysts */}
        <div>
          <h4 className="font-medium mb-3">Active Analysts</h4>
          <div className="space-y-2">
            {analysts.map(analyst => (
              <div key={analyst.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {analyst.analyst.name?.charAt(0) || analyst.analyst.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {analyst.analyst.name || analyst.analyst.email}
                    </span>
                    <Badge className={`${getActivityColor(analyst.activity)} text-xs`}>
                      {getActivityIcon(analyst.activity)}
                      {analyst.activity}
                    </Badge>
                  </div>
                  {analyst.details && (
                    <p className="text-xs text-muted-foreground">{analyst.details}</p>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {Math.round((Date.now() - analyst.timestamp.getTime()) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Note */}
        <div>
          <h4 className="font-medium mb-3">Add Collaboration Note</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Share insights, recommendations, or concerns..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
            />
            <Button onClick={addNote} disabled={!newNote.trim()}>
              Add Note
            </Button>
            <Button onClick={escalateThreat} variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Escalate
            </Button>
          </div>
        </div>

        {/* Collaboration Notes */}
        <div>
          <h4 className="font-medium mb-3">Collaboration Thread</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notes.map(note => (
              <div key={note.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {note.author.name?.charAt(0) || note.author.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {note.author.name || note.author.email}
                    </span>
                    <Badge className={`text-xs ${getNoteTypeColor(note.type)}`}>
                      {note.type}
                    </Badge>
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    {note.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-sm">{note.message}</p>
              </div>
            ))}
            
            {notes.length === 0 && (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No collaboration notes yet</p>
                <p className="text-muted-foreground text-xs">Add the first note to start the discussion</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeCollaboration;
