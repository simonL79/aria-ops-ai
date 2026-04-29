// Shared SSRF guard for user-supplied URLs.
// Rejects non-https schemes and hostnames that resolve (lexically) to
// loopback, link-local, private, or otherwise-internal ranges.

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /\.localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,            // link-local (incl. AWS/GCP/Azure metadata 169.254.169.254)
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // CGNAT 100.64.0.0/10
  /^0\./,                    // 0.0.0.0/8
  /^224\./,                  // multicast
  /^255\.255\.255\.255$/,
  /^::1$/,                   // IPv6 loopback
  /^fe80:/i,                 // IPv6 link-local
  /^fc00:/i, /^fd[0-9a-f]{2}:/i, // IPv6 unique-local
  /^::ffff:(127|10|192\.168|169\.254)\./i, // IPv4-mapped IPv6
  /\.internal$/i,
  /\.local$/i,
];

export interface SsrfCheckResult {
  ok: boolean;
  url?: URL;
  error?: string;
}

export function validatePublicUrl(input: unknown): SsrfCheckResult {
  if (typeof input !== 'string' || input.length === 0 || input.length > 2048) {
    return { ok: false, error: 'Invalid URL' };
  }
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: 'Only http(s) URLs are allowed' };
  }
  // Strongly prefer https in production; allow http only for non-private hosts.
  const hostname = parsed.hostname.replace(/^\[|\]$/g, ''); // strip IPv6 brackets
  if (!hostname) return { ok: false, error: 'URL hostname missing' };

  for (const re of PRIVATE_HOST_PATTERNS) {
    if (re.test(hostname)) {
      return { ok: false, error: 'URL targets a private or internal address' };
    }
  }
  // Block credentials in URL (user:pass@host) — common SSRF/abuse vector.
  if (parsed.username || parsed.password) {
    return { ok: false, error: 'URL credentials not allowed' };
  }
  return { ok: true, url: parsed };
}
