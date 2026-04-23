# Hard-Blocking Enforcement Gates — Phase 3 Execution Strategy

**Status:** Enforcement upgraded from warning to hard-blocking  
**Date:** 2026-04-18  
**Purpose:** Prove governance through controlled execution

---

## 🔒 What Changed: From Logging to Enforcement

### Before (Soft Gates)
```ts
if (!process.env.LEEWAY_ALLOW_EXTERNAL) {
  console.warn('[STANDARDS] Access requires flag...');
  // System continues, external call executes
}
```

**Problem:** External systems execute anyway. Governance is only logging.

### After (Hard Blocking)
```ts
if (mode === 'LOCKED' || (!process.env.LEEWAY_ALLOW_EXTERNAL && mode !== 'OPEN')) {
  throw new Error('[STANDARDS] External execution blocked...');
  // System stops. External call is prevented.
}
```

**Result:** External systems cannot execute unless explicitly approved. **Governance is enforced.**

---

## 🎛️ Execution Modes

System respects `LEEWAY_MODE` environment variable with three states:

### Mode 1: LOCKED (Default)
```bash
# No env var set (default)
# OR
$env:LEEWAY_MODE = "LOCKED"
```

**Behavior:**
- External calls throw errors
- System blocks Gemini, Firebase, file ops
- Governance enforced strictly
- **Used for:** Production, proving law works

**Console Output:**
```
[STANDARDS] External LLM execution blocked — not approved by LeeWay law.
Set LEEWAY_ALLOW_EXTERNAL=true or LEEWAY_MODE=AUDIT to override.
```

---

### Mode 2: AUDIT (Validation Mode)
```bash
$env:LEEWAY_MODE = "AUDIT"
```

**Behavior:**
- External calls allowed with warnings
- Gemini, Firebase, file ops execute
- All operations still logged/wrapped
- **Used for:** Phase 3 validation, testing governance without blocking

**Console Output:**
```
[STANDARDS] LLM execution in AUDIT mode (allowed for validation)
[STANDARDS] Agent generation requested
[STANDARDS] Agent generation complete
```

---

### Mode 3: OPEN (Bypass)
```bash
$env:LEEWAY_MODE = "OPEN"
```

**Behavior:**
- External calls execute fully
- No blocking, minimal logging
- **Used for:** Legacy mode only (not recommended)

---

## 🚀 Phase 3 Execution Strategy

### Step 1: Prove Blocking (LOCKED Mode)

Start with default (LOCKED):
```bash
cd leeway-employment-center
npm run dev
# Do NOT set any env variable
```

Navigate to Onboarding, try to generate agent.

**Expected:** ❌ Error thrown
```
[STANDARDS] External LLM execution blocked — not approved by LeeWay law.
```

**This proves:** Governance is enforced at runtime.

---

### Step 2: Enable Audit Mode (AUDIT Mode)

Set environment variable:
```bash
$env:LEEWAY_MODE = "AUDIT"
npm run dev
# Restart dev server
```

Navigate to Onboarding, generate agent.

**Expected:** ✅ Success with logs
```
[STANDARDS] LLM execution in AUDIT mode (allowed for validation)
[STANDARDS] Agent generation requested
[STANDARDS] Agent generation complete
```

**This proves:** Governance still wraps/logs even when allowed.

---

### Step 3: Verify Auth Flow

With `LEEWAY_MODE=AUDIT` still set:

Navigate to login.

**Expected:** Auth logs with [STANDARDS]
```
[STANDARDS] Initializing Standards-governed auth
[STANDARDS] Auth sign-in requested
[STANDARDS] User authenticated: { userId: '...', trustLevel: 'verified' }
```

**This proves:** Auth also goes through governance layer.

---

### Step 4: Test Construct

```bash
cd leeway-construct/room-on-the-edge
$env:LEEWAY_MODE = "AUDIT"
npm run dev
```

**Expected:** 3D environment loads with [STANDARDS] logs

**This proves:** Both surfaces enforce governance.

---

