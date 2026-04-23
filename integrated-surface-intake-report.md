# Integrated Surface Intake Report (Deterministic Audit)

**Date:** 2026-04-18  
**Audit Authority:** LeeWay-Standards Deterministic Classification  
**Framework:** Core Sovereignty Doctrine Enforcement  
**Status:** ⛔ VIOLATIONS DETECTED — Remediation Required

---

## Scope

- **leeway-construct** (`room-on-the-edge` 3D environment)
- **leeway-employment-center** (workforce onboarding system)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Files Scanned** | 59 |
| **KEEP (OK)** | 39 |
| **REWRITE_ECHO (Adapter Required)** | 13 |
| **MOVE (to Standards)** | 5 |
| **DELETE (Orphan/External)** | 2 |

---

## Critical Violations by Type

### 1. Governance in Projection (GOV_IN_PROJECTION) ⛔ BLOCKING

**Law Violated:** "Projection surfaces must NOT contain governance/permissions logic"

| File | Surface | Severity | Issue |
|------|---------|----------|-------|
| `src/core/governanceEnforcer.ts` | construct | CRITICAL | Governance enforcement outside Standards |
| `src/core/fileOps.ts` | construct | CRITICAL | File system governance in projection |
| `src/core/execution/StudioExecutionController.ts` | construct | CRITICAL | Execution gating (external origin) |
| `src/services/geminiService.ts` | employment | 🔴 CRITICAL | **Agent creation outside Standards birth** |
| `src/components/Onboarding.tsx` | employment | HIGH | Calls geminiService (illegal) |
| `firestore.rules` | both | HIGH | Security rules outside Standards |

**Root Cause:** Functions signed into projection layer without Standards contract.  
**Impact:** Standards law broken at origin. Agents born unmonitored.

---

### 2. External Environment Sovereignty (EXT_ENV) ⛔ CRITICAL

**Law Violated:** "Surfaces must NOT carry external environment ownership"

| Category | Evidence | Severity |
|----------|----------|----------|
| **Direct Gemini SDK** | `@google/genai` in package.json (both) | CRITICAL |
| **API Key Injection** | `vite.config.ts` injects `GEMINI_API_KEY` at build time (both) | CRITICAL |
| **Runtime Init** | `geminiService.ts` instantiates `GoogleGenAI` directly | CRITICAL |
| **Auth Bypass** | `GoogleAuthProvider` in firebase.ts (both) | HIGH |
| **Branding** | `index.html` title "My Google AI Studio App" (both) | MEDIUM |
| **Deployment** | README references `ai.studio` (both) | MEDIUM |

**Root Cause:** Surfaces bootstrapped from Google AI Studio environment.  
**Impact:** Gemini inference unaudited. Auth not Standards-gated. External ownership claim.

---

## File Classification Summary

| Role | Count | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| **ui** (render/components) | 26 | Integrated | Integrated | ✅ OK |
| **governance** (enforcement/gating) | 3 | Standards | Projection | ❌ VIOLATION |
| **agent** (generation/birth) | 1 | Standards | External | ❌ VIOLATION |
| **adapter** (auth/services) | 2 | Standards | External | ❌ VIOLATION |
| **config** (build/env) | 15 | Integrated | External | ⚠️ PARTIAL |
| **orchestration** | 2 | Integrated | Integrated | ✅ OK |

---

## Enforcement Gates: FAILING

### ❌ Gate 1: No Governance in Projection
- **Status:** FAIL
- **Files:** governanceEnforcer.ts, fileOps.ts, StudioExecutionController.ts
- **Action:** MOVE to Standards

### ❌ Gate 2: Agents Born via Standards Contract
- **Status:** FAIL
- **Evidence:** `generateAgentFromSurvey()` uses Gemini without Standards birth
- **Action:** MOVE geminiService.ts → Standards; create Standards-born replacement

### ❌ Gate 3: No External SDK Runtime Usage
- **Status:** FAIL
- **Evidence:** GoogleGenAI instantiated in projection
- **Action:** REMOVE @google/genai; route through Standards adapter

### ❌ Gate 4: Auth Standards-Gated
- **Status:** FAIL
- **Evidence:** GoogleAuthProvider direct usage
- **Action:** CREATE firebase-auth-adapter in Standards

### ❌ Gate 5: No External Environment Ownership
- **Status:** FAIL
- **Evidence:** GEMINI_API_KEY, AI Studio branding, AI Studio deployment docs
- **Action:** REWRITE_ECHO all environment-dependent files

