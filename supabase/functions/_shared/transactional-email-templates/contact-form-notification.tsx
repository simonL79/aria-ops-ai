import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "A.R.I.A™"

interface ContactFormNotificationProps {
  name?: string
  email?: string
  company?: string
  message?: string
}

const ContactFormNotificationEmail = ({ name, email, company, message }: ContactFormNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>
        <Text style={text}>You've received a new enquiry via the {SITE_NAME} website.</Text>

        <Section style={detailsSection}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || 'Not provided'}</Text>

          <Text style={label}>Email</Text>
          <Text style={value}>{email || 'Not provided'}</Text>

          {company && (
            <>
              <Text style={label}>Company</Text>
              <Text style={value}>{company}</Text>
            </>
          )}

          <Text style={label}>Message</Text>
          <Text style={value}>{message || 'No message provided'}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>This email was sent from the {SITE_NAME} contact form.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormNotificationEmail,
  subject: (data: Record<string, any>) => `New enquiry from ${data.name || 'website visitor'}`,
  displayName: 'Contact form notification',
  to: 'simon@ariaops.co.uk',
  previewData: { name: 'Jane Smith', email: 'jane@example.com', company: 'Acme Corp', message: 'I need help with reputation management.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica', sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const detailsSection = { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px 24px', margin: '0 0 24px' }
const label = { fontSize: '12px', color: '#6b7280', fontWeight: 'bold' as const, textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '12px 0 2px' }
const value = { fontSize: '14px', color: '#111827', margin: '0 0 8px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0' }