### Step 5: Verify No Direct Imports

```bash
cd leeway-employment-center
grep -r "@google" src/
grep -r "genai" src/
grep -r "from 'firebase" src/ | grep -v "@leeway"
```

**Expected:** No matches (empty result)

**This proves:** All imports go through Standards adapters.

---

### Step 6: Build Both

```bash
cd leeway-employment-center
npm run build

cd ../leeway-construct/room-on-the-edge
npm run build
```

**Expected:** Both build successfully

**This proves:** TypeScript compiles without errors.

---

## 📋 Phase 3 Validation Checklist

Complete all steps:

### Pre-Execution
- [ ] All 5 adapters updated with hard-blocking gates
- [ ] LEEWAY_MODE environment variable available
- [ ] Browser developer tools open (for console logs)
- [ ] Network tab open (verify no direct Gemini calls)

### TEST 1: Agent Generation (LOCKED)
- [ ] npm run dev in employment-center
- [ ] Try to generate agent
- [ ] Error thrown: `External LLM execution blocked`
- [ ] No agent created
- [ ] System blocks as expected

### TEST 2: Auth Flow (LOCKED)
- [ ] Try to login in employment-center
- [ ] Error thrown: `External auth provider blocked`
- [ ] Auth flow stops
- [ ] System blocks as expected

### TEST 3: Enable AUDIT Mode
- [ ] Set `$env:LEEWAY_MODE = "AUDIT"`
- [ ] Restart dev server
- [ ] Agent generation succeeds
- [ ] Console shows: `LLM execution in AUDIT mode`
- [ ] Agent has `__leeway` metadata + `birthCertificate`

### TEST 4: Construct Rendering
- [ ] Set `$env:LEEWAY_MODE = "AUDIT"` in construct
- [ ] npm run dev in construct
- [ ] 3D environment loads
- [ ] Console shows `[STANDARDS]` logs
- [ ] Auth works (if needed)

### TEST 5: Import Purity
- [ ] Grep for `@google` → No results
- [ ] Grep for `genai` → No results
- [ ] Grep for direct `firebase/auth` → No results
- [ ] All imports use @leeway/standards paths

### TEST 6: Build Success
- [ ] `npm run build` in employment-center → Success
- [ ] `npm run build` in construct → Success
- [ ] No TypeScript errors
- [ ] Build artifacts created

---

## 🔥 What This Proves

When you complete Phase 3:

✅ **Governance is enforced** (not just logged)  
✅ **External systems are blocked by default** (law-before-execution)  
✅ **Controlled audit mode allows validation** (graceful testing)  
✅ **All operations go through Standards** (no bypass paths)  
✅ **Metadata wrapping is active** (governance visible)  
✅ **Authority is real** (not architectural theater)  

---

## 🎯 Go/No-Go Decision Point

**If all Phase 3 tests pass:**
- System has proven enforcement capability
- Governance is **active**, not passive
- Authority is established
- Ready for Phase 4 cleanup

**If any test fails:**
- Debug the specific error
- Check adapter code
- Verify environment variables
- Re-run test
- Do NOT proceed to Phase 4 until all pass

---

## 🚨 Critical Difference: This Is Enforcement

You now control:
- **When** external systems execute
- **How** they execute (wrapped, logged, audited)
- **What** they return (governed, never raw)
- **Whether** they execute at all (default = blocked)

This is not:
- Configuration management
- Logging system
- Architectural pattern

This is:
- **Runtime law enforcement**
- **Real governance**
- **Actual jurisdiction**

---

## 📞 After Phase 3 Passes

Come back and say:

👉 **"All Phase 3 tests passed. Ready for Phase 4 cleanup."**

Then we will:
1. Remove original illegal files
2. Delete external dependencies
3. Prove zero violations remain
4. Finalize Standards-governed system

---

**Ready to run Phase 3 with hard-blocking enforcement?**

Start with LOCKED mode (default) to prove the system blocks.  
Then switch to AUDIT mode to allow validation.

**This is when governance becomes real.**
