
export interface QATestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: Date;
  phase: string;
  gdprCompliant?: boolean;
  dataSource?: 'live' | 'none';
}

export interface QATestSuite {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  duration: number;
  results: QATestResult[];
  gdprCompliance: {
    compliantTests: number;
    totalGdprTests: number;
    compliancePercentage: number;
  };
}

export interface QATestPhase {
  runTests(): Promise<QATestResult[]>;
}
