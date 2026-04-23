/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.CONTRACT.THIRD_PARTY_PRODUCT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = third-party-product — governed module
WHY = Enforce LeeWay ecosystem admission standards through typed contracts
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/contracts/third-party-product.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type ThirdPartyRequestedLane = "Projection" | "Construct" | "MCP" | "Data" | "Hybrid";

export type ThirdPartyClassification = "ConstructModule" | "MCPWorker" | "DataModule" | "HybridModule";

export type ThirdPartyVisibility = {
  emitsReceipts: boolean;
  exposesHealthState: boolean;
  exposesAuditHooks: boolean;
};

export type ThirdPartyProductContract = {
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
  visibility: ThirdPartyVisibility;
};

export type ThirdPartyAdmissionFinding = {
  gate: "identity" | "authority" | "memory" | "agentForm" | "visibility";
  severity: "blocking" | "warn" | "info";
  message: string;
  filePath?: string;
};

export type ThirdPartyAdmissionStatus = {
  qualified: boolean;
  lane: ThirdPartyRequestedLane;
  normalizedLane: "ConstructSurface" | "MCPWorker" | "DataModule" | "Hybrid";
  findings: ThirdPartyAdmissionFinding[];
};