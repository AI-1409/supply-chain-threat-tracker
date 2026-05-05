'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nipsys/lsd';
import { ArrowRight } from '@phosphor-icons/react';
import { useState } from 'react';
import { filterIncidents } from '../../data/filter-utils';
import type { Incident } from '../../data/types';
import IncidentDialog from './IncidentDialog';
import { useFilters } from './IncidentsAppHydrated';

interface IncidentDashboardProps {
  incidents: Incident[];
}

function getCVSSColor(score: number): 'destructive' | 'warning' | 'success' {
  if (score >= 7.0) return 'destructive';
  if (score >= 4.0) return 'warning';
  return 'success';
}

function getCVSSSeverity(score: number): string {
  if (score >= 9.0) return 'Critical';
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  if (score >= 0.1) return 'Low';
  return 'None';
}

function getDocumentationQualityVariant(quality: string): 'destructive' | 'warning' | 'success' {
  switch (quality.toLowerCase()) {
    case 'confirmed':
    case 'high':
      return 'destructive';
    case 'limited':
    case 'medium':
      return 'warning';
    case 'unverified':
    case 'low':
      return 'success';
    default:
      return 'destructive';
  }
}

function getDocumentationQualityLabel(confidence: string): string {
  switch (confidence.toLowerCase()) {
    case 'high':
      return 'Confirmed';
    case 'medium':
      return 'Limited';
    case 'low':
      return 'Unverified';
    default:
      return confidence;
  }
}

export default function IncidentDashboard({ incidents }: IncidentDashboardProps) {
  const { filters } = useFilters();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredIncidents = filterIncidents(incidents, filters);

  function handleIncidentClick(incident: Incident) {
    setSelectedIncident(incident);
    setIsDialogOpen(true);
  }

  return (
    <>
      <IncidentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        incident={selectedIncident}
      />

      {/* Stats Summary - always based on all incidents */}
      <section className="mb-(--lsd-spacing-large)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-(--lsd-spacing-base)">
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-(--lsd-spacing-large)">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-text-primary)]">
                {incidents.length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Total Incidents
              </div>
            </CardContent>
          </Card>
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-(--lsd-spacing-large)">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-destructive)]">
                {incidents.filter(i => (i.cvss.base_score as number) >= 9).length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Critical (CVSS ≥9)
              </div>
            </CardContent>
          </Card>
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-(--lsd-spacing-large)">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-success)]">
                {incidents.filter(i => i.confidence_level === 'high').length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Confirmed
              </div>
            </CardContent>
          </Card>
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-(--lsd-spacing-large)">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-text-primary)]">
                {new Set(incidents.map(i => i.ecosystem)).size}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Ecosystems Affected
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Filters */}
      {filters.ecosystem !== 'all' ||
      filters.severity !== 'all' ||
      filters.documentationQuality !== 'all' ||
      filters.attackType !== 'all' ||
      filters.dateRange !== 'all' ? (
        <section className="mb-(--lsd-spacing-base)">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-[var(--lsd-text-primary)]">Active Filters</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.ecosystem !== 'all' && (
              <Badge variant="outlined" className="cursor-pointer hover:bg-[var(--lsd-muted)]">
                Ecosystem: {filters.ecosystem}
              </Badge>
            )}
            {filters.severity !== 'all' && (
              <Badge variant="outlined" className="cursor-pointer hover:bg-[var(--lsd-muted)]">
                Severity: {filters.severity}
              </Badge>
            )}
            {filters.documentationQuality !== 'all' && (
              <Badge variant="outlined" className="cursor-pointer hover:bg-[var(--lsd-muted)]">
                Quality: {filters.documentationQuality}
              </Badge>
            )}
            {filters.attackType !== 'all' && (
              <Badge variant="outlined" className="cursor-pointer hover:bg-[var(--lsd-muted)]">
                Attack: {filters.attackType.replace(/_/g, ' ')}
              </Badge>
            )}
            {filters.dateRange !== 'all' && (
              <Badge variant="outlined" className="cursor-pointer hover:bg-[var(--lsd-muted)]">
                Date: {filters.dateRange}
              </Badge>
            )}
          </div>
        </section>
      ) : null}

      {/* Incidents Grid */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--lsd-text-primary)]">
            {filteredIncidents.length} {filteredIncidents.length === 1 ? 'Incident' : 'Incidents'}
            {filteredIncidents.length !== incidents.length && (
              <span className="text-[var(--lsd-text-secondary)]"> of {incidents.length} total</span>
            )}
          </h2>
        </div>

        {filteredIncidents.length === 0 ? (
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-(--lsd-spacing-large)">
              <div className="text-center text-[var(--lsd-text-secondary)]">
                No incidents match the current filters.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-(--lsd-spacing-medium) md:grid-cols-2 lg:grid-cols-3">
            {filteredIncidents.map(incident => {
              const baseScore =
                typeof incident.cvss.base_score === 'string'
                  ? Number.parseFloat(incident.cvss.base_score)
                  : incident.cvss.base_score;
              const severity = getCVSSSeverity(baseScore);
              const quality = getDocumentationQualityLabel(incident.confidence_level);

              return (
                <Card
                  key={incident.id}
                  className="border-[var(--lsd-border)] cursor-pointer hover:border-[var(--lsd-primary)] transition-colors"
                  onClick={() => handleIncidentClick(incident)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{incident.package}</CardTitle>
                        <CardDescription className="mt-1">{incident.ecosystem}</CardDescription>
                      </div>
                      <Badge variant={getCVSSColor(baseScore)}>{severity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--lsd-text-secondary)]">CVSS:</span>
                        <span className="font-medium">{baseScore.toFixed(1)}</span>
                        <Badge
                          variant={getDocumentationQualityVariant(
                            getDocumentationQualityLabel(incident.confidence_level)
                          )}
                          className="ml-auto"
                        >
                          {quality}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--lsd-text-secondary)]">CVE:</span>
                        <span className="font-medium">{incident.cve || 'N/A'}</span>
                      </div>
                      <div className="text-[var(--lsd-text-secondary)]">
                        {incident.attack_mechanics.primary}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full group">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
