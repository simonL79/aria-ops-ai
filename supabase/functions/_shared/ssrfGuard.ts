// Shared SSRF guard for user-supplied URLs.
// Combines lexical hostname checks with DNS resolution + IP range validation
// to prevent bypasses via DNS rebinding, wildcard DNS, or unusual hostnames.

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
  resolvedIps?: string[];
  error?: string;
}

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function ipv4ToInt(ip: string): number | null {
  const m = ip.match(IPV4_RE);
  if (!m) return null;
  const parts = m.slice(1, 5).map(Number);
  if (parts.some((p) => p < 0 || p > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function ipv4InRange(ip: string, cidr: string): boolean {
  const [base, bitsStr] = cidr.split('/');
  const bits = Number(bitsStr);
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  if (ipInt === null || baseInt === null) return false;
  if (bits === 0) return true;
  const mask = (~0 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

const IPV4_BLOCKED_CIDRS = [
  '0.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',     // CGNAT
  '127.0.0.0/8',       // loopback
  '169.254.0.0/16',    // link-local + cloud metadata
  '172.16.0.0/12',
  '192.0.0.0/24',
  '192.0.2.0/24',
  '192.168.0.0/16',
  '198.18.0.0/15',
  '198.51.100.0/24',
  '203.0.113.0/24',
  '224.0.0.0/4',       // multicast
  '240.0.0.0/4',       // reserved + broadcast
];

export function isPrivateIp(ip: string): boolean {
  // IPv4
  if (IPV4_RE.test(ip)) {
    return IPV4_BLOCKED_CIDRS.some((cidr) => ipv4InRange(ip, cidr));
  }
  // IPv6 (lexical — sufficient for blocked ranges)
  const lower = ip.toLowerCase();
  if (lower === '::' || lower === '::1') return true;
  if (lower.startsWith('fe80:') || lower.startsWith('fec0:')) return true; // link/site local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;       // unique local
  if (lower.startsWith('ff')) return true;                                  // multicast
  // IPv4-mapped IPv6: ::ffff:a.b.c.d
  const mapped = lower.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (mapped) return isPrivateIp(mapped[1]);
  return false;
}

async function resolveHostname(hostname: string): Promise<string[]> {
  const ips = new Set<string>();
  // Deno.resolveDns is available in the edge runtime.
  const resolver: any = (globalThis as any).Deno?.resolveDns;
  if (typeof resolver !== 'function') return [];
  for (const rtype of ['A', 'AAAA'] as const) {
    try {
      const records: string[] = await resolver(hostname, rtype);
      for (const r of records) ips.add(r);
    } catch {
      // ignore — type may not exist
    }
  }
  return [...ips];
}

export async function validatePublicUrl(input: unknown): Promise<SsrfCheckResult> {
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
  if (parsed.username || parsed.password) {
    return { ok: false, error: 'URL credentials not allowed' };
  }
  const hostname = parsed.hostname.replace(/^\[|\]$/g, '');
  if (!hostname) return { ok: false, error: 'URL hostname missing' };

  // 1) Lexical pattern check (catches obvious cases + IP literals)
  for (const re of PRIVATE_HOST_PATTERNS) {
    if (re.test(hostname)) {
      return { ok: false, error: 'URL targets a private or internal address' };
    }
  }

  // If hostname is already an IP literal, validate via CIDR ranges too.
  if (IPV4_RE.test(hostname) || hostname.includes(':')) {
    if (isPrivateIp(hostname)) {
      return { ok: false, error: 'URL targets a private or internal IP' };
    }
    return { ok: true, url: parsed, resolvedIps: [hostname] };
  }

  // 2) DNS resolution — block if ANY resolved IP is private (defeats DNS rebinding/wildcards)
  let ips: string[] = [];
  try {
    ips = await resolveHostname(hostname);
  } catch {
    return { ok: false, error: 'DNS resolution failed' };
  }
  if (ips.length === 0) {
    return { ok: false, error: 'Hostname did not resolve' };
  }
  for (const ip of ips) {
    if (isPrivateIp(ip)) {
      return { ok: false, error: 'Hostname resolves to a private or internal IP' };
    }
  }
  return { ok: true, url: parsed, resolvedIps: ips };
}
