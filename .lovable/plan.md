

# Fix AI Intelligence Feed

## Problem
The `link` field in RSS items is wrapped in CDATA tags (`<![CDATA[https://...]]>`) that aren't being stripped, so clicking any article opens a broken URL.

## Fix

**File: `supabase/functions/ai-news-feed/index.ts`** — line 28

Add the same CDATA stripping that's already applied to `title` and `description`:

```typescript
// Before
const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() || '';

// After
const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim() || '';
```

One line changed, then redeploy the edge function.

