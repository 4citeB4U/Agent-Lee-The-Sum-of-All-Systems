# LeeWay Standards Adapters Index

**Status:** Phase 1 — Skeleton files created, ready for implementation  
**Date:** 2026-04-18

---

## 5 Core Adapters Being Built

### 1. Firebase Auth Adapter
**Location:** `LeeWay-Standards/adapters/firebase-auth-adapter.ts`  
**Replaces:**
- `leeway-construct/room-on-the-edge/src/firebase.ts` (GoogleAuthProvider)
- `leeway-employment-center/src/firebase.ts` (GoogleAuthProvider)

**What it does:**
- Wraps Firebase with Standards trust fabric
- Enforces Standards permissions on all auth operations
- Routes user identity through Standards audit chain
- Prevents direct GoogleAuthProvider usage

**Import path for consumers:**
```typescript
import { 
  initializeStandardsAuth, 
  signInWithStandardsProvider,
  watchStandardsAuthState,
  type StandardsAuthContext 
} from '@leeway/standards/adapters/firebase-auth-adapter';
```

**Consumers:**
- `construct/src/App.tsx` (auth initialization)
- `employment-center/src/App.tsx` (auth initialization)

---

### 2. Agent Generation Service
**Location:** `LeeWay-Standards/services/agent-generation-service.ts`  
**Replaces:**
- `leeway-employment-center/src/services/geminiService.ts` (GoogleGenAI direct instantiation)

**What it does:**
- All agents MUST be born with Standards birth certificate
- Every generation is logged to audit chain
- Agent identity is Standards-verified (not external-verified)
- Enforces Standards agent contract on output

**Import path for consumers:**
```typescript
import { 
  generateAgentFromSurvey,
  verifyAgentBirthCertificate,
  type StandardsAgent,
  type AgentBirthCertificate
} from '@leeway/standards/services/agent-generation-service';
```

**Consumers:**
- `employment-center/src/components/Onboarding.tsx` (survey → agent)

**Key types exported:**
```typescript
interface StandardsAgent {
  id, name, jobTitle, purpose, softSkills, hardSkills, jobTasks, 
  responsibilities, bio, suggestedActions, clockStatus, contract,
  birthCertificate: AgentBirthCertificate
}

interface AgentBirthCertificate {
  agentId, createdAt, birthAuthority: 'LeeWay-Standards',
  generationService: 'agent-generation-service',
  parentSurvey, auditChain[]
}
```

---

### 3. Governance Core
**Location:** `LeeWay-Standards/governance/governance-core.ts`  
**Replaces:**
- `leeway-construct/room-on-the-edge/src/core/governanceEnforcer.ts`

**What it does:**
- Central rule enforcement engine
- All permission checks go through this
- Exposes validation API to projection surfaces
- Logs all governance decisions to audit trail

**Import path for consumers:**
```typescript
import {
  checkGovernanceCompliance,
  enforceFileGovernance,
  logGovernanceDecision,
  CORE_GOVERNANCE_RULES,
  type GovernanceRule
} from '@leeway/standards/governance/governance-core';
```

**Consumers:**
- `construct/src/components/*` (permission checks)
- `construct/src/engine/*` (governance validation)

---

### 4. Execution Controller
**Location:** `LeeWay-Standards/core/execution-controller.ts`  
**Replaces:**
- `leeway-construct/room-on-the-edge/src/core/execution/StudioExecutionController.ts`

**What it does:**
- Route all execution commands through Standards authority
- No external environment can execute code directly
- All execution is logged and auditable
- Returns execution results through Standards report format

**Import path for consumers:**
```typescript
import {
  StandardsExecutionController,
  EXECUTION_PROFILES,
  type ExecutionProfile,
  type ExecutionResult
} from '@leeway/standards/core/execution-controller';
```

**Consumers:**
- `construct/src/engine/*` (execution requests)
- `construct/src/components/*` (task execution)

---

### 5. File System Authority
**Location:** `LeeWay-Standards/governance/file-system-authority.ts`  
**Replaces:**
- `leeway-construct/room-on-the-edge/src/core/fileOps.ts`

**What it does:**
- All file operations must pass through Standards authority
- Every operation is logged with full audit trail
- Prevents unauthorized file access
- Enforces data zone boundaries

