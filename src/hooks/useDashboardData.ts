
import { useState } from "react";
import { ContentAlert, ContentSource, ContentAction } from "@/types/dashboard";
import { mockAlerts, mockSources, mockActions } from "@/data/mockDashboardData";

export const useDashboardData = () => {
  const [filteredAlerts, setFilteredAlerts] = useState<ContentAlert[]>(mockAlerts);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // State for metrics
  const [reputationScore, setReputationScore] = useState(68);
  const [previousScore, setPreviousScore] = useState(61);
  const [sources, setSources] = useState<ContentSource[]>(mockSources);
  const [alerts, setAlerts] = useState<ContentAlert[]>(mockAlerts);
  const [actions, setActions] = useState<ContentAction[]>(mockActions);
  const [monitoredSources, setMonitoredSources] = useState(58);
  const [negativeContent, setNegativeContent] = useState(12);
  const [removedContent, setRemovedContent] = useState(7);

  return {
    filteredAlerts, 
    setFilteredAlerts,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    reputationScore, 
    setReputationScore,
    previousScore, 
    setPreviousScore,
    sources, 
    setSources,
    alerts, 
    setAlerts,
    actions, 
    setActions,
    monitoredSources, 
    setMonitoredSources,
    negativeContent, 
    setNegativeContent,
    removedContent, 
    setRemovedContent
  };
};
