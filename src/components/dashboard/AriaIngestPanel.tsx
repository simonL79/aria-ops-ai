
import React, { useState } from 'react';
import { AriaIngestRequest, AriaIngestResponse, submitToAriaIngest, testAriaIngest } from "@/services/ariaIngestService";
import { ContentAlert } from "@/types/dashboard";
import BatchProcessingPanel from "@/components/dashboard/processing/BatchProcessingPanel";
import ThreatTrendsChart from "@/components/dashboard/analytics/ThreatTrendsChart";
import SearchAndFilterPanel from "@/components/dashboard/search/SearchAndFilterPanel";
import ResponseManagementPanel from "@/components/dashboard/response/ResponseManagementPanel";
import EntityRelationshipMap from "@/components/dashboard/analytics/EntityRelationshipMap";
import AriaIngestHeader from "./aria-ingest/AriaIngestHeader";
import AriaIngestForm from "./aria-ingest/AriaIngestForm";
import AriaIngestResults from "./aria-ingest/AriaIngestResults";

const AriaIngestPanel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [lastResponse, setLastResponse] = useState<AriaIngestResponse | null>(null);
  const [formData, setFormData] = useState<AriaIngestRequest>({
    content: "",
    platform: "twitter",
    url: "",
    severity: "low",
    test: false
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [filteredAlerts, setFilteredAlerts] = useState<ContentAlert[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      // Provide a fallback URL if empty
      const requestData = {
        ...formData,
        url: formData.url.trim() || `https://manual-entry-${formData.platform}.com/${Date.now()}`
      };
      
      console.log('Submitting request:', requestData);
      const response = await submitToAriaIngest(requestData);
      console.log('Received response:', response);
      
      if (response) {
        setLastResponse(response);
        // Clear form on successful submission (but not test)
        if (!formData.test) {
          setFormData({
            content: "",
            platform: "twitter", 
            url: "",
            severity: "low",
            test: false
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      console.log('Running test...');
      const response = await testAriaIngest();
      console.log('Test response:', response);
      if (response) {
        setLastResponse(response);
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Notifications */}
      <AriaIngestHeader 
        filteredAlerts={filteredAlerts}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ARIA Ingest Form */}
        <AriaIngestForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onTest={handleTest}
          isSubmitting={isSubmitting}
          isTesting={isTesting}
        />

        {/* Batch Processing Panel */}
        <BatchProcessingPanel />
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Intelligence Analytics</h3>
        <ThreatTrendsChart alerts={lastResponse?.payload ? [lastResponse.payload as any] : []} />
      </div>

      {/* Search and Response Management */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SearchAndFilterPanel 
          alerts={lastResponse?.payload ? [lastResponse.payload as any] : []}
          onFilteredResults={setFilteredAlerts}
        />
        <ResponseManagementPanel />
      </div>

      {/* Entity Relationship Map */}
      <EntityRelationshipMap alerts={lastResponse?.payload ? [lastResponse.payload as any] : []} />

      {/* Enhanced results display with threat analysis */}
      {lastResponse && (
        <AriaIngestResults lastResponse={lastResponse} />
      )}
    </div>
  );
};

export default AriaIngestPanel;
