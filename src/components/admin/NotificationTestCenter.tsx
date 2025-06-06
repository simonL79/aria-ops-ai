
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const NotificationTestCenter = () => {
  const [isTestingNotifications, setIsTestingNotifications] = useState(false);
  const [testData, setTestData] = useState({
    entityName: 'Test Entity',
    eventType: 'system_test',
    summary: 'This is a test notification from A.R.I.A™ system',
    priority: 'medium'
  });

  const testNotificationSystem = async () => {
    setIsTestingNotifications(true);
    
    try {
      // Create test notification
      const { data, error } = await supabase
        .from('aria_notifications')
        .insert({
          entity_name: testData.entityName,
          event_type: testData.eventType,
          summary: testData.summary,
          priority: testData.priority
        })
        .select()
        .single();

      if (error) throw error;

      // Test activity logging
      await supabase
        .from('activity_logs')
        .insert({
          action: 'notification_test',
          entity_type: 'notification',
          entity_id: data.id,
          details: 'Notification system test completed successfully'
        });

      toast.success('✅ Notification system test completed successfully!');
      
    } catch (error) {
      console.error('Notification test failed:', error);
      toast.error('❌ Notification system test failed');
    } finally {
      setIsTestingNotifications(false);
    }
  };

  const runSystemValidation = async () => {
    toast.info('🔍 Running system validation...');
    
    try {
      // Check notification system
      const { data: notifications } = await supabase
        .from('aria_notifications')
        .select('*')
        .limit(5);

      // Check activity logs
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .limit(5);

      // Check system config
      const { data: configs } = await supabase
        .from('system_config')
        .select('*');

      let validationResults = [];
      
      if (notifications) {
        validationResults.push(`✅ Notifications: ${notifications.length} records accessible`);
      } else {
        validationResults.push('❌ Notifications: Table not accessible');
      }

      if (activities) {
        validationResults.push(`✅ Activity Logs: ${activities.length} records accessible`);
      } else {
        validationResults.push('❌ Activity Logs: Table not accessible');
      }

      if (configs) {
        validationResults.push(`✅ System Config: ${configs.length} configurations loaded`);
      } else {
        validationResults.push('❌ System Config: No configurations found');
      }

      toast.success(`System validation completed:\n${validationResults.join('\n')}`);
      
    } catch (error) {
      console.error('System validation failed:', error);
      toast.error('❌ System validation failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-corporate-accent" />
            Notification Test Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entityName" className="text-corporate-lightGray">
                Entity Name
              </Label>
              <Input
                id="entityName"
                value={testData.entityName}
                onChange={(e) => setTestData({...testData, entityName: e.target.value})}
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-corporate-lightGray">
                Event Type
              </Label>
              <Select value={testData.eventType} onValueChange={(value) => setTestData({...testData, eventType: value})}>
                <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system_test">System Test</SelectItem>
                  <SelectItem value="threat_detected">Threat Detected</SelectItem>
                  <SelectItem value="client_setup">Client Setup</SelectItem>
                  <SelectItem value="monitoring_alert">Monitoring Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-corporate-lightGray">
                Priority
              </Label>
              <Select value={testData.priority} onValueChange={(value) => setTestData({...testData, priority: value})}>
                <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary" className="text-corporate-lightGray">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={testData.summary}
              onChange={(e) => setTestData({...testData, summary: e.target.value})}
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={testNotificationSystem}
              disabled={isTestingNotifications}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isTestingNotifications ? (
                'Testing...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Test Notification
                </>
              )}
            </Button>

            <Button
              onClick={runSystemValidation}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              System Validation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-white font-medium">Testing Instructions</h4>
              <p className="text-corporate-lightGray text-sm">
                Use this notification test center to verify that your system can create and manage notifications properly. 
                This tests the core notification infrastructure that will be used for real-time alerts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTestCenter;
