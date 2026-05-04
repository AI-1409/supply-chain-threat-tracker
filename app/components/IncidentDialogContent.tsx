'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nipsys/lsd';
import type { Incident } from '../../data/types';

/**
 * IncidentDialogContent - Renders the incident detail content without page wrapper
 * This is the reusable content portion of IncidentDetail, suitable for use in dialogs or other contexts
 */
export default function IncidentDialogContent({ incident }: { incident: Incident }) {
  function getSeverityColor(
    severity: string
  ): 'info' | 'filled' | 'outlined' | 'destructive' | 'warning' | 'success' {
    const colors: Record<
      string,
      'info' | 'filled' | 'outlined' | 'destructive' | 'warning' | 'success'
    > = {
      CRITICAL: 'destructive',
      HIGH: 'destructive',
      MEDIUM: 'warning',
      LOW: 'success',
    };
    return colors[severity] || 'info';
  }

  function getConfidenceColor(
    confidence: string
  ): 'filled' | 'outlined' | 'warning' | 'success' | 'destructive' {
    const colors: Record<string, 'filled' | 'outlined' | 'warning' | 'success' | 'destructive'> = {
      HIGH: 'destructive',
      MEDIUM: 'warning',
      LOW: 'success',
      SUSPECTED: 'outlined',
    };
    return colors[confidence] || 'outlined';
  }

  const baseScore =
    typeof incident.cvss.base_score === 'string'
      ? Number.parseFloat(incident.cvss.base_score)
      : incident.cvss.base_score;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{incident.package}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {incident.id} · {incident.ecosystem}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getSeverityColor(incident.cvss.severity)}>
              {incident.cvss.severity} ({baseScore})
            </Badge>
            <Badge variant={getConfidenceColor(incident.confidence_level)}>
              {incident.confidence_level}
            </Badge>
            {incident.cve !== 'N/A' && <Badge variant="outlined">{incident.cve}</Badge>}
            {incident.ghsa !== 'N/A' && <Badge variant="outlined">{incident.ghsa}</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      {incident.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{incident.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Attack Mechanics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Attack Mechanics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Attack Type</div>
              <div className="text-sm font-semibold capitalize">
                {incident.attack_mechanics.primary.replace(/_/g, ' ')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Delivery Method</div>
              <div className="text-sm font-semibold capitalize">
                {incident.attack_mechanics.delivery.replace(/_/g, ' ')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Discovered</div>
              <div className="text-sm font-semibold">{incident.discovered}</div>
            </div>
          </div>
          {incident.attack_mechanics.description && (
            <div className="mt-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Details</div>
              <p className="text-sm text-gray-700">{incident.attack_mechanics.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CVSS Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>CVSS Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Base Score</span>
              <span className="font-semibold">{baseScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Severity</span>
              <span className="font-semibold">{incident.cvss.severity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Attack Vector</span>
              <span className="font-semibold">
                {incident.cvss.attack_vector.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Attack Complexity</span>
              <span className="font-semibold">
                {incident.cvss.attack_complexity.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Privileges Required</span>
              <span className="font-semibold">
                {incident.cvss.privileges_required.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">User Interaction</span>
              <span className="font-semibold">
                {incident.cvss.user_interaction.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {incident.impact_statistics.downloads && (
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Downloads Affected</span>
                <span className="font-semibold">
                  {incident.impact_statistics.downloads.toLocaleString()}
                </span>
              </div>
            )}
            {(incident.impact_statistics.affected_direct_packages ||
              incident.impact_statistics.affected_packages) && (
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Affected Packages</span>
                <span className="font-semibold">
                  {(
                    incident.impact_statistics.affected_direct_packages ||
                    incident.impact_statistics.affected_packages
                  )?.toLocaleString()}
                </span>
              </div>
            )}
            {incident.impact_statistics.exposure_duration && (
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Exposure Duration</span>
                <span className="font-semibold">
                  {incident.impact_statistics.exposure_duration}
                </span>
              </div>
            )}
            {incident.impact_statistics.targets && (
              <div className="col-span-1 md:col-span-2">
                <div className="font-medium text-muted-foreground mb-1">Targets</div>
                <div className="flex flex-wrap gap-1">
                  {incident.impact_statistics.targets.map((target: string, idx: number) => (
                    <Badge key={idx} variant="outlined" size="sm">
                      {target}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sources Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {incident.sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:underline"
              >
                <Badge
                  variant={
                    source.reliability === 'high'
                      ? 'filled'
                      : source.reliability === 'medium'
                        ? 'warning'
                        : 'outlined'
                  }
                  size="sm"
                >
                  {source.reliability}
                </Badge>{' '}
                {source.type}: {source.url}
              </a>
            ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Threat Actor</div>
                <div className="font-semibold">{incident.attribution.threat_actor}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Confidence</div>
                <div className="font-semibold">{incident.attribution.confidence}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Motivation</div>
                <div className="font-semibold">{incident.attribution.motivation}</div>
              </div>
              {incident.attribution.notes && (
                <div className="col-span-1 md:col-span-2">
                  <div className="font-medium text-muted-foreground">Notes</div>
                  <div className="text-sm mt-1">{incident.attribution.notes}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {incident.remediation.affected_versions && (
              <div>
                <div className="font-medium text-muted-foreground">Affected Versions</div>
                <div className="text-sm font-semibold">
                  {incident.remediation.affected_versions}
                </div>
              </div>
            )}
            {incident.remediation.fixed_version && (
              <div>
                <div className="font-medium text-muted-foreground">Fixed Version</div>
                <div className="text-sm font-semibold">{incident.remediation.fixed_version}</div>
              </div>
            )}
            {incident.remediation.safe_versions &&
              incident.remediation.safe_versions.length > 0 && (
                <div>
                  <div className="font-medium text-muted-foreground">Safe Versions</div>
                  <div className="text-sm font-semibold">
                    {incident.remediation.safe_versions.join(', ')}
                  </div>
                </div>
              )}
            <div>
              <div className="font-medium text-muted-foreground">Mitigation</div>
              <div className="text-sm font-semibold">{incident.remediation.mitigation}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IOCs Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Indicators of Compromise (IOCs)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={[]}>
            {incident.iocs.malicious_packages && incident.iocs.malicious_packages.length > 0 && (
              <AccordionItem value="malicious_packages">
                <AccordionTrigger>
                  Malicious Packages ({incident.iocs.malicious_packages.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {incident.iocs.malicious_packages.map((pkg: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <div className="font-semibold">{pkg.name}</div>
                        {pkg.version && (
                          <div className="text-muted-foreground">Version: {pkg.version}</div>
                        )}
                        {pkg.versions && (
                          <div className="text-muted-foreground">
                            Versions: {pkg.versions.join(', ')}
                          </div>
                        )}
                        {pkg.registry && (
                          <div className="text-muted-foreground">Registry: {pkg.registry}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {incident.iocs.network && incident.iocs.network.length > 0 && (
              <AccordionItem value="network">
                <AccordionTrigger>Network IOCs ({incident.iocs.network.length})</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {incident.iocs.network.map((ioc: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <div className="font-semibold">{ioc.type}</div>
                        {ioc.value && <div className="text-muted-foreground">{ioc.value}</div>}
                        {ioc.description && (
                          <div className="text-muted-foreground">{ioc.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {incident.iocs.behavioral && incident.iocs.behavioral.length > 0 && (
              <AccordionItem value="behaviors">
                <AccordionTrigger>
                  Behavioral IOCs ({incident.iocs.behavioral.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {incident.iocs.behavioral.map((behavior: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <div className="font-semibold">{behavior.type}</div>
                        {behavior.description && (
                          <div className="text-muted-foreground">{behavior.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {incident.iocs.file_hashes && incident.iocs.file_hashes.length > 0 && (
              <AccordionItem value="file_hashes">
                <AccordionTrigger>
                  File Hashes ({incident.iocs.file_hashes.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {incident.iocs.file_hashes.map((hash: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <div className="font-semibold">{hash.type}</div>
                        <div className="text-muted-foreground break-all">{hash.value}</div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
