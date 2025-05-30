
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Calendar, Building, User, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ContactInquiries = () => {
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load contact submissions');
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (submission.company && submission.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  };

  const updateStatus = async (submissionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
        return;
      }

      setSubmissions(prev =>
        prev.map(submission =>
          submission.id === submissionId
            ? { ...submission, status: newStatus }
            : submission
        )
      );

      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'in_progress': return 'bg-yellow-600';
      case 'responded': return 'bg-green-600';
      case 'closed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center">
        <Card className="bg-[#1A1B1E] border-gray-800 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-300">You need admin privileges to view contact inquiries.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading contact inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Inquiries</h1>
          <p className="text-gray-300">Manage and respond to customer inquiries</p>
        </div>

        {/* Filters */}
        <Card className="bg-[#1A1B1E] border-gray-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0A0B0D] border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-[#0A0B0D] border-gray-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#1A1B1E] border-gray-800 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{submissions.length}</div>
              <div className="text-sm text-gray-300">Total Inquiries</div>
            </div>
          </Card>
          <Card className="bg-[#1A1B1E] border-gray-800 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {submissions.filter(s => s.status === 'new').length}
              </div>
              <div className="text-sm text-gray-300">New</div>
            </div>
          </Card>
          <Card className="bg-[#1A1B1E] border-gray-800 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {submissions.filter(s => s.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-300">In Progress</div>
            </div>
          </Card>
          <Card className="bg-[#1A1B1E] border-gray-800 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {submissions.filter(s => s.status === 'responded').length}
              </div>
              <div className="text-sm text-gray-300">Responded</div>
            </div>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-[#1A1B1E] border-gray-800 p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No inquiries found</h3>
              <p className="text-gray-300">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No contact submissions have been received yet.'
                }
              </p>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="bg-[#1A1B1E] border-gray-800 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {submission.first_name} {submission.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {submission.email}
                          </div>
                          {submission.company && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {submission.company}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(submission.status)} text-white`}>
                        {submission.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="bg-[#0A0B0D] border border-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Message:</h4>
                      <p className="text-white whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                  
                  <div className="lg:w-48 space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Update Status:</p>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                      <Button
                        size="sm"
                        variant={submission.status === 'new' ? 'default' : 'outline'}
                        onClick={() => updateStatus(submission.id, 'new')}
                        className="w-full"
                      >
                        New
                      </Button>
                      <Button
                        size="sm"
                        variant={submission.status === 'in_progress' ? 'default' : 'outline'}
                        onClick={() => updateStatus(submission.id, 'in_progress')}
                        className="w-full"
                      >
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant={submission.status === 'responded' ? 'default' : 'outline'}
                        onClick={() => updateStatus(submission.id, 'responded')}
                        className="w-full"
                      >
                        Responded
                      </Button>
                      <Button
                        size="sm"
                        variant={submission.status === 'closed' ? 'default' : 'outline'}
                        onClick={() => updateStatus(submission.id, 'closed')}
                        className="w-full"
                      >
                        Closed
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInquiries;
