
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SystemOperationalStatus from '@/components/admin/SystemOperationalStatus';
import ClientQuickSetup from '@/components/admin/ClientQuickSetup';
import AutomatedTestSuite from '@/components/admin/AutomatedTestSuite';
import SystemInitializationPanel from '@/components/aria/SystemInitializationPanel';
import RealTimeMonitoringActivator from '@/components/admin/RealTimeMonitoringActivator';
import NotificationTestCenter from '@/components/admin/NotificationTestCenter';

const SystemCompletionPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-corporate-dark min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              A.R.I.A™ System Completion Dashboard
            </h1>
            <p className="text-corporate-lightGray">
              Complete the final phases to achieve 100% operational status
            </p>
          </div>

          {/* System Status Overview */}
          <SystemOperationalStatus />

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Phase 4: AI Integration */}
            <div className="space-y-6">
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-corporate-accent">Phase 4:</span>
                  AI Integration
                </h3>
                <p className="text-corporate-lightGray text-sm mb-4">
                  Complete AI system integration and local inference setup
                </p>
              </div>
              <SystemInitializationPanel />
              <AutomatedTestSuite />
            </div>

            {/* Phase 5: Real-Time Operations */}
            <div className="space-y-6">
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-corporate-accent">Phase 5:</span>
                  Real-Time Operations
                </h3>
                <p className="text-corporate-lightGray text-sm mb-4">
                  Activate live monitoring and scanning systems
                </p>
              </div>
              <RealTimeMonitoringActivator />
              <NotificationTestCenter />
            </div>

            {/* Phase 6: Client Operations */}
            <div className="space-y-6">
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-corporate-accent">Phase 6:</span>
                  Client Operations
                </h3>
                <p className="text-corporate-lightGray text-sm mb-4">
                  Set up client entities and operational workflows
                </p>
              </div>
              <ClientQuickSetup />
            </div>
          </div>

          {/* Final Instructions */}
          <div className="bg-corporate-darkSecondary border border-corporate-border rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">🎯 Complete These Steps for 100% Operational Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-corporate-accent font-medium">1.</span>
                  <span className="text-corporate-lightGray">
                    <strong>System Initialization:</strong> Click "Initialize A.R.I.A™ for Live Operations"
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-corporate-accent font-medium">2.</span>
                  <span className="text-corporate-lightGray">
                    <strong>Monitoring Activation:</strong> Enable real-time monitoring systems
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-corporate-accent font-medium">3.</span>
                  <span className="text-corporate-lightGray">
                    <strong>Client Setup:</strong> Create your first client entity for monitoring
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-corporate-accent font-medium">4.</span>
                  <span className="text-corporate-lightGray">
                    <strong>Test Systems:</strong> Run automated test suite to verify functionality
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-corporate-accent font-medium">5.</span>
                  <span className="text-corporate-lightGray">
                    <strong>Ollama Connection:</strong> Run <code className="bg-corporate-dark px-2 py-1 rounded text-corporate-accent">OLLAMA_ORIGINS=* ollama serve</code>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-corporate-accent font-medium">6.</span>
                  <span className="text-corporate-lightGray">
                    <strong>Final Validation:</strong> Verify all phase completion percentages reach 100%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemCompletionPage;
