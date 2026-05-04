// Example data structure for supply chain threat sources
// This file will be populated with actual threat data sources as the project develops

export interface ThreatDataSource {
  id: string;
  name: string;
  url: string;
  type: 'cve' | 'advisory' | 'feed' | 'repository';
  updateFrequency: string;
  description: string;
}

export const threatDataSources: ThreatDataSource[] = [
  {
    id: 'nvd',
    name: 'National Vulnerability Database',
    url: 'https://nvd.nist.gov/',
    type: 'cve',
    updateFrequency: 'daily',
    description: 'US government repository of standards based vulnerability management data',
  },
  {
    id: 'github-advisories',
    name: 'GitHub Security Advisories',
    url: 'https://github.com/advisories',
    type: 'advisory',
    updateFrequency: 'hourly',
    description: 'Security vulnerabilities affecting open source repositories',
  },
  {
    id: 'oss-vulndb',
    name: 'OSS Vulnerability Database',
    url: 'https://osv.dev/',
    type: 'cve',
    updateFrequency: 'continuous',
    description: 'Vulnerability database for open source software',
  },
  {
    id: 'npm-audit',
    name: 'NPM Security Audit',
    url: 'https://docs.npmjs.com/cli/v9/commands/npm-audit',
    type: 'repository',
    updateFrequency: 'on-demand',
    description: 'NPM package vulnerability scanning',
  },
];
