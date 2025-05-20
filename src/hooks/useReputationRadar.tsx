
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { EntityMention, RadarFilters, NewsArticle } from '@/types/radar';

export const useReputationRadar = () => {
  const [entities, setEntities] = useState<EntityMention[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  
  const fetchRadarData = useCallback(async (filters: Partial<RadarFilters> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the Supabase function
      // For now we'll use mock data
      const { timeframe = 'last24h' } = filters;
      
      // Mock edge function call - replace with actual call in production
      // const { data, error } = await supabase.functions.invoke('radar-news-scan', {
      //   body: { timeframe }
      // });
      
      // if (error) throw error;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data (replace with actual data from edge function)
      const mockEntities: EntityMention[] = [
        {
          id: "1",
          name: "TechCorp Inc",
          type: "organization",
          articles: [
            {
              id: "a1",
              title: "TechCorp Faces Backlash After Data Breach",
              url: "https://example.com/tech-corp-breach",
              source: "Tech News Daily",
              publishDate: "2025-05-20T08:30:00Z",
              snippet: "TechCorp Inc is facing customer backlash and potential lawsuits after a major data breach exposed sensitive information...",
              imageUrl: "https://picsum.photos/seed/techcorp/800/400"
            }
          ],
          sentiment: -0.75,
          riskCategory: "Data Privacy Incident",
          riskScore: 8.2,
          firstDetected: "2025-05-20T10:15:00Z",
          outreachStatus: "pending"
        },
        {
          id: "2",
          name: "Jane Smith",
          type: "person",
          articles: [
            {
              id: "a2",
              title: "Celebrity Jane Smith Apologizes For Controversial Comments",
              url: "https://example.com/jane-smith-apology",
              source: "Entertainment Weekly",
              publishDate: "2025-05-20T11:45:00Z",
              snippet: "Actress Jane Smith issued a public apology today after her controversial statements about climate change sparked outrage...",
              imageUrl: "https://picsum.photos/seed/janesmith/800/400"
            }
          ],
          sentiment: -0.6,
          riskCategory: "Public Relations Crisis",
          riskScore: 7.5,
          firstDetected: "2025-05-20T12:30:00Z",
          outreachStatus: "drafted",
          outreachDraft: "Dear Ms. Smith, We noticed your recent media coverage and wanted to reach out. Our firm specializes in reputation management during challenging media situations..."
        },
        {
          id: "3",
          name: "Global Bank Ltd",
          type: "organization",
          articles: [
            {
              id: "a3",
              title: "Global Bank Under Investigation For Compliance Issues",
              url: "https://example.com/global-bank-investigation",
              source: "Financial Times",
              publishDate: "2025-05-19T14:20:00Z",
              snippet: "Regulators have launched an investigation into Global Bank Ltd following allegations of compliance failures in its international operations...",
              imageUrl: "https://picsum.photos/seed/globalbank/800/400"
            }
          ],
          sentiment: -0.8,
          riskCategory: "Legal & Compliance",
          riskScore: 9.1,
          firstDetected: "2025-05-19T16:45:00Z",
          outreachStatus: "pending"
        }
      ];
      
      setEntities(mockEntities);
      setLastScanTime(new Date().toISOString());
      
    } catch (err) {
      console.error('Error fetching radar data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to fetch reputation radar data', {
        description: err instanceof Error ? err.message : undefined
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Generate outreach message using AI for a specific entity
  const generateOutreachMessage = useCallback(async (entity: EntityMention) => {
    try {
      // In a real implementation, call AI service to generate content
      // Example implementation:
      // const { data, error } = await supabase.functions.invoke('generate-outreach', {
      //   body: { entityName: entity.name, entityType: entity.type, articles: entity.articles }
      // });
      
      // if (error) throw error;
      
      // Mock AI-generated content
      const mockOutreach = entity.type === 'person'
        ? `Dear ${entity.name},\n\nI noticed the recent media coverage about you and wanted to reach out. Our firm specializes in reputation management and privacy protection, and we may be able to assist during this challenging situation.\n\nWould you be open to a confidential conversation about digital reputation protection strategies?\n\nBest regards,\n[Your Name]\n[Your Company]`
        : `Dear ${entity.name} team,\n\nI noticed the recent coverage of ${entity.name} in the media. Our agency specializes in corporate reputation management and crisis response, helping organizations navigate challenging media situations.\n\nWould your communications team be available for a brief conversation about our reputation protection and media management services?\n\nBest regards,\n[Your Name]\n[Your Company]`;
      
      return {
        success: true, 
        outreachMessage: mockOutreach
      };
    } catch (err) {
      console.error('Error generating outreach message:', err);
      toast.error('Failed to generate outreach message');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);
  
  // Update entity status (e.g., mark as contacted)
  const updateEntityStatus = useCallback(async (entityId: string, status: string) => {
    try {
      // In a real implementation, update in database
      // For now, just update local state
      setEntities(prev => 
        prev.map(entity => 
          entity.id === entityId 
            ? { ...entity, outreachStatus: status as any } 
            : entity
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error updating entity status:', err);
      toast.error('Failed to update entity status');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);
  
  useEffect(() => {
    // Fetch initial data on component mount
    fetchRadarData();
  }, [fetchRadarData]);
  
  return {
    entities,
    loading,
    error,
    lastScanTime,
    fetchRadarData,
    generateOutreachMessage,
    updateEntityStatus
  };
};
