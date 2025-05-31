
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Monitor, Zap, TrendingUp, Shield } from 'lucide-react';

const QAProcessCards = React.memo(() => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full">
    <Card className="corporate-card w-full min-w-0">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 corporate-heading text-sm sm:text-base">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-corporate-accent flex-shrink-0" />
          <span className="truncate">QA Testing Categories</span>
        </CardTitle>
        <CardDescription className="corporate-subtext text-xs sm:text-sm">Comprehensive testing approach</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-corporate-lightGray">
          <div className="flex items-center gap-2">
            <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
            <span className="font-medium">UI & Navigation Testing</span>
          </div>
          <p className="text-xs corporate-subtext ml-4 sm:ml-6">Button visibility, navigation flow, responsive design, interactive elements</p>
          
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
            <span className="font-medium">Functional Testing</span>
          </div>
          <p className="text-xs corporate-subtext ml-4 sm:ml-6">Live threat scan, entity management, guardian mode, report generation</p>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
            <span className="font-medium">Performance Testing</span>
          </div>
          <p className="text-xs corporate-subtext ml-4 sm:ml-6">Page load time, scan performance, memory usage, concurrent users</p>
          
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
            <span className="font-medium">Security Testing</span>
          </div>
          <p className="text-xs corporate-subtext ml-4 sm:ml-6">Input validation, authentication, data encryption, session management</p>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
            <span className="font-medium">Regression Testing</span>
          </div>
          <p className="text-xs corporate-subtext ml-4 sm:ml-6">Core functionality, integration points, database operations</p>
        </div>
      </CardContent>
    </Card>

    <Card className="corporate-card w-full min-w-0">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 corporate-heading text-sm sm:text-base">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-corporate-accent flex-shrink-0" />
          <span className="truncate">Quality Assurance Process</span>
        </CardTitle>
        <CardDescription className="corporate-subtext text-xs sm:text-sm">Systematic validation approach</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-corporate-lightGray">
          <div>
            <div className="font-medium text-white">1. Automated Test Execution</div>
            <p className="text-xs corporate-subtext">Comprehensive test suite runs all categories automatically</p>
          </div>
          
          <div>
            <div className="font-medium text-white">2. Real-time Results</div>
            <p className="text-xs corporate-subtext">Immediate feedback on test status and performance metrics</p>
          </div>
          
          <div>
            <div className="font-medium text-white">3. Defect Tracking</div>
            <p className="text-xs corporate-subtext">Critical defects flagged for immediate attention</p>
          </div>
          
          <div>
            <div className="font-medium text-white">4. Recommendations</div>
            <p className="text-xs corporate-subtext">Actionable insights for deployment readiness</p>
          </div>
          
          <div>
            <div className="font-medium text-white">5. Documentation</div>
            <p className="text-xs corporate-subtext">Detailed logging of all test results and system status</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
));

QAProcessCards.displayName = 'QAProcessCards';

export default QAProcessCards;
