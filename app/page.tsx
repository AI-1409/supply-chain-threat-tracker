import { incidents } from '../data/incidents';
import IncidentDashboard from './components/IncidentDashboard';

export default function Page() {
  return <IncidentDashboard incidents={incidents} />;
}
