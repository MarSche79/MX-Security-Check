/**
 * DNS-over-HTTPS Service
 * Uses Cloudflare's DNS JSON API to perform DNS lookups from the app.
 * This avoids the need for native DNS modules.
 */

const DNS_API = 'https://cloudflare-dns.com/dns-query';

interface DNSResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: { name: string; type: number }[];
  Answer?: DNSAnswer[];
  Authority?: DNSAnswer[];
}

interface DNSAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

// DNS Record Types
const DNS_TYPE = {
  A: 1,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  AAAA: 28,
} as const;

/**
 * Query DNS records using Cloudflare DNS-over-HTTPS
 */
const MAX_RESPONSE_SIZE = 1024 * 100; // 100KB max response
const DNS_TIMEOUT_MS = 10000; // 10 second timeout

async function queryDNS(name: string, type: string): Promise<DNSAnswer[]> {
  // Validate inputs
  if (!name || typeof name !== 'string' || name.length > 253) {
    return [];
  }
  const allowedTypes = ['MX', 'TXT', 'CNAME', 'A', 'AAAA'];
  if (!allowedTypes.includes(type)) {
    return [];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DNS_TIMEOUT_MS);

    const url = `${DNS_API}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/dns-json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`DNS query failed with status ${response.status}`);
    }

    // Check content-length to avoid processing oversized responses
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      throw new Error('DNS response too large');
    }

    const text = await response.text();
    if (text.length > MAX_RESPONSE_SIZE) {
      throw new Error('DNS response too large');
    }

    const data: DNSResponse = JSON.parse(text);

    if (data.Status !== 0) {
      return [];
    }

    // Validate response structure
    if (!Array.isArray(data.Answer)) {
      return [];
    }

    return data.Answer;
  } catch (error) {
    // Don't log domain names to console in production to avoid info leakage
    if (__DEV__) {
      console.warn(`DNS query error for ${name} (${type}):`, error);
    }
    return [];
  }
}

/**
 * Clean TXT record data by removing surrounding quotes and concatenating chunks
 */
function cleanTXTData(data: string): string {
  // DNS TXT records may be split into 255-byte chunks wrapped in quotes
  // e.g., "v=spf1 " "include:example.com " "~all"
  return data
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/"\s*"/g, '')
    .trim();
}

/**
 * Lookup MX records for a domain
 */
export async function lookupMX(
  domain: string
): Promise<{ priority: number; exchange: string }[]> {
  const answers = await queryDNS(domain, 'MX');

  return answers
    .filter((a) => a.type === DNS_TYPE.MX)
    .map((a) => {
      const parts = a.data.split(' ');
      return {
        priority: parseInt(parts[0], 10),
        exchange: (parts[1] || '').replace(/\.$/, '').toLowerCase(),
      };
    })
    .filter((r) => r.exchange)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Lookup all TXT records for a domain
 */
export async function lookupTXT(domain: string): Promise<string[]> {
  const answers = await queryDNS(domain, 'TXT');

  return answers
    .filter((a) => a.type === DNS_TYPE.TXT)
    .map((a) => cleanTXTData(a.data));
}

/**
 * Lookup SPF record (v=spf1) from TXT records
 */
export async function lookupSPF(domain: string): Promise<string | null> {
  const txts = await lookupTXT(domain);
  const spf = txts.find((t) => t.toLowerCase().startsWith('v=spf1'));
  return spf || null;
}

/**
 * Lookup DMARC record from _dmarc.{domain}
 */
export async function lookupDMARC(domain: string): Promise<string | null> {
  const txts = await lookupTXT(`_dmarc.${domain}`);
  const dmarc = txts.find((t) => t.toLowerCase().startsWith('v=dmarc1'));
  return dmarc || null;
}

/**
 * Lookup DKIM record for a specific selector
 */
export async function lookupDKIM(
  domain: string,
  selector: string
): Promise<string | null> {
  const txts = await lookupTXT(`${selector}._domainkey.${domain}`);
  if (txts.length > 0) {
    return txts[0];
  }

  // Some DKIM records are CNAME'd - check for CNAME
  const cnameAnswers = await queryDNS(
    `${selector}._domainkey.${domain}`,
    'CNAME'
  );
  if (cnameAnswers.length > 0) {
    // CNAME exists, which means DKIM is configured via redirect
    return `CNAME: ${cnameAnswers[0].data.replace(/\.$/, '')}`;
  }

  return null;
}

/**
 * Common DKIM selectors to try, organized by vendor
 */
export const DKIM_SELECTORS: { selector: string; vendor: string }[] = [
  // Google Workspace
  { selector: 'google', vendor: 'Google Workspace' },
  // Microsoft 365
  { selector: 'selector1', vendor: 'Microsoft 365' },
  { selector: 'selector2', vendor: 'Microsoft 365' },
  // Proofpoint
  { selector: 'proofpoint', vendor: 'Proofpoint' },
  { selector: 's1', vendor: 'Generic / Proofpoint' },
  { selector: 's2', vendor: 'Generic / Proofpoint' },
  // Mimecast
  { selector: 'mimecast20190104', vendor: 'Mimecast' },
  { selector: 'mimecast', vendor: 'Mimecast' },
  // Mailchimp / Mandrill
  { selector: 'k1', vendor: 'Mailchimp' },
  { selector: 'mandrill', vendor: 'Mandrill' },
  // Amazon SES
  { selector: 'amazonses', vendor: 'Amazon SES' },
  // SendGrid
  { selector: 'smtpapi', vendor: 'SendGrid' },
  { selector: 'em', vendor: 'SendGrid' },
  // Salesforce
  { selector: 'salesforce', vendor: 'Salesforce' },
  { selector: 'sf', vendor: 'Salesforce' },
  // HubSpot
  { selector: 'hs1', vendor: 'HubSpot' },
  { selector: 'hs2', vendor: 'HubSpot' },
  { selector: 'hubspot', vendor: 'HubSpot' },
  // Zendesk
  { selector: 'zendesk1', vendor: 'Zendesk' },
  { selector: 'zendesk2', vendor: 'Zendesk' },
  // Postmark
  { selector: 'postmark', vendor: 'Postmark' },
  // Generic / Defaults
  { selector: 'default', vendor: '' },
  { selector: 'dkim', vendor: '' },
  { selector: 'mail', vendor: '' },
  { selector: 'key1', vendor: '' },
  { selector: 'email', vendor: '' },
];

/**
 * Try all known DKIM selectors and return those that have records
 */
export async function lookupAllDKIM(
  domain: string
): Promise<{ selector: string; raw: string; found: boolean }[]> {
  const results: { selector: string; raw: string; found: boolean }[] = [];

  // Query all selectors concurrently in batches to avoid overwhelming
  const batchSize = 8;
  for (let i = 0; i < DKIM_SELECTORS.length; i += batchSize) {
    const batch = DKIM_SELECTORS.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async ({ selector }) => {
        const record = await lookupDKIM(domain, selector);
        return {
          selector,
          raw: record || '',
          found: !!record,
        };
      })
    );
    results.push(...batchResults.filter((r) => r.found));
  }

  return results;
}

/**
 * Parse SPF record into components
 */
export function parseSPF(raw: string): {
  mechanisms: string[];
  qualifier: string;
  includes: string[];
} {
  const parts = raw.split(/\s+/);
  const mechanisms = parts.filter((p) => p !== 'v=spf1');
  const includes = mechanisms
    .filter((m) => m.startsWith('include:'))
    .map((m) => m.replace('include:', ''));

  let qualifier = 'neutral';
  if (raw.includes('-all')) qualifier = '-all (hard fail)';
  else if (raw.includes('~all')) qualifier = '~all (soft fail)';
  else if (raw.includes('?all')) qualifier = '?all (neutral)';
  else if (raw.includes('+all')) qualifier = '+all (pass all - INSECURE)';

  return { mechanisms, qualifier, includes };
}

/**
 * Parse DMARC record into components
 */
export function parseDMARC(raw: string): {
  policy: string;
  subdomainPolicy?: string;
  percentage?: number;
  rua?: string[];
  ruf?: string[];
  adkim?: string;
  aspf?: string;
} {
  const tags: Record<string, string> = {};

  raw.split(';').forEach((part) => {
    const trimmed = part.trim();
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim().toLowerCase();
      const value = trimmed.substring(eqIdx + 1).trim();
      tags[key] = value;
    }
  });

  return {
    policy: tags['p'] || 'none',
    subdomainPolicy: tags['sp'],
    percentage: tags['pct'] ? parseInt(tags['pct'], 10) : undefined,
    rua: tags['rua']?.split(',').map((u) => u.trim()),
    ruf: tags['ruf']?.split(',').map((u) => u.trim()),
    adkim: tags['adkim'],
    aspf: tags['aspf'],
  };
}
