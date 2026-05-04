'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@nipsys/lsd';
import { Package } from '@phosphor-icons/react';

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
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[var(--lsd-background)]">
        {/* Left Sidebar */}
        <Sidebar className="border-r border-[var(--lsd-border)]">
          <div className="flex h-full w-[280px] flex-col">
            {/* Sidebar Header */}
            <div className="flex h-16 items-center border-b border-[var(--lsd-border)] px-6">
              <Package weight="bold" className="mr-2 h-6 w-6 text-[var(--lsd-primary)]" />
              <span className="text-lg font-semibold text-[var(--lsd-text-primary)]">
                SCT Tracker
              </span>
            </div>

            {/* Sidebar Content */}
            <SidebarContent className="flex-1 overflow-y-auto">
              <div className="p-4">
                <SidebarGroup>
                  <SidebarGroupLabel>Ecosystems</SidebarGroupLabel>
                  <SidebarMenu>
                    {ECOSYSTEMS.map(ecosystem => {
                      const count =
                        ecosystem === 'All'
                          ? incidents.length
                          : incidents.filter(i => i.ecosystem === ecosystem).length;

                      return (
                        <SidebarMenuItem key={ecosystem}>
                          <SidebarMenuButton
                            isActive={selectedEcosystem === ecosystem}
                            onClick={() => onEcosystemChange(ecosystem)}
                            className="w-full justify-between"
                          >
                            <span>{ecosystem}</span>
                            <span className="text-sm text-[var(--lsd-text-secondary)]">
                              {count}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              </div>
            </SidebarContent>
          </div>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="border-b border-[var(--lsd-border)] bg-[var(--lsd-background)]">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-2xl font-bold text-[var(--lsd-text-primary)]">
                  Supply Chain Threat Tracker
                </h1>
                <p className="text-sm text-[var(--lsd-text-secondary)]">
                  Real-time monitoring of supply chain security threats
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
