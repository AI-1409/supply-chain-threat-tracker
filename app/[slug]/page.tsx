import { notFound } from 'next/navigation';
import { getAllIncidentIds, getIncidentById } from '../../data/incidents';
import type { Incident } from '../../data/types';
import IncidentDetail from './IncidentDetail';

// Generate static params for all incidents at build time
export async function generateStaticParams() {
  const incidentIds = getAllIncidentIds();
  return incidentIds.map(id => ({
    slug: id,
  }));
}

export default async function IncidentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const incident = getIncidentById(slug);

  if (!incident) {
    notFound();
  }

  return <IncidentDetail incident={incident} />;
}
