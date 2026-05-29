import React from 'react';

/**
 * Site-wide statistical / outcome disclaimer.
 * Apply beneath any reference to outcomes, suppression rates, response
 * times, threat reduction or protected brand value across landing pages.
 */
export const STAT_DISCLAIMER_TEXT =
  'Representative outcomes from anonymised client engagements. Figures are illustrative and not a guarantee of results. Outcomes vary depending on platform, content type, jurisdiction and the nature of the threat. No reputable provider can guarantee removal or suppression of online content.';

interface StatDisclaimerProps {
  className?: string;
}

const StatDisclaimer: React.FC<StatDisclaimerProps> = ({ className = '' }) => (
  <p
    className={`text-xs text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto text-center ${className}`}
  >
    {STAT_DISCLAIMER_TEXT}
  </p>
);

export default StatDisclaimer;
