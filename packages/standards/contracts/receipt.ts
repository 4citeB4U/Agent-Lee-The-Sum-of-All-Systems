/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.CONTRACT.RECEIPT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = receipt — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/contracts/receipt.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type Receipt = {
  id: string;
  agent: string;
  severity: "info" | "warn" | "error" | "blocking";
  repo: string;
  path: string;
  issue: string;
  action: "KEEP" | "MOVE" | "DELETE" | "EXTERNALIZE" | "QUARANTINE";
  target?: string;
  autoFixable: boolean;
  ts: number;
};
