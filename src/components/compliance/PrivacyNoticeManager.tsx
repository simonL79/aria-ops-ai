
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
import { Plus, FileText, Edit, Eye, CheckCircle } from 'lucide-react';

interface PrivacyNotice {
  id: string;
  notice_type: string;
  version: string;
  title: string;
  content: string;
  effective_date: string;
  expiry_date: string;
  target_audience: string;
  language: string;
  jurisdiction: string;
  contact_details: any;
  data_controller_details: any;
  dpo_contact: any;
  is_active: boolean;
  created_by: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
}

const PrivacyNoticeManager = () => {
  const [notices, setNotices] = useState<PrivacyNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<PrivacyNotice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<PrivacyNotice | null>(null);
  const [formData, setFormData] = useState({
    notice_type: '',
    version: '',
    title: '',
    content: '',
    effective_date: '',
    expiry_date: '',
    target_audience: '',
    language: 'en',
    jurisdiction: 'UK',
    contact_email: '',
    contact_phone: '',
    controller_name: '',
    controller_address: '',
    dpo_name: '',
    dpo_email: ''
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching privacy notices:', error);
      toast.error('Failed to fetch privacy notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const noticeData = {
        notice_type: formData.notice_type,
        version: formData.version,
        title: formData.title,
        content: formData.content,
        effective_date: formData.effective_date,
        expiry_date: formData.expiry_date || null,
        target_audience: formData.target_audience,
        language: formData.language,
        jurisdiction: formData.jurisdiction,
        contact_details: {
          email: formData.contact_email,
          phone: formData.contact_phone
        },
        data_controller_details: {
          name: formData.controller_name,
          address: formData.controller_address
        },
        dpo_contact: {
          name: formData.dpo_name,
          email: formData.dpo_email
        },
        is_active: true
      };

      if (editingNotice) {
        const { error } = await supabase
          .from('privacy_notices')
          .update(noticeData)
          .eq('id', editingNotice.id);
        
        if (error) throw error;
        toast.success('Privacy notice updated successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'privacy_notice_updated',
          p_description: `Privacy notice updated: ${formData.title}`,
          p_legal_basis: 'Legal Obligation'
        });
      } else {
        const { error } = await supabase
          .from('privacy_notices')
          .insert([noticeData]);
        
        if (error) throw error;
        toast.success('Privacy notice created successfully');

        await supabase.rpc('log_compliance_activity', {
          p_activity_type: 'privacy_notice_created',
          p_description: `New privacy notice created: ${formData.title}`,
          p_legal_basis: 'Legal Obligation'
        });
      }
      
      setDialogOpen(false);
      setEditingNotice(null);
      resetForm();
      fetchNotices();
    } catch (error) {
      console.error('Error saving privacy notice:', error);
      toast.error('Failed to save privacy notice');
    }
  };

  const handleEdit = (notice: PrivacyNotice) => {
    setEditingNotice(notice);
    setFormData({
      notice_type: notice.notice_type,
      version: notice.version,
      title: notice.title,
      content: notice.content,
      effective_date: notice.effective_date,
      expiry_date: notice.expiry_date || '',
      target_audience: notice.target_audience,
      language: notice.language,
      jurisdiction: notice.jurisdiction,
      contact_email: notice.contact_details?.email || '',
      contact_phone: notice.contact_details?.phone || '',
      controller_name: notice.data_controller_details?.name || '',
      controller_address: notice.data_controller_details?.address || '',
      dpo_name: notice.dpo_contact?.name || '',
      dpo_email: notice.dpo_contact?.email || ''
    });
    setDialogOpen(true);
  };

  const handleView = (notice: PrivacyNotice) => {
    setViewingNotice(notice);
    setViewDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNotice(null);
    setFormData({
      notice_type: '',
      version: '',
      title: '',
      content: '',
      effective_date: '',
      expiry_date: '',
      target_audience: '',
      language: 'en',
      jurisdiction: 'UK',
      contact_email: '',
      contact_phone: '',
      controller_name: '',
      controller_address: '',
      dpo_name: '',
      dpo_email: ''
    });
  };

  if (loading) {
    return <div className="text-center p-8">Loading privacy notices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Privacy Notice Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Privacy Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? 'Edit Privacy Notice' : 'Create New Privacy Notice'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notice_type">Notice Type *</Label>
                  <Input
                    id="notice_type"
                    value={formData.notice_type}
                    onChange={(e) => setFormData({ ...formData, notice_type: e.target.value })}
                    placeholder="e.g., Employee Risk Scanner"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., 1.0"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  placeholder="Privacy notice content..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effective_date">Effective Date *</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="target_audience">Target Audience *</Label>
                <Input
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="e.g., Employees of client organizations"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="controller_name">Data Controller Name *</Label>
                  <Input
                    id="controller_name"
                    value={formData.controller_name}
                    onChange={(e) => setFormData({ ...formData, controller_name: e.target.value })}
                    placeholder="e.g., A.R.I.A Operations Ltd"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dpo_email">DPO Email *</Label>
                  <Input
                    id="dpo_email"
                    type="email"
                    value={formData.dpo_email}
                    onChange={(e) => setFormData({ ...formData, dpo_email: e.target.value })}
                    placeholder="dpo@ariaops.co.uk"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNotice ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Privacy Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No privacy notices</h3>
              <p className="text-gray-500 mb-4">
                Create privacy notices to inform data subjects about processing activities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold">{notice.title}</h3>
                        <p className="text-sm text-gray-600">{notice.notice_type} v{notice.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {notice.is_active && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <Badge variant={notice.is_active ? 'secondary' : 'outline'}>
                        {notice.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Target Audience:</span>
                      <div className="font-medium">{notice.target_audience}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Effective Date:</span>
                      <div className="font-medium">
                        {new Date(notice.effective_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Language:</span>
                      <div className="font-medium uppercase">{notice.language}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Jurisdiction:</span>
                      <div className="font-medium">{notice.jurisdiction}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(notice)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(notice)}>
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

      {/* View Privacy Notice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingNotice?.title}</DialogTitle>
          </DialogHeader>
          {viewingNotice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Notice Type:</span> {viewingNotice.notice_type}
                </div>
                <div>
                  <span className="font-medium">Version:</span> {viewingNotice.version}
                </div>
                <div>
                  <span className="font-medium">Target Audience:</span> {viewingNotice.target_audience}
                </div>
                <div>
                  <span className="font-medium">Effective Date:</span> {new Date(viewingNotice.effective_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Privacy Notice Content</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {viewingNotice.content}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Data Controller</h4>
                  <p>{viewingNotice.data_controller_details?.name}</p>
                  <p>{viewingNotice.data_controller_details?.address}</p>
                </div>
                <div>
                  <h4 className="font-medium">Data Protection Officer</h4>
                  <p>{viewingNotice.dpo_contact?.name}</p>
                  <p>{viewingNotice.dpo_contact?.email}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivacyNoticeManager;
