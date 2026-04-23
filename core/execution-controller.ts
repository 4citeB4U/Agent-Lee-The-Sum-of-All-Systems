/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.EXECUTION_CONTROLLER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = execution-controller — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = core/execution-controller.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * LeeWay Standards — Execution Controller
 * 
 * **Origin:** LeeWay-Standards (this is the canonical implementation)
 * **Replaces:**
 *   - leeway-construct/room-on-the-edge/src/core/execution/StudioExecutionController.ts
 * 
 * **Contract:**
 * - Route all execution commands through Standards authority
 * - No external environment can execute code directly
 * - All execution is logged and auditable
 * - Returns execution results through Standards report format
 * 
 * **Consumers:**
 * - construct/src/engine/* (execution requests)
 * - construct/src/components/* (task execution)
 */

/**
 * Execution profile — configuration for different execution modes
 */
export interface ExecutionProfile {
  id: string;
  name: string;
  description: string;
  intensity: number;
  constraints: {
    maxDuration: number;
    maxMemory: number;
    allowedResources: string[];
  };
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
 * Execution result — Standards-formatted response
 */
export interface ExecutionResult {
  status: 'success' | 'error' | 'timeout' | 'denied';
  output: any;
  auditEntry: {
    executedAt: string;
    executedBy: 'LeeWay-Standards';
    context: string;
  };
}

/**
 * Standard execution profiles (enforced by Standards)
 */
export const EXECUTION_PROFILES: Record<string, ExecutionProfile> = {
  BALANCED: {
    id: 'balanced',
    name: 'Balanced',
    description: 'Standard execution',
    intensity: 0.5,
    constraints: {
      maxDuration: 30000,
      maxMemory: 512,
      allowedResources: ['cpu', 'disk-read'],
    },
  },
  HIGH: {
    id: 'high',
    name: 'High',
    description: 'Maximum intensity',
    intensity: 1.0,
    constraints: {
      maxDuration: 60000,
      maxMemory: 1024,
      allowedResources: ['cpu', 'disk-read', 'disk-write'],
    },
  },
};

/**
 * Standards-governed execution controller
 * All execution must be routed through this
 */
export class StandardsExecutionController {
  private profile?: ExecutionProfile;

  async init(profile?: string): Promise<void> {
    // 1. LOG INITIALIZATION
    console.log('[STANDARDS] Execution controller initializing');

    // 2. VALIDATE PROFILE (if provided)
    if (profile && !EXECUTION_PROFILES[profile]) {
      throw new Error(`[STANDARDS] Unknown execution profile: ${profile}`);
    }

    // 3. SET PROFILE
    if (profile) {
      this.profile = EXECUTION_PROFILES[profile];
      console.log('[STANDARDS] Execution profile set:', {
        profile: this.profile.name,
        constraints: this.profile.constraints,
      });
    } else {
      this.profile = EXECUTION_PROFILES.BALANCED;
      console.log('[STANDARDS] Using default (BALANCED) execution profile');
    }

    // 4. LOG SUCCESS
    console.log('[STANDARDS] Execution controller initialized');
  }

  async execute(task: any): Promise<ExecutionResult> {
    // 0. ENFORCE EXTERNAL GATING (Hard Block by Default)
    if (task?.source === 'external') {
      const mode = (process.env.LEEWAY_MODE || 'LOCKED').toUpperCase();
      
      if (mode === 'LOCKED' || (mode !== 'AUDIT' && mode !== 'OPEN')) {
        throw buildEnforcementBlockError('execution-controller');
      }
      
      if (mode === 'AUDIT') {
        console.warn('[STANDARDS] External task in AUDIT mode (allowed for validation)');
      }
    }

    // 1. VALIDATE INPUT
    if (!task) {
      throw new Error('[STANDARDS] Task object required for execution');
    }

    // 2. LOG EXECUTION REQUEST
    console.log('[STANDARDS] Execution requested:', {
      taskType: task.type || 'unknown',
      profile: this.profile?.name || 'default',
    });

    // 3. CHECK PROFILE CONSTRAINTS
    if (this.profile) {
      if (task.duration && task.duration > this.profile.constraints.maxDuration) {
        throw new Error(
          `[STANDARDS] Task duration exceeds profile limit: ${task.duration}ms > ${this.profile.constraints.maxDuration}ms`
        );
      }
    }

    // 4. EXECUTE TASK
    let output;
    try {
      if (typeof task.execute === 'function') {
        output = await task.execute();
      } else if (typeof task.run === 'function') {
        output = await task.run();
      } else {
        throw new Error('[STANDARDS] Task has no execute or run method');
      }
    } catch (error) {
      console.error('[STANDARDS] Task execution failed:', error);
      return {
        status: 'error',
        output: { error: String(error) },
        auditEntry: {
          executedAt: new Date().toISOString(),
          executedBy: 'LeeWay-Standards',
          context: 'execution-failed',
        },
      };
    }

    // 5. ATTACH LEEWAY METADATA
    const result: ExecutionResult = {
      status: 'success',
      output,
      auditEntry: {
        executedAt: new Date().toISOString(),
        executedBy: 'LeeWay-Standards',
        context: task.type || 'task',
      },
    };

    // 6. LOG COMPLETION
    console.log('[STANDARDS] Task execution complete:', {
      taskType: task.type || 'unknown',
      status: 'success',
    });

    return result;
  }
}
