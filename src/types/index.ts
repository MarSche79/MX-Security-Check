export interface MXRecord {
  priority: number;
  exchange: string;
  vendor?: VendorInfo;
}

export interface SPFRecord {
  raw: string;
  mechanisms: string[];
  qualifier: string;
  includes: string[];
  vendors: VendorInfo[];
}

export interface DKIMRecord {
  selector: string;
  raw: string;
  found: boolean;
}

export interface DMARCRecord {
  raw: string;
  policy: string;
  subdomainPolicy?: string;
  percentage?: number;
  rua?: string[];
  ruf?: string[];
  adkim?: string;
  aspf?: string;
}

export interface VendorInfo {
  name: string;
  type: 'security-gateway' | 'email-hosting' | 'smtp-relay' | 'email-service' | 'edr';
  description?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface SecurityScore {
  total: number;
  grade: string;
  gradeColor: string;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  category: string;
  points: number;
  maxPoints: number;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  icon: string;
}

export interface EDRResult {
  vendor: VendorInfo;
  indicator: string;
}

export interface ScanResult {
  domain: string;
  timestamp: Date;
  mx: MXRecord[];
  spf: SPFRecord | null;
  dkim: DKIMRecord[];
  dmarc: DMARCRecord | null;
  securityScore: SecurityScore;
  vendors: VendorInfo[];
  smtpGateway: VendorInfo | null;
  securityVendors: VendorInfo[];
  edr: EDRResult[];
  errors: string[];
}

export type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';
