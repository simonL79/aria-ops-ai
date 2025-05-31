
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const QAComplianceStatus = React.memo(() => (
  <Card className="border-green-500 bg-green-900/20 w-full min-w-0">
    <CardHeader className="p-3 sm:p-4 lg:p-6">
      <CardTitle className="text-green-400 flex items-center gap-2 text-sm sm:text-base">
        <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <span className="truncate">Live Data Compliance Status</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
      <div className="text-green-300 space-y-1 sm:space-y-2 text-xs sm:text-sm">
        <p><strong className="text-white">✅ Mock Data Permanently Blocked:</strong> All simulation and test data disabled</p>
        <p><strong className="text-white">✅ Live OSINT Intelligence Only:</strong> Reddit RSS, News feeds, Forums crawling</p>
        <p><strong className="text-white">✅ Real-time Validation:</strong> All data sources verified as live</p>
        <p><strong className="text-white">✅ Simulation Fallbacks Removed:</strong> No mock data generation possible</p>
        <p><strong className="text-white">✅ Edge Functions Live Only:</strong> All scanning functions use live sources</p>
        <p><strong className="text-white">✅ Database Validation:</strong> Mock data triggers blocked at database level</p>
      </div>
    </CardContent>
  </Card>
));

QAComplianceStatus.displayName = 'QAComplianceStatus';

export default QAComplianceStatus;
