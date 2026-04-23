/*
LEEWAY HEADER
TAG: CORE.CONSTRUCT.ROOM_ON_THE_EDGE.CONTRACT
REGION: CORE
AUTHORITY: LeeWay-Standards
CLASS: CONSTITUTIONAL CONTRACT
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * ROOM ON THE EDGE — CONSTITUTIONAL SYSTEM CONTRACT
 *
 * This contract defines the Room on the Edge as a first-class system layer:
 * an embodied projection chamber that renders the Agent Lee OS operating environment
 * while remaining non-sovereign, governed, and fully bound to LeeWay Standards.
 *
 * This is enforceable by:
 * - The LEEWAY constitutional enforcement engine
 * - LeeWay Standards governance services
 * - Runtime integrity validators
 * - CI/CD pipeline checks
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🧬 IDENTITY & PLACEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const RoomOnTheEdgeContract = {
  // Identity: what is this thing?
  identity: {
    canonicalName: 'Room on the Edge',
    abbreviation: 'R.O.E',
    classification: 'Embodied Projection Chamber',
    systemLayer: 'Integrated-Embodiment',
    authorityClass: 'Render-Route-Reflect',
    sovereignty: 'NON-SOVEREIGN',

    description:
      'The primary rendered embodiment surface of Agent Lee OS. ' +
      'The Construct hosts all major projected forms (AgentVM, DatabaseHub, ' +
      'CommandCouncil, CreatorStudio, Pallium), provides dual-mode embodiment ' +
      '(3D screen + VR immersive), and reflects the governance, memory, ' +
      'and execution state of the system. It is owned and routed through ' +
      'LeeWay-Edge-Integrated, bound to LeeWay Standards law, ' +
      'and protected by seven constitutional guardians.',

    placement: {
      owner: 'LeeWay-Edge-Integrated',
      parent: 'Integrated-Embodiment Layer',
      children: [
        'ConstructView.tsx',
        'ConstructController.ts',
        'DeterministicConstructService.ts',
        'DeterministicVoxelEngine.ts',
        'ProjectedForms (AgentVM, DatabaseHub, CommandCouncil, CreatorStudio)',
        'Pallium Surface',
        'Governance Reflection Zone',
      ],
      authority_chain: 'Standards → Integrated → Construct (Render/Route/Reflect only)',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔴 CORE CONSTITUTIONAL LAWS (ENFORCED BY GUARDIANS)
  // ═══════════════════════════════════════════════════════════════════════════

  laws: {
    constructViewLaw: {
      id: 'LAW_CONSTRUCT_VIEW_SINGULARITY',
      rule: 'One construct, multiple embodiment modes, single shared state.',
      enforcement: 'BLOCK_ON_VIOLATION',
      guardian: 'RuntimeChainGuardian',
      details: {
        principle:
          'The Room on the Edge is a single unified environment. ' +
          '3D screen mode and VR immersive mode must share identical logic, agents, ' +
          'memory, and governance state. Only rendering layers and input methods may differ.',
        forbidden: [
          'separate logic trees for 3D vs VR',
          'different agent instances per mode',
          'forked Pallium or database state',
          'divergent projection availability',
          'mode-specific governance rules',
        ],
      },
    },

    constructAuthorityLaw: {
      id: 'LAW_CONSTRUCT_AUTHORITY_BOUNDS',
      rule:
        'Construct may render, route, and reflect. ' +
        'It may NOT legislate, own standards, execute sovereign authority, or control runtime.',
      enforcement: 'BLOCK_ON_VIOLATION',
      guardian: 'ConstructAuthoritySentinel',
      details: {
        principle:
          'The Construct is a governed surface, not a governing body. ' +
          'It receives instructions from LeeWay Standards and LeeWay-Edge-Integrated. ' +
          'It executes render and route commands. It reflects governance outcomes. ' +
          'It never creates law, runs standards checks, or makes execution decisions.',
        allowed: [
          'local scene management (camera, transitions)',
          'projection activation and switching',
          'spatial layout and ambient zones',
          'local voxel/world logic',
          'surface routing and narration',
          'reflection and display of external governance state',
        ],
        forbidden: [
          'running LeeWay governance checks',
          'owning standards law files',
          'executing runtime authority decisions',
          'storing system configuration',
          'managing user permissions',
          'controlling deployment or build',
          'modifying agent behavior independently',
        ],
      },
    },

    agentSingularityLaw: {
      id: 'LAW_AGENT_SINGULARITY',
      rule: 'All surfaces are expressions of Agent Lee. There is one agent, not multiple tools.',
      enforcement: 'BLOCK_ON_VIOLATION',
      guardian: 'PresenceIntegrityGuardian',
      details: {
        principle:
          'Agent Lee is the unified consciousness of the system. ' +
          'Every surface (DatabaseHub, AgentVM, CommandCouncil, CreatorStudio) ' +
          'is a form or modality of that singular agent, not an independent tool. ' +
          'Agent Lee is always the primary presence, always the narrator, always sovereign over the surfaces.',
        forbidden: [
          'tool-first presentation',
          'surfaces as independent products',
          'Agent Lee absence from major zones',
          'surfaces appearing to act autonomously',
          'projection-local agent claims',
        ],
      },
    },

    memorySeparationLaw: {
      id: 'LAW_MEMORY_BOUNDARY',
      rule: 'Pallium and Database Center must remain distinct systems in code, UI, and wording.',
      enforcement: 'BLOCK_ON_VIOLATION',
      guardian: 'MemoryBoundaryGuardian',
      details: {
        principle:
          'Pallium is a file-based multi-drive memory fabric (8 sovereign drives: L/E/O/N/A/R/D/LEE). ' +
          'Database Center is a structured 5-database system (Chroma/Milvus/Weaviate/Faiss/Firebase). ' +
          'They are architecturally separate. They must never be described, merged, or rendered as the same thing.',
        forbidden: [
          'Pallium described as a database',
          'drives described as tables',
          'view === "database" inside Pallium component',
          'Pallium merged with DB Center in UI',
          'file-memory confused with structured data',
          'Pallium mislabelled as primary relational store',
        ],
        correct_pattern:
          'Pallium = file-memory fabric. Database Center = structured DB system. Separate. Visible. Distinct.',
      },
    },

    projectionPurityLaw: {
      id: 'LAW_PROJECTION_PURITY',
      rule: 'Construct and projections cannot directly own runtime internals or standards law.',
      enforcement: 'BLOCK_ON_VIOLATION',
      guardian: 'ProjectionPurityGuardian',
      details: {
        principle:
          'The execution chain is: Standards → Integrated → Runtime → Projections. ' +
          'Projections (and the Construct as a projection surface) may consume core layers ' +
          'through adapters and MCP, but may not directly import, own, or re-export them.',
        forbidden: [
          'projection importing cortices/ directly',
          'projection importing runtime internals (RTCInitializer, etc.)',
          'projection importing Standards law files',
          'projection re-owning Integrated contracts',
          'projection storing local copy of governance logic',
        ],
        allowed: [
          'projection importing via Integrated adapters',
          'projection using MCP surface contracts',
          'projection reflecting (not executing) governance state',
          'projection receiving routed commands from Integrated',
        ],
      },
    },

    auditTrailLaw: {
      id: 'LAW_RECEIPT_AND_AUDIT',
      rule: 'Every governance action must leave evidence. Everything important must be tracked and timestamped.',
      enforcement: 'AUDIT_VIOLATION',
      guardian: 'ReceiptAuditWarden',
      details: {
        principle:
          'The system must be able to prove what happened, when, why, and who decided. ' +
          'Every guardian action, every law enforcement, every state change in the Construct ' +
          'must be logged to the Receipts drive (R) of Pallium.',
        required_events: [
          'construct initialization',
          'mode switch (3D ↔ VR)',
          'projection activation',
          'guardian enforcement',
          'violation detection',
          'state divergence',
        ],
      },
    },

    governanceReflectionLaw: {
      id: 'LAW_GOVERNANCE_VISIBILITY',
      rule: 'Governance state must be made visible in the Construct through the Governance Reflection Zone.',
      enforcement: 'VISIBILITY_VIOLATION',
      guardian: 'TrustFabricMonitor',
      details: {
        principle:
          'Users must be able to see the system is protected, governed, and trustworthy. ' +
          'The Governance Reflection Zone must display real-time guardian status, ' +
          'law enforcement activity, trust state, and receipts.',
        required_displays: [
          'Guardian status (Active / Warning / Blocking)',
          'Chain integrity (Valid / Broken)',
          'Pallium boundary status (Clean / Violated)',
          'Projection purity (Clean / Drift detected)',
          'Recent receipts and audit events',
          'Trust score and integrity state',
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧱 EMBODIMENT MODES (DUAL-MODE LOCK)
  // ═══════════════════════════════════════════════════════════════════════════

  embodiment: {
    modes: ['SCREEN_3D', 'VR_IMMERSIVE'],

    sharedState: {
      required: [
        'agents (Agent Lee, service agents)',
        'governance state (audits, violations, receipts)',
        'pallium (all 8 drives)',
        'database center (all 5 DBs)',
        'world model and projected forms',
        'projection routing and active surfaces',
        'trust fabric and guardian state',
      ],
      rule: 'STATE_MUST_BE_IDENTICAL_ACROSS_MODES',
      enforcement: 'BLOCK_ON_DIVERGENCE',
      guardian: 'RuntimeChainGuardian',
    },

    differences: {
      allowed: [
        'camera system (orbit vs head-tracked)',
        'input method (mouse/keyboard vs VR controllers)',
        'UI rendering layer (2D overlay vs world-space)',
        'interaction model (click-based vs gesture-based)',
        'performance optimization (LOD, culling)',
      ],
      forbidden: [
        'separate logic trees',
        'different agent instances',
        'forked memory systems',
        'mode-specific law enforcement',
        'divergent projection availability',
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧠 INTERNAL ZONES (MANDATORY ARCHITECTURE)
  // ═══════════════════════════════════════════════════════════════════════════

  zones: {
    agentPresence: {
      required: true,
      owner: 'Agent Lee (Sovereign)',
      role: 'Primary consciousness, narrator, controller',
      behaviors: [
        'greet user on entry',
        'narrate system state changes',
        'explain projections and modes',
        'guide navigation',
        'respond to user intent',
        'coordinate projection launching',
      ],
      forbidden: [
        'absence from major zones',
        'delegation of sovereignty to surfaces',
        'independent surface autonomy',
      ],
    },

    projectionZone: {
      required: true,
      surfaces: [
        'AgentVM (Execution form)',
        'DatabaseHub (Data form)',
        'CommandCouncil (Governance form)',
        'CreatorStudio (Creation form)',
        'Pallium (Memory form)',
      ],
      rule: 'All surfaces are expressions of Agent Lee, not independent tools',
      guardian: 'PresenceIntegrityGuardian',
    },

    worldLogic: {
      required: true,
      ownership: 'Construct-Local (Allowed)',
      allowed: [
        'camera control and movement',
        'scene graph and rendering',
        'spatial transitions between zones',
        'ambient lighting and effects',
        'projection mounting and visibility',
        'spatial audio',
      ],
      forbidden: [
        'governance logic',
        'execution authority',
        'file storage',
        'database writes',
      ],
    },

    governanceReflection: {
      required: true,
      role: 'Display-only mirror of system governance',
      mustDisplay: [
        'active audits and checks',
        'violations and errors',
        'receipts and historical events',
        'trust score and integrity',
        'guardian status',
        'agent activity and decisions',
      ],
      guardian: 'TrustFabricMonitor',
      rule: 'REFLECT_ONLY — No local governance execution',
    },

    externalAction: {
      required: true,
      role: 'Bridge to workforce operations and real-world actions',
      allowed: [
        'display of delegated tasks',
        'status of external operations',
        'return of completed work',
        'emergency stop signals',
      ],
      forbidden: [
        'direct execution of operations',
        'modification of deployed systems',
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 💾 MEMORY ARCHITECTURE (LOCKED)
  // ═══════════════════════════════════════════════════════════════════════════

  memory: {
    pallium: {
      type: 'MULTI_DRIVE_FILE_MEMORY',
      description: 'File-based multi-drive memory fabric. 8 sovereign drives.',
      drives: {
        L: { name: 'Law', purpose: 'Constitutional records and standards' },
        E: { name: 'Execution', purpose: 'Runtime decisions and actions' },
        O: { name: 'Operations', purpose: 'Workforce tasks and delegations' },
        N: { name: 'Narrative', purpose: 'Story state and context' },
        A: { name: 'Agents', purpose: 'Agent configurations and identities' },
        R: { name: 'Receipts', purpose: 'Audit trail and evidence' },
        D: { name: 'Diagnostics', purpose: 'System health and monitoring' },
        LEE: { name: 'Sovereign Core', purpose: 'Agent Lee core identity and authority' },
      },
      guardian: 'MemoryBoundaryGuardian',
      rule: 'NEVER DESCRIBE PALLIUM AS A DATABASE',
    },

    databaseCenter: {
      type: 'STRUCTURED_DB_SYSTEM',
      description: '5-database structured data system. Separate from Pallium.',
      databases: {
        neuralCore: {
          name: 'Chroma',
          purpose: 'Semantic search and embeddings',
        },
        coldStore: {
          name: 'Milvus',
          purpose: 'Archival and historical data',
        },
        agentMemory: {
          name: 'Weaviate',
          purpose: 'AI-native knowledge graphs',
        },
        taskRegistry: {
          name: 'Faiss',
          purpose: 'Task indexing and retrieval',
        },
        neuralCoreHub: {
          name: 'Firebase',
          purpose: 'Coordination and real-time sync',
        },
      },
      guardian: 'MemoryBoundaryGuardian',
      rule: 'KEEP SEPARATE FROM PALLIUM',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🚫 VIOLATION PATTERNS (ENGINE ENFORCED)
  // ═══════════════════════════════════════════════════════════════════════════

  violations: {
    patterns: [
      {
        pattern: /Pallium.*(?:is|as|=).*(?:database|db|relational)/i,
        law: 'memorySeparationLaw',
        severity: 'CRITICAL',
        fix: 'Replace with: Pallium is a file-memory fabric',
      },
      {
        pattern: /drives.*(?:tables|rows|columns)/i,
        law: 'memorySeparationLaw',
        severity: 'CRITICAL',
        fix: 'Drives are not tables. They are file-based memory locations.',
      },
      {
        pattern: /view\s*===\s*['"]database['"]/,
        law: 'memorySeparationLaw',
        severity: 'CRITICAL',
        fix: 'Remove database view from Pallium component. Use DatabaseHub instead.',
      },
      {
        pattern: /^\s*import\b[^;]*cortices\//m,
        law: 'projectionPurityLaw',
        severity: 'CRITICAL',
        fix: 'Replace with LeeWay-Edge-Integrated adapter',
      },
      {
        pattern: /^\s*import\b[^;]*(?:RTCInitializer|LeewayRTCClient)/m,
        law: 'projectionPurityLaw',
        severity: 'CRITICAL',
        fix: 'Replace with LeeWay-Edge-Integrated RTC adapter',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧠 AGENT PRESENTATION MODEL
  // ═══════════════════════════════════════════════════════════════════════════

  agentModel: {
    representation: 'ALL_SURFACES_ARE_AGENT_FORMS',
    principle:
      'There is one Agent Lee. Each surface is a mode or form through which Agent Lee ' +
      'presents itself and the system state. Surfaces are not separate tools.',

    mapping: {
      DatabaseHub: 'Agent Lee — Data Form (Query, store, retrieve)',
      AgentVM: 'Agent Lee — Execution Form (Run, decide, act)',
      CommandCouncil: 'Agent Lee — Governance Form (Audit, enforce, decide)',
      CreatorStudio: 'Agent Lee — Creation Form (Design, write, build)',
      Pallium: 'Agent Lee — Memory Form (Remember, recall, track)',
    },

    requiredBehavior: [
      'Agent Lee greets the user and explains the current form',
      'Agent Lee narrates transitions between forms',
      'Agent Lee explains what each form does and why',
      'Agent Lee is always visibly sovereign and present',
      'No surface appears to act independently of Agent Lee',
    ],

    guardian: 'PresenceIntegrityGuardian',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔌 VALIDATION ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  validate(filePath: string, content: string): ValidationResult {
    const violations: Violation[] = [];

    // Strip comments for pattern matching
    const active = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

    // Check each violation pattern
    for (const vio of this.violations.patterns) {
      if (vio.pattern.test(active)) {
        violations.push({
          pattern: vio.pattern.source,
          law: vio.law,
          severity: vio.severity,
          fix: vio.fix,
          filePath,
        });
      }
    }

    return {
      filePath,
      valid: violations.length === 0,
      violations,
      timestamp: new Date().toISOString(),
    };
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Violation {
  pattern: string;
  law: string;
  severity: 'CRITICAL' | 'WARNING';
  fix: string;
  filePath: string;
}

interface ValidationResult {
  filePath: string;
  valid: boolean;
  violations: Violation[];
  timestamp: string;
}

export type { Violation, ValidationResult };
