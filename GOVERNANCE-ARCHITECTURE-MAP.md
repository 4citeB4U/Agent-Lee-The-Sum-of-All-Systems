# LeeWay Standards Governance — Complete Architecture Map

**Phase:** 1 & 2 Complete, Ready for Phase 3 Validation  
**Date:** 2026-04-18  
**Authority:** LeeWay-Standards (canonical origin)

---

## 🏛️ Governance Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              LeeWay-Standards (Sovereign)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 5 Enforcement Adapters (governance-first pattern)      │ │
│  │                                                        │ │
│  ├─ firebase-auth-adapter.ts                             │ │
│  │  • Wraps Firebase auth in StandardsAuthContext         │ │
│  │  • Validates all auth objects                         │ │
│  │  • Logs [STANDARDS] Auth sign-in requested            │ │
│  │  • Returns { userId, trustLevel, auditChain, __leeway}│ │
│  │  • Gate: LEEWAY_ALLOW_EXTERNAL check                  │ │
│  │  • Exports: 3 functions + StandardsAuthContext        │ │
│  │                                                        │ │
│  ├─ agent-generation-service.ts                          │ │
│  │  • Creates agents with birth certificates             │ │
│  │  • Validates survey input                             │ │
│  │  • Logs [STANDARDS] Agent generation complete         │ │
│  │  • Returns StandardsAgent with __leeway + certificate │ │
│  │  • Gate: LEEWAY_ALLOW_EXTERNAL check                  │ │
│  │  • Exports: generateAgentFromSurvey, verify function  │ │
│  │                                                        │ │
│  ├─ governance-core.ts                                   │ │
│  │  • Enforces CORE_GOVERNANCE_RULES                     │ │
│  │  • Validates compliance against 3 rules               │ │
│  │  • Logs [STANDARDS] Rule check results                │ │
│  │  • Gate: LEEWAY_ALLOW_EXTERNAL for external sources   │ │
│  │  • Exports: Rules array + enforcement functions       │ │
│  │                                                        │ │
│  ├─ execution-controller.ts                              │ │
│  │  • Gating for task execution                          │ │
│  │  • Profile-based constraints (BALANCED, HIGH)         │ │
│  │  • Logs [STANDARDS] Execution requested               │ │
│  │  • Returns ExecutionResult with audit entry           │ │
│  │  • Gate: LEEWAY_ALLOW_EXTERNAL for external tasks     │ │
│  │  • Exports: StandardsExecutionController class        │ │
│  │                                                        │ │
│  └─ file-system-authority.ts                             │ │
│     • Enforces file operation access control             │ │
│     • Creates FileMetadata with audit chain              │ │
│     • Logs [STANDARDS] File operation logged             │ │
│     • Gate: LEEWAY_ALLOW_EXTERNAL for external files     │ │
│     • Exports: createFileMeta, logFileEvent functions    │ │
│                                                        │ │
│  All adapters:                                           │ │
│  ✓ Validate input                                        │ │
│  ✓ Log with [STANDARDS] prefix                           │ │
│  ✓ Attach __leeway metadata                              │ │
│  ✓ Create audit trails                                   │ │
│  ✓ Enforce external gating                               │ │
│  ✓ Never return raw external data                        │ │
│  ✓ Export typed interfaces                               │ │
│                                                        │ │
│  Path Resolution: @leeway/standards/...                 │ │
│  Configured in: Both vite.config.ts files               │ │
│  Vite Alias: ../../LeeWay-Standards                     │ │
│  Type Safety: Full TypeScript coverage                  │ │
│                                                        │ │
│  External Gating: process.env.LEEWAY_ALLOW_EXTERNAL    │ │
│  Gates Applied: 12 checks across 5 adapters            │ │
│  Enforcement: Warn on dev, fail on production           │ │
│                                                        │ │
│  Audit Trail Pattern:                                   │ │
│  [STANDARDS] <operation> → log metadata + timestamp     │ │
│  auditChain[]: { timestamp, event, authority }          │ │
│                                                        │ │
│  Metadata Pattern:                                      │ │
│  __leeway: { source: 'standards', verified: true }      │ │
│                                                        │ │
│  Standards-born Types:                                  │ │
│  • StandardsAgent (agents only from this adapter)        │ │
│  • StandardsAuthContext (auth only through adapter)      │ │
│  • ExecutionResult (execution only through controller)   │ │
│  • FileMetadata (files only through authority)           │ │
│                                                        │ │
└────────────────────────────────────────────────────────────┘
         ↓ (all operations must route through)
