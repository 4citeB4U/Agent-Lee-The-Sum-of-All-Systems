# LEEWAY RUNTIME SPECIFICATION

## Overview

The LEEWAY Runtime is a **self-auditing, tamper-evident execution environment** with embedded authorship and traceable behavior. It provides a verifiable framework for autonomous agent operations with governance, integrity, and forensic capabilities.

This runtime operates under the two-core sovereignty model defined by LeeWay-Standards and LeeWay-Edge-Integrated. See `CORE_SOVEREIGNTY_DOCTRINE.md` in this repo and the canonical doctrine in `../LeeWay-Standards/Docs/refactor/CORE_SOVEREIGNTY_DOCTRINE.md`.

## Core Principles

1. **Identity Embedded**: Every component declares its authorship and purpose
2. **Execution Gated**: Operations require integrity verification to proceed
3. **Audit Chained**: All actions are logged in tamper-evident chains
4. **Events Controlling**: Runtime events can block or modify execution flow
5. **Sovereignty First**: Offline-capable, self-contained operation

## Architecture Components

### 1. Identity & Authorship (LEEWAY Headers)

Every file contains a LEEWAY header declaring:

```javascript
/*
LEEWAY HEADER — DO NOT REMOVE

REGION: [architectural region]
TAG: [component tag]
COLOR_ONION_HEX: [visual identity]
ICON_ASCII: [icon specification]
5WH: [what/why/who/where/how]
AGENTS: [responsible agents]
LICENSE: [license]
*/
```

### 2. Integrity Verification (LeewayIntegrity)

**Core Verification**: Validates runtime signatures against known good values
**Engine Verification**: Each engine verifies its own signature
**Context Enforcement**: Ensures required runtime context is present

### 3. Audit Chain (AuditEngine)

**Tamper-Evident Logging**:
- Each record contains `hash` of content + previous hash
- Chain integrity can be verified externally
- Records: timestamp, correlation ID, user, room, event type

**Record Structure**:
```javascript
{
  ts: number,
  roomId: string,
  userId: string,
  correlationId: string,
  previousHash: string,
  hash: string,
  type: 'INTEGRITY' | 'LIFECYCLE' | 'SECURITY',
  event: string,
  result?: 'PASS' | 'FAIL',
  meta: object
}
```

### 4. Execution Flow (GraphEngine)

**Pre-Execution Checks**:
1. Engine signature verification
2. Context validation
3. Integrity verification (hard lock)
4. Event emission for blocking

**Execution Coupling**: `context.integrityVerified` must be `true` or execution throws `EXECUTION_LOCKED`

### 5. Event System (EventEngine)

**Event Types**:
- ROOM_* : Room lifecycle events
- USER_* : User access events
- SECURITY_* : Security alerts
- EXECUTION_* : Execution control events

**Blocking Mechanism**: Handlers can set `ctx.blocked = true` to prevent execution

## Runtime States

### Bootstrap Sequence

1. **Identity Init**: Generate user/session identity
2. **Trust Assessment**: Evaluate capabilities and permissions
3. **State Loading**: Restore previous runtime state
4. **Pallium Init**: Initialize multi-database gateway
5. **Audit Init**: Create audit engine with chain tracking
6. **Integrity Check**: Verify core and engine signatures
7. **Context Setup**: Establish runtime context with integrity flag

### Execution Sequence

1. **Request**: Task submitted to GraphEngine
2. **Verification**: Engine and context integrity checks
3. **Gating**: Integrity flag validation (hard lock)
4. **Event Check**: Emit EXECUTION_REQUESTED, allow blocking
5. **Execution**: Run task graph with audit logging
6. **Completion**: Mark graph complete, log outcome

## Security Model

### Zones (Permission Framework)

| Zone | Scope | Permissions | Example |
|------|-------|-------------|---------|
| Z0 | Agent VM | Internal orchestration | Agent communication |
| Z1 | Host Files | File system access | Code editing, deployment |
| Z2 | Memory DB | Data persistence | Task logs, knowledge base |

### Capability Gating

- **Default**: Z0 operations (always allowed if integrity verified)
- **Approval Required**: Z1/Z2 operations (user consent needed)
- **Blocked**: Operations violating governance rules

## Forensic Capabilities

### Audit Chain Verification

```javascript
function verifyChain(records) {
  let previousHash = null;
  for (const record of records) {
    const expectedHash = hash(record.content + previousHash);
    if (record.hash !== expectedHash) return false;
    previousHash = record.hash;
  }
  return true;
}
```

### Integrity Proofs

- **Creation Proof**: Git history + LEEWAY headers
- **Runtime Proof**: Signature verification logs
- **Execution Proof**: Audit chains + event logs
- **Tamper Detection**: Hash chain breaks + signature mismatches

## Deployment Model

### Sovereign Operation

- **Offline-First**: No external dependencies for core operation
- **Self-Contained**: All components bundled and verified
- **Portable**: Runs on Android, desktop, server environments

### Multi-Database Gateway (Pallium)

- **IndexedDB**: Local storage and caching
- **Firebase**: Cloud sync and multi-device
- **Vector DB**: Semantic search and retrieval

## Governance Contract

### G1-G7 Workflows

| Workflow | Lead Agent | Purpose |
|----------|------------|---------|
| G1 | Conversation | Social interaction, Q&A |
| G2 | Research | Web search, data gathering |
| G3 | Engineering | Code development, debugging |
| G4 | Design | UI/UX, creative tasks |
| G5 | Memory | Knowledge persistence, recall |
| G6 | Deployment | CI/CD, infrastructure |
| G7 | Health | Monitoring, diagnostics |

### Agent Civilization

20 named agents organized in 7 families with distinct:
- Archetypes (Mayor, Judge, Engineer, etc.)
- Drives (normalized 0-1 scales)
- Relationships (trust, dependency matrices)
- Voice profiles and visual identities

## Implementation Notes

### Hard Locks

- Removing integrity checks → `EXECUTION_LOCKED` error
- Tampering signatures → Engine verification failure
- Breaking audit chains → Forensic detection possible

### Event Control

- `EXECUTION_REQUESTED` event allows pre-execution blocking
- Security alerts can quarantine runtime components
- Room termination events clean up resources

### Chain Integrity

- Hash function: Simple 32-bit hash (upgradeable to SHA-256)
- Previous hash linking creates tamper-evident sequence
- Chain verification enables external auditing

## Future Extensions

### Patent-Ready Claims

1. **Self-Verifying Execution Environment**: System that embeds integrity checks into execution flow
2. **Tamper-Evident Audit Chains**: Linked hash structures for forensic logging
3. **Event-Gated Runtime Control**: Event system that can block autonomous operations
4. **Embedded Authorship Framework**: Code metadata system with governance enforcement

### Advanced Features

- **Multi-Party Verification**: External auditors can verify chain integrity
- **Runtime Hot-Patching**: Verified updates without breaking chains
- **Federated Governance**: Cross-system agent coordination with shared trust
- **Legal Admissibility**: Audit logs designed for court evidence