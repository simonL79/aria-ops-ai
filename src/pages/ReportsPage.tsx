
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, FileText, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMentionsAsAlerts } from "@/services/monitoring";
import { detectEntities } from "@/services/api/entityDetectionService";
import { ContentAlert } from "@/types/dashboard";

const ReportsPage = () => {
  const [reports, setReports] = useState<ContentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [period, setPeriod] = useState("all");
  const [entityFilter, setEntityFilter] = useState("");
  
  useEffect(() => {
    loadReports();
  }, []);
  
  const loadReports = async () => {
    setLoading(true);
    try {
      const mentions = await getMentionsAsAlerts();
      
      // Process each mention to ensure entity information is available
      const enhancedMentions = await Promise.all(
        mentions.map(async (mention) => {
          if (!mention.detectedEntities || mention.detectedEntities.length === 0) {
            const detectedEntities = await detectEntities(mention.content, mention.platform);
            return {
              ...mention,
              detectedEntities: detectedEntities
            };
          }
          return mention;
        })
      );
      
      setReports(enhancedMentions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reports:", error);
      setLoading(false);
    }
  };
  
  // Get unique entities from all reports
  const getUniqueEntities = () => {
    const entities = new Set<string>();
    reports.forEach(report => {
      if (report.detectedEntities && Array.isArray(report.detectedEntities)) {
        report.detectedEntities.forEach(entity => {
          if (typeof entity === 'string') {
            entities.add(entity);
          }
        });
      }
    });
    return Array.from(entities);
  };
  
  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    let matchesFilter = true;
    
    // Filter by entity
    if (entityFilter) {
      matchesFilter = false;
      if (report.detectedEntities && Array.isArray(report.detectedEntities)) {
        matchesFilter = report.detectedEntities.some(entity => 
          typeof entity === 'string' && entity.toLowerCase().includes(entityFilter.toLowerCase())
        );
      }
      if (!matchesFilter) return false;
    }
    
    // Filter by text content
    if (filter && !report.content.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    
    // Filter by time period
    if (period === "day") {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const reportDate = new Date(report.date);
      if (reportDate < oneDayAgo) return false;
    } else if (period === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const reportDate = new Date(report.date);
      if (reportDate < oneWeekAgo) return false;
    } else if (period === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const reportDate = new Date(report.date);
      if (reportDate < oneMonthAgo) return false;
    }
    
    return true;
  });
  
  const uniqueEntities = getUniqueEntities();
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-2xl font-bold">Entity Reports</h1>
          <Button onClick={loadReports} disabled={loading} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate New Report
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reputation Analysis by Entity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Input 
                  placeholder="Search in content..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              
              <Select
                value={entityFilter ? uniqueEntities.find(e => e.toLowerCase().includes(entityFilter.toLowerCase())) || "" : ""}
                onValueChange={setEntityFilter}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Entities</SelectItem>
                  {uniqueEntities.map((entity) => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={period}
                onValueChange={setPeriod}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="entity">Entity View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading reports...</div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8">No reports found matching the filters.</div>
                ) : (
                  filteredReports.map((report) => (
                    <Card key={report.id} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant={report.severity === 'high' ? 'destructive' : report.severity === 'medium' ? 'default' : 'secondary'}>
                              {report.severity.toUpperCase()}
                            </Badge>
                            <span className="ml-2 text-sm text-muted-foreground">{report.platform}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{typeof report.date === 'string' ? report.date : format(new Date(report.date), 'PPP')}</span>
                        </div>
                        
                        <p className="mb-2">{report.content}</p>
                        
                        {report.detectedEntities && report.detectedEntities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Detected Entities:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.isArray(report.detectedEntities) && report.detectedEntities.map((entity, idx) => (
                                <Badge key={idx} variant="outline" className="bg-gray-100">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {report.threatType && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              Threat Type: <span className="font-medium">{report.threatType.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="entity">
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">Loading entities...</div>
                  ) : uniqueEntities.length === 0 ? (
                    <div className="text-center py-8">No entities detected in the current reports.</div>
                  ) : (
                    uniqueEntities
                      .filter(entity => !entityFilter || entity.toLowerCase().includes(entityFilter.toLowerCase()))
                      .map((entity) => {
                        const entityReports = filteredReports.filter(r => 
                          r.detectedEntities && Array.isArray(r.detectedEntities) && 
                          r.detectedEntities.some(e => typeof e === 'string' && e === entity)
                        );
                        
                        if (entityReports.length === 0) return null;
                        
                        const highSeverityCount = entityReports.filter(r => r.severity === 'high').length;
                        const mediumSeverityCount = entityReports.filter(r => r.severity === 'medium').length;
                        
                        return (
                          <Card key={entity} className={`mb-4 ${highSeverityCount > 0 ? 'border-red-300' : mediumSeverityCount > 0 ? 'border-yellow-300' : 'border-gray-200'}`}>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-medium mb-2">{entity}</h3>
                              
                              <div className="flex gap-2 mb-3">
                                <Badge variant="destructive">{highSeverityCount} High</Badge>
                                <Badge>{mediumSeverityCount} Medium</Badge>
                                <Badge variant="secondary">{entityReports.length - highSeverityCount - mediumSeverityCount} Low</Badge>
                              </div>
                              
                              <p className="text-sm mb-3">
                                {entityReports.length} mentions across {new Set(entityReports.map(r => r.platform)).size} platforms
                              </p>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Recent Mentions:</h4>
                                {entityReports.slice(0, 3).map(report => (
                                  <div key={report.id} className="text-sm border-l-2 pl-2 border-gray-300">
                                    "{report.content.length > 100 ? `${report.content.substring(0, 100)}...` : report.content}"
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {report.platform} - {typeof report.date === 'string' ? report.date : format(new Date(report.date), 'PPP')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }).filter(Boolean)
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
