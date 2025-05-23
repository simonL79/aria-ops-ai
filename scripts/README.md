
# ARIA Health Check Script

This script provides a comprehensive health check for all ARIA input sources by querying the `scan_results` table in Supabase.

## What It Checks

✅ **Last post received per platform** (YouTube, Reddit, etc.)  
🧭 **Number of entries in last 24h**  
⚠️ **Missing platforms** (no posts in last 24-48h)  
🚨 **Potential threats detected**

## Setup

1. **Install dependencies:**
   ```bash
   cd scripts
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase service role key
   ```

3. **Run the health check:**
   ```bash
   npm run health-check
   ```

## Sample Output

```
🔍 ARIA Input Source Health Check
==================================
📅 Checking from: 5/23/2025, 7:03:21 AM

📊 Platform Status Summary:
✅ Healthy: 3
⚠️  Warnings: 2
❌ Errors: 0

✅ YouTube      | 12 entries (2 potential threats)
✅ Reddit       | 8 entries (1 potential threats)
✅ uk_news      | 15 entries (3 potential threats)
⚠️  Instagram   | No entries in last 24h (last: 5/21/2025, 3:45:12 PM)
⚠️  TikTok      | No entries in last 24h (last: 5/20/2025, 9:22:33 AM)
❌ Twitter      | No entries found at all

🔧 Active Scanners:
  • Reddit Scanner: Hourly via Supabase cron
  • RSS News: Every 2 hours via Supabase cron
  • YouTube RSS: Daily at 8 AM UTC via Supabase cron
  • Instagram/TikTok: External GitHub Actions (planned)

📈 Total entries in last 24h: 35

🚨 Action Required:
  ⚠️  2 platform(s) with no recent data
```

## Integration Ideas

- **Slack/Discord alerts:** Modify script to send results to webhooks
- **GitHub Actions:** Run daily as part of ops workflow
- **Monitoring dashboard:** Integrate results into the web interface
- **Email reports:** Send daily health summaries to admin

## Platform Mapping

The script checks these platforms based on the `platform` field in `scan_results`:
- `YouTube` - ARIA YouTube RSS scanner
- `Reddit` - Reddit scanner  
- `uk_news` - UK news RSS feeds
- `Instagram` - External scraper (planned)
- `TikTok` - External scraper (planned)
- `Twitter` - Twitter API integration (planned)
