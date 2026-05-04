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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@nipsys/lsd';
import Link from 'next/link';
import { useState } from 'react';
import type { Incident } from '../../data/types';

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
  const [activeTab, setActiveTab] = useState<string>('All');

  const filteredIncidents =
    activeTab === 'All'
      ? incidents
      : incidents.filter(incident => incident.ecosystem === activeTab);

  return (
    <>
      {/* Stats Summary */}
      <section className="mb-[var(--lsd-spacing-large)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[var(--lsd-spacing-base)]">
          <Card>
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="text-3xl font-bold text-[var(--lsd-text-primary)]">
                {incidents.length}
              </div>
              <div className="text-sm text-[var(--lsd-text-secondary)] mt-1">Total Incidents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="text-3xl font-bold text-[var(--lsd-destructive)]">
                {incidents.filter(i => (i.cvss.base_score as number) >= 7).length}
              </div>
              <div className="text-sm text-[var(--lsd-text-secondary)] mt-1">
                Critical (CVSS ≥7)
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="text-3xl font-bold text-[var(--lsd-success)]">
                {incidents.filter(i => i.confidence_level === 'high').length}
              </div>
              <div className="text-sm text-[var(--lsd-text-secondary)] mt-1">High Confidence</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-[var(--lsd-spacing-large)]">
              <div className="text-3xl font-bold text-[var(--lsd-text-primary)]">
                {ECOSYSTEM_TABS.filter(e => e !== 'All').length}
              </div>
              <div className="text-sm text-[var(--lsd-text-secondary)] mt-1">Ecosystems</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ecosystem Filter Tabs */}
      <section className="mb-[var(--lsd-spacing-large)]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {ECOSYSTEM_TABS.map(ecosystem => (
              <TabsTrigger key={ecosystem} value={ecosystem}>
                {ecosystem}
                {ecosystem === 'All'
                  ? ` (${incidents.length})`
                  : ` (${incidents.filter(i => i.ecosystem === ecosystem).length})`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
                <Link key={incident.id} href={incident.id} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-[var(--lsd-border)]">
                    <CardHeader>
                      <CardTitle className="text-xl">{incident.package}</CardTitle>
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
                          {incident.confidence_level}
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
                        View Details →
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
