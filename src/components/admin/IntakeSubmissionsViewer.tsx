
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Eye, RefreshCw, Users, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IntakeSubmission {
  id: string;
  full_name: string;
  email: string;
  brand_or_alias: string;
  focus_scope: string;
  operational_mode: string;
  status: string;
  created_at: string;
  known_aliases: string[];
  topics_to_flag: string[];
  prior_attacks: boolean;
  problematic_platforms: string[];
  consent_to_process: boolean;
  gdpr_agreed_at: string;
}

const IntakeSubmissionsViewer: React.FC = () => {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_intake_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load intake submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">New</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Completed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Intake Submissions</h2>
          <p className="text-corporate-lightGray">Review and process client onboarding submissions</p>
        </div>
        <Button onClick={loadSubmissions} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">Total Submissions</p>
                <p className="text-2xl font-bold text-white">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">Pending Processing</p>
                <p className="text-2xl font-bold text-white">
                  {submissions.filter(s => s.status === 'new').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {submissions.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-corporate-accent" />
              <p className="text-corporate-lightGray mt-2">Loading submissions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-corporate-lightGray">Name/Brand</TableHead>
                  <TableHead className="text-corporate-lightGray">Email</TableHead>
                  <TableHead className="text-corporate-lightGray">Focus</TableHead>
                  <TableHead className="text-corporate-lightGray">Mode</TableHead>
                  <TableHead className="text-corporate-lightGray">Status</TableHead>
                  <TableHead className="text-corporate-lightGray">Submitted</TableHead>
                  <TableHead className="text-corporate-lightGray">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="text-white">
                      <div>
                        <p className="font-medium">{submission.full_name}</p>
                        {submission.brand_or_alias && (
                          <p className="text-sm text-corporate-lightGray">{submission.brand_or_alias}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-corporate-lightGray">{submission.email}</TableCell>
                    <TableCell className="text-corporate-lightGray capitalize">{submission.focus_scope}</TableCell>
                    <TableCell className="text-corporate-lightGray capitalize">{submission.operational_mode}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-corporate-lightGray">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-corporate-darkSecondary border-corporate-border">
                          <DialogHeader>
                            <DialogTitle className="text-white">Submission Details</DialogTitle>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-6 text-white">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Identity</h4>
                                  <p><strong>Name:</strong> {selectedSubmission.full_name}</p>
                                  <p><strong>Email:</strong> {selectedSubmission.email}</p>
                                  {selectedSubmission.brand_or_alias && (
                                    <p><strong>Brand:</strong> {selectedSubmission.brand_or_alias}</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Configuration</h4>
                                  <p><strong>Focus:</strong> {selectedSubmission.focus_scope}</p>
                                  <p><strong>Mode:</strong> {selectedSubmission.operational_mode}</p>
                                  <p><strong>Prior Attacks:</strong> {selectedSubmission.prior_attacks ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                              
                              {selectedSubmission.known_aliases?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Known Aliases</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedSubmission.known_aliases.map((alias, i) => (
                                      <Badge key={i} variant="secondary">{alias}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedSubmission.topics_to_flag?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Topics to Flag</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedSubmission.topics_to_flag.map((topic, i) => (
                                      <Badge key={i} variant="outline">{topic}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedSubmission.problematic_platforms?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Problematic Platforms</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedSubmission.problematic_platforms.map((platform, i) => (
                                      <Badge key={i} className="bg-red-500/20 text-red-400 border-red-500/50">{platform}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2">Compliance</h4>
                                <p><strong>GDPR Consent:</strong> {selectedSubmission.consent_to_process ? 'Given' : 'Not given'}</p>
                                {selectedSubmission.gdpr_agreed_at && (
                                  <p><strong>Consent Date:</strong> {new Date(selectedSubmission.gdpr_agreed_at).toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntakeSubmissionsViewer;
