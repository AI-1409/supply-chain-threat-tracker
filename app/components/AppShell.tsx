'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
} from '@nipsys/lsd';
import { PackageIcon } from '@phosphor-icons/react';
import { useState } from 'react';
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

interface AppShellProps {
  children: React.ReactNode;
  incidents: Incident[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function AppShell({ children, incidents, filters, onFiltersChange }: AppShellProps) {
  const ecosystemCounts = ECOSYSTEM_OPTIONS.filter(opt => opt.value !== 'all')
    .map(opt => ({
      value: opt.value,
      label: opt.label,
      count: incidents.filter(i => {
        if (opt.value === 'other') {
          return ![
            'npm',
            'pypi',
            'rubygems',
            'crates.io',
            'go_modules',
            'maven',
            'nuget',
            'packagist',
            'cocoapods',
            'pub.dev',
          ].includes(i.ecosystem.toLowerCase());
        }
        return i.ecosystem.toLowerCase() === opt.value;
      }).length,
    }))
    .filter(e => e.count > 0);

  return (
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
                  onValueChange={value => onFiltersChange({ ...filters, ecosystem: value })}
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
                  onValueChange={value => onFiltersChange({ ...filters, severity: value })}
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
                    onFiltersChange({ ...filters, documentationQuality: value })
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
                  onValueChange={value => onFiltersChange({ ...filters, attackType: value })}
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
                  onValueChange={value => onFiltersChange({ ...filters, dateRange: value })}
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

        <main className="flex-1 overflow-y-auto p-(--lsd-spacing-base)">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
