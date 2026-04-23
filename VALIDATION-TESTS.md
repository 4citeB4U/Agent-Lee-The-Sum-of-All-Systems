# Real Phase 3 Validation — Governance Behavior Tests

**Purpose:** Verify that Standards adapters are actually governing, not just present

---

## 🧪 TEST 1: Agent Generation Enforcement

### Command
```bash
cd leeway-employment-center
npm run dev
```

### Steps
1. Open browser to http://localhost:5173
2. Navigate to Onboarding
3. Fill in survey:
   - Industry: "Operations"
   - Work Type: "Field Service"
   - Duration: "8 hours"
   - Shift: "Morning"
4. Click "Generate Agent"

### ✅ PASS If You See
```
[STANDARDS] Agent generation requested: { industry: 'Operations', ... }
[STANDARDS] Agent generation complete: { agentId: '...', birthCertificate: {...} }
```

### ✅ VERIFY METADATA
In browser console, inspect the returned agent object:
```json
{
  "id": "...",
  "name": "...",
  "jobTitle": "...",
  "__leeway": {
    "source": "standards",
    "verified": true,
    "timestamp": "2026-04-18T..."
  },
  "birthCertificate": {
    "agentId": "agent-...",
    "birthAuthority": "LeeWay-Standards",
    "generationService": "agent-generation-service",
    "auditChain": [...]
  }
}
```

### ❌ FAIL If You See
- No `[STANDARDS]` logs
- Agent has no `__leeway` property
- Agent has no `birthCertificate` property
- Raw Gemini output leaks through
- Import error about `@leeway/standards`

---

## 🧪 TEST 2: Auth Flow Governance

### Command
```bash
cd leeway-employment-center
npm run dev
```

### Steps
1. Open browser to http://localhost:5173
2. Look for login/auth area
3. Trigger authentication (Google Sign-In or equivalent)
4. Monitor browser console

### ✅ PASS If You See
```
[STANDARDS] Initializing Standards-governed auth
[STANDARDS] Standards auth adapter initialized
[STANDARDS] Auth sign-in requested
[STANDARDS] User authenticated: { userId: '...', trustLevel: 'verified' }
```

### ✅ VERIFY AUTH CONTEXT
In browser console, inspect the auth object:
```json
{
  "userId": "...",
  "trustLevel": "verified",
  "permissions": ["read", "execute"],
  "__leeway": {
    "verified": true,
    "source": "standards"
  },
  "auditChain": [
    { "timestamp": "...", "event": "USER_AUTHENTICATED", "authority": "LeeWay-Standards" }
  ]
}
```

### ❌ FAIL If You See
- No `[STANDARDS]` logs
- Raw Firebase User object exposed
- No `trustLevel` property
- No `auditChain`
- Auth context missing `__leeway` metadata

---

## 🧪 TEST 3: External Execution Blocking (Enforcement Proof)

### Purpose
Prove that governance is **enforced**, not just logged.  
Without `LEEWAY_MODE=AUDIT`, external systems should **throw errors**, not execute silently.

### Command (Employment Center)
```bash
cd leeway-employment-center
npm run dev
```

### Steps
1. Open browser to http://localhost:5173
2. Navigate to Onboarding
3. Try to generate agent WITHOUT setting environment variable
4. Monitor browser console and network tab

### ✅ PASS If You See

Error thrown in console:
```
[STANDARDS] External LLM execution blocked — not approved by LeeWay law. 
Set LEEWAY_ALLOW_EXTERNAL=true or LEEWAY_MODE=AUDIT to override.
```

**AND:** Agent generation fails (does not complete)

**AND:** Network tab shows NO request to Gemini API

**This proves:** Governance blocks execution by default

### ⚠️ NOW ENABLE AUDIT MODE

Set environment variable and restart:
```bash
$env:LEEWAY_MODE = "AUDIT"
npm run dev
```

### ✅ VERIFY

Now you should see:
```
[STANDARDS] LLM execution in AUDIT mode (allowed for validation)
[STANDARDS] Agent generation requested
[STANDARDS] Agent generation complete
```

Agent generates successfully (because AUDIT mode allows it).

### ❌ FAIL If You See
- No error thrown when system starts
- Agent generation succeeds without LEEWAY_MODE
- No `[STANDARDS]` blocking message
- System executes external calls silently
- Gemini API is called without environment gate

---

## 🧪 TEST 4: Construct 3D Environment + Auth

### Command
```bash
cd leeway-construct/room-on-the-edge
npm run dev
```

### Steps
1. Open browser to http://localhost:5173
2. Wait for 3D environment to load
3. Look for auth prompt
4. Monitor browser console

### ✅ PASS If You See
```
[STANDARDS] Initializing Standards-governed auth
[STANDARDS] Standards auth adapter initialized
[STANDARDS] Canvas rendering active
[STANDARDS] User authenticated: { userId: '...' }
```

