
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, FileText, Users, Target } from "lucide-react";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';
import { toast } from 'sonner';

interface OutreachPanelProps {
  threats: DiscoveredThreat[];
}

const OutreachPanel = ({ threats }: OutreachPanelProps) => {
  const [selectedThreat, setSelectedThreat] = useState<string>('');
  const [outreachTemplate, setOutreachTemplate] = useState('evidence_based');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingOutreach, setSendingOutreach] = useState(false);

  const outreachTemplates = {
    evidence_based: {
      subject: "We've detected a risk to your online reputation",
      message: `Dear [CONTACT_NAME],

I hope this email finds you well. I'm reaching out because our AI monitoring system has detected potential reputation risks affecting [ENTITY_NAME] that require immediate attention.

Key findings:
• Threat Level: [THREAT_LEVEL]/10
• Platform: [PLATFORM]
• Potential Reach: [POTENTIAL_REACH] users
• Detection Time: [TIMESTAMP]

We've compiled detailed evidence of this emerging situation and can provide immediate assistance to:
- Assess the full scope of the threat
- Remove or suppress harmful content
- Implement strategic response measures
- Prevent further escalation

I've attached a comprehensive evidence report with all findings and recommended next steps.

Would you be available for a brief call this week to discuss our findings and how we can help protect [ENTITY_NAME]'s reputation?

Best regards,
[YOUR_NAME]
ARIA Intelligence Team`
    },
    urgent_alert: {
      subject: "URGENT: High-priority reputation threat detected for [ENTITY_NAME]",
      message: `URGENT ATTENTION REQUIRED

Our automated monitoring systems have flagged a critical reputation threat affecting [ENTITY_NAME].

Threat Summary:
- Severity: [THREAT_LEVEL]/10 (HIGH PRIORITY)
- Platform: [PLATFORM]
- Content Type: [THREAT_TYPE]
- First Detected: [TIMESTAMP]

This situation requires immediate intervention to prevent further damage.

We can provide:
✓ Complete threat assessment within 2 hours
✓ Emergency response strategy
✓ Content removal/suppression services
✓ 24/7 monitoring and alerting

Please contact me immediately at [PHONE] or reply to this email.

Time is critical.

[YOUR_NAME]
Crisis Response Team`
    },
    soft_approach: {
      subject: "Monitoring insights for [ENTITY_NAME] - Partnership opportunity",
      message: `Dear [CONTACT_NAME],

I hope you're doing well. I wanted to reach out regarding some interesting online activity patterns we've observed related to [ENTITY_NAME].

Our AI-powered reputation monitoring platform recently identified some discussions across [PLATFORM] and other channels that might be of interest to your team.

Rather than just alerting you to potential issues, we'd love to explore how our advanced monitoring capabilities could support [ENTITY_NAME]'s ongoing reputation management efforts.

We specialize in:
- Real-time threat detection across 20+ platforms
- Predictive analysis and early warning systems
- Strategic response planning and execution
- Comprehensive reporting and insights

Would you be interested in a brief demo of what we've found and how our platform could benefit your team?

Looking forward to hearing from you.

Best regards,
[YOUR_NAME]
Partnership Development`
    }
  };

  const generateOutreachEmail = (threat: DiscoveredThreat, templateType: string) => {
    const template = outreachTemplates[templateType as keyof typeof outreachTemplates];
    
    let subject = template.subject
      .replace('[ENTITY_NAME]', threat.entityName)
      .replace('[THREAT_LEVEL]', threat.threatLevel.toString());
    
    let message = template.message
      .replace(/\[ENTITY_NAME\]/g, threat.entityName)
      .replace(/\[THREAT_LEVEL\]/g, threat.threatLevel.toString())
      .replace(/\[PLATFORM\]/g, threat.platform)
      .replace(/\[THREAT_TYPE\]/g, threat.threatType)
      .replace(/\[TIMESTAMP\]/g, new Date(threat.timestamp).toLocaleDateString())
      .replace(/\[POTENTIAL_REACH\]/g, threat.mentionCount.toString());
    
    return { subject, message };
  };

  const sendOutreachEmail = async () => {
    if (!selectedThreat) {
      toast.error("Please select a threat to create outreach for");
      return;
    }

    setSendingOutreach(true);
    
    try {
      const threat = threats.find(t => t.id === selectedThreat);
      if (!threat) return;

      const { subject, message } = generateOutreachEmail(threat, outreachTemplate);
      
      const response = await fetch('/functions/v1/send-outreach-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threat_id: threat.id,
          entity_name: threat.entityName,
          subject: customSubject || subject,
          message: customMessage || message,
          template_type: outreachTemplate
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send outreach email');
      }

      toast.success("Outreach email queued for delivery!");
      
      // Clear form
      setSelectedThreat('');
      setCustomSubject('');
      setCustomMessage('');
      
    } catch (error) {
      console.error('Error sending outreach email:', error);
      toast.error("Failed to send outreach email");
    } finally {
      setSendingOutreach(false);
    }
  };

  const highPriorityThreats = threats.filter(t => t.threatLevel >= 6);

  return (
    <div className="space-y-6">
      {/* Outreach Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Direct Outreach System
          </CardTitle>
          <CardDescription>
            Trust-first client acquisition through evidence-based threat intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Outreach Strategy:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• Find the issue first</div>
              <div>• Deliver comprehensive proof</div>
              <div>• Offer immediate solutions</div>
              <div>• Build trust through expertise</div>
              <div>• Convert crisis into opportunity</div>
              <div>• Establish ongoing partnerships</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outreach Ready</p>
                <p className="text-2xl font-bold">{highPriorityThreats.length}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entities Available</p>
                <p className="text-2xl font-bold">{new Set(highPriorityThreats.map(t => t.entityName)).size}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Evidence Reports</p>
                <p className="text-2xl font-bold">{highPriorityThreats.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outreach Composer */}
      <Card>
        <CardHeader>
          <CardTitle>Compose Outreach Campaign</CardTitle>
          <CardDescription>
            Create evidence-based outreach emails with attached threat reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Threat Selection */}
            <div>
              <Label htmlFor="threat-select">Select Threat to Address</Label>
              <Select value={selectedThreat} onValueChange={setSelectedThreat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a high priority threat..." />
                </SelectTrigger>
                <SelectContent>
                  {highPriorityThreats.map((threat) => (
                    <SelectItem key={threat.id} value={threat.id}>
                      {threat.entityName} - {threat.platform} (Level {threat.threatLevel}/10)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Selection */}
            <div>
              <Label htmlFor="template-select">Outreach Template</Label>
              <Select value={outreachTemplate} onValueChange={setOutreachTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evidence_based">Evidence-Based (Professional)</SelectItem>
                  <SelectItem value="urgent_alert">Urgent Alert (Crisis)</SelectItem>
                  <SelectItem value="soft_approach">Soft Approach (Partnership)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Subject */}
            <div>
              <Label htmlFor="custom-subject">Custom Subject Line (Optional)</Label>
              <Input
                id="custom-subject"
                placeholder="Leave empty to use template subject..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            </div>

            {/* Custom Message */}
            <div>
              <Label htmlFor="custom-message">Custom Message (Optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Leave empty to use template message..."
                rows={6}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>

            {/* Preview */}
            {selectedThreat && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Email Preview:</h4>
                {(() => {
                  const threat = threats.find(t => t.id === selectedThreat);
                  if (!threat) return null;
                  
                  const { subject, message } = generateOutreachEmail(threat, outreachTemplate);
                  
                  return (
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Subject:</strong> {customSubject || subject}
                      </div>
                      <div>
                        <strong>Message Preview:</strong>
                        <div className="mt-1 p-2 bg-white rounded border max-h-32 overflow-y-auto">
                          {(customMessage || message).split('\n').slice(0, 5).join('\n')}
                          {(customMessage || message).split('\n').length > 5 && '...'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Send Button */}
            <Button 
              onClick={sendOutreachEmail}
              disabled={!selectedThreat || sendingOutreach}
              size="lg"
              className="w-full"
            >
              {sendingOutreach ? (
                "Sending Outreach..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Evidence-Based Outreach Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Outreach Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Available Outreach Targets</CardTitle>
          <CardDescription>
            High priority threats ready for immediate outreach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highPriorityThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No high priority threats available for outreach at this time.
              </div>
            ) : (
              highPriorityThreats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{threat.entityName}</h4>
                        <Badge variant="outline">{threat.entityType}</Badge>
                        <Badge className={threat.threatLevel >= 8 ? 'bg-red-600' : 'bg-orange-500'}>
                          Level {threat.threatLevel}/10
                        </Badge>
                        <Badge variant="secondary">{threat.platform}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {threat.contextSnippet}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        Detected: {new Date(threat.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      onClick={() => setSelectedThreat(threat.id)}
                    >
                      <Mail className="mr-1 h-3 w-3" />
                      Create Outreach
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutreachPanel;
