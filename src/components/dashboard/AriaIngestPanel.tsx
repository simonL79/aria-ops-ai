
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader, Send, TestTube, CheckCircle, User, Building } from "lucide-react";
import { AriaIngestRequest, AriaIngestResponse, submitToAriaIngest, testAriaIngest } from "@/services/ariaIngestService";

const AriaIngestPanel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [lastResponse, setLastResponse] = useState<AriaIngestResponse | null>(null);
  const [formData, setFormData] = useState<AriaIngestRequest>({
    content: "",
    platform: "twitter",
    url: "",
    severity: "low",
    test: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      // Provide a fallback URL if empty
      const requestData = {
        ...formData,
        url: formData.url.trim() || `https://manual-entry-${formData.platform}.com/${Date.now()}`
      };
      
      console.log('Submitting request:', requestData);
      const response = await submitToAriaIngest(requestData);
      console.log('Received response:', response);
      
      if (response) {
        setLastResponse(response);
        // Clear form on successful submission (but not test)
        if (!formData.test) {
          setFormData({
            content: "",
            platform: "twitter", 
            url: "",
            severity: "low",
            test: false
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      console.log('Running test...');
      const response = await testAriaIngest();
      console.log('Test response:', response);
      if (response) {
        setLastResponse(response);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'PERSON':
        return <User className="h-3 w-3" />;
      case 'ORG':
        return <Building className="h-3 w-3" />;
      default:
        return <span className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  // Debug: Log the response structure
  console.log('Current lastResponse:', lastResponse);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            ARIA Content Ingest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/post (leave empty for manual entries)"
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter the content to analyze for entity extraction..."
                rows={4}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.content.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit to Pipeline
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={handleTest}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Debug card to show raw response */}
      {lastResponse && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm text-blue-700">Debug: Raw Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto">{JSON.stringify(lastResponse, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {/* Enhanced results display with better error handling */}
      {lastResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {lastResponse.test ? 'Test Results' : 'Processing Results'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Check if we have payload or if it's in a different structure */}
            {lastResponse.payload ? (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Platform</Label>
                    <p className="font-medium">{lastResponse.payload.platform || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Severity</Label>
                    <Badge variant={lastResponse.payload.severity === 'high' ? 'destructive' : 'secondary'}>
                      {lastResponse.payload.severity || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Content</Label>
                  <p className="text-sm bg-muted p-2 rounded">{lastResponse.payload.content || 'N/A'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Detected Entities</Label>
                  {lastResponse.payload.detected_entities && lastResponse.payload.detected_entities.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {lastResponse.payload.detected_entities.map((entity, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          {getEntityIcon(entity.type)}
                          {entity.name}
                          <span className="text-xs text-muted-foreground">({entity.type})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No entities detected</p>
                  )}
                </div>

                {lastResponse.payload.risk_entity_name && (
                  <div>
                    <Label className="text-muted-foreground">Primary Risk Entity</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        {getEntityIcon(lastResponse.payload.risk_entity_type || '')}
                        {lastResponse.payload.risk_entity_name}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Confidence</Label>
                    <p className="font-medium">{lastResponse.payload.confidence_score || 0}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="font-medium">{lastResponse.payload.status || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Source Type</Label>
                    <p className="font-medium">{lastResponse.payload.source_type || 'N/A'}</p>
                  </div>
                </div>
              </>
            ) : lastResponse.inserted ? (
              // Handle case where response has 'inserted' data instead of 'payload'
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Platform</Label>
                    <p className="font-medium">{lastResponse.inserted.platform || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Severity</Label>
                    <Badge variant={lastResponse.inserted.severity === 'high' ? 'destructive' : 'secondary'}>
                      {lastResponse.inserted.severity || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Content</Label>
                  <p className="text-sm bg-muted p-2 rounded">{lastResponse.inserted.content || 'N/A'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Detected Entities</Label>
                  {lastResponse.inserted.detected_entities && lastResponse.inserted.detected_entities.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {lastResponse.inserted.detected_entities.map((entity: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          {getEntityIcon(entity.type || 'UNKNOWN')}
                          {entity.name || entity}
                          <span className="text-xs text-muted-foreground">({entity.type || 'UNKNOWN'})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No entities detected</p>
                  )}
                </div>

                {lastResponse.inserted.risk_entity_name && (
                  <div>
                    <Label className="text-muted-foreground">Primary Risk Entity</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        {getEntityIcon(lastResponse.inserted.risk_entity_type || '')}
                        {lastResponse.inserted.risk_entity_name}
                      </Badge>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Response received but no data to display</p>
                <p className="text-xs text-muted-foreground mt-2">Check the debug section above for raw response data</p>
              </div>
            )}

            {lastResponse.message && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">{lastResponse.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AriaIngestPanel;
