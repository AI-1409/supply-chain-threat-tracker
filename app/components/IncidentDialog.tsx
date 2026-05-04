'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@nipsys/lsd';
import { ArrowSquareOut } from '@phosphor-icons/react';
import type { Incident } from '../../data/types';
import IncidentDialogContent from './IncidentDialogContent';

interface IncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: Incident | null;
}

/**
 * IncidentDialog - Dialog component for previewing incident details
 * Includes "open in new tab" button for deep linking to the incident detail page
 */
export default function IncidentDialog({ open, onOpenChange, incident }: IncidentDialogProps) {
  if (!incident) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl">{incident.id}</DialogTitle>
            <a
              href={`/${incident.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--lsd-primary)] transition-colors ml-4"
            >
              <span className="hidden sm:inline">Open in new tab</span>
              <ArrowSquareOut size={16} />
            </a>
          </div>
        </DialogHeader>
        <IncidentDialogContent incident={incident} />
      </DialogContent>
    </Dialog>
  );
}
