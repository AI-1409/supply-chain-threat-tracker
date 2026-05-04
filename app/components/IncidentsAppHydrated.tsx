'use client';

import { useState, createContext, useContext } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nipsys/lsd';
import { PackageIcon } from '@phosphor-icons/react';
import {
  ATTACK_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS,
  DEFAULT_FILTERS,
  DOCUMENTATION_QUALITY_OPTIONS,
  ECOSYSTEM_OPTIONS,
  type FilterState,
  SEVERITY_OPTIONS,
} from '../../data/filters';
import type { Incident } from '../../data/types';

const FilterContext = createContext<{ filters: FilterState; onFiltersChange: (filters: FilterState) => void } | undefined>(undefined);

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within IncidentsAppHydrated');
  }
  return context;
}

interface IncidentsAppHydratedProps {
  initialIncidents: Incident[];
  initialFilters: FilterState;
  children: React.ReactNode;
}

export function IncidentsAppHydrated({ initialIncidents, initialFilters, children }: IncidentsAppHydratedProps) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  return (
    <FilterContext.Provider value={{ filters, onFiltersChange: setFilters }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b border-[var(--lsd-border)]">
            <div className="flex items-center gap-(--lsd-spacing-smaller)">
              <PackageIcon weight="bold" className="h-6 w-6 text-[var(--lsd-primary)]" />
              <span className="text-lg font-semibold text-[var(--lsd-text-primary)]">
                SCT Tracker
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Ecosystem */}
            <SidebarGroup>
              <SidebarGroupLabel>Ecosystem</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Select
                    value={filters.ecosystem}
                    onValueChange={value => setFilters({ ...filters, ecosystem: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ecosystem" />
                    </SelectTrigger>
                    <SelectContent>
                      {ECOSYSTEM_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                          {opt.value === 'all' && ` (${incidents.length})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Severity */}
            <SidebarGroup>
              <SidebarGroupLabel>Severity</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Select
                    value={filters.severity}
                    onValueChange={value => setFilters({ ...filters, severity: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Documentation Quality */}
            <SidebarGroup>
              <SidebarGroupLabel>Documentation Quality</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Select
                    value={filters.documentationQuality}
                    onValueChange={value =>
                      setFilters({ ...filters, documentationQuality: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENTATION_QUALITY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Attack Type */}
            <SidebarGroup>
              <SidebarGroupLabel>Attack Type</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Select
                    value={filters.attackType}
                    onValueChange={value => setFilters({ ...filters, attackType: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTACK_TYPE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Date Range */}
            <SidebarGroup>
              <SidebarGroupLabel>Date Range</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Select
                    value={filters.dateRange}
                    onValueChange={value => setFilters({ ...filters, dateRange: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_RANGE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b border-[var(--lsd-border)] px-(--lsd-spacing-base)">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-[var(--lsd-text-primary)]">
              Supply Chain Threat Tracker
            </h1>
            <div className="w-10" />
          </header>

          <main className="flex-1 overflow-y-auto p-(--lsd-spacing-base)">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </FilterContext.Provider>
  );
}
