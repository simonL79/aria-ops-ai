
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Zap, AlertTriangle, FileText, Upload } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface StrikeUrl {
  id: string;
  url: string;
  platform: string;
  strike_type: 'dmca' | 'gdpr' | 'platform_flag' | 'deindex' | 'legal_escalation';
}

const StrikeRequestInterface = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState<StrikeUrl[]>([]);
  const [reason, setReason] = useState('');
  const [evidencePdf, setEvidencePdf] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addUrl = () => {
    const newUrl: StrikeUrl = {
      id: Math.random().toString(36).substr(2, 9),
      url: '',
      platform: '',
      strike_type: 'platform_flag'
    };
    setUrls([...urls, newUrl]);
  };

  const removeUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const updateUrl = (id: string, field: keyof StrikeUrl, value: string) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, [field]: value } : url
    ));
  };

  const detectPlatform = (urlString: string): string => {
    try {
      const url = new URL(urlString);
      const domain = url.hostname.toLowerCase();
      
      if (domain.includes('twitter.com') || domain.includes('x.com')) return 'Twitter/X';
      if (domain.includes('facebook.com')) return 'Facebook';
      if (domain.includes('instagram.com')) return 'Instagram';
      if (domain.includes('linkedin.com')) return 'LinkedIn';
      if (domain.includes('reddit.com')) return 'Reddit';
      if (domain.includes('youtube.com')) return 'YouTube';
      if (domain.includes('tiktok.com')) return 'TikTok';
      if (domain.includes('google.com')) return 'Google Search';
      
      return url.hostname;
    } catch {
      return '';
    }
  };

  const submitBatchStrike = async () => {
    if (!user) {
      toast.error('Please log in to submit strike requests');
      return;
    }

    if (urls.length === 0) {
      toast.error('Please add at least one URL');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for the strike');
      return;
    }

    const incompleteUrls = urls.filter(url => !url.url.trim() || !url.platform.trim());
    if (incompleteUrls.length > 0) {
      toast.error('Please complete all URL entries');
      return;
    }

    setIsSubmitting(true);

    try {
      const batchId = crypto.randomUUID();
      
      // Prepare strike requests
      const strikeRequests = urls.map(url => ({
        batch_id: batchId,
        url: url.url.trim(),
        platform: url.platform,
        reason: reason.trim(),
        strike_type: url.strike_type,
        requested_by: user.id,
        evidence_pdf: evidencePdf || null
      }));

      // Submit all requests
      const { data, error } = await supabase
        .from('strike_requests')
        .insert(strikeRequests)
        .select();

      if (error) {
        throw error;
      }

      // Clear form
      setUrls([]);
      setReason('');
      setEvidencePdf('');

      toast.success(
        `✅ Batch strike request submitted successfully!\n` +
        `${data.length} URLs queued for admin review.\n` +
        `Batch ID: ${batchId.slice(0, 8)}...`
      );

      console.log('🎯 Strike batch submitted:', {
        batch_id: batchId,
        count: data.length,
        requests: data
      });

    } catch (error) {
      console.error('❌ Strike submission failed:', error);
      toast.error('Failed to submit strike requests: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrikeTypeColor = (type: string) => {
    switch (type) {
      case 'dmca': return 'bg-red-100 text-red-800';
      case 'gdpr': return 'bg-blue-100 text-blue-800';
      case 'platform_flag': return 'bg-orange-100 text-orange-800';
      case 'deindex': return 'bg-purple-100 text-purple-800';
      case 'legal_escalation': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrikeTypeIcon = (type: string) => {
    switch (type) {
      case 'dmca': return '📋';
      case 'gdpr': return '🛡️';
      case 'platform_flag': return '🚩';
      case 'deindex': return '🔍';
      case 'legal_escalation': return '⚖️';
      default: return '🎯';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Zap className="h-5 w-5" />
          A.R.I.A/EX™ Batch Strike Request
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit multiple URLs for coordinated strike action. All requests require admin approval.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Entry Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Target URLs</h3>
            <Button onClick={addUrl} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>

          {urls.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No URLs added yet</p>
              <Button onClick={addUrl} variant="outline" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add First URL
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {urls.map((urlEntry, index) => (
                <div key={urlEntry.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      URL #{index + 1}
                    </span>
                    <Button
                      onClick={() => removeUrl(urlEntry.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">URL</label>
                      <Input
                        placeholder="https://example.com/problematic-content"
                        value={urlEntry.url}
                        onChange={(e) => {
                          updateUrl(urlEntry.id, 'url', e.target.value);
                          // Auto-detect platform
                          const platform = detectPlatform(e.target.value);
                          if (platform) {
                            updateUrl(urlEntry.id, 'platform', platform);
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Platform</label>
                      <Input
                        placeholder="Auto-detected from URL"
                        value={urlEntry.platform}
                        onChange={(e) => updateUrl(urlEntry.id, 'platform', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Strike Type</label>
                    <Select
                      value={urlEntry.strike_type}
                      onValueChange={(value) => updateUrl(urlEntry.id, 'strike_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platform_flag">
                          <div className="flex items-center gap-2">
                            <span>🚩</span>
                            Platform Flag - Report to platform moderators
                          </div>
                        </SelectItem>
                        <SelectItem value="dmca">
                          <div className="flex items-center gap-2">
                            <span>📋</span>
                            DMCA Takedown - Copyright infringement
                          </div>
                        </SelectItem>
                        <SelectItem value="gdpr">
                          <div className="flex items-center gap-2">
                            <span>🛡️</span>
                            GDPR Erasure - Right to be forgotten
                          </div>
                        </SelectItem>
                        <SelectItem value="deindex">
                          <div className="flex items-center gap-2">
                            <span>🔍</span>
                            Search Deindex - Remove from search results
                          </div>
                        </SelectItem>
                        <SelectItem value="legal_escalation">
                          <div className="flex items-center gap-2">
                            <span>⚖️</span>
                            Legal Escalation - Formal legal action
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Badge className={getStrikeTypeColor(urlEntry.strike_type)}>
                    {getStrikeTypeIcon(urlEntry.strike_type)} {urlEntry.strike_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Reason Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Reason for Strike Action *
          </label>
          <Textarea
            placeholder="Describe why these URLs should be struck (defamation, harassment, privacy violation, etc.)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Evidence Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Evidence PDF URL (Optional)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="https://evidence-storage.com/document.pdf"
              value={evidencePdf}
              onChange={(e) => setEvidencePdf(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <Separator />

        {/* Summary */}
        {urls.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Batch Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total URLs:</span>
                <span className="ml-2 font-medium">{urls.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Strike Types:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(new Set(urls.map(u => u.strike_type))).map(type => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {getStrikeTypeIcon(type)} {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={submitBatchStrike}
          disabled={isSubmitting || urls.length === 0 || !reason.trim()}
          className="w-full bg-red-600 hover:bg-red-700"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting Batch Strike...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Submit Batch Strike Request ({urls.length} URLs)
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          <FileText className="h-3 w-3 inline mr-1" />
          All strike requests require admin approval before execution
        </div>
      </CardContent>
    </Card>
  );
};

export default StrikeRequestInterface;
