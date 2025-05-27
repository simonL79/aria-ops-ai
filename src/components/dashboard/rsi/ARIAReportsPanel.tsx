
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Mail, 
  Bell,
  BellOff,
  Filter,
  Search
} from "lucide-react";
import { 
  getARIAReports, 
  getARIANotifications,
  markNotificationSeen,
  queueReportExport,
  getReportExports,
  type ARIAReport,
  type ARIANotification,
  type ReportExport
} from '@/services/aria/reportService';
import { toast } from 'sonner';

const ARIAReportsPanel = () => {
  const [reports, setReports] = useState<ARIAReport[]>([]);
  const [notifications, setNotifications] = useState<ARIANotification[]>([]);
  const [exports, setExports] = useState<ReportExport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [reportsData, notificationsData, exportsData] = await Promise.all([
        getARIAReports(),
        getARIANotifications(),
        getReportExports()
      ]);
      
      setReports(reportsData);
      setNotifications(notificationsData);
      setExports(exportsData);
    } catch (error) {
      console.error('Error loading A.R.I.A™ data:', error);
      toast.error('Failed to load A.R.I.A™ reports data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsSeen = async (notificationId: string) => {
    const success = await markNotificationSeen(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, seen: true } : n)
      );
    }
  };

  const handleExportReport = async (reportId: string, type: 'pdf' | 'email') => {
    const recipient = type === 'email' ? prompt('Enter email address:') : 'system';
    if (type === 'email' && !recipient) return;
    
    await queueReportExport(reportId, type, recipient || 'system');
    loadAllData();
  };

  const getRiskColor = (rating?: string) => {
    switch (rating) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.priority === filter;
    const matchesSearch = !searchTerm || 
      notification.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.risk_rating === filter;
    const matchesSearch = !searchTerm || 
      report.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading A.R.I.A™ Reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            A.R.I.A™ Auto-Generated Reports & Notifications
          </h3>
          <p className="text-sm text-muted-foreground">
            Automated risk reports and real-time notifications from entity monitoring
          </p>
        </div>
        <Button onClick={loadAllData} variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="notifications">
            Notifications ({notifications.filter(n => !n.seen).length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            Auto Reports ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="exports">
            Export Queue ({exports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div key={notification.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {notification.seen ? (
                            <BellOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Bell className="h-4 w-4 text-blue-600" />
                          )}
                          <h4 className="font-medium">{notification.entity_name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority?.toUpperCase()}
                          </Badge>
                          {!notification.seen && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkAsSeen(notification.id)}
                            >
                              Mark Seen
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.summary}</p>
                      <div className="text-xs text-gray-400">
                        {notification.event_type} • {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2" />
                    <p>No notifications found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Generated Risk Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div key={report.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{report.report_title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(report.risk_rating)}>
                            {report.risk_rating?.toUpperCase()}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExportReport(report.id, 'pdf')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExportReport(report.id, 'email')}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.summary}</p>
                      <div className="text-xs text-gray-400">
                        Entity: {report.entity_name} • Generated: {new Date(report.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>No reports found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports">
          <Card>
            <CardHeader>
              <CardTitle>Export Queue Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exports.length > 0 ? (
                  exports.map((exportItem) => (
                    <div key={exportItem.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{exportItem.export_type.toUpperCase()} Export</h4>
                          <p className="text-sm text-gray-600">To: {exportItem.recipient}</p>
                        </div>
                        <Badge variant={
                          exportItem.status === 'sent' ? 'default' :
                          exportItem.status === 'error' ? 'destructive' :
                          exportItem.status === 'processing' ? 'secondary' : 'outline'
                        }>
                          {exportItem.status.toUpperCase()}
                        </Badge>
                      </div>
                      {exportItem.error_message && (
                        <p className="text-sm text-red-600 mb-2">{exportItem.error_message}</p>
                      )}
                      <div className="text-xs text-gray-400">
                        Scheduled: {new Date(exportItem.scheduled_at).toLocaleString()}
                        {exportItem.sent_at && ` • Sent: ${new Date(exportItem.sent_at).toLocaleString()}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Download className="h-12 w-12 mx-auto mb-2" />
                    <p>No export jobs found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ARIAReportsPanel;
