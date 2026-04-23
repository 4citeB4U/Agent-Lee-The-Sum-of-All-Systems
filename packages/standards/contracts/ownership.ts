/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.CONTRACT.OWNERSHIP.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ownership — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/contracts/ownership.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type Ownership = {
  repo: string;
  path: string;
  owner: "Standards" | "Integrated" | "RTC" | "GPU" | "Product";
  responsibility: string;
};
