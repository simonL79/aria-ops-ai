
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Scale, Edit, Eye } from 'lucide-react';

interface LIA {
  id: string;
  purpose_description: string;
  legitimate_interest: string;
  necessity_test: string;
  balancing_test: string;
  data_subject_impact: string;
  mitigation_measures: string;
  data_types: string[];
  processing_methods: string;
  data_sources: string[];
  retention_justification: string;
  opt_out_mechanism: string;
  assessment_outcome: string;
  assessment_date: string;
  review_date: string;
  assessor_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const LIAManagement = () => {
  const [lias, setLias] = useState<LIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingLIA, setEditingLIA] = useState<LIA | null>(null);
  const [viewingLIA, setViewingLIA] = useState<LIA | null>(null);
  const [formData, setFormData] = useState({
    purpose_description: '',
    legitimate_interest: '',
    necessity_test: '',
    balancing_test: '',
    data_subject_impact: '',
    mitigation_measures: '',
    data_types: '',
    processing_methods: '',
    data_sources: '',
    retention_justification: '',
    opt_out_mechanism: '',
    assessment_outcome: '',
    assessment_date: '',
    review_date: '',
    assessor_name: ''
  });

  useEffect(() => {
    fetchLIAs();
  }, []);

  const fetchLIAs = async () => {
    try {
      const { data, error } = await supabase
        .from('lia_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLias(data || []);
    } catch (error) {
      console.error('Error fetching LIAs:', error);
      toast.error('Failed to fetch LIAs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const liaData = {
        ...formData,
        data_types: formData.data_types.split(',').map(s => s.trim()),
        data_sources: formData.data_sources.split(',').map(s => s.trim())
      };

      if (editingLIA) {
        const { error } = await supabase
          .from('lia_records')
          .update(liaData)
          .eq('id', editingLIA.id);
        
        if (error) throw error;
        toast.success('LIA updated successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'lia_updated',
          p_description: `LIA updated: ${formData.purpose_description}`,
          p_legal_basis: 'Legal Obligation'
        });
      } else {
        const { error } = await supabase
          .from('lia_records')
          .insert([liaData]);
        
        if (error) throw error;
        toast.success('LIA created successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'lia_created',
          p_description: `New LIA created: ${formData.purpose_description}`,
          p_legal_basis: 'Legal Obligation'
        });
      }
      
      setDialogOpen(false);
      setEditingLIA(null);
      resetForm();
      fetchLIAs();
    } catch (error) {
      console.error('Error saving LIA:', error);
      toast.error('Failed to save LIA');
    }
  };

  const handleEdit = (lia: LIA) => {
    setEditingLIA(lia);
    setFormData({
      purpose_description: lia.purpose_description,
      legitimate_interest: lia.legitimate_interest,
      necessity_test: lia.necessity_test,
      balancing_test: lia.balancing_test,
      data_subject_impact: lia.data_subject_impact,
      mitigation_measures: lia.mitigation_measures,
      data_types: lia.data_types.join(', '),
      processing_methods: lia.processing_methods,
      data_sources: lia.data_sources.join(', '),
      retention_justification: lia.retention_justification,
      opt_out_mechanism: lia.opt_out_mechanism,
      assessment_outcome: lia.assessment_outcome,
      assessment_date: lia.assessment_date,
      review_date: lia.review_date || '',
      assessor_name: lia.assessor_name
    });
    setDialogOpen(true);
  };

  const handleView = (lia: LIA) => {
    setViewingLIA(lia);
    setViewDialogOpen(true);
  };

  const resetForm = () => {
    setEditingLIA(null);
    setFormData({
      purpose_description: '',
      legitimate_interest: '',
      necessity_test: '',
      balancing_test: '',
      data_subject_impact: '',
      mitigation_measures: '',
      data_types: '',
      processing_methods: '',
      data_sources: '',
      retention_justification: '',
      opt_out_mechanism: '',
      assessment_outcome: '',
      assessment_date: '',
      review_date: '',
      assessor_name: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { variant: 'outline' as const, text: 'Draft' },
      under_review: { variant: 'default' as const, text: 'Under Review' },
      approved: { variant: 'secondary' as const, text: 'Approved' },
      rejected: { variant: 'destructive' as const, text: 'Rejected' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) {
    return <div className="text-center p-8">Loading LIAs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Legitimate Interest Assessments</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New LIA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLIA ? 'Edit LIA' : 'Create New LIA'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="purpose_description">Purpose Description *</Label>
                <Textarea
                  id="purpose_description"
                  value={formData.purpose_description}
                  onChange={(e) => setFormData({ ...formData, purpose_description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="legitimate_interest">Legitimate Interest *</Label>
                <Textarea
                  id="legitimate_interest"
                  value={formData.legitimate_interest}
                  onChange={(e) => setFormData({ ...formData, legitimate_interest: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="necessity_test">Necessity Test *</Label>
                <Textarea
                  id="necessity_test"
                  value={formData.necessity_test}
                  onChange={(e) => setFormData({ ...formData, necessity_test: e.target.value })}
                  placeholder="Explain why this processing is necessary for your legitimate interest"
                  required
                />
              </div>

              <div>
                <Label htmlFor="balancing_test">Balancing Test *</Label>
                <Textarea
                  id="balancing_test"
                  value={formData.balancing_test}
                  onChange={(e) => setFormData({ ...formData, balancing_test: e.target.value })}
                  placeholder="Balance your interests against the individual's rights and freedoms"
                  required
                />
              </div>

              <div>
                <Label htmlFor="data_subject_impact">Data Subject Impact *</Label>
                <Textarea
                  id="data_subject_impact"
                  value={formData.data_subject_impact}
                  onChange={(e) => setFormData({ ...formData, data_subject_impact: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="mitigation_measures">Mitigation Measures *</Label>
                <Textarea
                  id="mitigation_measures"
                  value={formData.mitigation_measures}
                  onChange={(e) => setFormData({ ...formData, mitigation_measures: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="opt_out_mechanism">Opt-out Mechanism *</Label>
                <Textarea
                  id="opt_out_mechanism"
                  value={formData.opt_out_mechanism}
                  onChange={(e) => setFormData({ ...formData, opt_out_mechanism: e.target.value })}
                  placeholder="How can individuals object to this processing?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="assessment_outcome">Assessment Outcome *</Label>
                <Textarea
                  id="assessment_outcome"
                  value={formData.assessment_outcome}
                  onChange={(e) => setFormData({ ...formData, assessment_outcome: e.target.value })}
                  required
                />
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
                  <Label htmlFor="assessor_name">Assessor Name *</Label>
                  <Input
                    id="assessor_name"
                    value={formData.assessor_name}
                    onChange={(e) => setFormData({ ...formData, assessor_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLIA ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All LIAs</CardTitle>
        </CardHeader>
        <CardContent>
          {lias.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No LIAs yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first Legitimate Interest Assessment for employee risk scanning.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lias.map((lia) => (
                <div key={lia.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{lia.purpose_description.substring(0, 100)}...</h3>
                      <p className="text-sm text-gray-600">Assessor: {lia.assessor_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(lia.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Assessment Date:</span>
                      <div className="font-medium">
                        {new Date(lia.assessment_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Data Types:</span>
                      <div className="font-medium">{lia.data_types.length} categories</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Data Sources:</span>
                      <div className="font-medium">{lia.data_sources.length} sources</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(lia)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(lia)}>
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

      {/* View LIA Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>LIA Details</DialogTitle>
          </DialogHeader>
          {viewingLIA && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Purpose Description</h4>
                <p className="text-sm text-gray-600">{viewingLIA.purpose_description}</p>
              </div>
              <div>
                <h4 className="font-medium">Legitimate Interest</h4>
                <p className="text-sm text-gray-600">{viewingLIA.legitimate_interest}</p>
              </div>
              <div>
                <h4 className="font-medium">Necessity Test</h4>
                <p className="text-sm text-gray-600">{viewingLIA.necessity_test}</p>
              </div>
              <div>
                <h4 className="font-medium">Balancing Test</h4>
                <p className="text-sm text-gray-600">{viewingLIA.balancing_test}</p>
              </div>
              <div>
                <h4 className="font-medium">Assessment Outcome</h4>
                <p className="text-sm text-gray-600">{viewingLIA.assessment_outcome}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LIAManagement;
