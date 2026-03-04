/**
 * Security Score Analyzer
 *
 * Calculates a comprehensive security score based on DNS records
 * and email security configuration.
 */

import { colors } from '../theme/colors';
import {
  SecurityScore,
  ScoreDetail,
  MXRecord,
  SPFRecord,
  DKIMRecord,
  DMARCRecord,
  ScanResult,
  VendorInfo,
  EDRResult,
} from '../types';
import {
  lookupMX,
  lookupSPF,
  lookupDMARC,
  lookupAllDKIM,
  lookupEDR,
  parseSPF,
  parseDMARC,
} from '../services/dnsService';
import {
  identifyMXVendor,
  identifySPFVendors,
  identifySMTPGateway,
  identifySecurityVendors,
  getAllVendors,
} from './vendorDatabase';

/**
 * Calculate security score from scan results
 */
export function calculateSecurityScore(
  mx: MXRecord[],
  spf: SPFRecord | null,
  dkim: DKIMRecord[],
  dmarc: DMARCRecord | null,
  securityVendors: VendorInfo[],
  edr: EDRResult[] = []
): SecurityScore {
  const details: ScoreDetail[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  // ── MX Records (15 points) ────────────────────────────────────────
  const mxMax = 15;
  maxPoints += mxMax;
  if (mx.length > 0) {
    const mxPoints = mx.length >= 2 ? mxMax : 10;
    totalPoints += mxPoints;
    details.push({
      category: 'MX Records',
      points: mxPoints,
      maxPoints: mxMax,
      status: mxPoints === mxMax ? 'pass' : 'warn',
      message:
        mx.length >= 2
          ? `${mx.length} MX records found with redundancy`
          : `${mx.length} MX record found (consider adding redundancy)`,
      icon: '📧',
    });
  } else {
    details.push({
      category: 'MX Records',
      points: 0,
      maxPoints: mxMax,
      status: 'fail',
      message: 'No MX records found - domain cannot receive email',
      icon: '📧',
    });
  }

  // ── SPF Record (20 points) ────────────────────────────────────────
  const spfMax = 20;
  maxPoints += spfMax;
  if (spf) {
    let spfPoints = 10; // Base points for having SPF
    let spfStatus: 'pass' | 'warn' | 'fail' = 'warn';
    let spfMessage = '';

    if (spf.qualifier.includes('-all')) {
      spfPoints = spfMax;
      spfStatus = 'pass';
      spfMessage = 'SPF configured with hard fail (-all) - excellent';
    } else if (spf.qualifier.includes('~all')) {
      spfPoints = 15;
      spfStatus = 'warn';
      spfMessage = 'SPF configured with soft fail (~all) - consider upgrading to -all';
    } else if (spf.qualifier.includes('?all')) {
      spfPoints = 8;
      spfStatus = 'warn';
      spfMessage = 'SPF with neutral policy (?all) - weak protection';
    } else if (spf.qualifier.includes('+all')) {
      spfPoints = 2;
      spfStatus = 'fail';
      spfMessage = 'SPF with pass-all (+all) - INSECURE: allows anyone to send';
    } else {
      spfMessage = 'SPF record found but qualifier unclear';
    }

    totalPoints += spfPoints;
    details.push({
      category: 'SPF Record',
      points: spfPoints,
      maxPoints: spfMax,
      status: spfStatus,
      message: spfMessage,
      icon: '🛡️',
    });
  } else {
    details.push({
      category: 'SPF Record',
      points: 0,
      maxPoints: spfMax,
      status: 'fail',
      message: 'No SPF record found - email spoofing not prevented',
      icon: '🛡️',
    });
  }

  // ── DKIM (20 points) ──────────────────────────────────────────────
  const dkimMax = 20;
  maxPoints += dkimMax;
  const foundDkim = dkim.filter((d) => d.found);
  if (foundDkim.length > 0) {
    const dkimPoints = foundDkim.length >= 2 ? dkimMax : 15;
    totalPoints += dkimPoints;
    details.push({
      category: 'DKIM Signing',
      points: dkimPoints,
      maxPoints: dkimMax,
      status: dkimPoints === dkimMax ? 'pass' : 'warn',
      message:
        foundDkim.length >= 2
          ? `${foundDkim.length} DKIM selectors found (${foundDkim.map((d) => d.selector).join(', ')})`
          : `1 DKIM selector found (${foundDkim[0].selector})`,
      icon: '🔑',
    });
  } else {
    details.push({
      category: 'DKIM Signing',
      points: 0,
      maxPoints: dkimMax,
      status: 'fail',
      message: 'No DKIM records found for common selectors',
      icon: '🔑',
    });
  }

  // ── DMARC (30 points) ─────────────────────────────────────────────
  const dmarcMax = 30;
  maxPoints += dmarcMax;
  if (dmarc) {
    let dmarcPoints = 10; // Base points for having DMARC
    let dmarcStatus: 'pass' | 'warn' | 'fail' = 'warn';
    let dmarcMessage = '';

    const policy = dmarc.policy.toLowerCase();

    if (policy === 'reject') {
      dmarcPoints = 25;
      dmarcStatus = 'pass';
      dmarcMessage = 'DMARC policy set to reject - maximum protection';
    } else if (policy === 'quarantine') {
      dmarcPoints = 20;
      dmarcStatus = 'warn';
      dmarcMessage = 'DMARC quarantine policy - good, consider upgrading to reject';
    } else {
      dmarcMessage = 'DMARC policy set to none - monitoring only, no enforcement';
    }

    // Bonus points for reporting
    if (dmarc.rua && dmarc.rua.length > 0) {
      dmarcPoints = Math.min(dmarcPoints + 3, dmarcMax);
    }
    if (dmarc.ruf && dmarc.ruf.length > 0) {
      dmarcPoints = Math.min(dmarcPoints + 2, dmarcMax);
    }

    totalPoints += dmarcPoints;
    details.push({
      category: 'DMARC Policy',
      points: dmarcPoints,
      maxPoints: dmarcMax,
      status: dmarcStatus,
      message: dmarcMessage,
      icon: '🔒',
    });
  } else {
    details.push({
      category: 'DMARC Policy',
      points: 0,
      maxPoints: dmarcMax,
      status: 'fail',
      message: 'No DMARC record found - domain vulnerable to spoofing',
      icon: '🔒',
    });
  }

  // ── Security Gateway (15 points) ──────────────────────────────────
  const gwMax = 15;
  maxPoints += gwMax;
  if (securityVendors.length > 0) {
    totalPoints += gwMax;
    details.push({
      category: 'Security Gateway',
      points: gwMax,
      maxPoints: gwMax,
      status: 'pass',
      message: `Protected by ${securityVendors.map((v) => v.name).join(', ')}`,
      icon: '🏰',
    });
  } else {
    details.push({
      category: 'Security Gateway',
      points: 0,
      maxPoints: gwMax,
      status: 'warn',
      message: 'No dedicated email security gateway detected',
      icon: '🏰',
    });
  }

  // ── EDR / Endpoint Protection (10 points) ─────────────────────────
  const edrMax = 10;
  maxPoints += edrMax;
  if (edr.length > 0) {
    totalPoints += edrMax;
    details.push({
      category: 'Endpoint Detection & Response',
      points: edrMax,
      maxPoints: edrMax,
      status: 'pass',
      message: `EDR detected: ${edr.map((e) => e.vendor.name).join(', ')}`,
      icon: '🛡️',
    });
  } else {
    details.push({
      category: 'Endpoint Detection & Response',
      points: 0,
      maxPoints: edrMax,
      status: 'warn',
      message: 'No EDR DNS indicators found (CrowdStrike, SentinelOne, Microsoft Defender)',
      icon: '🛡️',
    });
  }

  // ── Calculate Grade ───────────────────────────────────────────────
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const { grade, gradeColor } = getGrade(percentage);

  return {
    total: percentage,
    grade,
    gradeColor,
    details,
  };
}

/**
 * Get letter grade and color from score percentage
 */
function getGrade(score: number): { grade: string; gradeColor: string } {
  if (score >= 90) return { grade: 'A+', gradeColor: colors.success };
  if (score >= 80) return { grade: 'A', gradeColor: colors.success };
  if (score >= 70) return { grade: 'B', gradeColor: colors.successLight };
  if (score >= 60) return { grade: 'C', gradeColor: colors.warning };
  if (score >= 50) return { grade: 'D', gradeColor: colors.warningLight };
  return { grade: 'F', gradeColor: colors.error };
}

/**
 * Run a full security scan on a domain
 */
export async function runFullScan(domain: string): Promise<ScanResult> {
  const errors: string[] = [];
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  // ── Run all DNS lookups concurrently ──────────────────────────────
  const [mxRaw, spfRaw, dmarcRaw, dkimResults, edrResults] = await Promise.all([
    lookupMX(cleanDomain).catch((e) => {
      errors.push(`MX lookup failed: ${e.message}`);
      return [] as { priority: number; exchange: string }[];
    }),
    lookupSPF(cleanDomain).catch((e) => {
      errors.push(`SPF lookup failed: ${e.message}`);
      return null;
    }),
    lookupDMARC(cleanDomain).catch((e) => {
      errors.push(`DMARC lookup failed: ${e.message}`);
      return null;
    }),
    lookupAllDKIM(cleanDomain).catch((e) => {
      errors.push(`DKIM lookup failed: ${e.message}`);
      return [] as { selector: string; raw: string; found: boolean }[];
    }),
    lookupEDR(cleanDomain).catch((e) => {
      errors.push(`EDR lookup failed: ${e.message}`);
      return [] as EDRResult[];
    }),
  ]);

  // ── Process MX Records ────────────────────────────────────────────
  const mx: MXRecord[] = mxRaw.map((r) => ({
    ...r,
    vendor: identifyMXVendor(r.exchange),
  }));

  // ── Process SPF ───────────────────────────────────────────────────
  let spf: SPFRecord | null = null;
  if (spfRaw) {
    const parsed = parseSPF(spfRaw);
    spf = {
      raw: spfRaw,
      mechanisms: parsed.mechanisms,
      qualifier: parsed.qualifier,
      includes: parsed.includes,
      vendors: identifySPFVendors(parsed.includes),
    };
  }

  // ── Process DKIM ──────────────────────────────────────────────────
  const dkim: DKIMRecord[] = dkimResults;

  // ── Process DMARC ─────────────────────────────────────────────────
  let dmarc: DMARCRecord | null = null;
  if (dmarcRaw) {
    const parsed = parseDMARC(dmarcRaw);
    dmarc = {
      raw: dmarcRaw,
      ...parsed,
    };
  }

  // ── Identify Vendors ──────────────────────────────────────────────
  const smtpGateway = identifySMTPGateway(mxRaw);
  const securityVendors = identifySecurityVendors(mxRaw);
  const allVendors = getAllVendors(
    mxRaw,
    spf?.includes || [],
    dkimResults
  );

  // ── Calculate Security Score ──────────────────────────────────────
  const securityScore = calculateSecurityScore(
    mx,
    spf,
    dkim,
    dmarc,
    securityVendors,
    edrResults
  );

  return {
    domain: cleanDomain,
    timestamp: new Date(),
    mx,
    spf,
    dkim,
    dmarc,
    securityScore,
    vendors: allVendors,
    smtpGateway,
    securityVendors,
    edr: edrResults,
    errors,
  };
}
