/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.AUTO_ENFORCE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = auto-enforce — governed module
WHY = Expose LeeWay file-level auto-enforcement through the standards package CLI
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/cli/auto-enforce.mjs
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const standardsRoot = path.resolve(__dirname, '..', '..', '..');
const scriptPath = path.join(standardsRoot, 'scripts', 'auto-enforce-file-governance.mjs');

const child = spawn('node', [scriptPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: standardsRoot,
});
child.on('close', (code) => process.exit(code ?? 1));