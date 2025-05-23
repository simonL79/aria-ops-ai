
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use the project's Supabase configuration
const SUPABASE_URL = 'https://ssvskbejfacmjemphmry.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY not found in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PLATFORMS = ['YouTube', 'Reddit', 'uk_news', 'Instagram', 'TikTok', 'Twitter'];

interface HealthCheckResult {
  platform: string;
  status: 'healthy' | 'warning' | 'error';
  lastEntry?: string;
  count24h: number;
  message: string;
}

async function runHealthCheck(): Promise<void> {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
  const twoDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 48);

  console.log('🔍 ARIA Input Source Health Check');
  console.log('==================================');
  console.log(`📅 Checking from: ${yesterday.toLocaleString()}`);
  console.log('');

  const results: HealthCheckResult[] = [];

  for (const platform of PLATFORMS) {
    try {
      // Get recent entries for this platform
      const { data: recentData, error: recentError } = await supabase
        .from('scan_results')
        .select('created_at, severity, threat_type')
        .eq('platform', platform)
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false });

      if (recentError) {
        results.push({
          platform,
          status: 'error',
          count24h: 0,
          message: `Error: ${recentError.message}`
        });
        continue;
      }

      // Get the latest entry regardless of time
      const { data: latestData, error: latestError } = await supabase
        .from('scan_results')
        .select('created_at')
        .eq('platform', platform)
        .order('created_at', { ascending: false })
        .limit(1);

      if (latestError) {
        results.push({
          platform,
          status: 'error',
          count24h: 0,
          message: `Error fetching latest: ${latestError.message}`
        });
        continue;
      }

      const count24h = recentData?.length || 0;
      const latestEntry = latestData?.[0]?.created_at;

      if (count24h === 0) {
        const lastEntryDate = latestEntry ? new Date(latestEntry) : null;
        const isVeryOld = lastEntryDate && lastEntryDate < twoDaysAgo;
        
        results.push({
          platform,
          status: isVeryOld ? 'error' : 'warning',
          count24h: 0,
          lastEntry: latestEntry,
          message: latestEntry 
            ? `No entries in last 24h (last: ${new Date(latestEntry).toLocaleString()})`
            : 'No entries found at all'
        });
      } else {
        // Count threat levels
        const threats = recentData.filter(item => 
          item.severity === 'high' || 
          item.threat_type && !['system_message', 'scan'].includes(item.threat_type)
        );

        results.push({
          platform,
          status: 'healthy',
          count24h,
          lastEntry: latestEntry,
          message: `${count24h} entries (${threats.length} potential threats)`
        });
      }
    } catch (error) {
      results.push({
        platform,
        status: 'error',
        count24h: 0,
        message: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  // Display results
  const healthy = results.filter(r => r.status === 'healthy');
  const warnings = results.filter(r => r.status === 'warning');
  const errors = results.filter(r => r.status === 'error');

  console.log('📊 Platform Status Summary:');
  console.log(`✅ Healthy: ${healthy.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log('');

  // Show detailed results
  for (const result of results) {
    const icon = result.status === 'healthy' ? '✅' : 
                 result.status === 'warning' ? '⚠️ ' : '❌';
    
    console.log(`${icon} ${result.platform.padEnd(12)} | ${result.message}`);
  }

  console.log('');
  console.log('🔧 Active Scanners:');
  console.log('  • Reddit Scanner: Hourly via Supabase cron');
  console.log('  • RSS News: Every 2 hours via Supabase cron');
  console.log('  • YouTube RSS: Daily at 8 AM UTC via Supabase cron');
  console.log('  • Instagram/TikTok: External GitHub Actions (planned)');

  // Summary
  const totalEntries = results.reduce((sum, r) => sum + r.count24h, 0);
  console.log('');
  console.log(`📈 Total entries in last 24h: ${totalEntries}`);
  
  if (warnings.length > 0 || errors.length > 0) {
    console.log('');
    console.log('🚨 Action Required:');
    if (warnings.length > 0) {
      console.log(`  ⚠️  ${warnings.length} platform(s) with no recent data`);
    }
    if (errors.length > 0) {
      console.log(`  ❌ ${errors.length} platform(s) with errors`);
    }
  }

  // Send alerts if needed
  await sendAlertsIfNeeded(results);
}

async function sendAlertsIfNeeded(results: HealthCheckResult[]): Promise<void> {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  
  if (!SLACK_WEBHOOK_URL) {
    console.log('ℹ️  No Slack webhook configured - skipping alerts');
    return;
  }

  const errors = results.filter(r => r.status === 'error');
  const warnings = results.filter(r => r.status === 'warning');
  const highThreats = results.filter(r => r.count24h > 0 && r.message.includes('threats'))
    .reduce((sum, r) => {
      const match = r.message.match(/(\d+) potential threats/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

  // Determine if we should alert
  const shouldAlert = errors.length > 0 || warnings.length >= 3 || highThreats > 3;

  if (!shouldAlert) {
    console.log('✅ No alerts needed - all systems operational');
    return;
  }

  // Build Slack message
  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 ARIA Health Check Alert",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Errors:* ${errors.length}`
          },
          {
            type: "mrkdwn",
            text: `*Warnings:* ${warnings.length}`
          },
          {
            type: "mrkdwn",
            text: `*High Threats (24h):* ${highThreats}`
          },
          {
            type: "mrkdwn",
            text: `*Time:* ${new Date().toLocaleString()}`
          }
        ]
      }
    ]
  };

  // Add error details
  if (errors.length > 0) {
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*❌ Errors:*\n${errors.map(e => `• ${e.platform}: ${e.message}`).join('\n')}`
      }
    } as any);
  }

  // Add warning details
  if (warnings.length > 0) {
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*⚠️ Warnings:*\n${warnings.map(w => `• ${w.platform}: ${w.message}`).join('\n')}`
      }
    } as any);
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (response.ok) {
      console.log('📢 Alert sent to Slack successfully');
    } else {
      console.error('❌ Failed to send Slack alert:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack alert:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runHealthCheck().catch(console.error);
}

export { runHealthCheck };
