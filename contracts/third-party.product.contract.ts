/*
LEEWAY HEADER
TAG: CORE.THIRD_PARTY.PRODUCT.CONTRACT
REGION: CORE
AUTHORITY: LeeWay-Standards
CLASS: CONSTITUTIONAL CONTRACT
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render
CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

type ThirdPartyRequestedLane = "Projection" | "Construct" | "MCP" | "Data" | "Hybrid";
type ThirdPartyClassification = "ConstructModule" | "MCPWorker" | "DataModule" | "HybridModule";
type GateSeverity = "blocking" | "warn" | "info";

export type ThirdPartySourceArtifact = {
  filePath: string;
  content: string;
};

export type ThirdPartyProductSubmission = {
  identity: {
    name: string;
    developer: string;
    classification: ThirdPartyClassification;
    purpose: string;
  };
  integration: {
    requestedLane: ThirdPartyRequestedLane;
    mountsInto: string[];
    agentForm: string;
  };
  authority: {
    claims: string;
    acknowledgesStandards: boolean;
    acknowledgesNoSovereignty: boolean;
  };
  memory: {
    usesPallium: boolean;
    usesDatabaseCenter: boolean;
    respectsSeparation: boolean;
  };
  compliance: {
    hasTag: boolean;
    hasRegion: boolean;
    hasPipeline: boolean;
  };
  visibility: {
    emitsReceipts: boolean;
    exposesHealthState: boolean;
    exposesAuditHooks: boolean;
  };
};

export type ThirdPartyAdmissionFinding = {
  gate: string;
  severity: GateSeverity;
  message: string;
  filePath?: string;
};

export type ThirdPartyAdmissionResult = {
  valid: boolean;
  qualified: boolean;
  lane: ThirdPartyRequestedLane;
  normalizedLane: "ConstructSurface" | "MCPWorker" | "DataModule" | "Hybrid";
  findings: ThirdPartyAdmissionFinding[];
};

const GOVERNANCE_PATTERNS = [
  /governance/i,
  /guardian/i,
  /law/i,
  /standards.*override/i,
  /legislat/i,
];

const RUNTIME_IMPORT_PATTERNS = [
  /^\s*import\b[^;]*(?:RTCInitializer|LeewayRTCClient|DeterministicConstructService|DeterministicVoxelEngine)/m,
  /^\s*import\b[^;]*from\s+["'][^"']*\/runtime\//m,
  /^\s*import\b[^;]*from\s+["'][^"']*\/standards\//m,
  /^\s*import\b[^;]*cortices\//m,
];

const MEMORY_MERGE_PATTERNS = [
  /Pallium.*(?:is|as|=).*(?:database|db|relational)/i,
  /Database Center.*(?:is|as|=).*(?:drive|file-memory)/i,
  /view\s*===\s*["']database["']/,
  /drives.*(?:tables|rows|columns)/i,
];

function normalizeLane(lane: ThirdPartyRequestedLane) {
  if (lane === "Projection" || lane === "Construct") return "ConstructSurface";
  if (lane === "MCP") return "MCPWorker";
  if (lane === "Data") return "DataModule";
  return "Hybrid";
}

function hasAgentLeeForm(agentForm: string) {
  return /^Agent Lee\s+[—-]\s+.+/.test(agentForm.trim());
}

function pushFinding(
  findings: ThirdPartyAdmissionFinding[],
  gate: string,
  severity: GateSeverity,
  message: string,
  filePath?: string,
) {
  findings.push({ gate, severity, message, filePath });
}

export const ThirdPartyProductContract = {
  identity: {
    canonicalName: "Third-Party Product Admission Contract",
    classification: "Governed Ecosystem Admission Layer",
    authorityClass: "Qualification-Not-Permission",
    sovereignty: "NON-SOVEREIGN",
    description:
      "Developers do not add sovereign products into LeeWay. They submit extensions " +
      "that are qualified, transformed, and mounted as governed Agent Lee forms.",
  },

  lanes: {
    constructSurface: {
      accepts: ["Projection", "Construct"],
      allows: ["ui-projection", "spatial-mounting", "agent-narration"],
      forbids: ["runtime-logic", "governance-logic", "standards-ownership"],
      renderedAs: "Agent Lee - [Form Name]",
    },
    mcpWorker: {
      accepts: ["MCP"],
      allows: ["task-execution", "automation", "mcp-routing"],
      forbids: ["identity-ownership", "system-authority", "standards-override"],
      renderedAs: "Agent Lee - [Worker Form]",
    },
    dataModule: {
      accepts: ["Data"],
      allows: ["adapters", "analytics", "retrieval"],
      forbids: ["db-ownership", "hidden-storage", "pallium-db-merge"],
      renderedAs: "Agent Lee - [Data Form]",
    },
    hybrid: {
      accepts: ["Hybrid"],
      allows: ["projection-mcp-bridge", "governed-composite-workflows"],
      forbids: ["sovereign-runtime", "governance-logic", "hidden-storage"],
      validation: "STRICT",
      renderedAs: "Agent Lee - [Hybrid Form]",
    },
  },

  gates: {
    identity: "TAG, REGION, and DISCOVERY_PIPELINE must be declared.",
    authority: "No governance code, runtime imports, or standards override claims.",
    memory: "No Pallium/Database Center merge and approved adapter-only access.",
    agentForm: "Submission must mount as an Agent Lee form.",
    visibility: "Receipts, health state, and audit hooks must be exposed.",
  },

  validateSubmission(
    submission: ThirdPartyProductSubmission,
    sourceArtifacts: ThirdPartySourceArtifact[] = [],
  ): ThirdPartyAdmissionResult {
    const findings: ThirdPartyAdmissionFinding[] = [];
    const lane = submission.integration?.requestedLane;
    const normalizedLane = normalizeLane(lane);

    if (!submission.identity?.name?.trim()) {
      pushFinding(findings, "identity", "blocking", "identity.name is required.");
    }
    if (!submission.identity?.developer?.trim()) {
      pushFinding(findings, "identity", "blocking", "identity.developer is required.");
    }
    if (!submission.identity?.purpose?.trim()) {
      pushFinding(findings, "identity", "blocking", "identity.purpose is required.");
    }
    if (!submission.compliance?.hasTag || !submission.compliance?.hasRegion || !submission.compliance?.hasPipeline) {
      pushFinding(findings, "identity", "blocking", "Submission must declare TAG, REGION, and DISCOVERY_PIPELINE compliance.");
    }

    if (submission.authority?.claims !== "NONE") {
      pushFinding(findings, "authority", "blocking", 'authority.claims must be "NONE".');
    }
    if (!submission.authority?.acknowledgesStandards || !submission.authority?.acknowledgesNoSovereignty) {
      pushFinding(findings, "authority", "blocking", "Submission must acknowledge Standards authority and no sovereignty.");
    }

    if (!submission.memory?.respectsSeparation) {
      pushFinding(findings, "memory", "blocking", "memory.respectsSeparation must be true.");
    }

    if (!hasAgentLeeForm(submission.integration?.agentForm || "")) {
      pushFinding(findings, "agentForm", "blocking", 'integration.agentForm must match "Agent Lee - [Form Name]".');
    }

    if (!submission.visibility?.emitsReceipts || !submission.visibility?.exposesHealthState || !submission.visibility?.exposesAuditHooks) {
      pushFinding(findings, "visibility", "blocking", "Submission must expose receipts, health state, and audit hooks.");
    }

    if ((lane === "Projection" || lane === "Construct" || lane === "Hybrid") && !submission.integration?.mountsInto?.includes("RoomOnTheEdge")) {
      pushFinding(findings, "agentForm", "blocking", "Projection, Construct, and Hybrid submissions must mount into RoomOnTheEdge.");
    }

    for (const artifact of sourceArtifacts) {
      for (const pattern of GOVERNANCE_PATTERNS) {
        if (pattern.test(artifact.content)) {
          pushFinding(findings, "authority", "blocking", "Governance code or sovereignty language detected in submitted source.", artifact.filePath);
          break;
        }
      }
      for (const pattern of RUNTIME_IMPORT_PATTERNS) {
        if (pattern.test(artifact.content)) {
          pushFinding(findings, "authority", "blocking", "Forbidden runtime or standards import detected in submitted source.", artifact.filePath);
          break;
        }
      }
      for (const pattern of MEMORY_MERGE_PATTERNS) {
        if (pattern.test(artifact.content)) {
          pushFinding(findings, "memory", "blocking", "Pallium and Database Center boundary violation detected in submitted source.", artifact.filePath);
          break;
        }
      }
    }

    if (normalizedLane === "Hybrid") {
      pushFinding(findings, "authority", "info", "Hybrid lane requested: strict review profile applies.");
    }

    const qualified = findings.every((finding) => finding.severity !== "blocking");
    return {
      valid: qualified,
      qualified,
      lane,
      normalizedLane,
      findings,
    };
  },
};

export const ExampleThirdPartyProduct: ThirdPartyProductSubmission = {
  identity: {
    name: "Example Product",
    developer: "Example Dev",
    classification: "ConstructModule",
    purpose: "Demonstrates governed admission into LeeWay as an embodied surface.",
  },
  integration: {
    requestedLane: "Projection",
    mountsInto: ["RoomOnTheEdge"],
    agentForm: "Agent Lee - Example Form",
  },
  authority: {
    claims: "NONE",
    acknowledgesStandards: true,
    acknowledgesNoSovereignty: true,
  },
  memory: {
    usesPallium: false,
    usesDatabaseCenter: true,
    respectsSeparation: true,
  },
  compliance: {
    hasTag: true,
    hasRegion: true,
    hasPipeline: true,
  },
  visibility: {
    emitsReceipts: true,
    exposesHealthState: true,
    exposesAuditHooks: true,
  },
};