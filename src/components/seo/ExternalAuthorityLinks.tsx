import React from 'react';

/**
 * Outbound authority links from A.R.I.A to simon-lindsay.com.
 *
 * Intentionally rendered with rotated, varied anchor text on athlete /
 * founder cluster pages to (a) signal topical authority back to the
 * personal-brand domain and (b) give the partner domain reciprocal,
 * non-spammy anchors back to A.R.I.A (see public/external-link-spec.md).
 *
 * dofollow — these are deliberate authority links.
 */
const ANCHORS = [
  { href: 'https://simon-lindsay.com/', text: 'commercial reputation protection for athletes' },
  { href: 'https://simon-lindsay.com/commercial-strategist', text: 'sports commercial strategist' },
  { href: 'https://simon-lindsay.com/athlete-commercial-management', text: 'athlete commercial management' },
];

const ExternalAuthorityLinks: React.FC = () => {
  return (
    <section className="container mx-auto px-6 py-10 max-w-5xl">
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm uppercase tracking-widest text-primary mb-3">
          Working with Simon Lindsay
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          A.R.I.A’s athlete and founder engagements are frequently delivered
          alongside Simon Lindsay’s commercial advisory practice — covering{' '}
          {ANCHORS.map((a, i) => (
            <React.Fragment key={a.href}>
              <a
                href={a.href}
                className="text-primary hover:underline"
                rel="noopener"
              >
                {a.text}
              </a>
              {i < ANCHORS.length - 1 ? (i === ANCHORS.length - 2 ? ' and ' : ', ') : ''}
            </React.Fragment>
          ))}
          .
        </p>
      </div>
    </section>
  );
};

export default ExternalAuthorityLinks;
