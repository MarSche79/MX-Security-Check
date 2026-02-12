import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { ScanResult, ScanStatus } from '../types';
import { runFullScan } from '../utils/securityAnalyzer';
import { DomainInput } from '../components/DomainInput';
import { SecurityScoreGauge } from '../components/SecurityScore';
import { ResultCard } from '../components/ResultCard';
import { VendorBadge, VendorList } from '../components/VendorBadge';
import { LoadingOverlay } from '../components/LoadingOverlay';

let LinearGradient: any;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

const GradientHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (LinearGradient) {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E1B4B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {children}
      </LinearGradient>
    );
  }
  return <View style={[styles.header, { backgroundColor: '#131738' }]}>{children}</View>;
};

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const lastScanTime = React.useRef<number>(0);
  const RATE_LIMIT_MS = 3000; // 3 seconds between scans
  const MAX_DOMAIN_LENGTH = 253; // RFC 1035 max domain length

  const handleScan = useCallback(async () => {
    // Rate limiting
    const now = Date.now();
    if (now - lastScanTime.current < RATE_LIMIT_MS) {
      Alert.alert('Please Wait', 'Please wait a few seconds between scans.');
      return;
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    if (!cleanDomain) {
      Alert.alert('Invalid Domain', 'Please enter a domain name to scan.');
      return;
    }

    // Length validation (RFC 1035)
    if (cleanDomain.length > MAX_DOMAIN_LENGTH) {
      Alert.alert('Invalid Domain', 'Domain name is too long.');
      return;
    }

    // Hardened domain validation (anchored, no catastrophic backtracking)
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
    if (!domainRegex.test(cleanDomain)) {
      Alert.alert(
        'Invalid Domain',
        'Please enter a valid domain name (e.g., example.com).'
      );
      return;
    }

    lastScanTime.current = now;
    setStatus('scanning');
    setErrorMessage('');
    setResult(null);

    try {
      const scanResult = await runFullScan(cleanDomain);
      setResult(scanResult);
      setStatus('complete');
    } catch (error: any) {
      // Sanitize error message - don't leak internal details
      const safeMessage = (error.message && error.message.length < 200)
        ? error.message.replace(/https?:\/\/[^\s]+/g, '[redacted-url]')
        : 'An error occurred while scanning. Please try again.';
      setErrorMessage(safeMessage);
      setStatus('error');
    }
  }, [domain]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={result ? handleScan : undefined}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <GradientHeader>
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>🛡️</Text>
            <Text style={styles.headerTitle}>MX Security Check</Text>
            <Text style={styles.headerSubtitle}>
              Analyze email security, identify vendors & SMTP gateways
            </Text>
          </View>
        </GradientHeader>

        {/* ── Domain Input ────────────────────────────────────────── */}
        <DomainInput
          value={domain}
          onChangeText={setDomain}
          onScan={handleScan}
          isLoading={status === 'scanning'}
        />

        {/* ── Loading State ───────────────────────────────────────── */}
        {status === 'scanning' && <LoadingOverlay />}

        {/* ── Error State ─────────────────────────────────────────── */}
        {status === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Scan Failed</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        )}

        {/* ── Results ─────────────────────────────────────────────── */}
        {status === 'complete' && result && (
          <View style={styles.resultsContainer}>
            {/* Domain Header */}
            <View style={styles.domainHeader}>
              <Text style={styles.domainLabel}>Results for</Text>
              <Text style={styles.domainName}>{result.domain}</Text>
              <Text style={styles.timestamp}>
                Scanned {result.timestamp.toLocaleTimeString()}
              </Text>
            </View>

            {/* Security Score */}
            <ResultCard
              title="Security Score"
              icon="📊"
              status={
                result.securityScore.total >= 80
                  ? 'pass'
                  : result.securityScore.total >= 50
                    ? 'warn'
                    : 'fail'
              }
              subtitle={`Grade: ${result.securityScore.grade}`}
              defaultExpanded={true}
            >
              <SecurityScoreGauge score={result.securityScore} />
            </ResultCard>

            {/* SMTP Gateway / Email Provider */}
            <ResultCard
              title="SMTP Gateway"
              icon="🚀"
              status={result.smtpGateway ? 'info' : 'warn'}
              subtitle={result.smtpGateway?.name || 'Unknown'}
              defaultExpanded={true}
            >
              {result.smtpGateway ? (
                <VendorBadge vendor={result.smtpGateway} />
              ) : (
                <Text style={styles.noData}>
                  Could not identify the SMTP gateway
                </Text>
              )}
            </ResultCard>

            {/* Security Vendors */}
            <ResultCard
              title="Security Vendors"
              icon="🏰"
              status={result.securityVendors.length > 0 ? 'pass' : 'warn'}
              subtitle={
                result.securityVendors.length > 0
                  ? `${result.securityVendors.length} detected`
                  : 'None detected'
              }
              defaultExpanded={true}
            >
              {result.securityVendors.length > 0 ? (
                <VendorList vendors={result.securityVendors} />
              ) : (
                <View>
                  <Text style={styles.noData}>
                    No dedicated email security gateway detected
                  </Text>
                  <Text style={styles.hint}>
                    The domain may rely on built-in provider security (e.g.,
                    Microsoft Defender for Office 365, Google's built-in
                    filtering)
                  </Text>
                </View>
              )}
            </ResultCard>

            {/* MX Records */}
            <ResultCard
              title="MX Records"
              icon="📧"
              status={result.mx.length > 0 ? 'pass' : 'fail'}
              subtitle={`${result.mx.length} record${result.mx.length !== 1 ? 's' : ''} found`}
            >
              {result.mx.length > 0 ? (
                <View style={styles.recordsList}>
                  {result.mx.map((mx, i) => (
                    <View key={i} style={styles.mxRecord}>
                      <View style={styles.mxPriority}>
                        <Text style={styles.mxPriorityLabel}>PRI</Text>
                        <Text style={styles.mxPriorityValue}>
                          {mx.priority}
                        </Text>
                      </View>
                      <View style={styles.mxDetails}>
                        <Text style={styles.mxExchange}>{mx.exchange}</Text>
                        {mx.vendor && (
                          <VendorBadge vendor={mx.vendor} compact />
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noData}>
                  No MX records found. This domain cannot receive email.
                </Text>
              )}
            </ResultCard>

            {/* SPF Record */}
            <ResultCard
              title="SPF Record"
              icon="🛡️"
              status={
                result.spf
                  ? result.spf.qualifier.includes('-all')
                    ? 'pass'
                    : 'warn'
                  : 'fail'
              }
              subtitle={
                result.spf ? result.spf.qualifier : 'Not configured'
              }
            >
              {result.spf ? (
                <View style={styles.recordsList}>
                  <View style={styles.rawRecord}>
                    <Text style={styles.rawLabel}>RAW RECORD</Text>
                    <Text style={styles.rawValue} selectable>
                      {result.spf.raw}
                    </Text>
                  </View>

                  <View style={styles.spfDetail}>
                    <Text style={styles.detailLabel}>Qualifier</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color: result.spf.qualifier.includes('-all')
                            ? colors.success
                            : result.spf.qualifier.includes('~all')
                              ? colors.warning
                              : colors.error,
                        },
                      ]}
                    >
                      {result.spf.qualifier}
                    </Text>
                  </View>

                  {result.spf.includes.length > 0 && (
                    <View style={styles.spfDetail}>
                      <Text style={styles.detailLabel}>Includes</Text>
                      <View style={styles.includesList}>
                        {result.spf.includes.map((inc, i) => (
                          <Text key={i} style={styles.includeItem}>
                            {inc}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}

                  {result.spf.vendors.length > 0 && (
                    <VendorList
                      vendors={result.spf.vendors}
                      title="Authorized Senders"
                    />
                  )}
                </View>
              ) : (
                <Text style={styles.noData}>
                  No SPF record found. Email spoofing is not prevented.
                </Text>
              )}
            </ResultCard>

            {/* DKIM Records */}
            <ResultCard
              title="DKIM Signing"
              icon="🔑"
              status={
                result.dkim.some((d) => d.found) ? 'pass' : 'fail'
              }
              subtitle={
                result.dkim.filter((d) => d.found).length > 0
                  ? `${result.dkim.filter((d) => d.found).length} selector${result.dkim.filter((d) => d.found).length !== 1 ? 's' : ''} found`
                  : 'No selectors found'
              }
            >
              {result.dkim.filter((d) => d.found).length > 0 ? (
                <View style={styles.recordsList}>
                  {result.dkim
                    .filter((d) => d.found)
                    .map((dkim, i) => (
                      <View key={i} style={styles.dkimRecord}>
                        <View style={styles.dkimHeader}>
                          <Text style={styles.dkimSelector}>
                            {dkim.selector}._domainkey
                          </Text>
                          <View style={styles.dkimFound}>
                            <Text style={styles.dkimFoundText}>✓ Found</Text>
                          </View>
                        </View>
                        <Text
                          style={styles.dkimValue}
                          numberOfLines={3}
                          selectable
                        >
                          {dkim.raw}
                        </Text>
                      </View>
                    ))}
                </View>
              ) : (
                <View>
                  <Text style={styles.noData}>
                    No DKIM records found for common selectors
                  </Text>
                  <Text style={styles.hint}>
                    DKIM may still be configured with a custom selector not in
                    our database
                  </Text>
                </View>
              )}
            </ResultCard>

            {/* DMARC Record */}
            <ResultCard
              title="DMARC Policy"
              icon="🔒"
              status={
                result.dmarc
                  ? result.dmarc.policy === 'reject'
                    ? 'pass'
                    : result.dmarc.policy === 'quarantine'
                      ? 'warn'
                      : 'warn'
                  : 'fail'
              }
              subtitle={
                result.dmarc
                  ? `Policy: ${result.dmarc.policy}`
                  : 'Not configured'
              }
            >
              {result.dmarc ? (
                <View style={styles.recordsList}>
                  <View style={styles.rawRecord}>
                    <Text style={styles.rawLabel}>RAW RECORD</Text>
                    <Text style={styles.rawValue} selectable>
                      {result.dmarc.raw}
                    </Text>
                  </View>

                  <View style={styles.dmarcGrid}>
                    <View style={styles.dmarcItem}>
                      <Text style={styles.dmarcItemLabel}>Policy</Text>
                      <Text
                        style={[
                          styles.dmarcItemValue,
                          {
                            color:
                              result.dmarc.policy === 'reject'
                                ? colors.success
                                : result.dmarc.policy === 'quarantine'
                                  ? colors.warning
                                  : colors.error,
                          },
                        ]}
                      >
                        {result.dmarc.policy}
                      </Text>
                    </View>

                    {result.dmarc.subdomainPolicy && (
                      <View style={styles.dmarcItem}>
                        <Text style={styles.dmarcItemLabel}>
                          Subdomain Policy
                        </Text>
                        <Text style={styles.dmarcItemValue}>
                          {result.dmarc.subdomainPolicy}
                        </Text>
                      </View>
                    )}

                    {result.dmarc.percentage !== undefined && (
                      <View style={styles.dmarcItem}>
                        <Text style={styles.dmarcItemLabel}>Percentage</Text>
                        <Text style={styles.dmarcItemValue}>
                          {result.dmarc.percentage}%
                        </Text>
                      </View>
                    )}

                    <View style={styles.dmarcItem}>
                      <Text style={styles.dmarcItemLabel}>DKIM Alignment</Text>
                      <Text style={styles.dmarcItemValue}>
                        {result.dmarc.adkim === 's' ? 'Strict' : 'Relaxed'}
                      </Text>
                    </View>

                    <View style={styles.dmarcItem}>
                      <Text style={styles.dmarcItemLabel}>SPF Alignment</Text>
                      <Text style={styles.dmarcItemValue}>
                        {result.dmarc.aspf === 's' ? 'Strict' : 'Relaxed'}
                      </Text>
                    </View>
                  </View>

                  {result.dmarc.rua && result.dmarc.rua.length > 0 && (
                    <View style={styles.spfDetail}>
                      <Text style={styles.detailLabel}>
                        Aggregate Reports (rua)
                      </Text>
                      <View style={styles.includesList}>
                        {result.dmarc.rua.map((uri, i) => (
                          <Text key={i} style={styles.includeItem}>
                            {uri}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}

                  {result.dmarc.ruf && result.dmarc.ruf.length > 0 && (
                    <View style={styles.spfDetail}>
                      <Text style={styles.detailLabel}>
                        Forensic Reports (ruf)
                      </Text>
                      <View style={styles.includesList}>
                        {result.dmarc.ruf.map((uri, i) => (
                          <Text key={i} style={styles.includeItem}>
                            {uri}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.noData}>
                  No DMARC record found. The domain is vulnerable to email
                  spoofing and phishing attacks.
                </Text>
              )}
            </ResultCard>

            {/* All Detected Vendors */}
            <ResultCard
              title="All Detected Services"
              icon="🏢"
              status="info"
              subtitle={`${result.vendors.length} service${result.vendors.length !== 1 ? 's' : ''}`}
            >
              <VendorList vendors={result.vendors} />
            </ResultCard>

            {/* Errors */}
            {result.errors.length > 0 && (
              <ResultCard
                title="Scan Warnings"
                icon="⚠️"
                status="warn"
                subtitle={`${result.errors.length} warning${result.errors.length !== 1 ? 's' : ''}`}
              >
                {result.errors.map((err, i) => (
                  <Text key={i} style={styles.errorItem}>
                    {err}
                  </Text>
                ))}
              </ResultCard>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Results are based on publicly available DNS records.
              </Text>
              <Text style={styles.footerText}>
                DKIM detection is limited to common selectors.
              </Text>
            </View>
          </View>
        )}

        {/* ── Idle State ──────────────────────────────────────────── */}
        {status === 'idle' && (
          <View style={styles.idleContainer}>
            <Text style={styles.idleIcon}>🔐</Text>
            <Text style={styles.idleTitle}>Enter a domain to begin</Text>
            <Text style={styles.idleSubtitle}>
              Analyze MX, SPF, DKIM, DMARC records and identify email security
              vendors and SMTP gateways
            </Text>

            <View style={styles.featureGrid}>
              {[
                { icon: '📧', label: 'MX Records', desc: 'Mail server discovery' },
                { icon: '🛡️', label: 'SPF Analysis', desc: 'Sender policy check' },
                { icon: '🔑', label: 'DKIM Probing', desc: 'Signature verification' },
                { icon: '🔒', label: 'DMARC Policy', desc: 'Anti-spoofing rules' },
                { icon: '🏰', label: 'Security Vendors', desc: 'Gateway identification' },
                { icon: '🚀', label: 'SMTP Gateway', desc: 'Provider detection' },
              ].map((feature, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Footer Credit ───────────────────────────────────────── */}
        <Text style={styles.footerCredit}>Created by André Lutermann</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header ──────────────────────────────────────────────────────
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  // ── Results ─────────────────────────────────────────────────────
  resultsContainer: {
    paddingHorizontal: 20,
  },
  domainHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  domainLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  domainName: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },

  // ── MX Records ──────────────────────────────────────────────────
  recordsList: {
    gap: 10,
  },
  mxRecord: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  mxPriority: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 8,
    minWidth: 50,
  },
  mxPriorityLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mxPriorityValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  mxDetails: {
    flex: 1,
    gap: 6,
  },
  mxExchange: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'monospace',
  },

  // ── Raw Records ─────────────────────────────────────────────────
  rawRecord: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
  },
  rawLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  rawValue: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },

  // ── SPF Details ─────────────────────────────────────────────────
  spfDetail: {
    gap: 6,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  includesList: {
    gap: 4,
  },
  includeItem: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'monospace',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },

  // ── DKIM ────────────────────────────────────────────────────────
  dkimRecord: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  dkimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dkimSelector: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  dkimFound: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dkimFoundText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  dkimValue: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },

  // ── DMARC ───────────────────────────────────────────────────────
  dmarcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dmarcItem: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    minWidth: (width - 80) / 2,
    flex: 1,
  },
  dmarcItemLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dmarcItemValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // ── Status Text ─────────────────────────────────────────────────
  noData: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // ── Errors ──────────────────────────────────────────────────────
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    color: colors.error,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  errorItem: {
    color: colors.warningLight,
    fontSize: 13,
    marginBottom: 4,
  },

  // ── Footer ──────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
    gap: 4,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },

  // ── Idle State ──────────────────────────────────────────────────
  idleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  idleIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  idleTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  idleSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  featureItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 2,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  footerCredit: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
    opacity: 0.7,
  },
});
