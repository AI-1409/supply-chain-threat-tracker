// TypeScript type definitions for incident YAML data
// Matches the exact structure of incidents.yaml

export interface IncidentDatabase {
  incidents: Incident[];
  metadata: Metadata;
}

export interface Incident {
  id: string;
  package: string;
  ecosystem: string;
  cve: string;
  ghsa: string;
  discovered: string;
  reported: string;
  confidence_level: 'low' | 'medium' | 'high';
  cvss: CVSS;
  attack_mechanics: AttackMechanics;
  iocs: IOCs;
  impact_statistics: ImpactStatistics;
  sources: Source[];
  attribution: Attribution;
  remediation: Remediation;
  status: string;
}

export interface CVSS {
  base_score: number | string;
  severity: string;
  vector: string;
  attack_vector: string;
  attack_complexity: string;
  privileges_required: string;
  user_interaction: string;
}

export interface AttackMechanics {
  primary: string;
  secondary?: string;
  tertiary?: string;
  delivery: string;
  description: string;
}

export interface IOCs {
  malicious_packages: MaliciousPackage[];
  network?: NetworkIOC[];
  domain?: DomainIOC[];
  file_hashes?: FileHash[];
  file_path?: FilePathIOC[];
  file_type?: FileTypeIOC[];
  registry?: RegistryIOC[];
  behavioral: BehavioralIOC[];
  timing?: TimingIOC[];
}

export interface MaliciousPackage {
  name: string;
  version?: string;
  versions?: string[];
  registry?: string;
  publisher?: string;
  sha256?: string;
  count?: number | string;
  publishers?: number | string;
  time_window?: string;
  owner?: string;
  target?: string;
  status?: string;
  replaced_by?: string[];
}

export interface NetworkIOC {
  type: string;
  value?: string;
  description?: string;
  path?: string;
  status?: string;
}

export interface DomainIOC {
  type: string;
  value: string;
  registered?: string;
  elapsed_to_compromise?: number | string;
}

export interface FileHash {
  type: string;
  value: string;
  context?: string;
}

export interface FilePathIOC {
  type: string;
  value: string;
  description?: string;
}

export interface FileTypeIOC {
  type: string;
  pattern: string;
  target?: string;
}

export interface RegistryIOC {
  type: string;
  path: string;
  action: string;
}

export interface BehavioralIOC {
  type: string;
  pattern?: string;
  target?: string;
  action?: string;
  location?: string;
  method?: string;
  command?: string;
  coin?: string;
  targets?: string[];
  suspicious_binaries?: string[];
  methods?: string[];
  currencies?: string[];
  description?: string;
  tactic?: string;
  trigger?: string;
}

export interface TimingIOC {
  window_start?: string;
  maintained_duration?: string;
}

export interface ImpactStatistics {
  downloads?: number | string;
  affected_direct_packages?: number | string;
  affected_major_projects?: string[];
  specific_target?: string;
  theft_threshold_btc?: number | string;
  theft_threshold_bch?: number | string;
  affected_users?: number | string;
  exposure_duration?: number | string;
  data_targeted?: string[];
  severity_reason?: string;
  total_malicious_packages?: number | string;
  affected_platforms?: string | string[];
  targeted_wallets?: string;
  campaigns_count?: number | string;
  researcher?: string;
  direct_consumers?: number | string;
  transitive_reach?: string;
  weekly_downloads_before_attack?: number | string;
  capabilities?: string[];
  atypical_tactic?: string;
  affected_maintainers?: number | string;
  targeted_crate?: string;
  infrastructure_status?: string;
  tokens_at_risk?: string;
}

export interface Source {
  url: string;
  type: string;
  reliability: 'low' | 'medium' | 'high';
}

export interface Attribution {
  confidence: 'low' | 'medium' | 'high';
  threat_actor: string;
  motivation: string;
  notes?: string;
  ttps?: string[];
  accounts?: number | string;
  attack_history?: string;
  campaigns?: string;
  taunt?: string;
  technical_skill?: string;
  financial_connection?: string;
}

export interface Remediation {
  affected_versions?: string;
  fixed_version?: string;
  safe_versions?: string[];
  mitigation: string;
}

export interface Metadata {
  version: string;
  generated: string;
  note: string;
  fields_schema: string[];
}

// Type aliases for backward compatibility
export type IncidentsData = IncidentDatabase;
export type IncidentsDatabase = IncidentDatabase;
