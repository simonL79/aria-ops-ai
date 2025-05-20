
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader, Mail, AlertTriangle } from 'lucide-react';
import { EmailDigestSettings } from '@/types/aiScraping';
import { playNotificationSound } from '@/utils/notificationSound';

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [settings, setSettings] = useState<EmailDigestSettings>({
    enabled: true,
    frequency: 'daily',
    minRiskScore: 5,
    recipients: [''],
    lastSent: undefined
  });

  const handleRecipientChange = (index: number, value: string) => {
    const updatedRecipients = [...settings.recipients];
    updatedRecipients[index] = value;
    setSettings({ ...settings, recipients: updatedRecipients });
  };

  const addRecipient = () => {
    setSettings({ ...settings, recipients: [...settings.recipients, ''] });
  };

  const removeRecipient = (index: number) => {
    const updatedRecipients = settings.recipients.filter((_, i) => i !== index);
    setSettings({ ...settings, recipients: updatedRecipients });
  };

  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would save to a database
      // await saveEmailDigestSettings(settings);
      
      toast.success('Notification settings saved', {
        description: 'Your email digest preferences have been updated'
      });
    } catch (error) {
      toast.error('Error saving settings', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setTestingEmail(true);
    
    try {
      // Filter out empty email addresses
      const validRecipients = settings.recipients.filter(email => email.trim() !== '');
      
      if (validRecipients.length === 0) {
        toast.error('No recipients', {
          description: 'Please add at least one valid email address'
        });
        return;
      }
      
      // Call the edge function to send a test digest
      const response = await fetch('https://ssvskbejfacmjemphmry.supabase.co/functions/v1/email-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real app, add authorization header
        },
        body: JSON.stringify({
          recipients: validRecipients,
          minRiskScore: settings.minRiskScore,
          since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          clientName: 'A.R.I.A'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        playNotificationSound('success');
        toast.success('Test email sent', {
          description: `Digest email sent to ${validRecipients.length} recipient(s)`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Error sending test email', {
        description: error.message || 'Please try again or contact support'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">Email Digest Notifications</h3>
              <p className="text-muted-foreground text-sm">
                Configure automated email reports for high-risk reputation mentions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="enabled-digest" className="text-sm">Enable</Label>
              <Switch 
                id="enabled-digest" 
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value) => setSettings({ ...settings, frequency: value as 'daily' | 'weekly' | 'immediate' })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="immediate">Immediate Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="min-risk-score">Minimum Risk Score</Label>
                  <span className="text-sm font-medium">{settings.minRiskScore}</span>
                </div>
                <Slider
                  id="min-risk-score"
                  min={1}
                  max={10}
                  step={1}
                  value={[settings.minRiskScore]}
                  onValueChange={(value) => setSettings({ ...settings, minRiskScore: value[0] })}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lower (More Alerts)</span>
                  <span>Higher (Critical Only)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Recipients</Label>
              {settings.recipients.map((recipient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={recipient}
                    onChange={(e) => handleRecipientChange(index, e.target.value)}
                  />
                  {settings.recipients.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeRecipient(index)}
                    >
                      &times;
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addRecipient}>
                Add Recipient
              </Button>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700">
                  High-risk alerts (score 8 or above) will always be sent immediately, regardless of your frequency setting.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={sendTestEmail}
                disabled={testingEmail}
              >
                {testingEmail ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
              
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