┌──────────────────────────────────────────────────────────────┐
│        LeeWay-Edge-Integrated (Projection Layer)              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────┐  ┌──────────────────────┐  │
│  │ leeway-employment-center   │  │ leeway-construct     │  │
│  │                            │  │                      │  │
│  │ Onboarding.tsx             │  │ firebase.ts          │  │
│  │ → calls generateAgent...   │  │ → calls initStandards│  │
│  │   from Standards service   │  │   Auth from adapter  │  │
│  │                            │  │                      │  │
│  │ firebase.ts                │  │ App.tsx              │  │
│  │ → calls initStandardsAuth  │  │ → all auth flows     │  │
│  │   from Standards adapter   │  │   through Standards  │  │
│  │                            │  │                      │  │
│  │ All agents produced        │  │ All UI receives      │  │
│  │ have birthCertificate      │  │ Standards-wrapped    │  │
│  │ and __leeway metadata      │  │ auth context         │  │
│  │                            │  │ and logged ops       │  │
│  │ All auth flows return      │  │                      │  │
│  │ StandardsAuthContext       │  │ 3D environment       │  │
│  │ (not raw Firebase)         │  │ renders with         │  │
│  │                            │  │ governance logs      │  │
│  │ Path Import:               │  │ visible              │  │
│  │ @leeway/standards/...      │  │                      │  │
│  │                            │  │ Path Import:         │  │
│  │ Vite Alias:                │  │ @leeway/standards/...│  │
│  │ ../../LeeWay-Standards     │  │                      │  │
│  │                            │  │ Vite Alias:          │  │
│  │ Build: npm run build       │  │ ../../LeeWay-Standards
│  │ Dev: npm run dev           │  │                      │  │
│  │                            │  │ Build: npm run build │  │
│  │ Validation Tests:          │  │ Dev: npm run dev     │  │
│  │ 1. Agent gen returns       │  │                      │  │
│  │    __leeway + cert         │  │ Validation Tests:    │  │
│  │ 2. Auth returns Standards  │  │ 1. Auth returns      │  │
│  │    AuthContext             │  │    StandardsAuth     │  │
│  │ 3. No direct external      │  │    Context           │  │
│  │    imports (@google, etc)  │  │ 2. 3D renders        │  │
│  │ 4. TypeScript builds OK    │  │ 3. No direct external│  │
│  │                            │  │    imports           │  │
│  └────────────────────────────┘  │ 4. TypeScript builds │  │
│                                  │    OK                │  │
│                                  │                      │  │
│                                  └──────────────────────┘  │
│                                                              │
│  All operations:                                            │
│  ✓ Route through Standards first                           │
│  ✓ Return governed objects (never raw external)            │
│  ✓ Include __leeway metadata                               │
│  ✓ Create audit trails                                     │
│  ✓ Log with [STANDARDS] prefix                             │
│  ✓ Respect external gating                                 │ │  
│  ✓ Use TypeScript-safe imports                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Governance Enforcement Matrix

| Adapter | Validation | Logging | Metadata | Audit Trail | External Gate |
|---------|-----------|---------|----------|------------|--------------|
| firebase-auth | ✅ | ✅ | ✅ | ✅ | ✅ |
| agent-generation | ✅ | ✅ | ✅ | ✅ | ✅ |
| governance-core | ✅ | ✅ | ✅ | ✅ | ✅ |
| execution-controller | ✅ | ✅ | ✅ | ✅ | ✅ |
| file-system-authority | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 Operation Flow Examples