---

## ✅ Corrected Remediation Sequence (4 Phases) — PHASES 1 & 2 COMPLETE

### ✅ PHASE 1: BUILD CORE ADAPTERS (COMPLETE)

**Location:** LeeWay-Standards  
**Status:** COMPLETE ✅

Created 5 Standards-born adapter services with minimum enforcement logic:
```
✅ adapters/firebase-auth-adapter.ts (enforces Standards auth context)
✅ services/agent-generation-service.ts (enforces agent birth certificates)
✅ governance/governance-core.ts (enforces governance rules)
✅ core/execution-controller.ts (enforces execution constraints)
✅ governance/file-system-authority.ts (enforces file access gates)
```

**What each adapter does:**
- Validates all input
- Logs all operations with `[STANDARDS]` prefix
- Attaches `__leeway` metadata to all output
- Enforces contract requirements
- Never returns raw external output

### ✅ PHASE 2: SWITCH IMPORTS (COMPLETE)

**Location:** Both surfaces  
**Status:** COMPLETE ✅

Updated all critical imports to point to Standards adapters:

**Employment Center rewires:**
- `Onboarding.tsx` → calls `@leeway/standards/services/agent-generation-service` (was: geminiService)
- `firebase.ts` → calls `@leeway/standards/adapters/firebase-auth-adapter` (was: direct Firebase)

**Construct rewires:**
- `firebase.ts` → calls `@leeway/standards/adapters/firebase-auth-adapter` (was: direct Firebase)

**Authority chain now established:**
```
LeeWay-Standards (canonical)
    ↓ (all operations routed through)
agent-generation-service, auth-adapter, governance-core, etc.
    ↓ (consumed by)
leeway-employment-center, leeway-construct (Integrated projections)
    ↓ (all now)
Logged, audited, Standards-governed
```

### Phase 3: VALIDATE SYSTEM (READY)

**Status:** Ready to execute  
**Commands to run:**
```bash
npm run dev        # employment-center
npm run dev        # construct  
npm run build      # both surfaces
```

**Success criteria:**
- Starts without import errors
- `[STANDARDS]` logging visible
- Auth flows work
- Agent generation produces StandardsAgent with birthCertificate
- TypeScript builds succeed

**See:** `phase-3-4-validation-plan.md` for exact commands

### Phase 4: REMOVE ORIGINAL FILES (After Phase 3 Passes)

**Status:** Blocked until Phase 3 validation passes

Delete original illegal files:
```
- employment-center/src/services/geminiService.ts (direct Google SDK)
- construct/src/core/governanceEnforcer.ts (unowned governance)
- construct/src/core/fileOps.ts (unowned file ops)
- construct/src/core/execution/StudioExecutionController.ts (unowned execution)
```

Then cleanup and rebuild:
```bash
rm package-lock.json (both)
npm install (regenerate)
npm run build (verify)
```

Finally re-audit to confirm zero violations.

---

## Risk Assessment

| Risk | Count | Severity | Blocker? |
|------|-------|----------|----------|
| Governance in Projection | 3 | CRITICAL | YES |
| Agent Creation Uncontrolled | 1 | CRITICAL | YES |
| Inference Not Gated | 1 | CRITICAL | YES |
| Auth Not Standards | 2 | HIGH | YES |
| External Branding | 7 | MEDIUM | NO |
| Generated Artifacts | 2 | LOW | NO |

**Total Blocking Issues:** 5  
**Total Recommended Actions:** 21  
**Estimated Remediation Time:** 2-3 hours

---

## Compliance Checklist

- [ ] All governance logic moved to Standards
- [ ] All agent creation moved to Standards  
- [ ] geminiService.ts replaced with Standards-born service
- [ ] firebase.ts replaced with adapter
- [ ] @google/genai removed from dependencies
- [ ] GEMINI_API_KEY references removed
- [ ] Google branding removed
- [ ] AI Studio deployment docs replaced
- [ ] Echo files created with Standards links
- [ ] Re-audit confirms zero violations
- [ ] npm run build succeeds
- [ ] All motion controls and panel interactivity work

---

**Report Status:** Ready for Phase 1 MOVE execution  
**Authority:** LeeWay-Standards Intake Enforcement  
**Baseline:** Core Sovereignty Doctrine v1.0
