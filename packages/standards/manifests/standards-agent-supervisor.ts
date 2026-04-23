/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.STANDARDS_AGENT_SUPERVISOR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = standards-agent-supervisor — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/manifests/standards-agent-supervisor.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { STANDARDS_SERVICE_AGENTS, assertStandardsAgentsHaveVmIdentity } from "./standards-service-agents";
import type { StandardsAgentStatus } from "./standards-agent-status";
import { LEEWAY_DOCTRINE } from "./leeway-doctrine";

export type StandardsAgentRuntimeSnapshot = {
  generatedAt: string;
  mode: string;
  scope: string;
  doctrine: typeof LEEWAY_DOCTRINE;
  leeWayOperationalState: string;
  statuses: StandardsAgentStatus[];
};

function deriveLeeWayPhase(mode: string): string {
  switch (mode) {
    case "scan":
      return "LAYERED_GOVERNANCE";
    case "purge-plan":
      return "WORKFLOW_PRODUCTIVITY";
    case "enforce":
      return "ARCHITECTURE_ENFORCEMENT";
    case "quarantine":
      return "CONTROLLED_EXECUTION";
    case "move-simulate":
      return "STRUCTURAL_RECOMPOSITION";
    case "move-analyze":
      return "STRUCTURAL_RECOMPOSITION";
    case "move-apply":
      return "STRUCTURAL_RECOMPOSITION";
    case "move-group-analyze":
      return "COORDINATED_RECOMPOSITION";
    case "move-group-apply":
      return "COORDINATED_RECOMPOSITION";
    case "move-resolve-blockers":
      return "COORDINATED_RECOMPOSITION";
    case "watch":
      return "CONTINUOUS_GOVERNANCE";
    case "ci":
      return "SYSTEM_YIELD_GATING";
    default:
      return "STRUCTURED_FREEDOM";
  }
}

export function buildStandardsAgentSnapshot(mode: string, scope: string): StandardsAgentRuntimeSnapshot {
  const now = Date.now();
  const leeWayOperationalState = deriveLeeWayPhase(mode);
  const agents = assertStandardsAgentsHaveVmIdentity(STANDARDS_SERVICE_AGENTS);
  const statuses: StandardsAgentStatus[] = agents.map((agent) => ({
    agentId: agent.agentId,
    status: agent.mode.includes(mode as any) ? "running" : "idle",
    lastRunAt: now,
    receiptCount: 0,
    blockingCount: 0,
    reposWatched: [scope],
    currentMission: agent.mode.includes(mode as any)
      ? `${agent.title} active in ${mode} mode`
      : `${agent.title} standby in ${mode} mode`,
    leeWayPhase: leeWayOperationalState,
    identitySurface: agent.identitySurface,
    vmSurfaceId: agent.vmSurface.surfaceId,
    vmSurfaceRoute: agent.vmSurface.route,
    vmRequired: agent.vmSurface.required,
    fullIdentitySurface: agent.vmSurface.fullIdentitySurface,
    standardsMonitored: agent.vmSurface.standardsMonitored,
    vmMounted: true,
  }));

  return {
    generatedAt: new Date(now).toISOString(),
    mode,
    scope,
    doctrine: LEEWAY_DOCTRINE,
    leeWayOperationalState,
    statuses,
  };
}
