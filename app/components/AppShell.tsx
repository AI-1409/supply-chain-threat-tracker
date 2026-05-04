'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@nipsys/lsd';
import { PackageIcon } from '@phosphor-icons/react';

const ECOSYSTEMS = ['All', 'npm', 'PyPI', 'RubyGems', 'crates.io'] as const;

interface AppShellProps {
  children: React.ReactNode;
  selectedEcosystem: string;
  onEcosystemChange: (ecosystem: string) => void;
  incidents: { ecosystem: string }[];
}

export default function AppShell({
  children,
  selectedEcosystem,
  onEcosystemChange,
  incidents,
}: AppShellProps) {
  const ecosystemCounts = ECOSYSTEMS.map(ecosystem => {
    if (ecosystem === 'All') {
      return ecosystem;
    }
    const count = incidents.filter(i => i.ecosystem === ecosystem).length;
    return count > 0 ? ecosystem : null;
  }).filter(e => e !== null);

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
          <SidebarGroup>
            <SidebarGroupLabel>Ecosystems</SidebarGroupLabel>
            <SidebarMenu>
              {ECOSYSTEMS.map(ecosystem => {
                if (!ecosystemCounts.includes(ecosystem) && ecosystem !== 'All') {
                  return null;
                }
                const count =
                  ecosystem === 'All'
                    ? incidents.length
                    : incidents.filter(i => i.ecosystem === ecosystem).length;
                return (
                  <SidebarMenuItem key={ecosystem}>
                    <SidebarMenuButton
                      isActive={selectedEcosystem === ecosystem}
                      onClick={() => onEcosystemChange(ecosystem)}
                    >
                      <span>{ecosystem}</span>
                      <span className="text-sm text-[var(--lsd-text-secondary)]">{count}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
