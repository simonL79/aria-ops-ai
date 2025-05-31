
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QATestingHeader = React.memo(() => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
    <div className="min-w-0 flex-1">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 corporate-heading">
        <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-corporate-accent flex-shrink-0" />
        <span className="truncate">A.R.I.A™ Live Intelligence QA - 100% Live Data</span>
      </h1>
      <p className="corporate-subtext mt-1 text-xs sm:text-sm lg:text-base">
        Live OSINT Intelligence Validation - All Mock Data & Simulations Permanently Disabled
      </p>
    </div>
    
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-shrink-0">
      <Badge variant="secondary" className="flex items-center gap-1 bg-green-600 text-white border-green-500 text-xs">
        <CheckCircle className="h-3 w-3" />
        Live Data Only
      </Badge>
      <Badge className="bg-red-600 text-white hover:bg-red-700 text-xs">
        No Simulations
      </Badge>
    </div>
  </div>
));

QATestingHeader.displayName = 'QATestingHeader';

export default QATestingHeader;
