'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@nipsys/lsd';
import { ArrowSquareOut, X } from '@phosphor-icons/react';
import Link from 'next/link';
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
      <DialogContent className="max-w-4xl max-h-[85vh]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <DialogTitle className="text-xl">{incident.id}</DialogTitle>
            <div className="flex items-center gap-2">
              <Link
                href={`/${incident.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--lsd-primary)] transition-colors"
              >
                <span className="hidden sm:inline">Open in new tab</span>
                <ArrowSquareOut size={16} />
              </Link>
              <DialogClose asChild>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground hover:opacity-100 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={16} />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </div>
          </div>
          <DialogDescription>
            View detailed information about the {incident.package} incident in {incident.ecosystem}
          </DialogDescription>
        </DialogHeader>
        <IncidentDialogContent incident={incident} />
      </DialogContent>
    </Dialog>
  );
}
