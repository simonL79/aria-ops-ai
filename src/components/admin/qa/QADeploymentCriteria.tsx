
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const QADeploymentCriteria = React.memo(() => (
  <Card className="border-corporate-accent bg-corporate-darkSecondary w-full min-w-0">
    <CardHeader className="p-3 sm:p-4 lg:p-6">
      <CardTitle className="text-corporate-accent flex items-center gap-2 text-sm sm:text-base">
        <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <span className="truncate">Live Data Deployment Criteria</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
      <div className="text-corporate-lightGray space-y-1 sm:space-y-2 text-xs sm:text-sm">
        <p><strong className="text-white">✓ 100% Live Data Sources:</strong> Only real OSINT intelligence processed</p>
        <p><strong className="text-white">✓ Mock Data Permanently Disabled:</strong> All simulation triggers blocked</p>
        <p><strong className="text-white">✓ Live Edge Functions:</strong> Reddit, News, and Forum crawling operational</p>
        <p><strong className="text-white">✓ Real-time Validation:</strong> Continuous live data compliance monitoring</p>
        <p><strong className="text-white">✓ Database Enforcement:</strong> Mock data insertion blocked at DB level</p>
        <p><strong className="text-white">✓ Performance Optimized:</strong> No simulation overhead or delays</p>
      </div>
    </CardContent>
  </Card>
));

QADeploymentCriteria.displayName = 'QADeploymentCriteria';

export default QADeploymentCriteria;
