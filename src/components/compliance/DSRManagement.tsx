
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
import { Plus, Users, Edit, Clock, AlertTriangle } from 'lucide-react';

interface DSR {
  id: string;
  request_type: string;
  data_subject_name: string;
  data_subject_email: string;
  verification_status: string;
  request_details: string;
  data_categories: string[];
  legal_basis_for_refusal: string;
  processing_systems: string[];
  response_method: string;
  request_date: string;
  acknowledgment_sent_date: string;
  response_due_date: string;
  response_sent_date: string;
  status: string;
  outcome: string;
  data_provided: boolean;
  data_corrected: boolean;
  data_deleted: boolean;
  processing_restricted: boolean;
  handled_by: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const DSRManagement = () => {
  const [dsrs, setDsrs] = useState<DSR[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDSR, setEditingDSR] = useState<DSR | null>(null);
  const [formData, setFormData] = useState({
    request_type: '',
    data_subject_name: '',
    data_subject_email: '',
    verification_status: 'pending',
    request_details: '',
    data_categories: '',
    legal_basis_for_refusal: '',
    processing_systems: '',
    response_method: 'email',
    acknowledgment_sent_date: '',
    response_due_date: '',
    response_sent_date: '',
    status: 'received',
    outcome: '',
    notes: ''
  });

  useEffect(() => {
    fetchDSRs();
  }, []);

  const fetchDSRs = async () => {
    try {
      const { data, error } = await supabase
        .from('data_subject_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDsrs(data || []);
    } catch (error) {
      console.error('Error fetching DSRs:', error);
      toast.error('Failed to fetch data subject requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dsrData = {
        ...formData,
        data_categories: formData.data_categories ? formData.data_categories.split(',').map(s => s.trim()) : [],
        processing_systems: formData.processing_systems ? formData.processing_systems.split(',').map(s => s.trim()) : [],
        // Calculate response due date (30 days from request)
        response_due_date: formData.response_due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      if (editingDSR) {
        const { error } = await supabase
          .from('data_subject_requests')
          .update(dsrData)
          .eq('id', editingDSR.id);
        
        if (error) throw error;
        toast.success('DSR updated successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'dsr_updated',
          p_description: `DSR updated for ${formData.data_subject_name} (${formData.request_type})`,
          p_legal_basis: 'Legal Obligation'
        });
      } else {
        const { error } = await supabase
          .from('data_subject_requests')
          .insert([dsrData]);
        
        if (error) throw error;
        toast.success('DSR created successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'dsr_created',
          p_description: `New DSR received from ${formData.data_subject_name} (${formData.request_type})`,
          p_legal_basis: 'Legal Obligation'
        });
      }
      
      setDialogOpen(false);
      setEditingDSR(null);
      resetForm();
      fetchDSRs();
    } catch (error) {
      console.error('Error saving DSR:', error);
      toast.error('Failed to save DSR');
    }
  };

  const handleEdit = (dsr: DSR) => {
    setEditingDSR(dsr);
    setFormData({
      request_type: dsr.request_type,
      data_subject_name: dsr.data_subject_name,
      data_subject_email: dsr.data_subject_email,
      verification_status: dsr.verification_status,
      request_details: dsr.request_details || '',
      data_categories: dsr.data_categories ? dsr.data_categories.join(', ') : '',
      legal_basis_for_refusal: dsr.legal_basis_for_refusal || '',
      processing_systems: dsr.processing_systems ? dsr.processing_systems.join(', ') : '',
      response_method: dsr.response_method,
      acknowledgment_sent_date: dsr.acknowledgment_sent_date ? dsr.acknowledgment_sent_date.split('T')[0] : '',
      response_due_date: dsr.response_due_date ? dsr.response_due_date.split('T')[0] : '',
      response_sent_date: dsr.response_sent_date ? dsr.response_sent_date.split('T')[0] : '',
      status: dsr.status,
      outcome: dsr.outcome || '',
      notes: dsr.notes || ''
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDSR(null);
    setFormData({
      request_type: '',
      data_subject_name: '',
      data_subject_email: '',
      verification_status: 'pending',
      request_details: '',
      data_categories: '',
      legal_basis_for_refusal: '',
      processing_systems: '',
      response_method: 'email',
      acknowledgment_sent_date: '',
      response_due_date: '',
      response_sent_date: '',
      status: 'received',
      outcome: '',
      notes: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      received: { variant: 'outline' as const, text: 'Received' },
      under_review: { variant: 'default' as const, text: 'Under Review' },
      information_requested: { variant: 'secondary' as const, text: 'Info Requested' },
      processing: { variant: 'default' as const, text: 'Processing' },
      completed: { variant: 'secondary' as const, text: 'Completed' },
      rejected: { variant: 'destructive' as const, text: 'Rejected' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.received;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="text-center p-8">Loading DSRs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Subject Requests</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New DSR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDSR ? 'Edit DSR' : 'Record New DSR'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="request_type">Request Type *</Label>
                  <Select value={formData.request_type} onValueChange={(value) => setFormData({ ...formData, request_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="access">Right of Access</SelectItem>
                      <SelectItem value="rectification">Right to Rectification</SelectItem>
                      <SelectItem value="erasure">Right to Erasure</SelectItem>
                      <SelectItem value="restriction">Right to Restriction</SelectItem>
                      <SelectItem value="portability">Right to Data Portability</SelectItem>
                      <SelectItem value="objection">Right to Object</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="verification_status">Verification Status</Label>
                  <Select value={formData.verification_status} onValueChange={(value) => setFormData({ ...formData, verification_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_subject_name">Data Subject Name *</Label>
                  <Input
                    id="data_subject_name"
                    value={formData.data_subject_name}
                    onChange={(e) => setFormData({ ...formData, data_subject_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_subject_email">Data Subject Email *</Label>
                  <Input
                    id="data_subject_email"
                    type="email"
                    value={formData.data_subject_email}
                    onChange={(e) => setFormData({ ...formData, data_subject_email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="request_details">Request Details</Label>
                <Textarea
                  id="request_details"
                  value={formData.request_details}
                  onChange={(e) => setFormData({ ...formData, request_details: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="data_categories">Data Categories (comma-separated)</Label>
                <Input
                  id="data_categories"
                  value={formData.data_categories}
                  onChange={(e) => setFormData({ ...formData, data_categories: e.target.value })}
                  placeholder="e.g., personal identifiers, risk scores, scan results"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="information_requested">Information Requested</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="response_due_date">Response Due Date</Label>
                  <Input
                    id="response_due_date"
                    type="date"
                    value={formData.response_due_date}
                    onChange={(e) => setFormData({ ...formData, response_due_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDSR ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Data Subject Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {dsrs.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No DSRs yet</h3>
              <p className="text-gray-500 mb-4">
                Data subject requests will appear here when received.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dsrs.map((dsr) => (
                <div key={dsr.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold">{dsr.data_subject_name}</h3>
                        <p className="text-sm text-gray-600">{dsr.data_subject_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dsr.response_due_date && isOverdue(dsr.response_due_date) && dsr.status !== 'completed' && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {getStatusBadge(dsr.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Request Type:</span>
                      <div className="font-medium capitalize">{dsr.request_type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Received:</span>
                      <div className="font-medium">
                        {new Date(dsr.request_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className={`font-medium ${dsr.response_due_date && isOverdue(dsr.response_due_date) && dsr.status !== 'completed' ? 'text-red-600' : ''}`}>
                        {dsr.response_due_date ? new Date(dsr.response_due_date).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Verification:</span>
                      <div className="font-medium capitalize">{dsr.verification_status}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(dsr)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {dsr.response_due_date && isOverdue(dsr.response_due_date) && dsr.status !== 'completed' && (
                      <Badge variant="destructive" className="ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Overdue
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

export default DSRManagement;
