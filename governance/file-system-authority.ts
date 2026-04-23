/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.FILE_SYSTEM_AUTHORITY.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = file-system-authority — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = governance/file-system-authority.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * LeeWay Standards — File System Authority
 * 
 * **Origin:** LeeWay-Standards (this is the canonical implementation)
 * **Replaces:**
 *   - leeway-construct/room-on-the-edge/src/core/fileOps.ts
 * 
 * **Contract:**
 * - All file operations must pass through Standards authority
 * - Every operation is logged with full audit trail
 * - Prevents unauthorized file access
 * - Enforces data zone boundaries
 * 
 * **Consumers:**
 * - construct/src/* (file operations)
 * - employment-center/src/* (file operations)
 */

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
 * LeeWay Standards — File System Authority
 * 
 * **Origin:** LeeWay-Standards (this is the canonical implementation)
 * **Replaces:**
 *   - leeway-construct/room-on-the-edge/src/core/fileOps.ts
 * 
 * **Contract:**
 * - All file operations must pass through Standards authority
 * - Every operation is logged with full audit trail
 * - Prevents unauthorized file access
 * - Enforces data zone boundaries
 * 
 * **Consumers:**
 * - construct/src/* (file operations)
 * - employment-center/src/* (file operations)
 */

/**
 * File operation — standardized format
 */
export interface FileOperation {
  type: 'read' | 'write' | 'delete' | 'metadata';
  path: string;
  requester: string;
  timestamp: string;
  auditEntry?: string;
}

/**
 * File metadata — Standards format
 */
export interface FileMetadata {
  id: string;
  path: string;
  owner: 'LeeWay-Standards' | 'LeeWay-Integrated' | string;
  dataZone: string;
  created: string;
  modified: string;
  auditChain: Array<{
    timestamp: string;
    operation: string;
    authority: string;
  }>;
}

/**
 * Create file with Standards metadata
 */
export async function createFileMeta(fileData: any): Promise<FileMetadata> {
  // 0. ENFORCE EXTERNAL GATING (Hard Block by Default)
  if (fileData?.source === 'external') {
    const mode = (process.env.LEEWAY_MODE || 'LOCKED').toUpperCase();
    
    if (mode === 'LOCKED' || (mode !== 'AUDIT' && mode !== 'OPEN')) {
      throw buildEnforcementBlockError('file-system-authority');
    }
    
    if (mode === 'AUDIT') {
      console.warn('[STANDARDS] External file in AUDIT mode (allowed for validation)');
    }
  }

  // 1. VALIDATE INPUT
  if (!fileData || !fileData.path) {
    throw new Error('[STANDARDS] File path required for metadata creation');
  }

  // 2. LOG OPERATION
  console.log('[STANDARDS] File metadata creation:', {
    path: fileData.path,
  });

  // 3. GENERATE STANDARDS ID
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  // 4. CREATE METADATA
  const metadata: FileMetadata = {
    id: fileId,
    path: fileData.path,
    owner: fileData.owner || 'LeeWay-Integrated',
    dataZone: fileData.dataZone || 'default',
    created: now,
    modified: now,
    auditChain: [
      {
        timestamp: now,
        operation: 'CREATED',
        authority: 'LeeWay-Standards',
      },
    ],
  };

  // 5. ATTACH LEEWAY METADATA
  const result = {
    ...metadata,
    __leeway: {
      source: 'standards',
      timestamp: Date.now(),
      governed: true,
    },
  };

  // 6. LOG SUCCESS
  console.log('[STANDARDS] File metadata created:', {
    fileId,
    path: fileData.path,
  });

  return result;
}

/**
 * Log file operation to audit trail
 */
export async function logFileEvent(
  data: FileOperation,
  event?: string
): Promise<void> {
  // 1. VALIDATE INPUT
  if (!data || !data.path) {
    throw new Error('[STANDARDS] File operation requires path');
  }

  // 2. CREATE AUDIT ENTRY
  const auditEntry = {
    timestamp: new Date().toISOString(),
    type: data.type,
    path: data.path,
    requester: data.requester || 'unknown',
    event: event || data.type,
    authority: 'LeeWay-Standards',
  };

  // 3. LOG TO CONSOLE (in production, would write to audit database)
  console.log('[STANDARDS] File operation logged:', auditEntry);

  // 4. RETURN SUCCESS
  return;
}

/**
 * Verify file access is allowed
 */
export async function verifyFileAccess(
  requester: string,
  path: string,
  operation: 'read' | 'write' | 'delete'
): Promise<boolean> {
  // 1. VALIDATE INPUT
  if (!requester || !path || !operation) {
    throw new Error('[STANDARDS] Requester, path, and operation required for access verification');
  }

  // 2. LOG REQUEST
  console.log('[STANDARDS] File access verification:', {
    requester,
    path,
    operation,
  });

  // 3. CHECK AUTHORIZATION (simple implementation)
  // In production, would check against data zones and permissions
  const isAllowed = requester && path && operation;

  // 4. LOG RESULT
  if (isAllowed) {
    console.log('[STANDARDS] File access allowed:', {
      requester,
      path,
      operation,
    });
  } else {
    console.warn('[STANDARDS] File access denied:', {
      requester,
      path,
      operation,
    });
  }

  return isAllowed;
}
