import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { notFound } from 'next/navigation';
import type { MaliciousPackage } from '../../data/types';
import IncidentDetail from './IncidentDetail';

interface CVSS {
  base_score: number;
  severity: string;
  vector: string;
}

interface AttackMetrics {
  type: string;
  delivery: string;
  discovered: string;
}

interface IOCPackage {
  package: string;
  version_range: string;
  ecosystem: string;
}

interface IOCFileHash {
  algorithm: string;
  value: string;
}

interface IOCs {
  malicious_packages?: IOCPackage[];
  malicious_dependencies?: MaliciousPackage[];

  file_hashes?: IOCFileHash[];
  crypto_wallets?: string[];
  behaviors?: string[];
}

interface Impact {
  downloads?: number | string;
  affected_packages?: number | string;
  targets: string[];
  exposure_duration?: string;
}

interface Source {
  type: string;
  url: string;
  reliability: string;
}

interface Attribution {
  actor?: string;
  confidence?: string;
  motivation?: string;
  tactics: string[];
}

interface Remediation {
  affected_versions: string;
  safe_versions: string;
  mitigation: string;
}

interface Incident {
  id: string;
  package: string;
  ecosystem: string;
  cve: string;
  ghsa: string;
  discovered: string;
  reported: string;
  status: string;
  confidence_level: string;
  cvss: CVSS;
  attack_mechanics: AttackMetrics;
  description: string;
  iocs: IOCs;
  impact_statistics: Impact;
  sources: Source[];
  attribution?: Attribution;
  remediation: Remediation;
}

interface IncidentData {
  metadata: {
    version: string;
    schema: string;
    generated_at: string;
    total_incidents: number;
  };
  incidents: Incident[];
}

export async function generateStaticParams() {
  return [
    { slug: 'SC-2024-001' },
    { slug: 'SC-2024-002' },
    { slug: 'SC-2024-003' },
    { slug: 'SC-2024-004' },
    { slug: 'SC-2024-005' },
    { slug: 'SC-2024-006' },
  ];
}

export default async function IncidentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Load and parse incidents.yaml
  const yamlPath = path.join(process.cwd(), 'public', 'incidents.yaml');
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const data = yaml.load(yamlContent) as IncidentData;

  const incident = data.incidents.find(inc => inc.id === slug);

  if (!incident) {
    notFound();
  }

  return <IncidentDetail incident={incident} />;
}
