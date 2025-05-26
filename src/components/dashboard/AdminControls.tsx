
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, UserPlus, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { exportToCSV, formatDataForExport, type ExportableData } from '@/utils/csvExport';

interface AdminControlsProps {
  selectedItems: any[];
  onRefresh: () => void;
  allData: any[];
}

const AdminControls = ({ selectedItems, onRefresh, allData }: AdminControlsProps) => {
  const { user } = useAuth();
  const [assignee, setAssignee] = useState('');
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBulkAssign = async () => {
    if (!assignee || selectedItems.length === 0) {
      toast.error('Please select items and enter an assignee email');
      return;
    }

    setIsUpdating(true);
    try {
      const updates = selectedItems.map(item => ({
        id: item.id,
        assigned_to: assignee,
        contact_status_updated_by: user?.id
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('scan_results')
          .update({
            assigned_to: update.assigned_to,
            contact_status_updated_by: update.contact_status_updated_by,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id);

        if (error) throw error;
      }

      // Log the activity
      await supabase.from('activity_logs').insert({
        action: 'bulk_assign',
        entity_type: 'scan_results',
        entity_id: selectedItems.map(item => item.id).join(','),
        user_id: user?.id,
        user_email: user?.email,
        details: `Assigned ${selectedItems.length} items to ${assignee}`
      });

      toast.success(`Assigned ${selectedItems.length} items to ${assignee}`);
      setAssignee('');
      onRefresh();
    } catch (error) {
      console.error('Error assigning items:', error);
      toast.error('Failed to assign items');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!newStatus || selectedItems.length === 0) {
      toast.error('Please select items and choose a status');
      return;
    }

    setIsUpdating(true);
    try {
      for (const item of selectedItems) {
        const updateData: any = {
          status: newStatus,
          contact_status_updated_by: user?.id,
          updated_at: new Date().toISOString()
        };

        if (notes) {
          updateData.response_notes = notes;
        }

        const { error } = await supabase
          .from('scan_results')
          .update(updateData)
          .eq('id', item.id);

        if (error) throw error;
      }

      // Log the activity
      await supabase.from('activity_logs').insert({
        action: 'bulk_status_update',
        entity_type: 'scan_results',
        entity_id: selectedItems.map(item => item.id).join(','),
        user_id: user?.id,
        user_email: user?.email,
        details: `Updated status to ${newStatus} for ${selectedItems.length} items`
      });

      toast.success(`Updated ${selectedItems.length} items to ${newStatus}`);
      setNewStatus('');
      setNotes('');
      onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportAll = () => {
    try {
      const exportData = formatDataForExport(allData);
      exportToCSV(exportData, 'aria-all-results');
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const handleExportSelected = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to export');
      return;
    }

    try {
      const exportData = formatDataForExport(selectedItems);
      exportToCSV(exportData, 'aria-selected-results');
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Admin Controls
          {selectedItems.length > 0 && (
            <Badge variant="secondary">
              {selectedItems.length} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Controls */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportAll}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportSelected}
            disabled={selectedItems.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Selected ({selectedItems.length})
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">Bulk Actions</h4>
            
            {/* Assign */}
            <div className="flex gap-2">
              <Input
                placeholder="Assignee email"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleBulkAssign}
                disabled={isUpdating || !assignee}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Assign
              </Button>
            </div>

            {/* Status Update */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="actioned">Actioned</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleBulkStatusUpdate}
                  disabled={isUpdating || !newStatus}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Update Status
                </Button>
              </div>
              <Textarea
                placeholder="Add notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminControls;
