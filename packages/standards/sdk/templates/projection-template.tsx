/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UTIL
TAG: UTIL.MODULE.PROJECTION_TEMPLATE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = projection-template — governed module
WHY = Provide a template for writing LeeWay-compliant external projections
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/sdk/templates/projection-template.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * ## LeeWay Projection Template (React)
 *
 * This is a template for writing Room-compatible projections.
 * Projections are UI components that run INSIDE the Room runtime.
 *
 * Key requirements:
 * 1. Must mount with Agent Lee - prefix in title
 * 2. Must expose health state and audit hooks
 * 3. Cannot directly import from /standards or /runtime
 * 4. Must acknowledge no-sovereignty (cannot modify runtime)
 * 5. Must emit execution receipts
 */

import React, { useState, useEffect } from 'react';

export const ProjectionMetadata = {
  id: 'projection-template',
  type: 'projection',
  title: 'Agent Lee — [Your Projection Name]',
  region: 'UI',
  tag: 'UI.PROJECTION.YOUR_NAME.MAIN',
  discoveryPipeline: 'Voice → Intent → Location → Vertical → Ranking → Render',
  
  // Governance compliance
  acknowledgesNoSovereignty: true,
  emitsReceipts: true,
  exposesHealthState: true,
  exposesAuditHooks: true,
  
  // Capability declarations
  approvedDomains: ['localhost', 'api.example.com'],
  capabilities: {
    fileSystemRead: false,
    fileSystemWrite: false,
    networkAccess: true,
    agentSpawn: false,
  },
};

interface ProjectionProps {
  onHealthStateChange?: (state: HealthState) => void;
  onReceipt?: (receipt: ExecutionReceipt) => void;
}

interface HealthState {
  healthy: boolean;
  timestamp: string;
  errorCount: number;
}

interface ExecutionReceipt {
  type: string;
  timestamp: string;
  component: string;
  action: string;
  result: 'success' | 'failure';
}

export const LeeWayProjectionTemplate: React.FC<ProjectionProps> = ({
  onHealthStateChange,
  onReceipt,
}) => {
  const [count, setCount] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  // Emit health state on changes
  useEffect(() => {
    onHealthStateChange?.({
      healthy: errors === 0,
      timestamp: new Date().toISOString(),
      errorCount: errors,
    });
  }, [errors, onHealthStateChange]);

  const handleAction = async (action: string) => {
    try {
      setCount(count + 1);

      // Your business logic here
      const result = await performAction(action);

      onReceipt?.({
        type: 'projection-execution',
        timestamp: new Date().toISOString(),
        component: ProjectionMetadata.id,
        action,
        result: 'success',
      });

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrors(errors + 1);
      setLastError(errorMsg);

      onReceipt?.({
        type: 'projection-error',
        timestamp: new Date().toISOString(),
        component: ProjectionMetadata.id,
        action,
        result: 'failure',
      });

      throw error;
    }
  };

  return (
    <div className="p-6 bg-zinc-900 text-white rounded-lg border border-white/10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{ProjectionMetadata.title}</h2>
        <p className="text-white/60 text-sm mt-1">LeeWay-Compliant Projection</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-white/5 rounded">
          <div className="text-xs text-white/40 uppercase">Operations</div>
          <div className="text-2xl font-bold text-teal-400">{count}</div>
        </div>
        <div className="p-3 bg-white/5 rounded">
          <div className="text-xs text-white/40 uppercase">Errors</div>
          <div className={`text-2xl font-bold ${errors > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {errors}
          </div>
        </div>
      </div>

      {lastError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded mb-4 text-red-200 text-sm">
          {lastError}
        </div>
      )}

      <button
        onClick={() => handleAction('test-action')}
        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded text-white font-semibold"
      >
        Execute Action
      </button>

      <div className="mt-6 p-3 bg-white/5 rounded text-xs text-white/60 space-y-1">
        <div>
          <strong>Compliance:</strong> This projection adheres to LeeWay governance standards
        </div>
        <div>
          <strong>Receipts:</strong> All operations are logged for audit
        </div>
        <div>
          <strong>Sovereignty:</strong> No direct runtime or standards layer access
        </div>
      </div>
    </div>
  );
};

async function performAction(action: string) {
  return {
    success: true,
    action,
    result: 'Action completed successfully',
    timestamp: new Date().toISOString(),
  };
}

export default LeeWayProjectionTemplate;
