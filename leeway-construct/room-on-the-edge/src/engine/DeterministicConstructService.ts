/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.DETERMINISTICCONSTRUCTSERVICE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = DeterministicConstructService — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-construct/room-on-the-edge/src/engine/DeterministicConstructService.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import type { AssetBuildPlan } from './DeterministicVoxelEngine';

export interface ConstructConfig {
  skyboxColor: string;
  gridColor: string;
  nebulaIntensity: number;
  panels: Array<{
    id: string;
    title: string;
    color: string;
    position: { x: number; y: number; z: number };
  }>;
}

function averageHex(colors: string[]): string {
  if (!colors.length) return '#14b8a6';
  let r = 0, g = 0, b = 0;
  for (const hex of colors) {
    const raw = hex.replace('#', '');
    r += parseInt(raw.slice(0, 2), 16);
    g += parseInt(raw.slice(2, 4), 16);
    b += parseInt(raw.slice(4, 6), 16);
  }
  const count = colors.length;
  const rr = Math.round(r / count).toString(16).padStart(2, '0');
  const gg = Math.round(g / count).toString(16).padStart(2, '0');
  const bb = Math.round(b / count).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}

function brighten(hex: string, amount: number): string {
  const raw = hex.replace('#', '');
  const channels = [0, 2, 4].map(i => parseInt(raw.slice(i, i + 2), 16));
  const shifted = channels.map(v => Math.max(0, Math.min(255, Math.round(v + (255 - v) * amount))));
  return `#${shifted.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function darken(hex: string, amount: number): string {
  const raw = hex.replace('#', '');
  const channels = [0, 2, 4].map(i => parseInt(raw.slice(i, i + 2), 16));
  const shifted = channels.map(v => Math.max(0, Math.min(255, Math.round(v * (1 - amount)))));
  return `#${shifted.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

export function analyzeAssetForConstruct(plan: AssetBuildPlan): ConstructConfig {
  const dominant = averageHex(plan.palette.slice(0, Math.min(plan.palette.length, 8)));
  const skyboxColor = darken(dominant, 0.72);
  const gridColor = brighten(dominant, 0.3);

  return {
    skyboxColor,
    gridColor,
    nebulaIntensity: plan.style === 'unreal-prop' ? 0.32 : 0.22,
    panels: [
      {
        id: `asset-panel-${plan.id}`,
        title: `${plan.name.toUpperCase()} :: ${plan.style.toUpperCase()}`,
        color: gridColor,
        position: { x: 0, y: 1.5, z: -2.5 },
      },
    ],
  };
}
