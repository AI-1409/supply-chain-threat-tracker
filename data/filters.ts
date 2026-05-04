// Filter options for supply chain threat tracker

// Severity based on CVSS base score
export const SEVERITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical', threshold: { min: 9.0 } },
  { value: 'high', label: 'High', threshold: { min: 7.0, max: 8.99 } },
  { value: 'medium', label: 'Medium', threshold: { min: 4.0, max: 6.99 } },
  { value: 'low', label: 'Low', threshold: { max: 3.99 } },
] as const;

// Documentation Quality (renamed from confidence_level)
export const DOCUMENTATION_QUALITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'limited', label: 'Limited' },
  { value: 'unverified', label: 'Unverified' },
] as const;

// Attack Types based on research
export const ATTACK_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'compromised_maintainer', label: 'Compromised Maintainer Account' },
  { value: 'typosquatting', label: 'Typosquatting' },
  { value: 'dependency_confusion', label: 'Dependency Confusion' },
  { value: 'malicious_new_package', label: 'Malicious New Packages' },
  { value: 'compromised_legitimate', label: 'Compromised Legitimate Packages' },
  { value: 'self_propagating', label: 'Self-propagating / Wormable Malware' },
  { value: 'post_install_scripts', label: 'Post-Install Malicious Scripts' },
  { value: 'cicd_compromise', label: 'CI/CD System Compromise' },
  { value: 'build_environment', label: 'Build Environment Compromise' },
  { value: 'source_code_injection', label: 'Source Code Injection' },
  { value: 'container_malware', label: 'Container Image Malware' },
  { value: 'credential_harvesting', label: 'Credential Harvesting / Token Theft' },
  { value: 'obfuscated_code', label: 'Obfuscated / Invisible Code' },
  { value: 'repojacking', label: 'Repository Hijacking (RepoJacking)' },
  { value: 'auto_update_abuse', label: 'Auto-Update Abuse' },
  { value: 'other', label: 'Other' },
] as const;

// Ecosystems - Primary package managers with documented attacks
export const ECOSYSTEM_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'npm', label: 'npm' },
  { value: 'pypi', label: 'PyPI' },
  { value: 'rubygems', label: 'RubyGems' },
  { value: 'crates.io', label: 'crates.io' },
  { value: 'go_modules', label: 'Go Modules' },
  { value: 'maven', label: 'Maven Central' },
  { value: 'nuget', label: 'NuGet' },
  { value: 'packagist', label: 'Packagist' },
  { value: 'cocoapods', label: 'CocoaPods' },
  { value: 'pub.dev', label: 'pub.dev' },
  { value: 'other', label: 'Other' },
] as const;

// Date range presets
export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '180d', label: 'Last 6 months' },
  { value: '365d', label: 'Last year' },
  { value: 'custom', label: 'Custom range' },
] as const;

// Type for filter state
export interface FilterState {
  ecosystem: string;
  severity: string;
  documentationQuality: string;
  attackType: string;
  dateRange: string;
  customDateStart?: string;
  customDateEnd?: string;
}

export const DEFAULT_FILTERS: FilterState = {
  ecosystem: 'all',
  severity: 'all',
  documentationQuality: 'all',
  attackType: 'all',
  dateRange: 'all',
};
