import yaml from 'js-yaml';
import type { IncidentDatabase } from './types';

export async function loadIncidents() {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const yamlPath = path.join(process.cwd(), 'public', 'incidents.yaml');
  const fileContents = await fs.readFile(yamlPath, 'utf8');
  const data = yaml.load(fileContents) as IncidentDatabase;
  return data;
}
