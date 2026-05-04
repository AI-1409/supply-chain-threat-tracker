import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { IncidentDatabase } from '../../data/types';

// Path to the incidents.yaml file
const INCIDENTS_FILE_PATH = path.join(process.cwd(), 'data', 'incidents.yaml');

/**
 * Load incidents from the YAML file and return typed data
 * This function reads the YAML file, parses it, and returns strongly typed data
 *
 * @returns {IncidentDatabase} The typed incident data structure
 * @throws {Error} If the file cannot be read or parsed
 */
export function loadIncidents(): IncidentDatabase {
  try {
    // Read the YAML file
    const fileContents = fs.readFileSync(INCIDENTS_FILE_PATH, 'utf-8');

    // Parse the YAML content
    const data = yaml.load(fileContents);

    // Validate that the basic structure exists
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid YAML structure: root must be an object');
    }

    const typedData = data as IncidentDatabase;

    // Validate required top-level properties
    if (!Array.isArray(typedData.incidents)) {
      throw new Error('Invalid YAML structure: incidents must be an array');
    }

    if (!typedData.metadata) {
      throw new Error('Invalid YAML structure: metadata is required');
    }

    return typedData;
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      throw new Error(`YAML parsing error: ${error.message}`);
    }
    if (error instanceof Error && error.message.startsWith('Invalid YAML structure')) {
      throw error;
    }
    throw new Error(`Failed to load incidents: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a specific incident by ID
 *
 * @param {string} id - The incident ID (e.g., "SC-2024-001")
 * @returns {Incident | undefined} The incident if found, undefined otherwise
 */
export function getIncidentById(id: string) {
  const incidents = loadIncidents().incidents;
  return incidents.find(incident => incident.id === id);
}

/**
 * Get all incidents sorted by discovery date (newest first)
 *
 * @returns {typeof import('../../data/types').Incident[]} Sorted array of incidents
 */
export function getIncidentsSortedByDate() {
  const incidents = loadIncidents().incidents;
  return incidents.sort((a, b) => {
    return new Date(b.discovered).getTime() - new Date(a.discovered).getTime();
  });
}

/**
 * Filter incidents by ecosystem
 *
 * @param {string} ecosystem - The ecosystem name (e.g., "npm", "PyPI", "RubyGems", "crates.io")
 * @returns {typeof import('../../data/types').Incident[]} Filtered array of incidents
 */
export function getIncidentsByEcosystem(ecosystem: string) {
  const incidents = loadIncidents().incidents;
  return incidents.filter(incident => incident.ecosystem === ecosystem);
}

/**
 * Get unique list of all ecosystems in the database
 *
 * @returns {string[]} Array of unique ecosystem names
 */
export function getEcosystems(): string[] {
  const incidents = loadIncidents().incidents;
  const ecosystems = new Set(incidents.map(incident => incident.ecosystem));
  return Array.from(ecosystems).sort();
}
