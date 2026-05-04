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
import typesafeYaml from 'js-yaml';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CVSS {
  base_score: number;
  severity: string;
  vector: string;
  attack_vector: string;
  attack_complexity: string;
  privileges_required: string;
  user_interaction: string;
}

interface Incident {
  id: string;
  package: string;
  ecosystem: string;
  cve: string;
  ghsa: string;
  discovered: string;
  reported: string;
  confidence_level: string;
  cvss: CVSS;
  attack_mechanics: {
    primary: string;
    secondary: string;
    delivery: string;
    description: string;
  };
  status: string;
}

interface IncidentsData {
  incidents: Incident[];
}

const ECOSYSTEM_TABS = ['All', 'npm', 'PyPI', 'RubyGems', 'crates.io'] as const;

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

export default function Page() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await fetch('/supply-chain-threat-tracker/incidents.yaml');
        const yamlText = await response.text();
        const data = typesafeYaml.load(yamlText) as IncidentsData;

        // Normalize data types from YAML
        const normalizedIncidents = (data.incidents || []).map((incident: Incident) => ({
          ...incident,
          cvss: {
            ...incident.cvss,
            base_score: Number(incident.cvss?.base_score || 0),
          },
        }));
        setIncidents(normalizedIncidents);
      } catch (error) {
        console.error('Failed to load incidents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const filteredIncidents =
    activeTab === 'All'
      ? incidents
      : incidents.filter(incident => incident.ecosystem === activeTab);

  const handleCardClick = (incident: Incident) => {
    router.push(`/${incident.package}`);
  };

  return (
    <main className="min-h-screen bg-[var(--lsd-background)] p-[var(--lsd-spacing-largest)]">
      {/* Decorative Grid Background */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(to right, var(--lsd-border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--lsd-border) 1px, transparent 1px)
        `,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <section className="mb-[var(--lsd-spacing-largest)] text-center">
          <h1 className="text-[var(--lsd-text-primary)] text-5xl font-bold mb-[var(--lsd-spacing-base)]">
            Supply Chain Incident Dashboard
          </h1>
          <p className="text-[var(--lsd-text-secondary)] text-xl max-w-2xl mx-auto">
            Real-time monitoring of supply chain security threats across multiple ecosystems
          </p>
        </section>

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
                  {incidents.filter(i => i.cvss.base_score >= 7).length}
                </div>
                <div className="text-sm text-[var(--lsd-text-secondary)] mt-1">
                  Critical (CVSS ≥7)
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-[var(--lsd-spacing-large)]">
                <div className="text-3xl font-bold text-[var(--lsd-success)]">
                  {incidents.filter(i => i.confidence_level.toLowerCase() === 'high').length}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-[var(--lsd-spacing-largest)]">
            <div className="text-[var(--lsd-text-secondary)]">Loading incidents...</div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredIncidents.length === 0 && (
          <div className="text-center py-[var(--lsd-spacing-largest)]">
            <div className="text-[var(--lsd-text-secondary)]">
              No incidents found for this ecosystem.
            </div>
          </div>
        )}

        {/* Incident Cards Grid */}
        {!loading && filteredIncidents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--lsd-spacing-large)]">
            {filteredIncidents.map(incident => (
              <Card
                key={incident.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(incident)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-[var(--lsd-spacing-smaller)]">
                    <CardTitle className="text-xl">{incident.package}</CardTitle>
                    <Badge variant="destructive" size="sm">
                      CVSS {incident.cvss.base_score}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-[var(--lsd-spacing-smallest)] mt-[var(--lsd-spacing-smaller)]">
                    <span>{incident.id}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-[var(--lsd-spacing-smallest)] mb-[var(--lsd-spacing-base)]">
                    <Badge variant={getConfidenceColor(incident.confidence_level)} size="sm">
                      {incident.confidence_level.toUpperCase()}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {incident.ecosystem}
                    </Badge>
                    <Badge variant={getCVSSColor(incident.cvss.base_score)} size="sm">
                      {getCVSSSeverity(incident.cvss.base_score)}
                    </Badge>
                  </div>

                  {/* Brief Description */}
                  <p className="text-sm text-[var(--lsd-text-secondary)] leading-relaxed">
                    {incident.attack_mechanics.description.split('.').slice(0, 2).join('.').trim()}.
                  </p>

                  {/* Attack Details */}
                  <div className="mt-[var(--lsd-spacing-base)] space-y-[var(--lsd-spacing-smallest)]">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--lsd-text-secondary)]">Attack Type</span>
                      <span className="text-[var(--lsd-text-primary)] font-medium">
                        {incident.attack_mechanics.primary.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--lsd-text-secondary)]">Delivery</span>
                      <span className="text-[var(--lsd-text-primary)] font-medium">
                        {incident.attack_mechanics.delivery.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--lsd-text-secondary)]">Discovered</span>
                      <span className="text-[var(--lsd-text-primary)] font-medium">
                        {incident.discovered}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-[var(--lsd-spacing-smallest)] text-xs text-[var(--lsd-text-secondary)]">
                  <div className="flex justify-between w-full">
                    <span>CVE: {incident.cve.replace(/N\/A/g, 'None')}</span>
                    <span>GHSA: {incident.ghsa.replace(/N\/A/g, 'None')}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span>Status: {incident.status}</span>
                    <span>Severity: {incident.cvss.severity}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-[var(--lsd-spacing-smallest)]"
                    onClick={e => {
                      e.stopPropagation();
                      handleCardClick(incident);
                    }}
                  >
                    View Details →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-[var(--lsd-spacing-largest)] text-center text-[var(--lsd-text-secondary)] text-sm">
          <p>
            Powered by <strong>@nipsys/lsd</strong> • Real-time threat tracking • Updated May 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
