
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MentionsTab from './MentionsTab';
import { ContentAlert } from '@/types/dashboard';
import { getMentionsAsAlerts } from '@/services/monitoring';
import { classifyThreatAdvanced } from '@/services/intelligence/threatClassifier';
import { toast } from 'sonner';
import MentionDetailsDialog from './MentionDetailsDialog';
import ThreatClassificationResultDisplay from '@/components/dashboard/threatClassifier/ThreatClassificationResult';
import { ThreatClassificationResult } from '@/types/intelligence';

const MentionsPage = () => {
  const [searchParams] = useSearchParams();
  const [mentions, setMentions] = useState<ContentAlert[]>([]);
  const [selectedMention, setSelectedMention] = useState<ContentAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogAction, setDialogAction] = useState<'view' | 'resolve' | 'escalate'>('view');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ThreatClassificationResult | null>(null);
  const [activeTab, setActiveTab] = useState('mentions');
  
  useEffect(() => {
    fetchMentions();
    
    // Check if there's an alert ID in the URL params
    const alertId = searchParams.get('alert');
    if (alertId) {
      handleViewMentionFromUrl(alertId);
    }
  }, []);
  
  const fetchMentions = async () => {
    setLoading(true);
    try {
      const data = await getMentionsAsAlerts();
      setMentions(data);
    } catch (error) {
      console.error('Error fetching mentions:', error);
      toast.error('Failed to fetch mentions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewMentionFromUrl = async (id: string) => {
    const mention = mentions.find(m => m.id === id);
    if (mention) {
      setSelectedMention(mention);
      setDialogAction('view');
      setDialogOpen(true);
      
      // Classify the threat
      await classifyMention(mention);
    }
  };
  
  const handleViewDetail = async (mention: ContentAlert) => {
    setSelectedMention(mention);
    setDialogAction('view');
    setDialogOpen(true);
    
    // Classify the threat
    await classifyMention(mention);
  };
  
  const classifyMention = async (mention: ContentAlert) => {
    try {
      const result = await classifyThreatAdvanced({
        content: mention.content,
        platform: mention.platform,
        brand: "Your Company", // This should be dynamically set
        context: "Brand monitoring alert"
      });
      
      if (result) {
        setClassificationResult(result);
      }
    } catch (error) {
      console.error('Error classifying threat:', error);
    }
  };
  
  const handleMarkResolved = (id: string) => {
    const mention = mentions.find(m => m.id === id);
    if (mention) {
      setSelectedMention(mention);
      setDialogAction('resolve');
      setDialogOpen(true);
    }
  };
  
  const handleEscalate = (id: string) => {
    const mention = mentions.find(m => m.id === id);
    if (mention) {
      setSelectedMention(mention);
      setDialogAction('escalate');
      setDialogOpen(true);
    }
  };
  
  const handleConfirmAction = async () => {
    if (!selectedMention) return;
    
    try {
      // Handle the specific action
      if (dialogAction === 'resolve') {
        // Update mention status
        const updatedMentions = mentions.map(m => 
          m.id === selectedMention.id ? { ...m, status: 'resolved' as const } : m
        );
        setMentions(updatedMentions);
        toast.success('Mention marked as resolved');
      } else if (dialogAction === 'escalate') {
        // Escalate the mention
        const updatedMentions = mentions.map(m => 
          m.id === selectedMention.id ? { ...m, severity: 'high' as const, status: 'reviewing' as const } : m
        );
        setMentions(updatedMentions);
        toast.success('Mention escalated for urgent review');
      }
      
      // Close the dialog
      setDialogOpen(false);
    } catch (error) {
      console.error('Error handling mention action:', error);
      toast.error('Failed to process your request');
    }
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Mentions & Threat Monitoring</h1>
      
      <div className="space-y-6">
        {/* Classification result display */}
        {selectedMention && classificationResult && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Threat Analysis</h2>
            <ThreatClassificationResultDisplay result={classificationResult} />
          </div>
        )}
        
        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="mentions">All Mentions</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentions" className="space-y-4">
            <MentionsTab
              mentions={mentions}
              setMentions={setMentions}
              onViewDetail={handleViewDetail}
              onMarkResolved={handleMarkResolved}
              onEscalate={handleEscalate}
            />
          </TabsContent>
          
          <TabsContent value="threats" className="space-y-4">
            <MentionsTab
              mentions={mentions.filter(m => m.severity === 'high')}
              setMentions={setMentions}
              onViewDetail={handleViewDetail}
              onMarkResolved={handleMarkResolved}
              onEscalate={handleEscalate}
            />
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <MentionsTab
              mentions={mentions.filter(m => m.sourceType === 'review')}
              setMentions={setMentions}
              onViewDetail={handleViewDetail}
              onMarkResolved={handleMarkResolved}
              onEscalate={handleEscalate}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog for mention details, resolving, or escalating */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <MentionDetailsDialog
          selectedMention={selectedMention}
          actionType={dialogAction}
          onConfirm={handleConfirmAction}
        />
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MentionsPage;
