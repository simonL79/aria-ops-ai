
import { useState } from "react";
import { ContentItem } from "@/types/monitor";

export const useContentFilter = (initialContent: ContentItem[]) => {
  const [filtered, setFiltered] = useState(initialContent);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  
  const filterContent = () => {
    let results = [...initialContent];
    
    if (selectedPlatform !== 'all') {
      results = results.filter(item => item.platform === selectedPlatform);
    }
    
    if (selectedSentiment !== 'all') {
      results = results.filter(item => item.sentiment === selectedSentiment);
    }
    
    setFiltered(results);
  };

  return {
    filtered,
    selectedPlatform,
    setSelectedPlatform,
    selectedSentiment,
    setSelectedSentiment,
    filterContent
  };
};
