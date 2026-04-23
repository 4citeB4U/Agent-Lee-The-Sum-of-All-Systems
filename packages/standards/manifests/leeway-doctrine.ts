/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.LEEWAY_DOCTRINE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = leeway-doctrine — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = packages/standards/manifests/leeway-doctrine.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type LeeWayPillar = {
  name: string;
  principle: string;
  operationalMeaning: string;
};

export type LeeWayDoctrine = {
  systemName: string;
  oneLineDefinition: string;
  finalTruth: string;
  governedPath: ["Standards", "Integrated", "Runtime"];
  pillars: {
    L: LeeWayPillar;
    E1: LeeWayPillar;
    E2: LeeWayPillar;
    W: LeeWayPillar;
    A: LeeWayPillar;
    Y: LeeWayPillar;
  };
};

export const LEEWAY_PHASE_4_RULE =
  "No more single-file MOVE operations. All future moves must be group-based and dependency-aware.";

export const LEEWAY_DOCTRINE: LeeWayDoctrine = {
  systemName: "LeeWay - The Structured Freedom System",
  oneLineDefinition:
    "LeeWay = Freedom to build, enforced through layers, executed through systems, and delivered through governed outcomes.",
  finalTruth:
    "Freedom survives at scale not by removing limits, but by designing them correctly.",
  governedPath: ["Standards", "Integrated", "Runtime"],
  pillars: {
    L: {
      name: "Layered Foundations",
      principle: "Freedom is contained without being restricted.",
      operationalMeaning: "Capabilities must remain in proper layers with clear ownership boundaries.",
    },
    E1: {
      name: "Execution Law",
      principle: "Freedom becomes intentional.",
      operationalMeaning: "Every operation follows the governed path Standards -> Integrated -> Runtime.",
    },
    E2: {
      name: "Environment and Engine",
      principle: "Freedom becomes possible.",
      operationalMeaning: "Execution runs inside managed environments and engines with policy controls.",
    },
    W: {
      name: "Workflow and Workforce",
      principle: "Freedom becomes productive.",
      operationalMeaning: "Agents and workflows execute structured tasks with receipts and traceability.",
    },
    A: {
      name: "Architecture and Agents",
      principle: "Freedom becomes stable.",
      operationalMeaning: "Architecture defines law and agents continuously enforce it.",
    },
    Y: {
      name: "Yield and System Output",
      principle: "Freedom becomes real results.",
      operationalMeaning: "The system must produce clean, scalable, and governed outcomes.",
    },
  },
};
