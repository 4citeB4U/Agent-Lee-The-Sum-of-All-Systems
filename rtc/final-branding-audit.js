/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.FINAL_BRANDING_AUDIT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = final-branding-audit — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = rtc/final-branding-audit.js
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import fs from 'fs';
import path from 'path';

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scan(fullPath);
      }
    } else if (entry.isFile() && /\.(ts|tsx|js)$/.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update Company Name in headers
      content = content.replace(/LeeWay Innovations/g, 'LEEWAY INNOVATIONS');
      content = content.replace(/LeeWay Innovation/g, 'LEEWAY INNOVATIONS');
      
      // Update watermark where applicable (in source comments/headers)
      content = content.replace(/WHO\s+=\s+.*/g, 'WHO  = LEEWAY INNOVATIONS A LEEWAY INDUSTY CREATION');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

const root = process.cwd();
['src', 'services/sfu/src'].forEach(reg => {
  const p = path.join(root, reg);
  if (fs.existsSync(p)) scan(p);
});
console.log('Final Presentation Audit Complete.');
