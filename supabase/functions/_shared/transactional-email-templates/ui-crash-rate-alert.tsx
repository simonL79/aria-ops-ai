import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "A.R.I.A™ Monitoring"

interface CrashRateAlertProps {
  section?: string
  errorCount?: number
  threshold?: number
  windowMinutes?: number
  sampleMessages?: string[]
  errorLogUrl?: string
}

const CrashRateAlertEmail = ({
  section = 'All sections',
  errorCount = 0,
  threshold = 0,
  windowMinutes = 60,
  sampleMessages = [],
  errorLogUrl,
}: CrashRateAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`${errorCount} UI errors in ${section} (threshold ${threshold})`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerKicker}>{SITE_NAME} — UI CRASH RATE ALERT</Text>
          <Heading style={headerTitle}>{section}</Heading>
        </Section>

        <Section style={{ padding: '20px 24px' }}>
          <Text style={text}>
            <strong>{errorCount}</strong> client errors were recorded in the last{' '}
            <strong>{windowMinutes} minutes</strong>, exceeding the configured threshold of{' '}
            <strong>{threshold}</strong>.
          </Text>

          {sampleMessages.length > 0 && (
            <>
              <Hr style={hr} />
              <Text style={label}>Recent messages</Text>
              {sampleMessages.map((m, i) => (
                <Text key={i} style={mono}>• {m}</Text>
              ))}
            </>
          )}

          {errorLogUrl && (
            <>
              <Hr style={hr} />
              <Text style={text}>
                <Link href={errorLogUrl} style={link}>Open the admin error log →</Link>
              </Text>
            </>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#15121F', fontFamily: 'ui-sans-serif, system-ui, sans-serif', margin: 0, padding: '24px 0' }
const container = { backgroundColor: '#1C172B', borderRadius: '10px', maxWidth: '560px', margin: '0 auto', overflow: 'hidden' as const }
const header = { backgroundColor: '#b91c1c', padding: '18px 24px' }
const headerKicker = { color: 'rgba(255,255,255,0.85)', fontSize: '11px', letterSpacing: '1px', margin: '0 0 4px' }
const headerTitle = { color: '#ffffff', fontSize: '20px', margin: 0 }
const text = { color: '#CBD5E1', fontSize: '14px', lineHeight: '22px', margin: '0 0 8px' }
const label = { color: '#94A3B8', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '0 0 6px' }
const mono = { color: '#F8FAFC', fontSize: '12px', fontFamily: 'ui-monospace, monospace', margin: '0 0 4px', wordBreak: 'break-word' as const }
const hr = { borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }
const link = { color: '#A78BFA' }

export const template: TemplateEntry = {
  component: CrashRateAlertEmail,
  displayName: 'UI Crash Rate Alert',
  subject: (data: Record<string, any>) =>
    `UI crash rate alert: ${data?.errorCount ?? 0} errors in ${data?.section ?? 'the app'}`,
  previewData: {
    section: 'Portal · Resurfacing Alerts',
    errorCount: 12,
    threshold: 5,
    windowMinutes: 60,
    sampleMessages: ['Cannot read properties of undefined', 'permission denied for table'],
    errorLogUrl: 'https://ariaops.co.uk/admin/error-log',
  },
}