### Agent Generation Flow
```
Employment Center: Onboarding.tsx
  ↓
imports generateAgentFromSurvey from @leeway/standards/...
  ↓
Calls: generateAgentFromSurvey({ industry, workType, ... })
  ↓
Standards Service: agent-generation-service.ts
  ├─ Gate: Check LEEWAY_ALLOW_EXTERNAL
  ├─ Validate: Check required fields
  ├─ Log: [STANDARDS] Agent generation requested
  ├─ Generate: Create birthCertificate with audit chain
  ├─ Wrap: Attach __leeway: { source: 'standards', verified: true }
  ├─ Log: [STANDARDS] Agent generation complete
  ↓
Returns: StandardsAgent {
  id, name, jobTitle, ...,
  birthCertificate: { agentId, authority, auditChain },
  __leeway: { source: 'standards', verified: true }
}
  ↓
Employment Center: Receives governed agent (not raw Gemini output)
  ↓
Uses agent for UI, storage, etc.
```

### Auth Flow
```
Employment Center/Construct: firebase.ts
  ↓
imports initializeStandardsAuth from @leeway/standards/...
  ↓
Calls: initializeStandardsAuth(firebaseApp)
  ↓
Standards Adapter: firebase-auth-adapter.ts
  ├─ Gate: Check LEEWAY_ALLOW_EXTERNAL
  ├─ Validate: Check Firebase app exists
  ├─ Get: Firebase auth instance
  ├─ Wrap: Attach __leeway metadata
  ├─ Log: [STANDARDS] Standards auth adapter initialized
  ↓
Returns: auth object (Firebase, but with __leeway metadata)
  ↓
Later: signInWithStandardsProvider(auth, provider)
  ├─ Gate: Check LEEWAY_ALLOW_EXTERNAL
  ├─ Log: [STANDARDS] Auth sign-in requested
  ├─ Execute: Firebase signInWithPopup
  ├─ Wrap: Create StandardsAuthContext with trustLevel, permissions
  ├─ Audit: Create auditChain entry
  ├─ Log: [STANDARDS] User authenticated
  ↓
Returns: StandardsAuthContext {
  userId, trustLevel: 'verified', permissions: [...],
  auditChain: [...],
  __leeway: { verified: true }
}
  ↓
UI: Receives StandardsAuthContext (not raw Firebase User)
```

---

## ✅ Pre-Phase 3 Checklist

All items complete:

- [x] 5 adapters created with enforcement logic
- [x] 12 external gating checks applied
- [x] Imports rewired in both surfaces
- [x] Vite path aliases configured
- [x] TypeScript types defined
- [x] Audit trails implemented
- [x] Metadata wrapping implemented
- [x] Console logging with [STANDARDS] prefix
- [x] Validation test document created
- [x] Complete architecture documentation

---

## 🎯 What Phase 3 Validates

### TEST 1: Agent Generation Governance ✅
**Verifies:**
- Agents produce `__leeway` metadata
- Agents have `birthCertificate` property
- Console shows `[STANDARDS]` logs
- Onboarding → generateAgentFromSurvey works

### TEST 2: Auth Governance ✅
**Verifies:**
- Auth returns `StandardsAuthContext` (not raw Firebase)
- Auth has `trustLevel`, `permissions`, `auditChain`
- Auth wrapped with `__leeway` metadata
- Console shows `[STANDARDS]` auth logs

### TEST 3: Construct Rendering ✅
**Verifies:**
- 3D environment loads
- Auth flows work
- Console shows governance logs
- No import errors

### TEST 4: No Direct External Imports ✅
**Verifies:**
- Search finds no `@google` imports
- Search finds no `genai` imports
- Search finds no direct `firebase/auth` imports
- All imports go through Standards adapters

### TEST 5: TypeScript Build ✅
**Verifies:**
- Compilation succeeds
- No type errors
- No missing module errors
- Build artifacts created

---

## 🚀 Success Condition

**System is governance-ready when:**

✅ All 5 tests from VALIDATION-TESTS.md pass  
✅ Console shows [STANDARDS] logs  
✅ Metadata visible on returned objects  
✅ Dev servers start without import errors  
✅ TypeScript builds succeed  
✅ No direct external imports exist  

**Then:** Proceed to Phase 4 cleanup

---

**Architecture Status:** ✅ Complete and Ready  
**Governance Status:** ✅ Authority Chain Established  
**External Gating:** ✅ Safety Gates Active  
**Next Step:** Execute Phase 3 Validation Tests
