'use client';

import { Button } from '@nipsys/lsd';
import Link from 'next/link';
import type { Incident } from '../../data/types';
import IncidentDialogContent from '../components/IncidentDialogContent';

export default function IncidentDetail({ incident }: { incident: Incident }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          ← Back to Dashboard
        </Button>
      </Link>

      <IncidentDialogContent incident={incident} />
    </div>
  );
}
