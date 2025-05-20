
import { toast } from "sonner";
import { getMonitoredPlatforms } from "./platforms";
import { saveMention } from "./mentions";

/**
 * Run a manual monitoring scan
 */
export const runMonitoringScan = async (): Promise<{ success: boolean; newMentions: number }> => {
  // Get platforms that are actively being monitored
  const activePlatforms = getMonitoredPlatforms().filter(p => p.enabled);
  
  console.log("Running scan on platforms:", activePlatforms.map(p => p.name).join(", "));
  
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));
  
  // Simulate finding new mentions
  const newMentionsCount = Math.floor(Math.random() * 5); // 0-4 new mentions
  
  // Generate mock mentions
  for (let i = 0; i < newMentionsCount; i++) {
    const randomPlatformIndex = Math.floor(Math.random() * activePlatforms.length);
    const platform = activePlatforms[randomPlatformIndex];
    
    saveMention(
      platform.name,
      generateRandomContent(platform.name),
      `https://example.com/${platform.id}/post/${Date.now() + i}`
    );
  }
  
  // Toast notification for user feedback
  toast.success("Analysis complete", {
    description: `Found ${newMentionsCount} new mentions and updated reputation metrics.`
  });
  
  return {
    success: true,
    newMentions: newMentionsCount
  };
};

// Helper function to generate random content for mock mentions
const generateRandomContent = (platform: string): string => {
  const contentTemplates = [
    "Just heard about {brand}. Their product seems interesting.",
    "Has anyone tried {brand} products? Thinking of buying one.",
    "I'm not happy with my experience with {brand}. Customer service was terrible.",
    "Love the new release from {brand}! Definitely recommend it.",
    "Saw an ad for {brand} today. Looks promising but not sure yet."
  ];
  
  const brandNames = ["YourBrand", "RepShield", "TechGiant", "EcoFriendly"];
  const randomBrand = brandNames[Math.floor(Math.random() * brandNames.length)];
  
  const templateIndex = Math.floor(Math.random() * contentTemplates.length);
  return contentTemplates[templateIndex].replace("{brand}", randomBrand);
};
