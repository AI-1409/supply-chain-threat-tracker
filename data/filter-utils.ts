import type { FilterState } from './filters';
import {
  ATTACK_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS,
  DOCUMENTATION_QUALITY_OPTIONS,
  ECOSYSTEM_OPTIONS,
  SEVERITY_OPTIONS,
} from './filters';
import type { Incident } from './types';

/**
 * Filter incidents based on the provided filter state
 */
export function filterIncidents(incidents: Incident[], filters: FilterState): Incident[] {
  return incidents.filter(incident => {
    // Ecosystem filter
    if (filters.ecosystem !== 'all') {
      const ecosystem = incident.ecosystem.toLowerCase();
      if (filters.ecosystem === 'other') {
        const primaryEcosystems = [
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
        ];
        if (primaryEcosystems.includes(ecosystem)) return false;
      } else if (!ecosystem.includes(filters.ecosystem.toLowerCase())) {
        return false;
      }
    }

    // Severity filter
    if (filters.severity !== 'all') {
      const baseScore =
        typeof incident.cvss.base_score === 'string'
          ? Number.parseFloat(incident.cvss.base_score)
          : incident.cvss.base_score;
      const severity = SEVERITY_OPTIONS.find(s => s.value === filters.severity);
      if (!severity || !('threshold' in severity)) return false;

      const threshold = severity.threshold;
      if ('min' in threshold && baseScore < threshold.min) return false;
      if ('max' in threshold && baseScore > threshold.max) return false;
    }

    // Documentation Quality filter
    if (filters.documentationQuality !== 'all') {
      // Map confidence_level to documentation_quality
      const qualityMap: Record<string, string> = {
        high: 'confirmed',
        medium: 'limited',
        low: 'unverified',
      };
      const incidentQuality = qualityMap[incident.confidence_level] || 'unverified';
      if (incidentQuality !== filters.documentationQuality) return false;
    }

    // Attack Type filter
    if (filters.attackType !== 'all') {
      const attackType = getNormalizedAttackType(incident);
      if (filters.attackType === 'other') {
        // Match if it's not one of the known attack types
        const knownTypes = ATTACK_TYPE_OPTIONS.filter(
          opt => opt.value !== 'all' && opt.value !== 'other'
        );
        const isKnown = knownTypes.some(kt => attackType.includes(kt.value.replace(/_/g, ' ')));
        if (isKnown) return false;
      } else if (!attackType.includes(filters.attackType.replace(/_/g, ' '))) {
        return false;
      }
    }

    // Date Range filter
    if (filters.dateRange !== 'all') {
      const discoveredDate = new Date(incident.discovered);
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '180d':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case '365d':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'custom':
          if (filters.customDateStart) {
            startDate = new Date(filters.customDateStart);
          } else {
            startDate = new Date(0); // Beginning of time
          }
          if (filters.customDateEnd) {
            const endDate = new Date(filters.customDateEnd);
            if (discoveredDate > endDate) return false;
          }
          break;
        default:
          startDate = new Date(0);
      }

      if (discoveredDate < startDate) return false;
    }

    return true;
  });
}

/**
 * Normalize attack type from incident data to match our filter options
 */
function getNormalizedAttackType(incident: Incident): string {
  const attackMechanics = incident.attack_mechanics;
  const normalizedAttackType = [
    attackMechanics.primary,
    attackMechanics.secondary,
    attackMechanics.tertiary,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return normalizedAttackType;
}

/**
 * Get filter label for display
 */
export function getFilterLabel(type: keyof FilterState, value: string): string {
  switch (type) {
    case 'ecosystem':
      return ECOSYSTEM_OPTIONS.find(opt => opt.value === value)?.label || value;
    case 'severity':
      return SEVERITY_OPTIONS.find(opt => opt.value === value)?.label || value;
    case 'documentationQuality':
      return DOCUMENTATION_QUALITY_OPTIONS.find(opt => opt.value === value)?.label || value;
    case 'attackType':
      return ATTACK_TYPE_OPTIONS.find(opt => opt.value === value)?.label || value;
    case 'dateRange':
      return DATE_RANGE_OPTIONS.find(opt => opt.value === value)?.label || value;
    default:
      return value;
  }
}
