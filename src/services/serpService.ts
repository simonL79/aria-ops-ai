
import { SERPResult, SeoMetrics } from "../types/serp";

export const getSerpResults = (): SERPResult[] => {
  return [
    {
      position: 1,
      previousPosition: 1,
      url: "https://yourwebsite.com",
      title: "Official Website | Your Brand",
      type: "owned"
    },
    {
      position: 2,
      previousPosition: 5,
      url: "https://yourblog.com/about",
      title: "About Us | Your Brand Blog",
      type: "owned"
    },
    {
      position: 3,
      previousPosition: 2,
      url: "https://thirdparty.com/review",
      title: "Your Brand Review - Trusted Source",
      type: "neutral"
    },
    {
      position: 4,
      previousPosition: 3,
      url: "https://news.example.com/story",
      title: "Breaking: Controversy at Your Brand",
      type: "negative"
    },
    {
      position: 5,
      previousPosition: 8,
      url: "https://social.example.com/discussion",
      title: "Discussion: Your Brand Experience",
      type: "neutral"
    }
  ];
};

export const getSeoMetrics = (): SeoMetrics => {
  return {
    ownedResults: 4,
    negativeResults: 2,
    controlScore: 68,
    visibilityScore: 72
  };
};
