/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.GOVERNANCE_CORE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = governance-core — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = governance/governance-core.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * LeeWay Standards — Governance Core
 * 
 * **Origin:** LeeWay-Standards (this is the canonical implementation)
 * **Replaces:**
 *   - leeway-construct/room-on-the-edge/src/core/governanceEnforcer.ts
 * 
 * **Contract:**
 * - Central rule enforcement engine
 * - All permission checks go through this
 * - Exposes validation API to projection surfaces
 * - Logs all governance decisions to audit trail
 * 
 * **Consumers:**
 * - construct/src/components/* (permission checks)
 * - construct/src/engine/* (governance validation)
 */

/**
 * Governance rule — base type for all rules
 */
export interface GovernanceRule {
  id: string;
  name: string;
  authority: 'LeeWay-Standards';
  applies_to: string[]; // ['construct', 'employment-center', 'rtc-layer', etc]
  condition: (context: any) => boolean;
  action: 'allow' | 'deny' | 'log' | 'gate';
}

function buildEnforcementBlockError(adapter: string): Error {
  const context = {
    layer: 'standards',
    adapter,
    timestamp: Date.now(),
  };

  const payload = {
    type: 'LEEWAY_ENFORCEMENT_BLOCK',
    message: 'External execution blocked',
    context,
  };

  const error = new Error('[LEEWAY_ENFORCEMENT] External execution blocked — not approved by Standards');
  (error as any).name = 'LEEWAY_ENFORCEMENT_BLOCK';
  (error as any).payload = payload;
  return error;
}

/**
 * Core governance rules enforced by Standards
 */
export const CORE_GOVERNANCE_RULES: GovernanceRule[] = [
  {
    id: 'rule-001',
    name: 'No external AI SDK direct usage',
    authority: 'LeeWay-Standards',
    applies_to: ['construct', 'employment-center'],
    condition: (context) => !context.hasDirectGoogleSDK,
    action: 'deny',
  },
  {
    id: 'rule-002',
    name: 'All agents must be Standards-born',
    authority: 'LeeWay-Standards',
    applies_to: ['employment-center'],
    condition: (context) => context.agent?.birthCertificate?.birthAuthority === 'LeeWay-Standards',
    action: 'gate',
  },
  {
    id: 'rule-003',
    name: 'Auth must pass through Standards adapter',
    authority: 'LeeWay-Standards',
    applies_to: ['construct', 'employment-center'],
    condition: (context) => context.authSource === 'Standards',
    action: 'deny',
  },
];

/**
 * Enforce governance on file operation
 */
export async function enforceFileGovernance(file: any): Promise<{ compliant: boolean; violations: string[] }> {
  // 0. ENFORCE EXTERNAL GATING (Hard Block by Default)
  if (file?.source === 'external') {
    const mode = (process.env.LEEWAY_MODE || 'LOCKED').toUpperCase();
    
    if (mode === 'LOCKED' || (mode !== 'AUDIT' && mode !== 'OPEN')) {
      throw buildEnforcementBlockError('governance-core');
    }
    
    if (mode === 'AUDIT') {
      console.warn('[STANDARDS] External file in AUDIT mode (allowed for validation)');
    }
  }

  // 1. VALIDATE INPUT
  if (!file) {
    throw new Error('[STANDARDS] File object required for governance enforcement');
  }

  // 2. LOG ENFORCEMENT
  console.log('[STANDARDS] File governance enforcement:', {
    filePath: file.path || 'unknown',
  });

  const violations: string[] = [];

  // 3. CHECK OWNERSHIP
  if (file.owner && !['LeeWay-Standards', 'LeeWay-Integrated'].includes(file.owner)) {
    violations.push(`File ownership violation: ${file.owner}`);
  }

  // 4. CHECK FOR EXTERNAL MARKERS
  if (file.hasExternalSDK || file.hasGoogleDependencies) {
    violations.push('File contains external SDK references');
  }

  // 5. LOG RESULT
  const compliant = violations.length === 0;
  console.log('[STANDARDS] File governance check:', {
    compliant,
    violations,
  });

  return { compliant, violations };
}

/**
 * Check if operation meets governance rules
 */
export async function checkGovernanceCompliance(
  operationContext: any
): Promise<{ allowed: boolean; reason?: string }> {
  // 1. VALIDATE INPUT
  if (!operationContext) {
    throw new Error('[STANDARDS] Operation context required for governance check');
  }

  // 2. LOG CHECK
  console.log('[STANDARDS] Governance compliance check:', {
    operation: operationContext.operation || 'unknown',
  });

  // 3. EVALUATE AGAINST CORE RULES
  for (const rule of CORE_GOVERNANCE_RULES) {
    try {
      // 4. CHECK RULE CONDITION
      const ruleApplies = operationContext.applies_to ? 
        rule.applies_to.includes(operationContext.applies_to) : true;

      if (ruleApplies && !rule.condition(operationContext)) {
        // 5. LOG VIOLATION
        console.warn('[STANDARDS] Rule violation detected:', {
          ruleId: rule.id,
          ruleName: rule.name,
          action: rule.action,
        });

        if (rule.action === 'deny') {
          return {
            allowed: false,
            reason: `Governance rule violated: ${rule.name}`,
          };
        }
      }
    } catch (error) {
      console.error('[STANDARDS] Error evaluating rule:', rule.id, error);
    }
  }

  // 6. LOG COMPLIANCE
  console.log('[STANDARDS] Operation is governance compliant');
  return { allowed: true };
}

/**
 * Log governance decision to audit trail
 */
export async function logGovernanceDecision(
  ruleId: string,
  decision: 'allow' | 'deny',
  context: any
): Promise<void> {
  // 1. VALIDATE INPUT
  if (!ruleId) {
    throw new Error('[STANDARDS] Rule ID required for logging');
  }

  // 2. CREATE AUDIT ENTRY
  const auditEntry = {
    timestamp: new Date().toISOString(),
    ruleId,
    decision,
    context: {
      operation: context?.operation,
      applies_to: context?.applies_to,
    },
    authority: 'LeeWay-Standards',
  };

  // 3. LOG TO CONSOLE (in production, would write to audit database)
  console.log('[STANDARDS] Governance decision logged:', auditEntry);

  // 4. RETURN SUCCESS
  return;
}
