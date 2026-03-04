/**
 * Vendor Identification Database
 *
 * Comprehensive database of MX record patterns, SPF includes, and other
 * identifiers mapped to email security vendors, hosting providers,
 * and SMTP gateway services.
 */

import { VendorInfo } from '../types';

// ─── MX Record Vendor Patterns ─────────────────────────────────────────────

interface VendorPattern {
  pattern: string;
  vendor: VendorInfo;
}

/**
 * MX record hostname patterns mapped to vendors.
 * Patterns are matched against the MX exchange hostname (case-insensitive).
 * More specific patterns should come first.
 */
export const MX_VENDOR_PATTERNS: VendorPattern[] = [
  // ── Email Security Gateways ──────────────────────────────────────────
  {
    pattern: 'pphosted.com',
    vendor: {
      name: 'Proofpoint',
      type: 'security-gateway',
      description: 'Proofpoint Email Protection (Enterprise)',
      confidence: 'high',
    },
  },
  {
    pattern: 'ppe-hosted.com',
    vendor: {
      name: 'Proofpoint Essentials',
      type: 'security-gateway',
      description: 'Proofpoint Essentials (SMB)',
      confidence: 'high',
    },
  },
  {
    pattern: 'mimecast.com',
    vendor: {
      name: 'Mimecast',
      type: 'security-gateway',
      description: 'Mimecast Secure Email Gateway',
      confidence: 'high',
    },
  },
  {
    pattern: 'barracudanetworks.com',
    vendor: {
      name: 'Barracuda',
      type: 'security-gateway',
      description: 'Barracuda Email Security Gateway',
      confidence: 'high',
    },
  },
  {
    pattern: 'barracuda.com',
    vendor: {
      name: 'Barracuda',
      type: 'security-gateway',
      description: 'Barracuda Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'iphmx.com',
    vendor: {
      name: 'Cisco Secure Email',
      type: 'security-gateway',
      description: 'Cisco IronPort / Secure Email Cloud Gateway',
      confidence: 'high',
    },
  },
  {
    pattern: 'fireeyecloud.com',
    vendor: {
      name: 'Trellix (FireEye)',
      type: 'security-gateway',
      description: 'Trellix Email Security (formerly FireEye)',
      confidence: 'high',
    },
  },
  {
    pattern: 'fireeye.com',
    vendor: {
      name: 'Trellix (FireEye)',
      type: 'security-gateway',
      description: 'Trellix Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailcontrol.com',
    vendor: {
      name: 'Forcepoint',
      type: 'security-gateway',
      description: 'Forcepoint Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'sophos.com',
    vendor: {
      name: 'Sophos',
      type: 'security-gateway',
      description: 'Sophos Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'reflexion.net',
    vendor: {
      name: 'Sophos Reflexion',
      type: 'security-gateway',
      description: 'Sophos Reflexion Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'trendmicro.com',
    vendor: {
      name: 'Trend Micro',
      type: 'security-gateway',
      description: 'Trend Micro Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'tmes.trendmicro.eu',
    vendor: {
      name: 'Trend Micro',
      type: 'security-gateway',
      description: 'Trend Micro Email Security (EU)',
      confidence: 'high',
    },
  },
  {
    pattern: 'messagelabs.com',
    vendor: {
      name: 'Broadcom (Symantec)',
      type: 'security-gateway',
      description: 'Symantec Email Security.cloud (Broadcom)',
      confidence: 'high',
    },
  },
  {
    pattern: 'symanteccloud.com',
    vendor: {
      name: 'Broadcom (Symantec)',
      type: 'security-gateway',
      description: 'Symantec Cloud Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'hornetsecurity.com',
    vendor: {
      name: 'Hornetsecurity',
      type: 'security-gateway',
      description: 'Hornetsecurity Email Protection',
      confidence: 'high',
    },
  },
  {
    pattern: 'antispamcloud.com',
    vendor: {
      name: 'N-able (SpamExperts)',
      type: 'security-gateway',
      description: 'SpamExperts / N-able Mail Assure',
      confidence: 'high',
    },
  },
  {
    pattern: 'spamexperts.com',
    vendor: {
      name: 'N-able (SpamExperts)',
      type: 'security-gateway',
      description: 'SpamExperts Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'securence.com',
    vendor: {
      name: 'Securence',
      type: 'security-gateway',
      description: 'Securence Email Filtering',
      confidence: 'high',
    },
  },
  {
    pattern: 'spamh.com',
    vendor: {
      name: 'SpamHero',
      type: 'security-gateway',
      description: 'SpamHero Email Filtering',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailguard.com.au',
    vendor: {
      name: 'MailGuard',
      type: 'security-gateway',
      description: 'MailGuard Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'zerospam.ca',
    vendor: {
      name: 'Zerospam',
      type: 'security-gateway',
      description: 'Zerospam Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'vadesecure.com',
    vendor: {
      name: 'Vade Secure',
      type: 'security-gateway',
      description: 'Vade Secure Email Protection',
      confidence: 'high',
    },
  },
  {
    pattern: 'abnormalsecurity.com',
    vendor: {
      name: 'Abnormal Security',
      type: 'security-gateway',
      description: 'Abnormal Security Email Protection',
      confidence: 'high',
    },
  },
  {
    pattern: 'avanan.net',
    vendor: {
      name: 'Avanan (Check Point)',
      type: 'security-gateway',
      description: 'Avanan Cloud Email Security (Check Point)',
      confidence: 'high',
    },
  },
  {
    pattern: 'ironscales.com',
    vendor: {
      name: 'IronScales',
      type: 'security-gateway',
      description: 'IronScales Email Security Platform',
      confidence: 'high',
    },
  },
  {
    pattern: 'agari.com',
    vendor: {
      name: 'Agari',
      type: 'security-gateway',
      description: 'Agari Phishing Defense',
      confidence: 'high',
    },
  },
  {
    pattern: 'appriver.com',
    vendor: {
      name: 'AppRiver (Zix)',
      type: 'security-gateway',
      description: 'AppRiver / Zix Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'zixmail.net',
    vendor: {
      name: 'Zix',
      type: 'security-gateway',
      description: 'Zix Email Encryption & Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'clearswift.net',
    vendor: {
      name: 'Clearswift',
      type: 'security-gateway',
      description: 'HelpSystems Clearswift Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'spamtitan.com',
    vendor: {
      name: 'SpamTitan',
      type: 'security-gateway',
      description: 'TitanHQ SpamTitan Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'exclaimer.net',
    vendor: {
      name: 'Exclaimer',
      type: 'security-gateway',
      description: 'Exclaimer Email Signature & Security',
      confidence: 'medium',
    },
  },
  {
    pattern: 'tessian.com',
    vendor: {
      name: 'Tessian',
      type: 'security-gateway',
      description: 'Tessian Intelligent Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'darktrace.com',
    vendor: {
      name: 'Darktrace',
      type: 'security-gateway',
      description: 'Darktrace Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'perception-point.io',
    vendor: {
      name: 'Perception Point',
      type: 'security-gateway',
      description: 'Perception Point Advanced Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'greathorn.com',
    vendor: {
      name: 'GreatHorn',
      type: 'security-gateway',
      description: 'GreatHorn Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'area1security.com',
    vendor: {
      name: 'Cloudflare Area 1',
      type: 'security-gateway',
      description: 'Cloudflare Area 1 Email Security',
      confidence: 'high',
    },
  },
  {
    pattern: 'mail.protection.outlook.com',
    vendor: {
      name: 'Microsoft Exchange Online Protection',
      type: 'security-gateway',
      description: 'Microsoft Exchange Online Protection (EOP) Security Gateway',
      confidence: 'high',
    },
  },

  // ── Email Hosting / SMTP Gateways ────────────────────────────────────
  {
    pattern: 'outlook.com',
    vendor: {
      name: 'Microsoft Outlook',
      type: 'email-hosting',
      description: 'Microsoft Outlook.com',
      confidence: 'high',
    },
  },
  {
    pattern: 'google.com',
    vendor: {
      name: 'Google Workspace',
      type: 'email-hosting',
      description: 'Google Workspace (Gmail for Business)',
      confidence: 'high',
    },
  },
  {
    pattern: 'googlemail.com',
    vendor: {
      name: 'Google Workspace',
      type: 'email-hosting',
      description: 'Google Gmail',
      confidence: 'high',
    },
  },
  {
    pattern: 'gmail.com',
    vendor: {
      name: 'Google Gmail',
      type: 'email-hosting',
      description: 'Google Gmail',
      confidence: 'high',
    },
  },
  {
    pattern: 'yahoodns.net',
    vendor: {
      name: 'Yahoo Mail',
      type: 'email-hosting',
      description: 'Yahoo Mail',
      confidence: 'high',
    },
  },
  {
    pattern: 'zoho.com',
    vendor: {
      name: 'Zoho Mail',
      type: 'email-hosting',
      description: 'Zoho Mail',
      confidence: 'high',
    },
  },
  {
    pattern: 'zoho.eu',
    vendor: {
      name: 'Zoho Mail',
      type: 'email-hosting',
      description: 'Zoho Mail (EU)',
      confidence: 'high',
    },
  },
  {
    pattern: 'emailsrvr.com',
    vendor: {
      name: 'Rackspace',
      type: 'email-hosting',
      description: 'Rackspace Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'secureserver.net',
    vendor: {
      name: 'GoDaddy',
      type: 'email-hosting',
      description: 'GoDaddy Email & Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'domaincontrol.com',
    vendor: {
      name: 'GoDaddy',
      type: 'email-hosting',
      description: 'GoDaddy DNS / Email',
      confidence: 'medium',
    },
  },
  {
    pattern: 'cloudflare.net',
    vendor: {
      name: 'Cloudflare',
      type: 'email-hosting',
      description: 'Cloudflare Email Routing',
      confidence: 'high',
    },
  },
  {
    pattern: 'icloud.com',
    vendor: {
      name: 'Apple iCloud',
      type: 'email-hosting',
      description: 'Apple iCloud Mail',
      confidence: 'high',
    },
  },
  {
    pattern: 'fastmail.com',
    vendor: {
      name: 'Fastmail',
      type: 'email-hosting',
      description: 'Fastmail Email Service',
      confidence: 'high',
    },
  },
  {
    pattern: 'messagingengine.com',
    vendor: {
      name: 'Fastmail',
      type: 'email-hosting',
      description: 'Fastmail (Messaging Engine)',
      confidence: 'high',
    },
  },
  {
    pattern: 'migadu.com',
    vendor: {
      name: 'Migadu',
      type: 'email-hosting',
      description: 'Migadu Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'hover.com',
    vendor: {
      name: 'Hover',
      type: 'email-hosting',
      description: 'Hover Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'gandi.net',
    vendor: {
      name: 'Gandi',
      type: 'email-hosting',
      description: 'Gandi Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'titan.email',
    vendor: {
      name: 'Titan Email',
      type: 'email-hosting',
      description: 'Titan Professional Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'registrar-servers.com',
    vendor: {
      name: 'Namecheap',
      type: 'email-hosting',
      description: 'Namecheap Email / DNS',
      confidence: 'medium',
    },
  },
  {
    pattern: 'dreamhost.com',
    vendor: {
      name: 'DreamHost',
      type: 'email-hosting',
      description: 'DreamHost Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'bluehost.com',
    vendor: {
      name: 'Bluehost',
      type: 'email-hosting',
      description: 'Bluehost Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'hostgator.com',
    vendor: {
      name: 'HostGator',
      type: 'email-hosting',
      description: 'HostGator Email / Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'ionos.com',
    vendor: {
      name: 'IONOS (1&1)',
      type: 'email-hosting',
      description: 'IONOS Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'kundenserver.de',
    vendor: {
      name: 'IONOS (1&1)',
      type: 'email-hosting',
      description: 'IONOS / 1&1 Mail Server',
      confidence: 'high',
    },
  },
  {
    pattern: 'ovh.net',
    vendor: {
      name: 'OVH',
      type: 'email-hosting',
      description: 'OVHcloud Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailhostbox.com',
    vendor: {
      name: 'OpenSRS',
      type: 'email-hosting',
      description: 'OpenSRS / Tucows Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'netsolmail.net',
    vendor: {
      name: 'Network Solutions',
      type: 'email-hosting',
      description: 'Network Solutions Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'pair.com',
    vendor: {
      name: 'pair Networks',
      type: 'email-hosting',
      description: 'pair Networks Email Hosting',
      confidence: 'high',
    },
  },
  {
    pattern: 'yandex.net',
    vendor: {
      name: 'Yandex Mail',
      type: 'email-hosting',
      description: 'Yandex Business Mail',
      confidence: 'high',
    },
  },
  {
    pattern: 'mail.ru',
    vendor: {
      name: 'Mail.ru',
      type: 'email-hosting',
      description: 'Mail.ru Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'protonmail.ch',
    vendor: {
      name: 'Proton Mail',
      type: 'email-hosting',
      description: 'Proton Mail Encrypted Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'tutanota.de',
    vendor: {
      name: 'Tutanota',
      type: 'email-hosting',
      description: 'Tutanota Encrypted Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailbox.org',
    vendor: {
      name: 'Mailbox.org',
      type: 'email-hosting',
      description: 'Mailbox.org Secure Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'runbox.com',
    vendor: {
      name: 'Runbox',
      type: 'email-hosting',
      description: 'Runbox Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'hey.com',
    vendor: {
      name: 'HEY',
      type: 'email-hosting',
      description: 'HEY Email (Basecamp)',
      confidence: 'high',
    },
  },

  // ── Transactional / SMTP Relay Services ──────────────────────────────
  {
    pattern: 'amazonaws.com',
    vendor: {
      name: 'Amazon SES',
      type: 'smtp-relay',
      description: 'Amazon Simple Email Service',
      confidence: 'high',
    },
  },
  {
    pattern: 'sendgrid.net',
    vendor: {
      name: 'SendGrid',
      type: 'smtp-relay',
      description: 'Twilio SendGrid Email Delivery',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailgun.org',
    vendor: {
      name: 'Mailgun',
      type: 'smtp-relay',
      description: 'Mailgun Email Delivery',
      confidence: 'high',
    },
  },
  {
    pattern: 'postmarkapp.com',
    vendor: {
      name: 'Postmark',
      type: 'smtp-relay',
      description: 'Postmark Transactional Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'sparkpostmail.com',
    vendor: {
      name: 'SparkPost',
      type: 'smtp-relay',
      description: 'SparkPost / MessageBird Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'mandrillapp.com',
    vendor: {
      name: 'Mandrill',
      type: 'smtp-relay',
      description: 'Mandrill by Mailchimp',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailjet.com',
    vendor: {
      name: 'Mailjet',
      type: 'smtp-relay',
      description: 'Mailjet Email Delivery',
      confidence: 'high',
    },
  },
  {
    pattern: 'smtp2go.com',
    vendor: {
      name: 'SMTP2GO',
      type: 'smtp-relay',
      description: 'SMTP2GO Email Delivery',
      confidence: 'high',
    },
  },
  {
    pattern: 'elasticemail.com',
    vendor: {
      name: 'Elastic Email',
      type: 'smtp-relay',
      description: 'Elastic Email SMTP Service',
      confidence: 'high',
    },
  },
  {
    pattern: 'socketlabs.com',
    vendor: {
      name: 'SocketLabs',
      type: 'smtp-relay',
      description: 'SocketLabs Email Delivery',
      confidence: 'high',
    },
  },
  {
    pattern: 'brevo.com',
    vendor: {
      name: 'Brevo (Sendinblue)',
      type: 'smtp-relay',
      description: 'Brevo SMTP Relay',
      confidence: 'high',
    },
  },
  {
    pattern: 'sendinblue.com',
    vendor: {
      name: 'Brevo (Sendinblue)',
      type: 'smtp-relay',
      description: 'Sendinblue SMTP Relay',
      confidence: 'high',
    },
  },
];

// ─── SPF Include Vendor Patterns ────────────────────────────────────────────

export const SPF_VENDOR_PATTERNS: VendorPattern[] = [
  {
    pattern: 'spf.protection.outlook.com',
    vendor: {
      name: 'Microsoft 365',
      type: 'email-hosting',
      description: 'Microsoft 365 SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: '_spf.google.com',
    vendor: {
      name: 'Google Workspace',
      type: 'email-hosting',
      description: 'Google Workspace SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'amazonses.com',
    vendor: {
      name: 'Amazon SES',
      type: 'smtp-relay',
      description: 'Amazon SES SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'sendgrid.net',
    vendor: {
      name: 'SendGrid',
      type: 'smtp-relay',
      description: 'SendGrid SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailgun.org',
    vendor: {
      name: 'Mailgun',
      type: 'smtp-relay',
      description: 'Mailgun SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'servers.mcsv.net',
    vendor: {
      name: 'Mailchimp',
      type: 'email-service',
      description: 'Mailchimp Email Marketing',
      confidence: 'high',
    },
  },
  {
    pattern: 'spf.mandrillapp.com',
    vendor: {
      name: 'Mandrill',
      type: 'smtp-relay',
      description: 'Mandrill Transactional Email',
      confidence: 'high',
    },
  },
  {
    pattern: 'sparkpostmail.com',
    vendor: {
      name: 'SparkPost',
      type: 'smtp-relay',
      description: 'SparkPost SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'postmarkapp.com',
    vendor: {
      name: 'Postmark',
      type: 'smtp-relay',
      description: 'Postmark SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'pphosted.com',
    vendor: {
      name: 'Proofpoint',
      type: 'security-gateway',
      description: 'Proofpoint SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'mimecast',
    vendor: {
      name: 'Mimecast',
      type: 'security-gateway',
      description: 'Mimecast SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'mktomail.com',
    vendor: {
      name: 'Marketo',
      type: 'email-service',
      description: 'Adobe Marketo Marketing Emails',
      confidence: 'high',
    },
  },
  {
    pattern: 'hubspot.com',
    vendor: {
      name: 'HubSpot',
      type: 'email-service',
      description: 'HubSpot Email Marketing',
      confidence: 'high',
    },
  },
  {
    pattern: 'spf.sendinblue.com',
    vendor: {
      name: 'Brevo (Sendinblue)',
      type: 'smtp-relay',
      description: 'Brevo SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'mail.zendesk.com',
    vendor: {
      name: 'Zendesk',
      type: 'email-service',
      description: 'Zendesk Support Emails',
      confidence: 'high',
    },
  },
  {
    pattern: 'freshdesk.com',
    vendor: {
      name: 'Freshdesk',
      type: 'email-service',
      description: 'Freshdesk Support Emails',
      confidence: 'high',
    },
  },
  {
    pattern: 'helpscoutemail.com',
    vendor: {
      name: 'Help Scout',
      type: 'email-service',
      description: 'Help Scout Support Emails',
      confidence: 'high',
    },
  },
  {
    pattern: 'salesforce.com',
    vendor: {
      name: 'Salesforce',
      type: 'email-service',
      description: 'Salesforce Email Sending',
      confidence: 'high',
    },
  },
  {
    pattern: 'zoho.com',
    vendor: {
      name: 'Zoho',
      type: 'email-hosting',
      description: 'Zoho SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'mailjet.com',
    vendor: {
      name: 'Mailjet',
      type: 'smtp-relay',
      description: 'Mailjet SPF Authorization',
      confidence: 'high',
    },
  },
  {
    pattern: 'intercom.io',
    vendor: {
      name: 'Intercom',
      type: 'email-service',
      description: 'Intercom Messaging',
      confidence: 'high',
    },
  },
  {
    pattern: 'constantcontact.com',
    vendor: {
      name: 'Constant Contact',
      type: 'email-service',
      description: 'Constant Contact Email Marketing',
      confidence: 'high',
    },
  },
  {
    pattern: 'campaignmonitor.com',
    vendor: {
      name: 'Campaign Monitor',
      type: 'email-service',
      description: 'Campaign Monitor Email Marketing',
      confidence: 'high',
    },
  },
];

// ─── Vendor Identification Functions ────────────────────────────────────────

/**
 * Identify vendor from an MX exchange hostname
 */
export function identifyMXVendor(exchange: string): VendorInfo | undefined {
  const host = exchange.toLowerCase();
  for (const { pattern, vendor } of MX_VENDOR_PATTERNS) {
    if (host.includes(pattern.toLowerCase())) {
      return { ...vendor };
    }
  }
  return undefined;
}

/**
 * Identify vendors from SPF includes
 */
export function identifySPFVendors(includes: string[]): VendorInfo[] {
  const vendors: VendorInfo[] = [];
  const seen = new Set<string>();

  for (const include of includes) {
    const inc = include.toLowerCase();
    for (const { pattern, vendor } of SPF_VENDOR_PATTERNS) {
      if (inc.includes(pattern.toLowerCase()) && !seen.has(vendor.name)) {
        vendors.push({ ...vendor });
        seen.add(vendor.name);
        break;
      }
    }
  }

  return vendors;
}

/**
 * Determine the primary SMTP gateway from MX records
 */
export function identifySMTPGateway(
  mxRecords: { priority: number; exchange: string }[]
): VendorInfo | null {
  if (mxRecords.length === 0) return null;

  // The lowest priority MX is the primary mail handler
  const primary = mxRecords[0];
  const vendor = identifyMXVendor(primary.exchange);

  if (vendor) {
    return vendor;
  }

  // If no known vendor matched, return a generic entry
  return {
    name: extractDomainFromMX(primary.exchange),
    type: 'email-hosting',
    description: `Custom mail server: ${primary.exchange}`,
    confidence: 'low',
  };
}

/**
 * Identify all unique security vendors from MX records
 */
export function identifySecurityVendors(
  mxRecords: { priority: number; exchange: string }[]
): VendorInfo[] {
  const vendors: VendorInfo[] = [];
  const seen = new Set<string>();

  for (const mx of mxRecords) {
    const vendor = identifyMXVendor(mx.exchange);
    if (vendor && vendor.type === 'security-gateway' && !seen.has(vendor.name)) {
      vendors.push(vendor);
      seen.add(vendor.name);
    }
  }

  return vendors;
}

/**
 * Get all unique vendors from all sources (MX, SPF, DKIM)
 */
export function getAllVendors(
  mxRecords: { priority: number; exchange: string }[],
  spfIncludes: string[],
  dkimSelectors: { selector: string; found: boolean }[]
): VendorInfo[] {
  const vendors: VendorInfo[] = [];
  const seen = new Set<string>();

  // From MX records
  for (const mx of mxRecords) {
    const vendor = identifyMXVendor(mx.exchange);
    if (vendor && !seen.has(vendor.name)) {
      vendors.push(vendor);
      seen.add(vendor.name);
    }
  }

  // From SPF includes
  const spfVendors = identifySPFVendors(spfIncludes);
  for (const vendor of spfVendors) {
    if (!seen.has(vendor.name)) {
      vendors.push(vendor);
      seen.add(vendor.name);
    }
  }

  return vendors;
}

/**
 * Extract a readable domain name from an MX hostname
 */
function extractDomainFromMX(exchange: string): string {
  const parts = exchange.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return exchange;
}

/**
 * Get vendor type display label
 */
export function getVendorTypeLabel(type: VendorInfo['type']): string {
  switch (type) {
    case 'security-gateway':
      return 'Security Gateway';
    case 'email-hosting':
      return 'Email Hosting';
    case 'smtp-relay':
      return 'SMTP Relay';
    case 'email-service':
      return 'Email Service';
    default:
      return 'Unknown';
  }
}

/**
 * Get vendor type color
 */
export function getVendorTypeColor(type: VendorInfo['type']): string {
  switch (type) {
    case 'security-gateway':
      return '#EF4444';
    case 'email-hosting':
      return '#6366F1';
    case 'smtp-relay':
      return '#06B6D4';
    case 'email-service':
      return '#F59E0B';
    default:
      return '#64748B';
  }
}
