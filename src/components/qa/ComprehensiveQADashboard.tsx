
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Play, Clock, Shield, Zap, Monitor, RotateCcw } from 'lucide-react';
import { comprehensiveQARunner, QATestCase, QAReport } from '@/services/testing/comprehensiveQARunner';
import { toast } from 'sonner';

const ComprehensiveQADashboard = () => {
  const [testCases, setTestCases] = useState<QATestCase[]>([]);
  const [currentReport, setCurrentReport] = useState<QAReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setTestCases(comprehensiveQARunner.getTestCases());
    setCurrentReport(comprehensiveQARunner.getCurrentReport());
  }, []);

  const runComprehensiveQA = async () => {
    setIsRunning(true);
    try {
      toast.info('Starting comprehensive QA testing suite...');
      
      const report = await comprehensiveQARunner.runComprehensiveQA();
      setCurrentReport(report);
      setTestCases(comprehensiveQARunner.getTestCases());
      
      if (report.overallStatus === 'passed') {
        toast.success(`QA Suite completed successfully! ${report.passedTests}/${report.totalTests} tests passed`);
      } else if (report.overallStatus === 'warning') {
        toast.warning(`QA Suite completed with warnings. ${report.failedTests} tests failed`);
      } else {
        toast.error(`QA Suite failed. ${report.criticalDefects.length} critical defects found`);
      }
    } catch (error) {
      console.error('QA execution failed:', error);
      toast.error('QA execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'skipped': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Play className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ui_navigation': return <Monitor className="h-4 w-4" />;
      case 'functional': return <Zap className="h-4 w-4" />;
      case 'performance': return <RotateCcw className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'regression': return <CheckCircle className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const filteredTestCases = selectedCategory === 'all' 
    ? testCases 
    : testCases.filter(test => test.category === selectedCategory);

  const calculateProgress = () => {
    if (!currentReport) return 0;
    const completedTests = currentReport.passedTests + currentReport.failedTests + currentReport.skippedTests;
    return (completedTests / currentReport.totalTests) * 100;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Shield className="h-6 w-6" />
            A.R.I.A™ Genesis Sentinel - Comprehensive QA Dashboard
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              onClick={runComprehensiveQA}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Running QA Suite...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Comprehensive QA
                </>
              )}
            </Button>
            {currentReport && (
              <div className="text-sm text-gray-400">
                Last run: {currentReport.startTime.toLocaleString()}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Status */}
          {currentReport && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Overall Status</h3>
                  <p className={`text-xl font-bold ${getOverallStatusColor(currentReport.overallStatus)}`}>
                    {currentReport.overallStatus.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {currentReport.passedTests}/{currentReport.totalTests}
                  </div>
                  <div className="text-sm text-gray-400">Tests Passed</div>
                </div>
              </div>
              
              <Progress value={calculateProgress()} className="mb-4" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-green-400 text-xl font-bold">{currentReport.passedTests}</div>
                  <div className="text-xs text-gray-400">Passed</div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-red-400 text-xl font-bold">{currentReport.failedTests}</div>
                  <div className="text-xs text-gray-400">Failed</div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-yellow-400 text-xl font-bold">{currentReport.skippedTests}</div>
                  <div className="text-xs text-gray-400">Skipped</div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-red-400 text-xl font-bold">{currentReport.criticalDefects.length}</div>
                  <div className="text-xs text-gray-400">Critical Defects</div>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {currentReport && Object.keys(currentReport.categories).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Category Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {Object.entries(currentReport.categories).map(([category, stats]) => (
                  <div key={category} className="bg-gray-800 p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium text-white capitalize">
                        {category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {stats.passed}/{stats.total} passed
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{ width: `${stats.total > 0 ? (stats.passed / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Results */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-6 mb-4 bg-gray-800">
              <TabsTrigger value="all">All Tests</TabsTrigger>
              <TabsTrigger value="ui_navigation">UI/Nav</TabsTrigger>
              <TabsTrigger value="functional">Functional</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="regression">Regression</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory}>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTestCases.map((test) => (
                  <div key={test.id} className="bg-gray-800 p-4 rounded">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(test.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{test.testName}</span>
                            <Badge 
                              variant={test.priority === 'critical' ? 'destructive' : 
                                     test.priority === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {test.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">{test.description}</div>
                          {test.result && (
                            <div className="text-sm text-gray-300">{test.result}</div>
                          )}
                          {test.defects && test.defects.length > 0 && (
                            <div className="text-sm text-red-400 mt-1">
                              Defects: {test.defects.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={test.status === 'passed' ? 'default' : 
                                  test.status === 'failed' ? 'destructive' : 'secondary'}
                        >
                          {test.status.toUpperCase()}
                        </Badge>
                        {test.executionTime && (
                          <div className="text-xs text-gray-500 mt-1">
                            {test.executionTime}ms
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          {currentReport && currentReport.recommendations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
              <div className="bg-gray-800 p-4 rounded">
                <ul className="space-y-2">
                  {currentReport.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Critical Defects */}
          {currentReport && currentReport.criticalDefects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Critical Defects</h3>
              <div className="bg-red-900/20 border border-red-600 rounded p-4">
                <ul className="space-y-2">
                  {currentReport.criticalDefects.map((defect, index) => (
                    <li key={index} className="text-red-300 flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {defect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveQADashboard;
