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
import type { Incident } from '../../data/types';
import AppShell from './AppShell';
import IncidentDialog from './IncidentDialog';

const ECOSYSTEM_TABS = ['All', 'npm', 'PyPI', 'RubyGems', 'crates.io'] as const;

interface IncidentDashboardProps {
  incidents: Incident[];
}

function getConfidenceColor(confidence: string): 'destructive' | 'warning' | 'success' {
  switch (confidence.toLowerCase()) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'suspected':
    case 'low':
      return 'success';
    default:
      return 'destructive';
  }
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

export default function IncidentDashboard({ incidents }: IncidentDashboardProps) {
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>('All');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredIncidents =
    selectedEcosystem === 'All'
      ? incidents
      : incidents.filter(incident => incident.ecosystem === selectedEcosystem);

  function handleIncidentClick(incident: Incident) {
    setSelectedIncident(incident);
    setIsDialogOpen(true);
  }

  return (
    <AppShell
      selectedEcosystem={selectedEcosystem}
      onEcosystemChange={setSelectedEcosystem}
      incidents={incidents}
    >
      <IncidentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        incident={selectedIncident}
      />

      {/* Stats Summary */}
      <section className="mb-[var(--lsd-spacing-large)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[var(--lsd-spacing-base)]">
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-text-primary)]">
                {incidents.length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Total Incidents
              </div>
            </CardContent>
          </Card>
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-destructive)]">
                {incidents.filter(i => (i.cvss.base_score as number) >= 7).length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Critical (CVSS ≥7)
              </div>
            </CardContent>
          </Card>
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-success)]">
                {incidents.filter(i => i.confidence_level === 'high').length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                High Confidence
              </div>
            </CardContent>
          </Card>
          <Card className="border-[var(--lsd-border)]">
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="flex items-baseline justify-center text-3xl font-bold text-[var(--lsd-text-primary)]">
                {ECOSYSTEM_TABS.filter(e => e !== 'All').length}
              </div>
              <div className="text-sm text-center text-[var(--lsd-text-secondary)] mt-1">
                Ecosystems
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Current Selection */}
      <section className="mb-[var(--lsd-spacing-large)]">
        <h2 className="text-xl font-semibold text-[var(--lsd-text-primary)] mb-2">
          {selectedEcosystem === 'All' ? 'All Ecosystems' : selectedEcosystem}
        </h2>
        <p className="text-sm text-[var(--lsd-text-secondary)]">
          Showing {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''}
        </p>
      </section>

      {/* No Results */}
      {filteredIncidents.length === 0 && (
        <div className="text-center py-[var(--lsd-spacing-largest)]">
          <div className="text-[var(--lsd-text-secondary)]">
            No incidents found for this ecosystem.
          </div>
        </div>
      )}

      {/* Incident Cards */}
      {filteredIncidents.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--lsd-spacing-base)]">
            {filteredIncidents.map(incident => {
              const baseScore =
                typeof incident.cvss.base_score === 'string'
                  ? Number.parseFloat(incident.cvss.base_score)
                  : incident.cvss.base_score;

              return (
                <Card
                  key={incident.id}
                  onClick={() => handleIncidentClick(incident)}
                  className="h-full hover:shadow-lg hover:border-[var(--lsd-primary)] transition-all cursor-pointer border"
                >
                  <CardHeader>
                    <CardTitle className="text-xl truncate" title={incident.package}>
                      {incident.package}
                    </CardTitle>
                    <CardDescription>
                      {incident.id} · {incident.ecosystem}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={getCVSSColor(baseScore)} size="sm">
                        {getCVSSSeverity(baseScore)} ({baseScore})
                      </Badge>
                      <Badge variant={getConfidenceColor(incident.confidence_level)} size="sm">
                        {incident.confidence_level.charAt(0).toUpperCase() +
                          incident.confidence_level.slice(1)}
                      </Badge>
                    </div>
                    {incident.attack_mechanics.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {incident.attack_mechanics.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outlined" size="sm" className="w-full">
                      View Details <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </AppShell>
  );
}
