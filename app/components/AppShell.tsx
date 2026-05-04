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
import { List, Package } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useMobile } from '../hooks/use-mobile';

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
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ecosystemCounts = ECOSYSTEMS.map(ecosystem => {
    if (ecosystem === 'All') {
      return ecosystem;
    }
    const count = incidents.filter(i => i.ecosystem === ecosystem).length;
    return count > 0 ? ecosystem : null;
  }).filter(e => e !== null);

  const handleEcosystemChange = (ecosystem: string) => {
    onEcosystemChange(ecosystem);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (!isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isMobile, isSidebarOpen]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[var(--lsd-background)]">
        {/* Mobile Toggle Button - Only shows on mobile */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--lsd-background)] border border-[var(--lsd-border)] shadow-sm hover:bg-[var(--lsd-muted)] transition-colors lg:hidden"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <List size={24} weight="bold" className="text-[var(--lsd-text-primary)]" />
          </button>
        )}

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                setIsSidebarOpen(false);
              }
            }}
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        <Sidebar
          className={`border-r border-[var(--lsd-border)] transition-transform duration-300 ease-in-out ${
            isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
          } fixed lg:relative z-50 h-full`}
        >
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
                            onClick={() => handleEcosystemChange(ecosystem)}
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
