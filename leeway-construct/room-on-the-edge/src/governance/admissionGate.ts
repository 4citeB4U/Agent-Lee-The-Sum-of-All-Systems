/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.CORE.GOVERNANCE.ADMISSION_GATE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = admissionGate.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = governance/admissionGate.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
export interface ConstructAdmissionMetadata {
  developer?: string;
  requestedLane?: 'Projection' | 'Construct' | 'MCP' | 'Data' | 'Hybrid';
  tag?: string;
  region?: string;
  discoveryPipeline?: string;
  agentForm?: string;
  acknowledgesNoSovereignty?: boolean;
  emitsReceipts?: boolean;
  exposesHealthState?: boolean;
  exposesAuditHooks?: boolean;
}

export interface ConstructProjectionLike {
  id: string;
  type: string;
  title?: string;
  admission?: ConstructAdmissionMetadata;
}

export interface AdmissionFinding {
  gate: 'identity' | 'authority' | 'agent-form' | 'visibility';
  message: string;
}

export interface AdmissionEvaluation {
  qualified: boolean;
  findings: AdmissionFinding[];
}

export interface ConstructGovernanceStatus {
  healthy: boolean;
  blockedCount: number;
  summary: string;
}

export interface BlockedProjectionReport {
  id: string;
  title: string;
  type: string;
  findings: AdmissionFinding[];
}

const INTERNAL_TYPES = new Set(['pallium', 'database', 'agentvm', 'foundry', 'asset']);
const REQUIRED_PIPELINE = 'Voice → Intent → Location → Vertical → Ranking → Render';

function isAgentLeeForm(value: string | undefined) {
  return /^Agent Lee\s+[—-]\s+.+/.test(String(value || '').trim());
}

export function validateConstructProjectionAdmission(projection: ConstructProjectionLike): AdmissionEvaluation {
  if (INTERNAL_TYPES.has(projection.type)) {
    return { qualified: true, findings: [] };
  }

  const findings: AdmissionFinding[] = [];
  const admission = projection.admission;

  if (!admission?.tag || !admission?.region || !admission?.discoveryPipeline) {
    findings.push({ gate: 'identity', message: 'Missing TAG, REGION, or DISCOVERY_PIPELINE metadata.' });
  }
  if (admission?.discoveryPipeline && admission.discoveryPipeline !== REQUIRED_PIPELINE) {
    findings.push({ gate: 'identity', message: 'DISCOVERY_PIPELINE does not match the governed LeeWay pipeline.' });
  }
  if (!admission?.acknowledgesNoSovereignty) {
    findings.push({ gate: 'authority', message: 'Submission does not acknowledge no-sovereignty runtime rules.' });
  }
  if (!isAgentLeeForm(admission?.agentForm || projection.title)) {
    findings.push({ gate: 'agent-form', message: 'Projection title must mount as an Agent Lee form.' });
  }
  if (!admission?.emitsReceipts || !admission?.exposesHealthState || !admission?.exposesAuditHooks) {
    findings.push({ gate: 'visibility', message: 'Projection must expose receipts, health state, and audit hooks.' });
  }

  return {
    qualified: findings.length === 0,
    findings,
  };
}

export function evaluateConstructAdmissions<T extends ConstructProjectionLike>(projections: T[]) {
  const qualified = [] as T[];
  const blocked = [] as BlockedProjectionReport[];

  for (const projection of projections) {
    const evaluation = validateConstructProjectionAdmission(projection);
    if (evaluation.qualified) {
      qualified.push(projection);
      continue;
    }
    blocked.push({
      id: projection.id,
      title: projection.title || projection.id,
      type: projection.type,
      findings: evaluation.findings,
    });
  }

  return {
    qualified,
    blocked,
    status: {
      healthy: blocked.length === 0,
      blockedCount: blocked.length,
      summary: blocked.length === 0 ? 'Admission Gate Active' : `${blocked.length} projection(s) blocked by admission gate`,
    } satisfies ConstructGovernanceStatus,
  };
}