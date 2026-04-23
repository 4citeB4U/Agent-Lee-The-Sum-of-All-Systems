# Phase 3 & 4 Validation + Cleanup Plan

**Status:** Phase 2 complete, Phase 3 ready to execute  
**Date:** 2026-04-18

---

## Phase 3: Validate System (Commands to Run)

Before removing any original files, confirm the system works with Standards adapters.

### Validation Command 1: Employment Center Dev

```bash
cd d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-employment-center
npm run dev
```

**Expected output:**
- App starts without errors
- `[STANDARDS]` log messages visible in console
- Auth flow works
- Agent generation creates agents with `birthCertificate` property
- No import errors or missing module warnings

**Success indicator:**
```
[STANDARDS] Auth request
[STANDARDS] Agent generation requested: { industry: '...', workType: '...' }
[STANDARDS] Agent generation complete: { agentId: '...' }
```

### Validation Command 2: Construct Dev

```bash
cd d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge
npm run dev
```

**Expected output:**
- Construct loads without errors
- 3D environment renders
- `[STANDARDS]` log messages visible in console
- Auth flow works
- No import errors

**Success indicator:**
```
[STANDARDS] Auth request
[STANDARDS] Auth state changed (signed in)
Canvas rendering active
```

### Validation Command 3: Build Test (Employment Center)

```bash
cd d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-employment-center
npm run build
```

**Expected:**
- TypeScript compilation succeeds
- No errors about missing modules or type mismatches
- Build output ready

### Validation Command 4: Build Test (Construct)

```bash
cd d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge
npm run build
```

**Expected:**
- TypeScript compilation succeeds
- No errors about missing modules or type mismatches
- Build output ready

---

## Phase 3 Validation Checklist

After running all 4 commands, verify:

- [ ] `npm run dev` (employment) — no errors
- [ ] `npm run dev` (construct) — no errors
- [ ] `npm run build` (employment) — succeeds
- [ ] `npm run build` (construct) — succeeds
- [ ] Auth works end-to-end in both
- [ ] Console shows `[STANDARDS]` log messages
- [ ] No "Cannot find module" errors
- [ ] TypeScript compilation has zero errors
- [ ] Agent generation produces StandardsAgent with birthCertificate
- [ ] Construct 3D environment renders

**If all pass:** Proceed to Phase 4  
**If any fail:** Debug import paths, check for async/await issues

---

## Phase 4: Remove Original Files (After Phase 3 Passes)

Only after Phase 3 validation succeeds, delete the original illegal files:

### Files to Delete

```bash
# Employment Center
rm d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-employment-center\src\services\geminiService.ts

# Construct  
rm d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge\src\core\governanceEnforcer.ts
rm d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge\src\core\fileOps.ts
rm d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge\src\core\execution\StudioExecutionController.ts

# Both
rm d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-employment-center\package-lock.json
rm d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge\package-lock.json
```

### Regenerate Dependencies

```bash
# Employment Center
cd d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-employment-center
npm install

# Construct
cd d:\LeeWay_Product_Line\LeeWay-Edge-Integrated\leeway-construct\room-on-the-edge
npm install
```

### Rebuild

```bash
# Employment Center
npm run build

# Construct
npm run build
```

---

## Phase 4 Final Audit

After cleanup and rebuild, run deterministic audit again:

```bash
# Would run your audit framework on both surfaces
# Expected results:
# - Total violations: 0
# - google_ai_studio_dependency: all false
# - illegal_sovereign_logic: all false
# - current_owner=External: 0 files
# - action=MOVE: 0 files
# - Enforcement gates: all PASS
```

---

## Success Criteria (Final)

System passes Phase 3 & 4 when:

1. ✅ Dev servers start without errors
2. ✅ TypeScript builds succeed
3. ✅ Auth flows work end-to-end
4. ✅ Agent generation produces StandardsAgent
5. ✅ `[STANDARDS]` logging is active
6. ✅ Original illegal files deleted
7. ✅ Dependencies regenerated
8. ✅ Builds still succeed after cleanup
9. ✅ Re-audit shows zero violations
10. ✅ All governance enforcement rules active

---

## Timeline

- **Phase 3 (Validation):** ~15 minutes (run 4 commands, verify output)
- **Phase 4 (Cleanup & Rebuild):** ~10 minutes (delete files, npm install, build)
- **Final Audit:** ~5 minutes

**Total:** ~30 minutes to full Standards compliance

---

## Rollback Plan (if Phase 3 fails)

If validation reveals errors:

1. Do NOT proceed to Phase 4
2. Restore original files from git if deleted
3. Fix import paths or adapter code
4. Re-run Phase 3 validation
5. Only proceed to Phase 4 after Phase 3 fully passes

---

**Ready for Phase 3:** Run validation commands in terminal  
**Next Step:** Execute Phase 3 validation
