import yaml from 'js-yaml';

export async function loadIncidents() {
  const fs = await import('fs/promises');
  const path = await import('path');

  const yamlPath = path.join(process.cwd(), 'public', 'incidents.yaml');
  const fileContents = await fs.readFile(yamlPath, 'utf8');
  const data = yaml.load(fileContents) as any;
  return data;
}
