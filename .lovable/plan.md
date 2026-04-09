

# Add Live AI News Section to Homepage

## What

A new "AI Intelligence Feed" section on the homepage that scrapes live headlines from aibusiness.com via a Supabase Edge Function, displaying them in the dark premium theme as a curated news ticker / card grid.

## How It Works

Since aibusiness.com is a public website, we'll use a Firecrawl-based edge function to scrape the latest headlines on demand, cache them in Supabase, and display them in a styled section on the homepage.

However, the simpler and more reliable approach: **use an RSS feed**. AI Business publishes RSS at `https://aibusiness.com/rss.xml`. We already have RSS scraping infrastructure (`supabase/functions/rss-scraper/`).

## Changes

### 1. New Edge Function: `ai-news-feed`
**File: `supabase/functions/ai-news-feed/index.ts`** (new)

- Fetches `https://aibusiness.com/rss.xml` 
- Parses XML to extract title, link, pubDate, description, and image URL from each item
- Returns the latest 8-10 articles as JSON
- Includes CORS headers for browser access
- Caches results in a `ai_news_cache` table (optional, for performance)

### 2. New Section Component: `AINewsFeedSection`
**File: `src/components/sections/AINewsFeedSection.tsx`** (new)

- Calls the edge function on mount via `supabase.functions.invoke('ai-news-feed')`
- Displays a section titled "AI Intelligence Feed" with subtitle "Live from AI Business"
- Shows 6 news cards in a 3-column grid (2 on tablet, 1 on mobile)
- Each card: headline, date, source badge, and "Read More" link opening in new tab
- Skeleton loading state while fetching
- Styled in the existing dark theme: `bg-background`, `glass-card`, `text-primary` accents
- Uses `useScrollReveal` for entrance animation (matches other sections)

### 3. Add to Homepage
**File: `src/pages/HomePage.tsx`**

- Import and place `<AINewsFeedSection />` between `ServicesSection` and `HowItWorksSection` (or after TrustSection — between credibility and pricing)

## Design

Cards will match the premium dark aesthetic:
- Glass-card background with border-border
- Headline in white, date in muted-foreground
- Blue primary accent on hover
- External link icon on each card
- "Powered by AI Business" attribution at bottom

## Files Summary

| File | Action |
|------|--------|
| `supabase/functions/ai-news-feed/index.ts` | Create — RSS fetch + parse |
| `src/components/sections/AINewsFeedSection.tsx` | Create — news grid UI |
| `src/pages/HomePage.tsx` | Edit — add section |

