# LeeWay Standards

LeeWay Standards is a governance-first Agent Lee runtime workspace combining:
- a CLI/governance toolchain,
- a browser UI (AgentNotepad VM shell + persona diagnostics),
- and a sovereign core execution foundation (Lee Prime + Prime Family).

This README reflects the current state of the repository as of 2026-04-22.

## Current Runtime State

### 1) Persona Runtime (wired)
The Agent Lee persona stack is wired into the UI flow in AgentNotepad:
- `Agent_Lee_Persona_System/01_SUPERIOR_PROMPT/Agent_Lee_Superior_Prompt.md`
- `Agent_Lee_Persona_System/02_ENGINE/agentlee_persona_engine_v1_1.js`
- `Agent_Lee_Persona_System/03_POETRY/agentlee_poetry_bank.js`
- `Agent_Lee_Persona_System/04_LINGO/agentlee_lingo_worker.js`

Implemented behavior in `components/AgentNotepad.tsx`:
- runtime script/module loading (`poetry -> engine -> lingo`)
- superior prompt loading and injection into Gemini requests
- persona response post-processing through `AgentLeePersonaEngine.respond(...)`
- lingo pack refresh bootstrap
- diagnostics globals: `window.__agentleeModules`, `window.__agentleeSuperiorPrompt`

### 2) Persona Diagnostics UI (wired)
`src/ui/diagnostics/PersonaHealthPanel.tsx` is integrated and rendered in AgentNotepad.

Panel displays:
- superior prompt load status
- active mode / overlay
- poetry key count
- lingo refresh status
- module readiness rows (`poetry`, `engine`, `lingo`)

### 3) Sovereign Foundation (present and bootstrapped)
`src/core/lee-prime/` now includes:
- `AuthorityMatrix.ts` (permissions and collaboration law)
- `CoreRegistry.ts` (canonical Prime Family registry + hierarchy helpers)
- `ExecutionEngine.ts` (sovereign cycle runner + receipts + retry/escalation)

`src/core/AgentLeeRuntimeBootstrap.ts` now instantiates and logs:
- `SovereignExecutionEngine`
- stage order via `SOVEREIGN_EXECUTION_ORDER`
- unit count via `CORE_REGISTRY`

## Sovereign Cycle

The canonical cycle represented by `ExecutionEngine.ts`:

`Perception -> Origin -> Structure -> Execution -> Veritas -> Echo -> Synthesis -> Lee Prime`

Governance guarantees baked into the foundation:
- Lee Prime is final speaker
- Veritas validation gate before delivery
- Echo memory authority for continuity writes
- authority checks between handoff stages via `resolvePermission(...)`

## Project Layout (high level)

- `components/` UI app components (including AgentNotepad)
- `src/core/` runtime core modules and bootstrap
- `src/core/lee-prime/` sovereign authority/registry/execution foundation
- `src/ui/diagnostics/` operational UI diagnostics panels
- `Agent_Lee_Persona_System/` superior prompt + persona engine + poetry + lingo assets
- `scripts/` governance/compliance/audit utilities
- `schemas/` schema contracts and config schemas
- `receipts/` status snapshots, receipts, and migration artifacts

## Toolchain

- Node.js >= 18
- TypeScript
- React
- Vite
- `@google/genai`

## Install

```bash
npm install
```

## Commands

### CLI entry (implemented)
`src/cli/leeway.js` currently supports:

```bash
npm run start
npm run leeway -- help
npm run leeway -- compliance
```

### Governance and status scripts (from package scripts)

```bash
npm run ssa:scan
npm run ssa:enforce
npm run ssa:audit
npm run ssa:status
npm run leeway:enforce:check
npm run leeway:enforce:fix
npm run leeway:compliance
```

## Known Repository Baseline Notes

Current TypeScript baseline includes pre-existing errors outside the new sovereign/persona wiring:
- `src/agents/legacy/VisionAgent.ts`
- `src/core/health-check.test.ts`

These are known existing issues and not part of the Lee Prime/Persona foundation wiring described above.

## Licensing

MIT (see repository license and file headers).
# Agent-Lee-The-Sum-of-All-Systems
