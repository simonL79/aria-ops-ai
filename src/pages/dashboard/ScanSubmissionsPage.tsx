
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowDownUp,
  Calendar,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  UserCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ScanSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  keywords: string;
  created_at: string;
  status: 'new' | 'in_review' | 'complete' | 'archived';
  admin_notes: string | null;
}

const StatusBadge = ({ status }: { status: ScanSubmission['status'] }) => {
  switch (status) {
    case 'new':
      return <Badge variant="default">New</Badge>;
    case 'in_review':
      return <Badge variant="secondary">In Review</Badge>;
    case 'complete':
      return <Badge className="bg-green-500 text-white">Complete</Badge>;
    case 'archived':
      return <Badge variant="outline">Archived</Badge>;
    default:
      return null;
  }
};

const ScanSubmissionsPage = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<ScanSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ScanSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ScanSubmission['status']>('new');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reputation_scan_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data as ScanSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/auth');
      return;
    }

    fetchSubmissions();
  }, [isAuthenticated, isAdmin, navigate]);

  const handleViewSubmission = (submission: ScanSubmission) => {
    setSelectedSubmission(submission);
    setNotes(submission.admin_notes || '');
    setStatus(submission.status);
    setDetailsOpen(true);
  };

  const handleUpdateSubmission = async () => {
    if (!selectedSubmission) return;

    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('reputation_scan_submissions')
        .update({
          status,
          admin_notes: notes,
        })
        .eq('id', selectedSubmission.id);

      if (error) {
        throw error;
      }

      toast.success('Submission updated successfully');
      setDetailsOpen(false);
      
      // Update local state to reflect changes without refetching
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, status, admin_notes: notes } 
            : sub
        )
      );
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reputation Scan Submissions</CardTitle>
              <CardDescription>
                View and manage reputation scan requests from potential clients
              </CardDescription>
            </div>
            <Button onClick={fetchSubmissions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowDownUp className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No submissions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(submission.created_at), 'MMM d, yyyy')}</span>
                            </div>
                          </TableCell>
                          <TableCell>{submission.full_name}</TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>
                            <StatusBadge status={submission.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSubmission && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Name</h3>
                  <p>{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p>{selectedSubmission.email}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p>{selectedSubmission.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Submitted</h3>
                  <p>{format(new Date(selectedSubmission.created_at), 'PPP')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Keywords</h3>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {selectedSubmission.keywords}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="font-medium block">
                    Status
                  </label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="notes" className="font-medium block">
                    Admin Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes about this submission here..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSubmission} disabled={updatingStatus}>
                {updatingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Update
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default ScanSubmissionsPage;