**Import path for consumers:**
```typescript
import {
  createFileMeta,
  logFileEvent,
  verifyFileAccess,
  type FileOperation,
  type FileMetadata
} from '@leeway/standards/governance/file-system-authority';
```

**Consumers:**
- `construct/src/*` (file operations)
- `employment-center/src/*` (file operations)

---

## Dependency Chain (Import Order)

```
┌─────────────────────────────────────────┐
│     LeeWay-Standards Core Adapters      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ firebase-auth-adapter.ts           │
│  │  (all auth flows)                    │
│  │                                      │
│  ├─ agent-generation-service.ts         │
│  │  (agent creation + birth certs)      │
│  │                                      │
│  ├─ governance-core.ts                  │
│  │  (rule enforcement + gating)         │
│  │                                      │
│  ├─ execution-controller.ts             │
│  │  (task execution routing)            │
│  │                                      │
│  └─ file-system-authority.ts            │
│     (file operation gating)              │
│                                         │
└─────────────────────────────────────────┘
         ↓ (consumed by)
┌─────────────────────────────────────────┐
│     Integrated Projection Surfaces      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ leeway-construct                   │
│  │  (uses auth, governance, execution) │
│  │                                      │
│  └─ leeway-employment-center           │
│     (uses auth, agent-generation)      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Phase 2: Import Rewrite Targets

### leeway-construct

**File:** `src/firebase.ts`
```typescript
// OLD: GoogleAuthProvider direct
// NEW: import from Standards adapter
import { initializeStandardsAuth } from '@leeway/standards/adapters/firebase-auth-adapter';
```

**File:** `src/App.tsx`
```typescript
// OLD: import { leewayProvider } from './firebase'
// NEW: import { signInWithStandardsProvider } from '@leeway/standards/adapters/firebase-auth-adapter'
```

**File:** `src/core/governanceEnforcer.ts`
```typescript
// Remove this file entirely
// Consumers should import from Standards:
// import { checkGovernanceCompliance } from '@leeway/standards/governance/governance-core'
```

### leeway-employment-center

**File:** `src/firebase.ts`
```typescript
// OLD: GoogleAuthProvider direct
// NEW: import from Standards adapter
import { initializeStandardsAuth } from '@leeway/standards/adapters/firebase-auth-adapter';
```

**File:** `src/components/Onboarding.tsx`
```typescript
// OLD: import { generateAgentFromSurvey } from '../services/geminiService'
// NEW: import { generateAgentFromSurvey } from '@leeway/standards/services/agent-generation-service'
```

**File:** `src/services/geminiService.ts`
```typescript
// Remove this file entirely
// Consumers should import from Standards:
// import { generateAgentFromSurvey } from '@leeway/standards/services/agent-generation-service'
```

---

## Validation Checklist (Phase 3)

After all adapters are implemented and imports rewired:

- [ ] TypeScript compilation succeeds
- [ ] `npm run dev` starts without errors
- [ ] Construct app loads without runtime errors
- [ ] Employment Center app loads without runtime errors
- [ ] Auth flow works end-to-end
- [ ] Agent generation works end-to-end
- [ ] Governance checks don't false-positive
- [ ] No console warnings about missing imports

---

## File Cleanup (Phase 4)

After validation passes:

```bash
# Delete original files
rm leeway-construct/room-on-the-edge/src/core/governanceEnforcer.ts
rm leeway-construct/room-on-the-edge/src/core/fileOps.ts
rm leeway-construct/room-on-the-edge/src/core/execution/StudioExecutionController.ts
rm leeway-employment-center/src/services/geminiService.ts

# Delete lockfiles and regenerate
rm leeway-construct/room-on-the-edge/package-lock.json
rm leeway-employment-center/package-lock.json
cd leeway-construct/room-on-the-edge && npm install
cd ../../leeway-employment-center && npm install

# Rebuild
npm run build
```

---

## Final Audit

Re-run deterministic audit to confirm:
- **Total violations:** 0
- **google_ai_studio_dependency:** all false
- **illegal_sovereign_logic:** all false
- **current_owner=External:** 0 files
- **action=MOVE:** 0 files
- **Enforcement gates:** all PASS

---

**Next Step:** Provide implementation code for all 5 adapter services
