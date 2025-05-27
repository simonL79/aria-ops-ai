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
import { Plus, FileText, Edit, Eye, Calendar } from 'lucide-react';

interface DPIA {
  id: string;
  assessment_title: string;
  processing_purpose: string;
  data_types: string[];
  legal_basis: string;
  necessity_justification: string;
  proportionality_assessment: string;
  identified_risks: any; // Changed from any[] to any to match database Json type
  mitigation_measures: any; // Changed from any[] to any to match database Json type
  data_retention_period: string;
  data_minimization_measures: string;
  security_measures: string;
  automated_decision_making: boolean;
  profiling_activities: boolean;
  assessment_date: string;
  review_date: string;
  assessor_name: string;
  assessor_role: string;
  status: string;
  approval_date: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
}

const DPIAManagement = () => {
  const [dpias, setDpias] = useState<DPIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingDPIA, setEditingDPIA] = useState<DPIA | null>(null);
  const [viewingDPIA, setViewingDPIA] = useState<DPIA | null>(null);
  const [formData, setFormData] = useState({
    assessment_title: '',
    processing_purpose: '',
    data_types: '',
    legal_basis: '',
    necessity_justification: '',
    proportionality_assessment: '',
    data_retention_period: '',
    data_minimization_measures: '',
    security_measures: '',
    automated_decision_making: false,
    profiling_activities: false,
    assessment_date: '',
    review_date: '',
    assessor_name: '',
    assessor_role: ''
  });

  useEffect(() => {
    fetchDPIAs();
  }, []);

  const fetchDPIAs = async () => {
    try {
      const { data, error } = await supabase
        .from('dpia_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Transform the data to ensure arrays are properly handled
      const transformedData = data?.map(item => ({
        ...item,
        identified_risks: Array.isArray(item.identified_risks) ? item.identified_risks : [],
        mitigation_measures: Array.isArray(item.mitigation_measures) ? item.mitigation_measures : []
      })) || [];
      setDpias(transformedData);
    } catch (error) {
      console.error('Error fetching DPIAs:', error);
      toast.error('Failed to fetch DPIAs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dpiaData = {
        ...formData,
        data_types: formData.data_types.split(',').map(s => s.trim()),
        data_retention_period: formData.data_retention_period ? `${formData.data_retention_period} years` : null,
        identified_risks: [],
        mitigation_measures: []
      };

      if (editingDPIA) {
        const { error } = await supabase
          .from('dpia_records')
          .update(dpiaData)
          .eq('id', editingDPIA.id);
        
        if (error) throw error;
        toast.success('DPIA updated successfully');

        // Log the activity
        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'dpia_updated',
          p_description: `DPIA updated: ${formData.assessment_title}`,
          p_legal_basis: 'Legal Obligation'
        });
      } else {
        const { error } = await supabase
          .from('dpia_records')
          .insert([dpiaData]);
        
        if (error) throw error;
        toast.success('DPIA created successfully');

        // Log the activity
        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'dpia_created',
          p_description: `New DPIA created: ${formData.assessment_title}`,
          p_legal_basis: 'Legal Obligation'
        });
      }
      
      setDialogOpen(false);
      setEditingDPIA(null);
      resetForm();
      fetchDPIAs();
    } catch (error) {
      console.error('Error saving DPIA:', error);
      toast.error('Failed to save DPIA');
    }
  };

  const handleEdit = (dpia: DPIA) => {
    setEditingDPIA(dpia);
    setFormData({
      assessment_title: dpia.assessment_title,
      processing_purpose: dpia.processing_purpose,
      data_types: dpia.data_types.join(', '),
      legal_basis: dpia.legal_basis,
      necessity_justification: dpia.necessity_justification,
      proportionality_assessment: dpia.proportionality_assessment,
      data_retention_period: dpia.data_retention_period || '',
      data_minimization_measures: dpia.data_minimization_measures || '',
      security_measures: dpia.security_measures || '',
      automated_decision_making: dpia.automated_decision_making,
      profiling_activities: dpia.profiling_activities,
      assessment_date: dpia.assessment_date,
      review_date: dpia.review_date || '',
      assessor_name: dpia.assessor_name,
      assessor_role: dpia.assessor_role
    });
    setDialogOpen(true);
  };

  const handleView = (dpia: DPIA) => {
    setViewingDPIA(dpia);
    setViewDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDPIA(null);
    setFormData({
      assessment_title: '',
      processing_purpose: '',
      data_types: '',
      legal_basis: '',
      necessity_justification: '',
      proportionality_assessment: '',
      data_retention_period: '',
      data_minimization_measures: '',
      security_measures: '',
      automated_decision_making: false,
      profiling_activities: false,
      assessment_date: '',
      review_date: '',
      assessor_name: '',
      assessor_role: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { variant: 'outline' as const, text: 'Draft' },
      under_review: { variant: 'default' as const, text: 'Under Review' },
      approved: { variant: 'secondary' as const, text: 'Approved' },
      requires_update: { variant: 'destructive' as const, text: 'Requires Update' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) {
    return <div className="text-center p-8">Loading DPIAs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Protection Impact Assessments</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New DPIA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDPIA ? 'Edit DPIA' : 'Create New DPIA'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assessment_title">Assessment Title *</Label>
                  <Input
                    id="assessment_title"
                    value={formData.assessment_title}
                    onChange={(e) => setFormData({ ...formData, assessment_title: e.target.value })}
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
                      <SelectItem value="legitimate_interest">Legitimate Interest</SelectItem>
                      <SelectItem value="consent">Consent</SelectItem>
                      <SelectItem value="legal_obligation">Legal Obligation</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="public_task">Public Task</SelectItem>
                      <SelectItem value="vital_interests">Vital Interests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="processing_purpose">Processing Purpose *</Label>
                <Textarea
                  id="processing_purpose"
                  value={formData.processing_purpose}
                  onChange={(e) => setFormData({ ...formData, processing_purpose: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="data_types">Data Types (comma-separated) *</Label>
                <Input
                  id="data_types"
                  value={formData.data_types}
                  onChange={(e) => setFormData({ ...formData, data_types: e.target.value })}
                  placeholder="e.g., names, email addresses, social media posts"
                  required
                />
              </div>

              <div>
                <Label htmlFor="necessity_justification">Necessity Justification *</Label>
                <Textarea
                  id="necessity_justification"
                  value={formData.necessity_justification}
                  onChange={(e) => setFormData({ ...formData, necessity_justification: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="proportionality_assessment">Proportionality Assessment *</Label>
                <Textarea
                  id="proportionality_assessment"
                  value={formData.proportionality_assessment}
                  onChange={(e) => setFormData({ ...formData, proportionality_assessment: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assessor_name">Assessor Name *</Label>
                  <Input
                    id="assessor_name"
                    value={formData.assessor_name}
                    onChange={(e) => setFormData({ ...formData, assessor_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="assessor_role">Assessor Role *</Label>
                  <Input
                    id="assessor_role"
                    value={formData.assessor_role}
                    onChange={(e) => setFormData({ ...formData, assessor_role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assessment_date">Assessment Date *</Label>
                  <Input
                    id="assessment_date"
                    type="date"
                    value={formData.assessment_date}
                    onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="review_date">Review Date</Label>
                  <Input
                    id="review_date"
                    type="date"
                    value={formData.review_date}
                    onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDPIA ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All DPIAs</CardTitle>
        </CardHeader>
        <CardContent>
          {dpias.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No DPIAs yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first Data Protection Impact Assessment to ensure GDPR compliance.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dpias.map((dpia) => (
                <div key={dpia.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{dpia.assessment_title}</h3>
                      <p className="text-sm text-gray-600">Assessor: {dpia.assessor_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(dpia.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Legal Basis:</span>
                      <div className="font-medium capitalize">{dpia.legal_basis.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Assessment Date:</span>
                      <div className="font-medium">
                        {new Date(dpia.assessment_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Data Types:</span>
                      <div className="font-medium">{dpia.data_types.length} categories</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Review Due:</span>
                      <div className="font-medium">
                        {dpia.review_date ? new Date(dpia.review_date).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(dpia)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(dpia)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View DPIA Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>DPIA Details: {viewingDPIA?.assessment_title}</DialogTitle>
          </DialogHeader>
          {viewingDPIA && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Processing Purpose</h4>
                  <p className="text-sm text-gray-600">{viewingDPIA.processing_purpose}</p>
                </div>
                <div>
                  <h4 className="font-medium">Legal Basis</h4>
                  <p className="text-sm text-gray-600 capitalize">{viewingDPIA.legal_basis.replace('_', ' ')}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Data Types</h4>
                <p className="text-sm text-gray-600">{viewingDPIA.data_types.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium">Necessity Justification</h4>
                <p className="text-sm text-gray-600">{viewingDPIA.necessity_justification}</p>
              </div>
              <div>
                <h4 className="font-medium">Proportionality Assessment</h4>
                <p className="text-sm text-gray-600">{viewingDPIA.proportionality_assessment}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DPIAManagement;
