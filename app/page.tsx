import { IncidentsAppHydrated } from './components/IncidentsAppHydrated';
import IncidentDashboard from './components/IncidentDashboard';
import { getAllIncidents } from '../data/incidents';
import { DEFAULT_FILTERS } from '../data/filters';

export default function Page() {
  // Load incidents on the server
  const incidents = getAllIncidents();
  const filters = DEFAULT_FILTERS;

  return (
    <IncidentsAppHydrated initialIncidents={incidents} initialFilters={filters}>
      <IncidentDashboard incidents={incidents} />
    </IncidentsAppHydrated>
  );
}
