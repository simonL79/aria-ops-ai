
import { ContentItem } from "@/types/monitor";

export const mockContent: ContentItem[] = [
  {
    id: '1',
    platform: 'Twitter',
    type: 'post',
    content: 'The worst experience I\'ve ever had with a company. Complete waste of money and time. #NeverAgain',
    date: '2 hours ago',
    sentiment: 'negative',
    impact: 'high',
    url: 'https://twitter.com/user/status/123456'
  },
  {
    id: '2',
    platform: 'Reddit',
    type: 'comment',
    content: 'Their customer service could be better, but overall the product works as advertised.',
    date: '1 day ago',
    sentiment: 'neutral',
    impact: 'low',
    url: 'https://reddit.com/r/subreddit/comments/123'
  },
  {
    id: '3',
    platform: 'Facebook',
    type: 'post',
    content: 'Very disappointed with the quality of the product I received. Not what I expected at all.',
    date: '3 days ago',
    sentiment: 'negative',
    impact: 'medium',
    url: 'https://facebook.com/post/123456'
  },
  {
    id: '4',
    platform: 'Yelp',
    type: 'review',
    content: 'One star service. The staff was rude and unprofessional. Will not be coming back!',
    date: '1 week ago',
    sentiment: 'negative',
    impact: 'high',
    url: 'https://yelp.com/biz/business/review/123456'
  },
  {
    id: '5',
    platform: 'Twitter',
    type: 'post',
    content: 'Actually had a great experience with their support team today. Problem solved quickly!',
    date: '2 days ago',
    sentiment: 'positive',
    impact: 'low',
    url: 'https://twitter.com/user/status/789012'
  }
];

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'negative': return 'bg-alert-negative text-white';
    case 'neutral': return 'bg-gray-500 text-white';
    case 'positive': return 'bg-alert-positive text-white';
    default: return 'bg-gray-200';
  }
};

export const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100';
  }
};
