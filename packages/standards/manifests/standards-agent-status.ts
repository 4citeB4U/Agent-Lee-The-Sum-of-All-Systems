/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.STANDARDS_AGENT_STATUS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = standards-agent-status — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/manifests/standards-agent-status.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type StandardsAgentStatus = {
  agentId: string;
  status: "idle" | "running" | "error" | "blocked";
  lastRunAt: number;
  receiptCount: number;
  blockingCount: number;
  reposWatched: string[];
  currentMission: string;
  leeWayPhase?: string;
  identitySurface: "agent-vm";
  vmSurfaceId: string;
  vmSurfaceRoute: string;
  vmRequired: true;
  fullIdentitySurface: true;
  standardsMonitored: true;
  vmMounted: boolean;
};
