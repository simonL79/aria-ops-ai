import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "A.R.I.A™ EIDETIC"

interface ResurfacingAlertProps {
  severity?: string
  eventType?: string
  narrativeCategory?: string
  prevDecay?: number | null
  newDecay?: number | null
  prevThreat?: number | null
  newThreat?: number | null
  contentExcerpt?: string
  contentUrl?: string
  preferencesUrl?: string
}

const fmtPct = (n: number | null | undefined) =>
  (n === null || n === undefined) ? '—' : `${(Number(n) * 100).toFixed(0)}%`

const sevColor = (s?: string) =>
  s === 'critical' ? '#dc2626' : s === 'high' ? '#ea580c' : s === 'medium' ? '#ca8a04' : '#6b7280'

const ResurfacingAlertEmail = ({
  severity = 'medium', eventType = 'event', narrativeCategory,
  prevDecay, newDecay, prevThreat, newThreat,
  contentExcerpt, contentUrl, preferencesUrl,
}: ResurfacingAlertProps) => {
  const sev = String(severity).toUpperCase()
  const color = sevColor(severity)
  const label = String(eventType).replace(/_/g, ' ')
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`${sev}: ${label}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ ...header, backgroundColor: color }}>
            <Text style={headerKicker}>{SITE_NAME} ALERT — {sev}</Text>
            <Heading style={headerTitle}>{label}</Heading>
          </Section>
          <Section style={body}>
            <Text style={text}>A previously stable digital memory has shifted state and requires attention.</Text>
            <Section style={statsBox}>
              {(prevDecay != null || newDecay != null) && (
                <Text style={statRow}><span style={statLabel}>Decay</span> <b>{fmtPct(prevDecay)}</b> → <b>{fmtPct(newDecay)}</b></Text>
              )}
              {(prevThreat != null || newThreat != null) && (
                <Text style={statRow}><span style={statLabel}>Threat (30d)</span> <b>{fmtPct(prevThreat)}</b> → <b>{fmtPct(newThreat)}</b></Text>
              )}
              {narrativeCategory && (
                <Text style={statRow}><span style={statLabel}>Category</span> {narrativeCategory}</Text>
              )}
            </Section>
            {contentExcerpt && (
              <Section style={{ ...excerpt, borderLeftColor: color }}>
                <Text style={excerptText}>{contentExcerpt}</Text>
              </Section>
            )}
            {contentUrl && (
              <Text style={text}><Link href={contentUrl} style={link}>View source →</Link></Text>
            )}
            <Hr style={hr} />
            <Text style={footer}>
              Acknowledge this in the EIDETIC dashboard to clear it from the active queue.
              {preferencesUrl && (<> · <Link href={preferencesUrl} style={footerLink}>Manage alerts</Link></>)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ResurfacingAlertEmail,
  subject: (d: Record<string, any>) => `EIDETIC ${String(d.severity || 'alert').toUpperCase()}: ${String(d.eventType || 'event').replace(/_/g, ' ')}`,
  displayName: 'EIDETIC resurfacing alert',
  previewData: {
    severity: 'high', eventType: 'decay_reversal', narrativeCategory: 'reputational',
    prevDecay: 0.85, newDecay: 0.32, prevThreat: 0.4, newThreat: 0.72,
    contentExcerpt: 'A previously dormant article has resurfaced on a high-authority domain.',
    contentUrl: 'https://example.com/article',
    preferencesUrl: 'https://ariaops.co.uk/admin/eidetic/preferences',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "-apple-system, 'Segoe UI', Arial, sans-serif" }
const container = { padding: '24px 0', maxWidth: '600px', margin: '0 auto' }
const header = { padding: '20px 24px', borderRadius: '8px 8px 0 0', color: '#ffffff' }
const headerKicker = { fontSize: '11px', letterSpacing: '1px', opacity: 0.85, margin: '0 0 4px', color: '#ffffff' }
const headerTitle = { fontSize: '20px', fontWeight: 'bold' as const, margin: '0', color: '#ffffff', textTransform: 'capitalize' as const }
const body = { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px' }
const text = { fontSize: '14px', color: '#111827', lineHeight: '1.6', margin: '0 0 14px' }
const statsBox = { backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px 16px', margin: '0 0 16px' }
const statRow = { fontSize: '13px', color: '#111827', margin: '6px 0' }
const statLabel = { color: '#6b7280', display: 'inline-block', minWidth: '110px' }
const excerpt = { padding: '12px 14px', backgroundColor: '#f9fafb', borderLeft: '3px solid #6b7280', margin: '0 0 14px' }
const excerptText = { fontSize: '13px', color: '#374151', margin: '0' }
const link = { color: '#2563eb', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0 12px' }
const footer = { fontSize: '12px', color: '#6b7280', margin: '0' }
const footerLink = { color: '#2563eb', textDecoration: 'none' }
