
import { RSSFeed } from './types.ts';

// Environment variables
export const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
export const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const ARIA_INGEST_KEY = Deno.env.get('ARIA_INGEST_KEY');

// CORS headers for browser requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UK-focused RSS feeds for celebrities, sports personalities, and general news
export const RSS_FEEDS: RSSFeed[] = [
  // UK Celebrity & Entertainment News
  { url: 'https://www.thesun.co.uk/tvandshowbiz/feed/', name: 'The Sun - TV & Showbiz' },
  { url: 'https://www.dailymail.co.uk/tvshowbiz/index.rss', name: 'Daily Mail - TV & Showbiz' },
  { url: 'https://www.mirror.co.uk/3am/feed/', name: 'The Mirror - 3AM Celebrity News' },
  { url: 'https://www.ok.co.uk/celebrity-news/rss.xml', name: 'OK! Magazine Celebrity News' },
  { url: 'https://www.hellomagazine.com/rss/celebrities/', name: 'Hello! Magazine - Celebrities' },
  { url: 'https://www.digitalspy.com/rss/showbiz.xml', name: 'Digital Spy - Showbiz' },
  
  // UK Sports News
  { url: 'https://www.bbc.co.uk/sport/rss.xml', name: 'BBC Sport' },
  { url: 'https://www.theguardian.com/uk/sport/rss', name: 'The Guardian - UK Sport' },
  { url: 'https://www.skysports.com/rss/12040', name: 'Sky Sports News' },
  { url: 'https://www.independent.co.uk/sport/rss', name: 'The Independent - Sport' },
  { url: 'https://talksport.com/feed/', name: 'talkSPORT' },
  { url: 'https://www.telegraph.co.uk/sport/rss.xml', name: 'The Telegraph - Sport' },
  
  // UK Football (Premier League focus)
  { url: 'https://www.bbc.co.uk/sport/football/rss.xml', name: 'BBC Sport - Football' },
  { url: 'https://www.theguardian.com/football/rss', name: 'The Guardian - Football' },
  { url: 'https://www.skysports.com/rss/12691', name: 'Sky Sports - Premier League' },
  
  // UK General News (for public figures)
  { url: 'https://www.bbc.co.uk/news/rss.xml', name: 'BBC News' },
  { url: 'https://www.theguardian.com/uk/rss', name: 'The Guardian - UK News' },
  { url: 'https://www.independent.co.uk/news/uk/rss', name: 'The Independent - UK News' },
  { url: 'https://www.telegraph.co.uk/news/rss.xml', name: 'The Telegraph - News' },
  
  // UK Business & Politics (public figures)
  { url: 'https://www.bbc.co.uk/news/business/rss.xml', name: 'BBC Business' },
  { url: 'https://www.bbc.co.uk/news/politics/rss.xml', name: 'BBC Politics' },
  { url: 'https://www.theguardian.com/politics/rss', name: 'The Guardian - Politics' },
  { url: 'https://www.ft.com/rss/home/uk', name: 'Financial Times - UK' }
];

// UK-focused keywords for public figure threats and reputation risks
export const THREAT_KEYWORDS = [
  // Legal issues
  'lawsuit', 'sued', 'charges', 'arrested', 'investigation', 'fraud', 'scandal',
  'court', 'trial', 'guilty', 'conviction', 'settlement', 'legal action', 'charged',
  
  // UK-specific legal terms
  'magistrates court', 'crown court', 'tribunal', 'police investigation', 'CPS',
  'serious fraud office', 'ofcom investigation', 'parliamentary inquiry',
  
  // Behavioral issues
  'controversy', 'backlash', 'criticism', 'outrage', 'offensive', 'inappropriate',
  'misconduct', 'behaviour', 'allegations', 'accused', 'denied', 'apology',
  'racism', 'sexism', 'harassment', 'discrimination',
  
  // Career/reputation damage
  'fired', 'suspended', 'dropped', 'cancelled', 'boycott', 'loses sponsorship',
  'contract terminated', 'banned', 'excluded', 'resignation', 'stepped down',
  'sacked', 'dismissed', 'stripped of title', 'loses endorsement',
  
  // UK Sports specific
  'transfer saga', 'doping', 'performance enhancing', 'match fixing', 'betting scandal',
  'relegated', 'points deduction', 'FA investigation', 'premier league',
  
  // UK Celebrity specific
  'divorce battle', 'custody dispute', 'rehab', 'mental health crisis',
  'tax avoidance', 'offshore accounts', 'bankruptcy', 'financial troubles',
  
  // Social media/public relations
  'viral', 'trending', 'social media storm', 'twitter row', 'instagram drama',
  'leaked', 'exposed', 'caught', 'video surfaces', 'photos leaked', 'paparazzi',
  
  // UK Media specific
  'tabloid exclusive', 'kiss and tell', 'phone hacking', 'privacy breach',
  'injunction', 'super injunction', 'gagging order'
];
