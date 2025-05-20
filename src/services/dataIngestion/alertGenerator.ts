
import { ContentAlert } from "@/types/dashboard";

/**
 * Generate a simulated alert for demo purposes
 */
export const generateSimulatedAlert = (platform: string): ContentAlert => {
  const severities = ['low', 'medium', 'high'];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  const contentOptions = [
    "I had a terrible experience with this company. Will never use their services again!",
    "Just found out this company has been using unethical practices. Spread the word!",
    "Their customer support is non-existent. Stay away!",
    "Been using their product for a month and noticed some serious quality issues.",
    "This company completely misrepresented their service. Looking into legal options."
  ];
  
  const content = contentOptions[Math.floor(Math.random() * contentOptions.length)];
  
  return {
    id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    platform,
    content,
    date: '10 minutes ago',
    severity: severity as 'low' | 'medium' | 'high',
    status: 'new'
  };
};
