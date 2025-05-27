
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Database, Edit, Calendar, AlertTriangle } from 'lucide-react';

interface RetentionSchedule {
  id: string;
  data_category: string;
  table_name: string;
  retention_period: string;
  retention_justification: string;
  deletion_method: string;
  legal_basis: string;
  review_frequency: string;
  last_review_date: string | null;
  next_review_date: string | null;
  responsible_role: string;
  automated_deletion: boolean;
  deletion_job_name: string | null;
  special_category_data: boolean;
  cross_border_considerations: string | null;
  created_at: string;
  updated_at: string;
}

const DataRetentionManager = () => {
  const [schedules, setSchedules] = useState<RetentionSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<RetentionSchedule | null>(null);
  const [formData, setFormData] = useState({
    data_category: '',
    table_name: '',
    retention_period: '',
    retention_justification: '',
    deletion_method: '',
    legal_basis: '',
    review_frequency: '1 year',
    last_review_date: '',
    next_review_date: '',
    responsible_role: '',
    automated_deletion: false,
    deletion_job_name: '',
    special_category_data: false,
    cross_border_considerations: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('data_retention_schedule')
        .select('*')
        .order('data_category');

      if (error) throw error;
      
      // Transform the data to handle interval types properly
      const transformedData = data?.map(item => ({
        ...item,
        retention_period: item.retention_period ? String(item.retention_period) : '',
        review_frequency: item.review_frequency ? String(item.review_frequency) : '1 year',
        last_review_date: item.last_review_date || null,
        next_review_date: item.next_review_date || null,
        deletion_job_name: item.deletion_job_name || null,
        cross_border_considerations: item.cross_border_considerations || null
      })) || [];
      
      setSchedules(transformedData);
    } catch (error) {
      console.error('Error fetching retention schedules:', error);
      toast.error('Failed to fetch retention schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const scheduleData = {
        ...formData,
        retention_period: `${formData.retention_period} years`,
        review_frequency: `${formData.review_frequency}`,
        next_review_date: formData.next_review_date || calculateNextReview(formData.review_frequency)
      };

      if (editingSchedule) {
        const { error } = await supabase
          .from('data_retention_schedule')
          .update(scheduleData)
          .eq('id', editingSchedule.id);
        
        if (error) throw error;
        toast.success('Retention schedule updated successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'retention_schedule_updated',
          p_description: `Retention schedule updated for ${formData.data_category}`,
          p_legal_basis: 'Legal Obligation'
        });
      } else {
        const { error } = await supabase
          .from('data_retention_schedule')
          .insert([scheduleData]);
        
        if (error) throw error;
        toast.success('Retention schedule created successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'retention_schedule_created',
          p_description: `New retention schedule created for ${formData.data_category}`,
          p_legal_basis: 'Legal Obligation'
        });
      }
      
      setDialogOpen(false);
      setEditingSchedule(null);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error('Error saving retention schedule:', error);
      toast.error('Failed to save retention schedule');
    }
  };

  const calculateNextReview = (frequency: string) => {
    const now = new Date();
    const yearFromNow = new Date(now.setFullYear(now.getFullYear() + 1));
    return yearFromNow.toISOString().split('T')[0];
  };

  const handleEdit = (schedule: RetentionSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      data_category: schedule.data_category,
      table_name: schedule.table_name,
      retention_period: schedule.retention_period.replace(' years', ''),
      retention_justification: schedule.retention_justification,
      deletion_method: schedule.deletion_method,
      legal_basis: schedule.legal_basis,
      review_frequency: schedule.review_frequency.replace(' year', ''),
      last_review_date: schedule.last_review_date || '',
      next_review_date: schedule.next_review_date || '',
      responsible_role: schedule.responsible_role,
      automated_deletion: schedule.automated_deletion,
      deletion_job_name: schedule.deletion_job_name || '',
      special_category_data: schedule.special_category_data,
      cross_border_considerations: schedule.cross_border_considerations || ''
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSchedule(null);
    setFormData({
      data_category: '',
      table_name: '',
      retention_period: '',
      retention_justification: '',
      deletion_method: '',
      legal_basis: '',
      review_frequency: '1 year',
      last_review_date: '',
      next_review_date: '',
      responsible_role: '',
      automated_deletion: false,
      deletion_job_name: '',
      special_category_data: false,
      cross_border_considerations: ''
    });
  };

  const isReviewOverdue = (nextReviewDate: string) => {
    if (!nextReviewDate) return false;
    return new Date(nextReviewDate) < new Date();
  };

  if (loading) {
    return <div className="text-center p-8">Loading retention schedules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Retention Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Edit Retention Schedule' : 'Create New Retention Schedule'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_category">Data Category *</Label>
                  <Input
                    id="data_category"
                    value={formData.data_category}
                    onChange={(e) => setFormData({ ...formData, data_category: e.target.value })}
                    placeholder="e.g., Employee Risk Data"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="table_name">Table Name *</Label>
                  <Input
                    id="table_name"
                    value={formData.table_name}
                    onChange={(e) => setFormData({ ...formData, table_name: e.target.value })}
                    placeholder="e.g., company_employees"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="retention_period">Retention Period (years) *</Label>
                  <Input
                    id="retention_period"
                    type="number"
                    value={formData.retention_period}
                    onChange={(e) => setFormData({ ...formData, retention_period: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="legal_basis">Legal Basis *</Label>
                  <Select value={formData.legal_basis} onValueChange={(value) => setFormData({ ...formData, legal_basis: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal basis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Legitimate Interest">Legitimate Interest</SelectItem>
                      <SelectItem value="Legal Obligation">Legal Obligation</SelectItem>
                      <SelectItem value="Consent">Consent</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="retention_justification">Retention Justification *</Label>
                <Textarea
                  id="retention_justification"
                  value={formData.retention_justification}
                  onChange={(e) => setFormData({ ...formData, retention_justification: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deletion_method">Deletion Method *</Label>
                  <Select value={formData.deletion_method} onValueChange={(value) => setFormData({ ...formData, deletion_method: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deletion method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automated deletion">Automated deletion</SelectItem>
                      <SelectItem value="Manual deletion">Manual deletion</SelectItem>
                      <SelectItem value="Automated pseudonymization then deletion">Automated pseudonymization then deletion</SelectItem>
                      <SelectItem value="Manual review then deletion">Manual review then deletion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="responsible_role">Responsible Role *</Label>
                  <Input
                    id="responsible_role"
                    value={formData.responsible_role}
                    onChange={(e) => setFormData({ ...formData, responsible_role: e.target.value })}
                    placeholder="e.g., Data Protection Officer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="last_review_date">Last Review Date</Label>
                  <Input
                    id="last_review_date"
                    type="date"
                    value={formData.last_review_date}
                    onChange={(e) => setFormData({ ...formData, last_review_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="next_review_date">Next Review Date</Label>
                  <Input
                    id="next_review_date"
                    type="date"
                    value={formData.next_review_date}
                    onChange={(e) => setFormData({ ...formData, next_review_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cross_border_considerations">Cross-border Considerations</Label>
                <Textarea
                  id="cross_border_considerations"
                  value={formData.cross_border_considerations}
                  onChange={(e) => setFormData({ ...formData, cross_border_considerations: e.target.value })}
                  placeholder="Any special considerations for international data transfers"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSchedule ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No retention schedules</h3>
              <p className="text-gray-500 mb-4">
                Define data retention policies to ensure GDPR compliance.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold">{schedule.data_category}</h3>
                        <p className="text-sm text-gray-600">Table: {schedule.table_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {schedule.next_review_date && isReviewOverdue(schedule.next_review_date) && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {schedule.special_category_data && (
                        <Badge variant="destructive">Special Category</Badge>
                      )}
                      {schedule.automated_deletion && (
                        <Badge variant="secondary">Automated</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Retention Period:</span>
                      <div className="font-medium">{schedule.retention_period}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Legal Basis:</span>
                      <div className="font-medium">{schedule.legal_basis}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Deletion Method:</span>
                      <div className="font-medium">{schedule.deletion_method}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Next Review:</span>
                      <div className={`font-medium ${schedule.next_review_date && isReviewOverdue(schedule.next_review_date) ? 'text-red-600' : ''}`}>
                        {schedule.next_review_date ? new Date(schedule.next_review_date).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-gray-500 text-sm">Justification:</span>
                    <p className="text-sm">{schedule.retention_justification}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(schedule)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {schedule.next_review_date && isReviewOverdue(schedule.next_review_date) && (
                      <Badge variant="destructive" className="ml-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        Review Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataRetentionManager;
