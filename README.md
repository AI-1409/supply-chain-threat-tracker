# Supply Chain Threat Tracker

A security threat monitoring application for tracking supply chain vulnerabilities across software dependencies.

## Features

- Threat Dashboard - Real-time overview of active supply chain threats
- Threat Intelligence - Comprehensive threat intelligence feeds and vulnerability analysis
- Security Checklist - Track supply chain security compliance and best practices
- Data Sources - View and manage threat data sources and integrations

## Tech Stack

- Next.js 16.2.4
- React 19.2.4
- TypeScript 5+
- TailwindCSS v4
- LSD (@nipsys/lsd) 1.1.1
- Biome.js (linting/formatting)
- Lefthook (git hooks)

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Building

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start
```

## Quality Gates

The project uses Lefthook with pre-commit and pre-push hooks:

- **Pre-commit**: Runs Biome linting - blocks commits with lint errors
- **Pre-push**: Runs build - blocks push if build fails

## Data Sources

The application integrates with multiple threat intelligence sources:

- National Vulnerability Database (NVD)
- GitHub Security Advisories
- OSS Vulnerability Database
- NPM Security Audit
- And more...

## Deployment

The project is configured for static export:

- Static export enabled in `next.config.ts`
- Base path set to `/supply-chain-threat-tracker`
