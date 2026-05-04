'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nipsys/lsd';
import { Badge } from '@nipsys/lsd';
import { Button } from '@nipsys/lsd';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@nipsys/lsd';

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

interface IOCNetwork {
  host: string;
  port: number;
}

interface IOCFileHash {
  algorithm: string;
  value: string;
}

interface IOCs {
  malicious_packages?: IOCPackage[];
  malicious_dependencies?: any[];
  network?: IOCNetwork[];
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
  package_name: string;
  ecosystem: string;
  cve: string;
  ghsa: string;
  confidence: string;
  cvss: CVSS;
  attack_metrics: AttackMetrics;
  description: string;
  iocs: IOCs;
  impact: Impact;
  sources: Source[];
  attribution?: Attribution;
  remediation: Remediation;
}

export default function IncidentDetail({ incident }: { incident: Incident }) {
  const router = useRouter();

  function getSeverityColor(severity: string): 'info' | 'filled' | 'outlined' | 'destructive' | 'warning' | 'success' {
    const colors: Record<string, 'info' | 'filled' | 'outlined' | 'destructive' | 'warning' | 'success'> = {
      CRITICAL: 'destructive',
      HIGH: 'warning',
      MEDIUM: 'info',
      LOW: 'success',
    };
    return colors[severity] || 'info';
  }

  function getConfidenceColor(confidence: string): 'filled' | 'outlined' | 'warning' {
    const colors: Record<string, 'filled' | 'outlined' | 'warning'> = {
      HIGH: 'filled',
      MEDIUM: 'warning',
      LOW: 'outlined',
      SUSPECTED: 'outlined',
    };
    return colors[confidence] || 'outlined';
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="mb-6"
      >
        ← Back to Dashboard
      </Button>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{incident.package_name}</CardTitle>
                <CardDescription className="text-lg">
                  {incident.id} · {incident.ecosystem}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getSeverityColor(incident.cvss.severity)}>
                {incident.cvss.severity} ({incident.cvss.base_score})
              </Badge>
              <Badge variant={getConfidenceColor(incident.confidence)}>
                {incident.confidence}
              </Badge>
              {incident.cve !== 'N/A' && (
                <Badge variant="outlined">{incident.cve}</Badge>
              )}
              {incident.ghsa !== 'N/A' && (
                <Badge variant="outlined">{incident.ghsa}</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{incident.description}</p>
          </CardContent>
        </Card>

        {/* Attack Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Attack Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Attack Type</div>
                <div className="text-sm font-semibold capitalize">{incident.attack_metrics.type.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Delivery Method</div>
                <div className="text-sm font-semibold capitalize">{incident.attack_metrics.delivery.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Discovered</div>
                <div className="text-sm font-semibold">{incident.attack_metrics.discovered}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CVSS Vector Card */}
        <Card>
          <CardHeader>
            <CardTitle>CVSS Vector</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-xs bg-muted px-3 py-2 rounded block break-all">{incident.cvss.vector}</code>
          </CardContent>
        </Card>

        {/* IOCs Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Indicators of Compromise (IOCs)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {/* Malicious Packages */}
              {incident.iocs.malicious_packages && incident.iocs.malicious_packages.length > 0 && (
                <AccordionItem value="malicious-packages">
                  <AccordionTrigger>Malicious Packages ({incident.iocs.malicious_packages.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {incident.iocs.malicious_packages.map((pkg, idx) => (
                        <div key={idx} className="bg-muted/50 p-3 rounded text-sm">
                          <div className="font-semibold">{pkg.package}</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            <div>Ecosystem: {pkg.ecosystem}</div>
                            <div>Version Range: {pkg.version_range}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Network IOCs */}
              {incident.iocs.network && incident.iocs.network.length > 0 && (
                <AccordionItem value="network">
                  <AccordionTrigger>Network Indicators ({incident.iocs.network.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {incident.iocs.network.map((net, idx) => (
                        <div key={idx} className="bg-muted/50 p-3 rounded flex justify-between items-center">
                          <code className="text-sm">{net.host}</code>
                          <Badge variant="info">Port {net.port}</Badge>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* File Hashes */}
              {incident.iocs.file_hashes && incident.iocs.file_hashes.length > 0 && (
                <AccordionItem value="file-hashes">
                  <AccordionTrigger>File Hashes ({incident.iocs.file_hashes.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {incident.iocs.file_hashes.map((hash, idx) => (
                        <div key={idx} className="bg-muted/50 p-3 rounded">
                          <div className="text-xs font-medium text-muted-foreground mb-1">{hash.algorithm}</div>
                          <code className="text-xs break-all">{hash.value}</code>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Crypto Wallets */}
              {incident.iocs.crypto_wallets && incident.iocs.crypto_wallets.length > 0 && (
                <AccordionItem value="crypto-wallets">
                  <AccordionTrigger>Cryptocurrency Wallets ({incident.iocs.crypto_wallets.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {incident.iocs.crypto_wallets.map((wallet, idx) => (
                        <code key={idx} className="block bg-muted/50 p-3 rounded text-xs break-all">{wallet}</code>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Behaviors */}
              {incident.iocs.behaviors && incident.iocs.behaviors.length > 0 && (
                <AccordionItem value="behaviors">
                  <AccordionTrigger>Malicious Behaviors ({incident.iocs.behaviors.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {incident.iocs.behaviors.map((behavior, idx) => (
                        <Badge key={idx} variant="destructive" className="capitalize">
                          {behavior.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Impact Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Downloads</div>
                <div className="text-sm font-semibold">
                  {typeof incident.impact.downloads === 'number'
                    ? incident.impact.downloads.toLocaleString()
                    : incident.impact.downloads}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Affected Packages</div>
                <div className="text-sm font-semibold">
                  {typeof incident.impact.affected_packages === 'number'
                    ? incident.impact.affected_packages.toLocaleString()
                    : incident.impact.affected_packages}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-muted-foreground">Targets</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {incident.impact.targets.map((target, idx) => (
                    <Badge key={idx} variant="info">{target}</Badge>
                  ))}
                </div>
              </div>
              {incident.impact.exposure_duration && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Exposure Duration</div>
                  <div className="text-sm font-semibold">{incident.impact.exposure_duration}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attribution Card */}
        {incident.attribution && (
          <Card>
            <CardHeader>
              <CardTitle>Attribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incident.attribution.actor && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Threat Actor</div>
                    <div className="text-sm font-semibold">{incident.attribution.actor}</div>
                  </div>
                )}
                {incident.attribution.confidence && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Confidence</div>
                    <div className="text-sm font-semibold capitalize">{incident.attribution.confidence}</div>
                  </div>
                )}
                {incident.attribution.motivation && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Motivation</div>
                    <div className="text-sm font-semibold capitalize">{incident.attribution.motivation.replace(/_/g, ' ')}</div>
                  </div>
                )}
                {incident.attribution.tactics && incident.attribution.tactics.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Tactics</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {incident.attribution.tactics.map((tactic, idx) => (
                        <Badge key={idx} variant="outlined">{tactic}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remediation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Remediation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Affected Versions</div>
                <div className="text-sm">{incident.remediation.affected_versions}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Safe Versions</div>
                <div className="text-sm">{incident.remediation.safe_versions}</div>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <div className="text-sm font-medium text-muted-foreground mb-1">Mitigation</div>
                <div className="text-sm">{incident.remediation.mitigation}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sources Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incident.sources.map((source, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-muted/50 rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outlined">{source.type.replace(/_/g, ' ')}</Badge>
                      <Badge variant={source.reliability === 'confirmed' ? 'filled' : 'info'}>
                        {source.reliability}
                      </Badge>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate block"
                    >
                      {source.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
