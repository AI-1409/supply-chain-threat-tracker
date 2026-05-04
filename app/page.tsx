import { incidents } from '../data/incidents';
import IncidentDashboard from './components/IncidentDashboard';

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--lsd-background)] p-[var(--lsd-spacing-largest)]">
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

        {/* Incident Dashboard */}
        <IncidentDashboard incidents={incidents} />

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