### ✅ VERIFY
- 3D environment renders
- Auth works
- Console has `[STANDARDS]` logs
- No import errors

### ❌ FAIL If You See
- Import error: `Cannot find module '@leeway/standards'`
- No `[STANDARDS]` logs
- Canvas doesn't render
- Auth flow broken

---

## 🧪 TEST 5: No Direct External Imports

### Command (Employment Center)
```bash
cd leeway-employment-center
grep -r "@google" src/
grep -r "genai" src/
grep -r "from 'firebase" src/ | grep -v "@leeway"
```

### Command (Construct)
```bash
cd leeway-construct/room-on-the-edge
grep -r "@google" src/
grep -r "genai" src/
grep -r "from 'firebase" src/ | grep -v "@leeway"
```

### ✅ PASS If You See
```
(no output - no matches)
```

### ❌ FAIL If You See
```
src/services/geminiService.ts: import { GoogleGenAI } from '@google/genai'
src/firebase.ts: import { getAuth } from 'firebase/auth'
```

---

## 🧪 TEST 6: Build TypeScript

### Command (Employment Center)
```bash
cd leeway-employment-center
npm run build
```

### Command (Construct)
```bash
cd leeway-construct/room-on-the-edge
npm run build
```

### ✅ PASS If
- TypeScript compilation succeeds
- No type errors about missing modules
- No `Cannot find module '@leeway/standards'` errors
- Build output created successfully

### ❌ FAIL If
- TypeScript compilation errors
- Module not found for `@leeway/standards`
- Type mismatches in adapter usage

---

## 📋 Validation Checklist

Run all tests in order. ALL must pass.

### Phase 3 Pre-Validation Checklist
- [ ] Vite path aliases added to both vite.config.ts
- [ ] Hard-blocking gates added to all 5 adapters
- [ ] No import errors in dev servers
- [ ] TypeScript compiles without errors
- [ ] LEEWAY_MODE environment setup ready

### Phase 3 Test Checklist
- [ ] TEST 1: Agent generation produces `__leeway` metadata ✓
- [ ] TEST 1: Agent has `birthCertificate` property ✓
- [ ] TEST 1: Console shows `[STANDARDS]` logs ✓
- [ ] TEST 2: Auth returns StandardsAuthContext (not raw Firebase) ✓
- [ ] TEST 2: Auth has `trustLevel`, `permissions`, `auditChain` ✓
- [ ] TEST 2: Auth wrapped with `__leeway` metadata ✓
- [ ] TEST 3: System BLOCKS agent generation without LEEWAY_MODE=AUDIT ✓
- [ ] TEST 3: Error message shows governance enforcement ✓
- [ ] TEST 3: Agent generation succeeds with LEEWAY_MODE=AUDIT ✓
- [ ] TEST 3: No direct Gemini API calls in network tab (blocked) ✓
- [ ] TEST 4: Construct loads without errors ✓
- [ ] TEST 4: 3D environment renders ✓
- [ ] TEST 4: Console shows `[STANDARDS]` logs ✓
- [ ] TEST 5: No direct @google imports ✓
- [ ] TEST 5: No direct firebase/auth imports (all through adapter) ✓
- [ ] TEST 5: No genai imports ✓
- [ ] TEST 6: Employment Center builds successfully ✓
- [ ] TEST 6: Construct builds successfully ✓
- [ ] TEST 6: No TypeScript errors ✓

---

## 🚨 If Any Test Fails

**DO NOT PROCEED TO PHASE 4**

Instead:

1. Check error message
2. Verify hard-blocking gates are in place
3. Verify Vite alias is correct: `@leeway/standards` → `../../LeeWay-Standards`
4. Verify adapter import paths are correct
5. Check browser console for [STANDARDS] logs
6. Check that system throws error when LEEWAY_MODE not set
7. Verify LEEWAY_MODE=AUDIT allows execution
8. Fix adapter code
9. Restart dev server
10. Re-run failing test

---

## ✅ Success Criteria (All Must Pass)

System is governance-ready when:

1. ✅ External execution BLOCKED by default (throws error)
2. ✅ External execution ALLOWED with LEEWAY_MODE=AUDIT
3. ✅ Dev servers start with governance logs
4. ✅ TypeScript builds succeed
5. ✅ Agent generation produces StandardsAgent with birthCertificate
6. ✅ Auth returns StandardsAuthContext (not raw Firebase)
7. ✅ All operations log with `[STANDARDS]` prefix
8. ✅ All output wrapped with `__leeway` metadata
9. ✅ No direct external imports found
10. ✅ 3D environment renders
11. ✅ Governance enforces law (not just architecture)

---

## 🎯 Then Proceed to Phase 4

Only after ALL tests pass, say:

👉 **"execute phase 4 cleanup"**

This will:
- Delete original illegal files (geminiService.ts, etc.)
- Remove package-lock.json and regenerate
- Rebuild to confirm clean state
- Re-audit to prove zero violations
