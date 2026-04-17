import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "A.R.I.A™ EIDETIC"

interface DigestEvent {
  id: string
  severity: string
  event_type: string
  narrative_category?: string | null
  content_excerpt?: string | null
  content_url?: string | null
  created_at: string
}

interface DigestProps {
  digestType?: 'daily' | 'weekly'
  periodLabel?: string
  totalEvents?: number
  criticalCount?: number
  highCount?: number
  mediumCount?: number
  resolvedCount?: number
  topEvents?: DigestEvent[]
  preferencesUrl?: string
  dashboardUrl?: string
}

const sevColor = (s?: string) =>
  s === 'critical' ? '#dc2626' : s === 'high' ? '#ea580c' : s === 'medium' ? '#ca8a04' : '#6b7280'

const DigestEmail = ({
  digestType = 'daily', periodLabel = 'last 24 hours',
  totalEvents = 0, criticalCount = 0, highCount = 0, mediumCount = 0, resolvedCount = 0,
  topEvents = [], preferencesUrl, dashboardUrl,
}: DigestProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`EIDETIC ${digestType} digest — ${totalEvents} events`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerKicker}>{SITE_NAME} — {digestType.toUpperCase()} DIGEST</Text>
          <Heading style={headerTitle}>Memory activity, {periodLabel}</Heading>
        </Section>

        <Section style={body}>
          <Section style={summary}>
            <Text style={summaryRow}>
              <span style={{ ...pill, backgroundColor: '#fee2e2', color: '#991b1b' }}>{criticalCount} critical</span>
              <span style={{ ...pill, backgroundColor: '#ffedd5', color: '#9a3412' }}>{highCount} high</span>
              <span style={{ ...pill, backgroundColor: '#fef3c7', color: '#92400e' }}>{mediumCount} medium</span>
              <span style={{ ...pill, backgroundColor: '#d1fae5', color: '#065f46' }}>{resolvedCount} resolved</span>
            </Text>
          </Section>

          {topEvents.length === 0 ? (
            <Text style={text}>No new resurfacing events in this period. All clear.</Text>
          ) : (
            <>
              <Text style={sectionHeading}>Top events</Text>
              {topEvents.map((ev) => (
                <Section key={ev.id} style={{ ...eventCard, borderLeftColor: sevColor(ev.severity) }}>
                  <Text style={eventMeta}>
                    <span style={{ ...miniPill, color: sevColor(ev.severity), borderColor: sevColor(ev.severity) }}>
                      {String(ev.severity).toUpperCase()}
                    </span>
                    <span style={eventType}>{String(ev.event_type).replace(/_/g, ' ')}</span>
                    {ev.narrative_category && <span style={eventCat}> · {ev.narrative_category}</span>}
                  </Text>
                  {ev.content_excerpt && <Text style={eventExcerpt}>{ev.content_excerpt}</Text>}
                  {ev.content_url && (
                    <Text style={eventLinkRow}><Link href={ev.content_url} style={link}>View source →</Link></Text>
                  )}
                </Section>
              ))}
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            {dashboardUrl && <Link href={dashboardUrl} style={footerLink}>Open dashboard</Link>}
            {dashboardUrl && preferencesUrl && ' · '}
            {preferencesUrl && <Link href={preferencesUrl} style={footerLink}>Manage alert preferences</Link>}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DigestEmail,
  subject: (d: Record<string, any>) => {
    const t = d.digestType === 'weekly' ? 'Weekly' : 'Daily'
    return `${t} EIDETIC digest — ${d.totalEvents ?? 0} events (${d.criticalCount ?? 0} critical)`
  },
  displayName: 'EIDETIC digest',
  previewData: {
    digestType: 'daily',
    periodLabel: 'last 24 hours',
    totalEvents: 7, criticalCount: 1, highCount: 3, mediumCount: 3, resolvedCount: 4,
    topEvents: [
      { id: '1', severity: 'critical', event_type: 'new_high_threat', narrative_category: 'legal', content_excerpt: 'New high-authority article detected.', content_url: 'https://example.com/a', created_at: new Date().toISOString() },
      { id: '2', severity: 'high', event_type: 'decay_reversal', narrative_category: 'reputational', content_excerpt: 'Previously dormant content resurfaced.', content_url: 'https://example.com/b', created_at: new Date().toISOString() },
    ],
    preferencesUrl: 'https://ariaops.co.uk/admin/eidetic/preferences',
    dashboardUrl: 'https://ariaops.co.uk/admin',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "-apple-system, 'Segoe UI', Arial, sans-serif" }
const container = { padding: '24px 0', maxWidth: '640px', margin: '0 auto' }
const header = { padding: '20px 24px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '8px 8px 0 0' }
const headerKicker = { fontSize: '11px', letterSpacing: '1px', opacity: 0.7, margin: '0 0 4px', color: '#ffffff' }
const headerTitle = { fontSize: '20px', fontWeight: 'bold' as const, margin: '0', color: '#ffffff' }
const body = { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px' }
const summary = { margin: '0 0 20px' }
const summaryRow = { margin: '0', fontSize: '13px', lineHeight: '2' }
const pill = { display: 'inline-block', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' as const, marginRight: '6px' }
const sectionHeading = { fontSize: '13px', fontWeight: 'bold' as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '8px 0 12px' }
const text = { fontSize: '14px', color: '#111827', lineHeight: '1.6', margin: '0 0 14px' }
const eventCard = { padding: '12px 14px', backgroundColor: '#f9fafb', borderLeft: '3px solid #6b7280', borderRadius: '4px', margin: '0 0 10px' }
const eventMeta = { fontSize: '12px', margin: '0 0 6px' }
const miniPill = { display: 'inline-block', padding: '2px 8px', border: '1px solid', borderRadius: '999px', fontSize: '10px', fontWeight: 'bold' as const, marginRight: '8px' }
const eventType = { color: '#111827', fontWeight: 'bold' as const, textTransform: 'capitalize' as const }
const eventCat = { color: '#6b7280' }
const eventExcerpt = { fontSize: '13px', color: '#374151', margin: '4px 0' }
const eventLinkRow = { fontSize: '12px', margin: '4px 0 0' }
const link = { color: '#2563eb', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0 12px' }
const footer = { fontSize: '12px', color: '#6b7280', margin: '0' }
const footerLink = { color: '#2563eb', textDecoration: 'none' }
