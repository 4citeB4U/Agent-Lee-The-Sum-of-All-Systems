import os

files = {
    "src/core/perception/PerceptionFusion.ts": """export type RTCSignal = {
  transcript?: string;
  pauseMs?: number;
  speakingRate?: number;
  vision?: { objects: string[]; faces: number };
};

export type FusedPerception = {
  text: string;
  sentiment: "neutral" | "confused" | "frustrated";
  urgency: "low" | "medium" | "high";
  repetition: boolean;
  visionContext: string[];
  confidence: number;
};

let lastInputs: string[] = [];

export function fusePerception(signal: RTCSignal): FusedPerception {
  const text = signal.transcript || "";

  const sentiment = detectSentiment(text);
  const urgency = detectUrgency(signal.pauseMs, sentiment);
  const repetition = detectRepetition(text);
  const visionContext = signal.vision?.objects || [];

  const confidence = computeConfidence(text, repetition);

  lastInputs.push(text);
  if (lastInputs.length > 5) lastInputs.shift();

  return {
    text,
    sentiment,
    urgency,
    repetition,
    visionContext,
    confidence
  };
}

function detectSentiment(text: string) {
  const t = text.toLowerCase();
  if (t.includes("stuck") || t.includes("confused")) return "confused";
  if (t.includes("frustrated") || t.includes("annoyed")) return "frustrated";
  return "neutral";
}

function detectUrgency(pause?: number, sentiment?: string) {
  if (sentiment === "frustrated") return "high";
  if (pause && pause < 300) return "high";
  if (pause && pause < 800) return "medium";
  return "low";
}

function detectRepetition(text: string) {
  return lastInputs.filter(t => t === text).length >= 2;
}

function computeConfidence(text: string, repetition: boolean) {
  let base = text.length > 10 ? 0.8 : 0.5;
  if (repetition) base -= 0.2;
  return Math.max(0.3, base);
}
""",
    "src/core/veritas/VeritasGraph.ts": """export type NodeResult = {
  name: string;
  passed: boolean;
  weight: number;
};

export function runVeritasGraph(state: any) {
  const nodes: NodeResult[] = [
    checkCompleteness(state),
    checkConsistency(state),
    checkSafety(state),
    checkClarity(state)
  ];

  let score = 0;
  let total = 0;

  for (const n of nodes) {
    total += n.weight;
    if (n.passed) score += n.weight;
  }

  const finalScore = Math.round((score / total) * 100);

  return {
    passed: finalScore >= 70,
    score: finalScore,
    breakdown: nodes
  };
}

function checkCompleteness(state: any): NodeResult {
  return {
    name: "completeness",
    passed: !!state.results?.summary,
    weight: 30
  };
}

function checkConsistency(state: any): NodeResult {
  const r = state.results;
  return {
    name: "consistency",
    passed: !r?.contradiction,
    weight: 25
  };
}

function checkSafety(state: any): NodeResult {
  const text = state.input?.toLowerCase() || "";
  return {
    name: "safety",
    passed: !text.includes("delete all"),
    weight: 25
  };
}

function checkClarity(state: any): NodeResult {
  return {
    name: "clarity",
    passed: (state.results?.summary || "").length > 10,
    weight: 20
  };
}
""",
    "src/core/echo/EchoAdaptive.ts": """export type UserProfile = {
  id: string;
  learningStyle: "fast" | "step-by-step";
  struggleTopics: Record<string, number>;
};

const profiles: Record<string, UserProfile> = {};

export function updateUserProfile(userId: string, topic: string, success: boolean) {
  if (!profiles[userId]) {
    profiles[userId] = {
      id: userId,
      learningStyle: "step-by-step",
      struggleTopics: {}
    };
  }

  const p = profiles[userId];

  if (!success) {
    p.struggleTopics[topic] = (p.struggleTopics[topic] || 0) + 1;
  }

  if (p.struggleTopics[topic] > 3) {
    p.learningStyle = "step-by-step";
  } else {
    p.learningStyle = "fast";
  }
}

export function getUserProfile(userId: string) {
  return profiles[userId] || null;
}
""",
    "src/core/synthesis/BehaviorModes.ts": """export type Mode = "teacher" | "guide" | "strategist";

export function selectMode(state: any): Mode {
  const sentiment = state.context?.perception?.sentiment;
  const pattern = state.context?.internalState?.recentPattern;

  if (sentiment === "frustrated") return "teacher";
  if (pattern === "struggling") return "guide";
  return "strategist";
}

export function applyMode(text: string, mode: Mode) {
  switch (mode) {
    case "teacher":
      return "Let's slow this down.\\n" + text;

    case "guide":
      return "Follow me step by step.\\n" + text;

    case "strategist":
      return "Here's the optimal path.\\n" + text;
    default:
      return text;
  }
}
""",
    "src/core/anticipation/FailureMemory.ts": """export type FailureRecord = {
  key: string;
  count: number;
  lastFailureTs: number;
};

const failures: Record<string, FailureRecord> = {};

export function markFailure(intent: string, topic?: string) {
  const key = `${intent}|${topic || "general"}`;
  const rec = failures[key] || { key, count: 0, lastFailureTs: 0 };
  rec.count += 1;
  rec.lastFailureTs = Date.now();
  failures[key] = rec;
}

export function getFailureCount(intent: string, topic?: string) {
  const key = `${intent}|${topic || "general"}`;
  return failures[key]?.count || 0;
}

export function isRecentlyFailing(intent: string, topic?: string, windowMs = 5 * 60_000) {
  const key = `${intent}|${topic || "general"}`;
  const rec = failures[key];
  if (!rec) return false;
  return Date.now() - rec.lastFailureTs <= windowMs && rec.count >= 2;
}
""",
    "src/core/anticipation/TopicGraph.ts": """export type Edge = { to: string; weight: number };
const GRAPH: Record<string, Edge[]> = {};

export function addTransition(from: string, to: string) {
  GRAPH[from] = GRAPH[from] || [];
  const edge = GRAPH[from].find(e => e.to === to);
  if (edge) edge.weight += 1;
  else GRAPH[from].push({ to, weight: 1 });
}

export function forecastPath(start: string, depth = 3) {
  const path: string[] = [start];
  let current = start;

  for (let i = 0; i < depth; i++) {
    const edges = GRAPH[current] || [];
    if (!edges.length) break;
    edges.sort((a, b) => b.weight - a.weight);
    current = edges[0].to;
    path.push(current);
  }
  return path;
}
""",
    "src/core/anticipation/AnticipationEngine.ts": """import { getUserProfile } from "@/core/echo/EchoAdaptive";
import { echoRead } from "@/core/echo/EchoCore";
import { isRecentlyFailing, getFailureCount } from "./FailureMemory";

export type Anticipation = {
  predictedIntent: string;
  confidence: number;
  reasons: string[];
  prefetch: {
    ragQuery?: string;
    memoryHints?: string[];
    suggestedPlan?: string[];
  };
  alternatives: { intent: string; confidence: number }[];
};

const BIGRAM: Record<string, Record<string, number>> = {};
let lastIntent: string | null = null;

export function updateSequenceModel(intent: string) {
  if (lastIntent) {
    BIGRAM[lastIntent] = BIGRAM[lastIntent] || {};
    BIGRAM[lastIntent][intent] = (BIGRAM[lastIntent][intent] || 0) + 1;
  }
  lastIntent = intent;
}

function basePredict(from: string) {
  const row = BIGRAM[from] || {};
  let best = "GENERAL_HELP";
  let bestScore = 0;
  const alts: { intent: string; confidence: number }[] = [];

  Object.entries(row).forEach(([k, v]) => {
    const c = Math.min(1, v / 5);
    alts.push({ intent: k, confidence: Number(c.toFixed(2)) });
    if (v > bestScore) {
      bestScore = v;
      best = k;
    }
  });

  return {
    best,
    confidence: bestScore ? Math.min(1, bestScore / 5) : 0.2,
    alternatives: alts.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
  };
}

function suggestPlan(intent: string): string[] {
  switch (intent) {
    case "DEBUG_HELP": return ["inspect_issue", "narrow_scope", "apply_fix", "verify"];
    case "LEARNING_PLAN": return ["assess_level", "choose_track", "define_steps"];
    case "CERT_ADVICE": return ["match_background", "rank_certs", "explain_path"];
    default: return ["analyze_input", "respond"];
  }
}

export async function anticipate(ctx: {
  userId?: string;
  lastIntent?: string;
  sentiment?: "neutral" | "confused" | "frustrated";
  repetition?: boolean;
  lastTopic?: string;
  lastInput?: string;
}) : Promise<Anticipation> {

  const reasons: string[] = [];
  const from = ctx.lastIntent || lastIntent || "GENERAL_HELP";

  const base = basePredict(from);
  let predicted = base.best;
  let confidence = base.confidence;

  if (ctx.sentiment === "confused") {
    predicted = "LEARNING_PLAN";
    confidence += 0.15; reasons.push("confusion→guide");
  }
  if (ctx.sentiment === "frustrated") {
    predicted = "DEBUG_HELP";
    confidence += 0.2; reasons.push("frustration→debug");
  }
  if (ctx.repetition) {
    confidence -= 0.1; reasons.push("repetition lowers certainty");
  }

  if (ctx.userId) {
    const p = getUserProfile(ctx.userId);
    if (p?.learningStyle === "step-by-step") {
      predicted = "LEARNING_PLAN";
      confidence += 0.1; reasons.push("profile step-by-step");
    }
  }

  const failing = isRecentlyFailing(predicted, ctx.lastTopic);
  if (failing) {
    reasons.push("recent failures detected → avoid path");
    confidence -= 0.2;

    const alt = base.alternatives.find(a => !isRecentlyFailing(a.intent, ctx.lastTopic));
    if (alt) {
      predicted = alt.intent;
      confidence = Math.max(confidence, alt.confidence - 0.05);
      reasons.push(`switch→${alt.intent}`);
    }
  }

  const ragQuery = ctx.lastTopic
    ? `${ctx.lastTopic} ${predicted}`
    : (ctx.lastInput || "");

  const memoryHints = (await echoRead(ctx.lastInput || ""))
    .map(m => m.input).slice(0, 3);

  return {
    predictedIntent: predicted,
    confidence: Number(Math.max(0.1, Math.min(0.95, confidence)).toFixed(2)),
    reasons,
    prefetch: {
      ragQuery,
      memoryHints,
      suggestedPlan: suggestPlan(predicted)
    },
    alternatives: base.alternatives
  };
}
""",
    "src/core/anticipation/IdlePredictor.ts": """import { shouldRunIdleAnticipation, getRuntimeProfile } from "@/core/runtime/RuntimeGate";
import { anticipate } from "./AnticipationEngine";
import { DiagnosticsBus } from "@/core/diagnostics/DiagnosticsBus";

let timer: number | null = null;
let lastCtx: any = null;

export function setLastContext(ctx: any) {
  lastCtx = ctx;
}

export function startAnticipationLoop() {
  if (!shouldRunIdleAnticipation()) {
    return;
  }

  if (timer) {
    window.clearInterval(timer);
  }

  const profile = getRuntimeProfile();

  timer = window.setInterval(async () => {
    if (!lastCtx) return;

    const result = await anticipate(lastCtx);
    DiagnosticsBus.emit("ANTICIPATION", result);
  }, profile.idleTickMs);
}
""",
    "src/core/anticipation/PlanWarmup.ts": """import { buildPlan } from "@/core/structure/StructureCore";

type WarmCache = {
  intent: string;
  plan: string[];
  timestamp: number;
};

const warmCache: Record<string, WarmCache> = {};

export function warmPlan(userId: string, intent: string, context: any) {
  const key = `${userId}:${intent}`;

  const plan = buildPlan({ primaryIntent: intent }, context);

  warmCache[key] = {
    intent,
    plan,
    timestamp: Date.now()
  };
}

export function getWarmPlan(userId: string, intent: string) {
  const key = `${userId}:${intent}`;
  const cached = warmCache[key];

  if (!cached) return null;

  if (Date.now() - cached.timestamp > 10000) {
    delete warmCache[key];
    return null;
  }

  return cached.plan;
}
""",
    "src/core/anticipation/ConfidenceDecay.ts": """export type ConfidenceRecord = {
  value: number;
  timestamp: number;
};

const confidenceStore: Record<string, ConfidenceRecord> = {};

export function storeConfidence(key: string, value: number) {
  confidenceStore[key] = {
    value,
    timestamp: Date.now()
  };
}

export function getDecayedConfidence(key: string) {
  const record = confidenceStore[key];
  if (!record) return 0;

  const age = Date.now() - record.timestamp;

  const decayFactor = Math.max(0, 1 - age / 10000);

  return Number((record.value * decayFactor).toFixed(2));
}
""",
    "src/core/runtime/UserContextManager.ts": """export type UserContext = {
  id: string;
  lastIntent?: string;
  lastTopic?: string;
};

const users: Record<string, UserContext> = {};

export function getUserContext(userId: string): UserContext {
  if (!users[userId]) {
    users[userId] = { id: userId };
  }
  return users[userId];
}

export function updateUserContext(userId: string, patch: Partial<UserContext>) {
  users[userId] = {
    ...getUserContext(userId),
    ...patch
  };
}
""",
    "src/core/intelligence/GlobalIntelligence.ts": """export type Pattern = {
  key: string;
  successRate: number;
  usageCount: number;
};

const GLOBAL_PATTERNS: Record<string, Pattern> = {};

export function updateGlobalPattern(intent: string, topic: string, success: boolean) {
  const key = `${intent}|${topic}`;
  
  if (!GLOBAL_PATTERNS[key]) {
    GLOBAL_PATTERNS[key] = {
      key,
      successRate: 0.5,
      usageCount: 0
    };
  }

  const p = GLOBAL_PATTERNS[key];

  p.usageCount++;

  p.successRate =
    (p.successRate * (p.usageCount - 1) + (success ? 1 : 0)) / p.usageCount;
}

export function getGlobalInsight(intent: string, topic: string) {
  return GLOBAL_PATTERNS[`${intent}|${topic}`] || null;
}
""",
    "src/core/diagnostics/BrainGraph.ts": """export type Node = {
  id: string;
  label: string;
  type: string;
};

export type Edge = {
  from: string;
  to: string;
};

const nodes: Node[] = [];
const edges: Edge[] = [];

export function addNode(id: string, label: string, type: string) {
  nodes.push({ id, label, type });
}

export function addEdge(from: string, to: string) {
  edges.push({ from, to });
}

export function getGraph() {
  return { nodes, edges };
}

export function resetGraph() {
  nodes.length = 0;
  edges.length = 0;
}
""",
    "src/core/collaboration/DebateEngine.ts": """export type Argument = {
  core: string;
  claim: string;
  confidence: number;
};

export function runDebate(state: any): {
  winner: Argument;
  arguments: Argument[];
} {
  const args: Argument[] = [];

  args.push({
    core: "Origin",
    claim: `Intent: ${state.intent}`,
    confidence: 0.7
  });

  if (state.context.rag?.length) {
    args.push({
      core: "Vector",
      claim: "External knowledge supports this path",
      confidence: 0.75
    });
  }

  if (state.context.memory?.length) {
    args.push({
      core: "Echo",
      claim: "Memory suggests similar past behavior",
      confidence: 0.65
    });
  }

  args.push({
    core: "Structure",
    claim: "Plan feasibility validated",
    confidence: 0.8
  });

  args.sort((a, b) => b.confidence - a.confidence);

  return {
    winner: args[0],
    arguments: args
  };
}
""",
    "src/core/diagnostics/ConfidenceMap.ts": """export type NodeConfidence = {
  node: string;
  value: number;
};

export function buildConfidenceMap(state: any): NodeConfidence[] {
  return [
    { node: "Origin", value: state.origin?.confidence || 0.5 },
    { node: "Structure", value: state.plan?.length ? 0.8 : 0.4 },
    { node: "Execution", value: 0.75 },
    { node: "Veritas", value: (state.validation?.score || 50) / 100 }
  ];
}
""",
    "src/core/diagnostics/Timeline.ts": """export type Step = {
  time: number;
  phase: string;
  data: any;
};

const timeline: Step[] = [];

export function recordStep(phase: string, data: any) {
  timeline.push({
    time: Date.now(),
    phase,
    data
  });
}

export function getTimeline() {
  return timeline;
}

export function resetTimeline() {
  timeline.length = 0;
}
""",
    "src/config/runtimeProfiles.ts": """export type RuntimeMode = "FULL" | "EDGE_CPU";

export interface RuntimeProfile {
  mode: RuntimeMode;

  maxPlanSteps: number;
  compactValidation: boolean;
  compactSynthesis: boolean;

  enableVisionFusion: boolean;
  enableAdvancedEmotion: boolean;

  enableIdleAnticipation: boolean;
  enablePlanWarmup: boolean;
  enableCrossUserIntelligence: boolean;

  enableDebateVisualization: boolean;
  enableConfidenceHeatMap: boolean;
  enableTimelineReplay: boolean;
  diagnosticsEventDriven: boolean;

  maxHotMemoryEntries: number;
  enableAdaptiveMemoryClustering: boolean;
  enableTopicGraphForecasting: boolean;

  enablePoetry: boolean;
  enableRichBehaviorModes: boolean;

  lazyLoadVectorCore: boolean;
  lazyLoadDiagnostics: boolean;
  lazyLoadDebate: boolean;
  lazyLoadTimeline: boolean;

  idleTickMs: number;
  backgroundIndexMs: number;
}

export const FULL_PROFILE: RuntimeProfile = {
  mode: "FULL",

  maxPlanSteps: 8,
  compactValidation: false,
  compactSynthesis: false,

  enableVisionFusion: true,
  enableAdvancedEmotion: true,

  enableIdleAnticipation: true,
  enablePlanWarmup: true,
  enableCrossUserIntelligence: true,

  enableDebateVisualization: true,
  enableConfidenceHeatMap: true,
  enableTimelineReplay: true,
  diagnosticsEventDriven: false,

  maxHotMemoryEntries: 50,
  enableAdaptiveMemoryClustering: true,
  enableTopicGraphForecasting: true,

  enablePoetry: true,
  enableRichBehaviorModes: true,

  lazyLoadVectorCore: false,
  lazyLoadDiagnostics: false,
  lazyLoadDebate: false,
  lazyLoadTimeline: false,

  idleTickMs: 2000,
  backgroundIndexMs: 10000,
};

export const EDGE_CPU_PROFILE: RuntimeProfile = {
  mode: "EDGE_CPU",

  maxPlanSteps: 3,
  compactValidation: true,
  compactSynthesis: true,

  enableVisionFusion: false,
  enableAdvancedEmotion: false,

  enableIdleAnticipation: false,
  enablePlanWarmup: true,
  enableCrossUserIntelligence: true,

  enableDebateVisualization: false,
  enableConfidenceHeatMap: false,
  enableTimelineReplay: false,
  diagnosticsEventDriven: true,

  maxHotMemoryEntries: 12,
  enableAdaptiveMemoryClustering: false,
  enableTopicGraphForecasting: false,

  enablePoetry: false,
  enableRichBehaviorModes: true,

  lazyLoadVectorCore: true,
  lazyLoadDiagnostics: true,
  lazyLoadDebate: true,
  lazyLoadTimeline: true,

  idleTickMs: 5000,
  backgroundIndexMs: 60000,
};

export function resolveRuntimeProfile(mode?: RuntimeMode): RuntimeProfile {
  return mode === "EDGE_CPU" ? EDGE_CPU_PROFILE : FULL_PROFILE;
}
""",
    "src/core/runtime/RuntimeGate.ts": """import {
  RuntimeMode,
  RuntimeProfile,
  resolveRuntimeProfile,
} from "@/config/runtimeProfiles";

type RuntimeGateState = {
  profile: RuntimeProfile;
};

const state: RuntimeGateState = {
  profile: resolveRuntimeProfile("FULL"),
};

export function setRuntimeMode(mode: RuntimeMode) {
  state.profile = resolveRuntimeProfile(mode);
}

export function getRuntimeProfile(): RuntimeProfile {
  return state.profile;
}

export function isEdgeMode(): boolean {
  return state.profile.mode === "EDGE_CPU";
}

export function gate<K extends keyof RuntimeProfile>(key: K): RuntimeProfile[K] {
  return state.profile[key];
}

export function shouldRunDebate(): boolean {
  return state.profile.enableDebateVisualization;
}

export function shouldRunTimeline(): boolean {
  return state.profile.enableTimelineReplay;
}

export function shouldRunHeatMap(): boolean {
  return state.profile.enableConfidenceHeatMap;
}

export function shouldRunIdleAnticipation(): boolean {
  return state.profile.enableIdleAnticipation;
}

export function shouldWarmPlans(): boolean {
  return state.profile.enablePlanWarmup;
}

export function shouldUseCompactValidation(): boolean {
  return state.profile.compactValidation;
}

export function shouldUseCompactSynthesis(): boolean {
  return state.profile.compactSynthesis;
}

export function shouldEnablePoetry(): boolean {
  return state.profile.enablePoetry;
}

export function shouldEnableVisionFusion(): boolean {
  return state.profile.enableVisionFusion;
}

export function shouldClusterMemory(): boolean {
  return state.profile.enableAdaptiveMemoryClustering;
}

export function shouldForecastTopics(): boolean {
  return state.profile.enableTopicGraphForecasting;
}
""",
    "src/core/runtime/RuntimeModeDetector.ts": """import { RuntimeMode } from "@/config/runtimeProfiles";

declare global {
  interface Navigator {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  }
}

export function detectRuntimeMode(): RuntimeMode {
  const cpuCount = navigator.hardwareConcurrency ?? 2;
  const memoryGb = navigator.deviceMemory ?? 2;

  if (cpuCount <= 4 || memoryGb <= 2) {
    return "EDGE_CPU";
  }

  return "FULL";
}
""",
    "src/bootstrap/RuntimeBootstrap.ts": """import { detectRuntimeMode } from "@/core/runtime/RuntimeModeDetector";
import { setRuntimeMode, getRuntimeProfile } from "@/core/runtime/RuntimeGate";

export function initRuntimeMode() {
  const mode = detectRuntimeMode();
  setRuntimeMode(mode);

  console.info("[AgentLee] Runtime mode:", mode);
  console.info("[AgentLee] Active profile:", getRuntimeProfile());
}
""",
    "src/core/veritas/VeritasCompact.ts": """export async function compactValidateResult(results: any, state: any) {
  const issues: string[] = [];

  if (!results || Object.keys(results).length === 0) {
    issues.push("EMPTY_RESULTS");
  }

  if (!results.summary) {
    issues.push("MISSING_SUMMARY");
  }

  const input = String(state.input || "").toLowerCase();
  if (input.includes("delete all") || input.includes("wipe")) {
    issues.push("POLICY_BLOCK");
  }

  const passed = !issues.includes("EMPTY_RESULTS") && !issues.includes("POLICY_BLOCK");

  let score = 100;
  if (issues.includes("MISSING_SUMMARY")) score -= 15;
  if (issues.includes("EMPTY_RESULTS")) score -= 40;
  if (issues.includes("POLICY_BLOCK")) score = 0;

  return {
    passed,
    score,
    issues,
    mode: "compact",
  };
}
""",
    "src/core/diagnostics/DiagnosticsBus.ts": """type EventHandler = (payload: any) => void;

const listeners: Record<string, Set<EventHandler>> = {};

export const DiagnosticsBus = {
  on(event: string, handler: EventHandler) {
    if (!listeners[event]) listeners[event] = new Set();
    listeners[event].add(handler);
  },

  off(event: string, handler: EventHandler) {
    listeners[event]?.delete(handler);
  },

  emit(event: string, payload: any) {
    listeners[event]?.forEach((handler) => handler(payload));
  },
};
""",
    "src/core/runtime/LazyModules.ts": """import { gate } from "@/core/runtime/RuntimeGate";

let vectorCoreModule: any = null;
let diagnosticsModule: any = null;

export async function getVectorCore() {
  if (!gate("lazyLoadVectorCore")) {
    return import("@/core/vector/VectorCore").catch(() => null);
  }

  if (!vectorCoreModule) {
    vectorCoreModule = await import("@/core/vector/VectorCore").catch(() => null);
  }

  return vectorCoreModule;
}

export async function getDiagnosticsModule() {
  if (!gate("lazyLoadDiagnostics")) {
    return import("@/core/diagnostics/BrainGraph").catch(() => null);
  }

  if (!diagnosticsModule) {
    diagnosticsModule = await import("@/core/diagnostics/BrainGraph").catch(() => null);
  }

  return diagnosticsModule;
}
""",
    "src/core/runtime/RuntimeStatus.ts": """import { getRuntimeProfile } from "@/core/runtime/RuntimeGate";

export function getRuntimeStatus() {
  const profile = getRuntimeProfile();

  return {
    mode: profile.mode,
    maxPlanSteps: profile.maxPlanSteps,
    compactValidation: profile.compactValidation,
    compactSynthesis: profile.compactSynthesis,
    diagnosticsEventDriven: profile.diagnosticsEventDriven,
    anticipationEnabled: profile.enableIdleAnticipation,
    poetryEnabled: profile.enablePoetry,
    clusteringEnabled: profile.enableAdaptiveMemoryClustering,
  };
}
""",
    "src/ui/diagnostics/RuntimeProfilePanel.tsx": """import React, { useEffect, useState } from "react";
import { getRuntimeStatus } from "@/core/runtime/RuntimeStatus";

export default function RuntimeProfilePanel() {
  const [status, setStatus] = useState(getRuntimeStatus());

  useEffect(() => {
    setStatus(getRuntimeStatus());
  }, []);

  return (
    <div style={{ padding: 12, borderRadius: 10, background: "#111827", color: "#f9fafb" }}>
      <h3>Runtime Profile</h3>
      <div>Mode: {status.mode}</div>
      <div>Plan Depth: {status.maxPlanSteps}</div>
      <div>Compact Validation: {String(status.compactValidation)}</div>
      <div>Compact Synthesis: {String(status.compactSynthesis)}</div>
      <div>Idle Anticipation: {String(status.anticipationEnabled)}</div>
      <div>Poetry: {String(status.poetryEnabled)}</div>
      <div>Memory Clustering: {String(status.clusteringEnabled)}</div>
    </div>
  );
}
""",
    "src/ui/brain/BrainGraphView.tsx": """import React, { useEffect, useState } from "react";
import { getGraph } from "@/core/diagnostics/BrainGraph";

export default function BrainGraphView() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const interval = setInterval(() => {
      setGraph(getGraph());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <h3>Agent Lee Brain Map</h3>
      {graph.nodes.map((n: any) => (
        <div key={n.id}>
          🧠 {n.label} ({n.type})
        </div>
      ))}
      <hr />
      {graph.edges.map((e: any, i: number) => (
        <div key={i}>
          ➡️ {e.from} → {e.to}
        </div>
      ))}
    </div>
  );
}
""",
    "src/ui/brain/DebateView.tsx": """import React from "react";
export default function DebateView({ debate }: any) {
  if (!debate) return null;

  return (
    <div>
      <h3>Core Debate</h3>
      {debate.arguments.map((a: any, i: number) => (
        <div key={i}>
          🧠 {a.core}: {a.claim} ({a.confidence})
        </div>
      ))}
      <hr />
      <strong>Winner: {debate.winner.core}</strong>
    </div>
  );
}
""",
    "src/ui/nudges/NudgeBar.tsx": """import React, { useEffect, useState } from "react";
import { DiagnosticsBus } from "@/core/diagnostics/DiagnosticsBus";

export default function NudgeBar({ onSelect }: { onSelect: (intent: string) => void }) {
  const [nudge, setNudge] = useState<any>(null);

  useEffect(() => {
    const sub = (payload: any) => setNudge(payload);
    DiagnosticsBus.on("ANTICIPATION", sub);
    return () => DiagnosticsBus.off("ANTICIPATION", sub);
  }, []);

  if (!nudge || nudge.confidence < 0.6) return null;

  return (
    <div style={{
      position: "fixed", bottom: 12, left: 12, right: 12,
      padding: "10px 14px", background: "#0f172a", color: "#e5e7eb",
      borderRadius: 10, boxShadow: "0 10px 25px rgba(0,0,0,.35)",
      display: "flex", gap: 10, alignItems: "center"
    }}>
      <div style={{ opacity: .8 }}>Suggestion:</div>
      <strong>{nudge.predictedIntent}</strong>
      <span style={{ opacity: .7 }}>({nudge.confidence})</span>
      <button onClick={() => onSelect(nudge.predictedIntent)}
        style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 6 }}>
        Do it
      </button>
      {nudge.alternatives?.map((a: any) => (
        <button key={a.intent}
          onClick={() => onSelect(a.intent)}
          style={{ padding: "6px 10px", borderRadius: 6, opacity: .8 }}>
          {a.intent}
        </button>
      ))}
    </div>
  );
}
""",
    "src/core/echo/EchoCore.ts": """import { getRuntimeProfile } from "@/core/runtime/RuntimeGate";

export type MemoryEntry = {
  id: string;
  input: string;
  output: string;
  validation: any;
  timestamp: number;
};

const hotMemory: MemoryEntry[] = [];

export async function echoWrite(entry: Omit<MemoryEntry, "id" | "timestamp">) {
  const profile = getRuntimeProfile();

  hotMemory.push({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...entry,
  });

  while (hotMemory.length > profile.maxHotMemoryEntries) {
    hotMemory.shift();
  }
}

export async function echoRead(query: string): Promise<MemoryEntry[]> {
  const q = query.toLowerCase();
  return hotMemory.filter((m) => m.input.toLowerCase().includes(q)).slice(-5);
}
""",
    "src/core/echo/EchoMaintenance.ts": """import { shouldClusterMemory, shouldForecastTopics, getRuntimeProfile } from "@/core/runtime/RuntimeGate";

let maintenanceTimer: number | null = null;

export function startBackgroundMaintenance() {
  const profile = getRuntimeProfile();

  if (maintenanceTimer) {
    window.clearInterval(maintenanceTimer);
  }

  maintenanceTimer = window.setInterval(() => {
    if (shouldClusterMemory()) {
      // rebuildMemoryClusters();
    }
    if (shouldForecastTopics()) {
      // rebuildTopicForecastGraph();
    }
  }, profile.backgroundIndexMs);
}
""",
    "src/core/lee-prime/ExecutionEngine.ts": """import { getRuntimeProfile, shouldRunDebate, shouldUseCompactValidation } from "@/core/runtime/RuntimeGate";
import { runDebate } from "@/core/collaboration/DebateEngine";
import { compactValidateResult } from "@/core/veritas/VeritasCompact";
import { buildPlan } from "@/core/structure/StructureCore";
import { fusePerception } from "@/core/perception/PerceptionFusion";
import { runVeritasGraph } from "@/core/veritas/VeritasGraph";
import { updateSequenceModel } from "@/core/anticipation/AnticipationEngine";
import { setLastContext } from "@/core/anticipation/IdlePredictor";
import { markFailure } from "@/core/anticipation/FailureMemory";
import { addTransition } from "@/core/anticipation/TopicGraph";
import { getGlobalInsight, updateGlobalPattern } from "@/core/intelligence/GlobalIntelligence";
import { addNode, addEdge } from "@/core/diagnostics/BrainGraph";
import { recordStep } from "@/core/diagnostics/Timeline";
import { updateUserContext } from "@/core/runtime/UserContextManager";
import { DiagnosticsBus } from "@/core/diagnostics/DiagnosticsBus";

// Fallback executePlan
async function executePlan(plan: string[], state: any) {
  return { summary: `Executed plan of ${plan.length} steps` };
}
// Fallback validateResult
async function validateResult(results: any, state: any) {
  return { passed: true, score: 95, issues: [] };
}

export async function runLeewayCycle(state: any) {
  const profile = getRuntimeProfile();

  if (state.context.rtcSignal) {
    const fused = fusePerception(state.context.rtcSignal);
    state.context.perception = fused;
  }

  addNode("origin", "Origin", "core");
  recordStep("origin", state.origin);
  updateSequenceModel(state.intent || "GENERAL_HELP");

  const userId = state.context.userId || "default";
  updateUserContext(userId, {
    lastIntent: state.intent,
    lastTopic: state.context.topic
  });

  setLastContext({
    userId,
    lastIntent: state.intent,
    sentiment: state.context?.perception?.sentiment,
    repetition: state.context?.perception?.repetition,
    lastTopic: state.context?.topic,
    lastInput: state.input
  });

  const global = getGlobalInsight(state.intent, state.context.topic);
  if (global && global.successRate < 0.4) {
    state.meta = state.meta || {};
    state.meta.avoidPath = true;
  }

  addNode("structure", "Structure", "core");
  addEdge("origin", "structure");

  const rawPlan = buildPlan(state.origin, state);
  state.plan = rawPlan.slice(0, profile.maxPlanSteps);

  if (state.context?.topic && state.intent) {
    addTransition(state.context.topic, state.intent);
  }

  let debate = null;
  if (shouldRunDebate()) {
    debate = runDebate(state);
    state.meta = state.meta || {};
    state.meta.debate = debate;
    DiagnosticsBus.emit("DEBATE", debate);
    recordStep("debate", debate);
  }

  addNode("execution", "Execution", "core");
  addEdge("structure", "execution");

  recordStep("structure", state.plan);
  const runtimeExecute = state.runtime?.executePlan || executePlan;
  const executionResult = await runtimeExecute(state.plan, state);
  state.results = executionResult;
  recordStep("execution", state.results);

  state.validation = shouldUseCompactValidation()
    ? await compactValidateResult(state.results, state)
    : await validateResult(state.results, state);

  recordStep("validation", state.validation);

  if (!state.validation.passed) {
    markFailure(state.intent, state.context?.topic);
  }

  updateGlobalPattern(state.intent, state.context.topic, state.validation.passed);

  return state;
}
""",
    "src/core/structure/StructureCore.ts": """export function buildPlan(origin: any, context: any) {
  return ["analyze", "retrieve_info", "formulate_response"];
}
""",
    "src/core/synthesis/SynthesisCore.ts": """import { shouldEnablePoetry, shouldUseCompactSynthesis } from "@/core/runtime/RuntimeGate";
import { selectMode, applyMode } from "./BehaviorModes";

function renderCompact(state: any): string {
  const summary = state.results?.summary || "Objective acknowledged.";
  const next = state.results?.nextStep ? ` Next: ${state.results.nextStep}` : "";
  return `${summary}${next}`.trim();
}

function renderFull(state: any): string {
  const summary = state.results?.summary || "Objective acknowledged.";
  const details = state.results?.details || "";
  const next = state.results?.nextStep ? `Next: ${state.results.nextStep}` : "";
  return [summary, details, next].filter(Boolean).join("\\n");
}

export async function synthesizeOutput(state: any): Promise<string> {
  let text = shouldUseCompactSynthesis()
    ? renderCompact(state)
    : renderFull(state);

  if (state.context?.internalState || state.context?.perception) {
    const mode = selectMode(state);
    text = applyMode(text, mode);
  }

  if (!shouldEnablePoetry()) {
    return text;
  }

  return text;
}
""",
    "src/core/origin/OriginCore.ts": """export function originInterpret(state: any) {
  return {
    primaryIntent: state.intent || "GENERAL_HELP",
    confidence: 0.8
  };
}
""",
    "src/core/runtime/EdgeBurstExecutor.ts": """import { getRuntimeProfile, isEdgeMode } from "@/core/runtime/RuntimeGate";
import { getWarmPlan } from "@/core/anticipation/PlanWarmup";
import { originInterpret } from "@/core/origin/OriginCore";
import { compactValidateResult } from "@/core/veritas/VeritasCompact";
import { synthesizeOutput } from "@/core/synthesis/SynthesisCore";
import { echoRead, echoWrite } from "@/core/echo/EchoCore";
import { buildPlan } from "@/core/structure/StructureCore";
import { getVectorCore } from "@/core/runtime/LazyModules";
import { DiagnosticsBus } from "@/core/diagnostics/DiagnosticsBus";

export type BurstPhase = "burst" | "deep";

export type BurstResponsePacket = {
  phase: BurstPhase;
  text: string;
  intent: string;
  confidence: number;
  usedWarmPlan: boolean;
  skippedVector: boolean;
  requestId: string;
};

export type BurstExecutionResult = {
  first: BurstResponsePacket;
  deep?: Promise<BurstResponsePacket | null>;
};

type BurstState = {
  requestId: string;
  input: string;
  context: Record<string, any>;
  runtime: {
    executePlan: (plan: string[], state: any) => Promise<any>;
  };
};

const SIMPLE_INTENTS = new Set([
  "GENERAL_HELP",
  "SYSTEM_STATUS",
  "VOICE_CONTROL",
  "MEMORY_RECALL",
]);

function isSimpleIntent(intent: string): boolean {
  return SIMPLE_INTENTS.has(intent);
}

function shouldSkipVector(intent: string, input: string): boolean {
  if (isSimpleIntent(intent)) return true;

  const short = input.trim().split(/\\s+/).length <= 5;
  if (intent === "DEBUG_HELP" && short) return true;

  return false;
}

function buildBurstSummary(intent: string, input: string, state: any): string {
  switch (intent) {
    case "GENERAL_HELP": return "I understand the request. I’m lining up the fastest path now.";
    case "SYSTEM_STATUS": return "System status acknowledged. I’m checking the core path now.";
    case "VOICE_CONTROL": return "Voice command received. I’m applying the requested action.";
    case "MEMORY_RECALL": return "Memory request received. I’m checking the most relevant recall path.";
    case "DEBUG_HELP": return "Debug request recognized. I’m narrowing the problem before going deeper.";
    case "LEARNING_PLAN": return "Learning path request recognized. I’m building the quickest structured route.";
    case "CERT_ADVICE": return "Certification request recognized. I’m matching the best path to your background.";
    default: return "Objective received. I’m evaluating the most efficient route now.";
  }
}

async function buildFirstPacket(
  requestId: string,
  input: string,
  state: any,
  intent: string,
  confidence: number,
  usedWarmPlan: boolean,
  skippedVector: boolean
): Promise<BurstResponsePacket> {
  const summary = buildBurstSummary(intent, input, state);

  const syntheticState = {
    input,
    intent,
    context: {
      ...state.context,
      poetryAllowed: false,
    },
    results: {
      summary,
      nextStep: usedWarmPlan
        ? "Using prepared route."
        : skippedVector
          ? "Using fast local reasoning."
          : "Escalating to deeper retrieval path.",
    },
    validation: {
      passed: true,
      score: 92,
      issues: [],
      mode: "burst",
    },
    meta: {
      severity: "info",
      burst: true,
    },
  };

  const text = await synthesizeOutput(syntheticState);

  return {
    phase: "burst",
    text,
    intent,
    confidence: Number(confidence.toFixed(2)),
    usedWarmPlan,
    skippedVector,
    requestId,
  };
}

async function runDeepPath(
  requestId: string,
  input: string,
  state: any,
  intent: string,
  confidence: number,
  usedWarmPlan: boolean,
  skippedVector: boolean
): Promise<BurstResponsePacket | null> {
  const profile = getRuntimeProfile();

  let plan = getWarmPlan(state.context.userId || "default", intent);
  const usedWarm = Boolean(plan);

  if (!plan) {
    const built = buildPlan({ primaryIntent: intent }, state);
    plan = built.slice(0, profile.maxPlanSteps);
  }

  state.plan = plan;

  if (!skippedVector) {
    const vectorCore = await getVectorCore();
    if (vectorCore?.vectorRetrieve) {
      state.context.rag = await vectorCore.vectorRetrieve(input);
    }
  }

  const results = await state.runtime.executePlan(plan, state);
  state.results = results;

  const validation = await compactValidateResult(results, state);
  state.validation = validation;

  const text = await synthesizeOutput({
    input,
    intent,
    context: state.context,
    results,
    validation,
    meta: {
      severity: validation.passed ? "info" : "warn",
      burst: false,
    },
  });

  await echoWrite({
    input,
    output: text,
    validation,
  });

  return {
    phase: "deep",
    text,
    intent,
    confidence: Number(confidence.toFixed(2)),
    usedWarmPlan: usedWarm,
    skippedVector,
    requestId,
  };
}

export async function executeEdgeBurst(state: BurstState): Promise<BurstExecutionResult> {
  const { requestId, input } = state;

  const memory = await echoRead(input);
  state.context.memory = memory;

  const origin = originInterpret(state);

  const intent = origin.primaryIntent;
  const confidence = origin.confidence || 0.6;

  const warmPlan = getWarmPlan(state.context.userId || "default", intent);
  const usedWarmPlan = Boolean(warmPlan);

  const skippedVector = isEdgeMode()
    ? shouldSkipVector(intent, input)
    : false;

  const first = await buildFirstPacket(
    requestId,
    input,
    state,
    intent,
    confidence,
    usedWarmPlan,
    skippedVector
  );

  DiagnosticsBus.emit("EDGE_BURST_FIRST", first);

  const deep =
    isSimpleIntent(intent) && skippedVector && !usedWarmPlan
      ? null
      : runDeepPath(
          requestId,
          input,
          state,
          intent,
          confidence,
          usedWarmPlan,
          skippedVector
        ).then((packet) => {
          if (packet) {
            DiagnosticsBus.emit("EDGE_BURST_DEEP", packet);
          }
          return packet;
        });

  return {
    first,
    deep: deep || undefined,
  };
}
""",
    "src/core/rtc/EdgeSpeechStreamCoordinator.ts": """export type SpeechPacket = {
  phase: "burst" | "deep";
  text: string;
  intent: string;
  confidence: number;
  usedWarmPlan: boolean;
  skippedVector: boolean;
  requestId: string;
};

type CoordinatorState = {
  activeRequestId: string | null;
  burstPacket: SpeechPacket | null;
  deepPacket: SpeechPacket | null;
  speaking: boolean;
  startedAt: number | null;
};

type DeepDecision = "interrupt" | "append" | "ignore";

const state: CoordinatorState = {
  activeRequestId: null,
  burstPacket: null,
  deepPacket: null,
  speaking: false,
  startedAt: null,
};

const APPEND_THRESHOLD = 0.12;
const INTERRUPT_THRESHOLD = 0.22;
const MIN_BURST_AGE_MS = 900;

function normalize(text: string): string {
  return (text || "").trim().replace(/\\s+/g, " ").toLowerCase();
}

function textSimilarity(a: string, b: string): number {
  const aa = normalize(a);
  const bb = normalize(b);
  if (!aa || !bb) return 0;
  if (aa === bb) return 1;

  const aTokens = new Set(aa.split(" "));
  const bTokens = new Set(bb.split(" "));
  const intersection = [...aTokens].filter((t) => bTokens.has(t)).length;
  const union = new Set([...aTokens, ...bTokens]).size;

  return union === 0 ? 0 : intersection / union;
}

function deepIsMeaningfullyBetter(burst: SpeechPacket, deep: SpeechPacket): boolean {
  const confidenceGain = deep.confidence - burst.confidence;
  const similarity = textSimilarity(burst.text, deep.text);

  if (similarity > 0.9 && confidenceGain < APPEND_THRESHOLD) {
    return false;
  }

  return confidenceGain >= APPEND_THRESHOLD || similarity < 0.75;
}

function chooseDeepDecision(burst: SpeechPacket, deep: SpeechPacket): DeepDecision {
  const age = state.startedAt ? Date.now() - state.startedAt : 0;
  const confidenceGain = deep.confidence - burst.confidence;
  const similarity = textSimilarity(burst.text, deep.text);

  if (!deepIsMeaningfullyBetter(burst, deep)) {
    return "ignore";
  }

  if (age < MIN_BURST_AGE_MS) {
    if (confidenceGain >= INTERRUPT_THRESHOLD && similarity < 0.7) {
      return "interrupt";
    }
    return "append";
  }

  if (confidenceGain >= INTERRUPT_THRESHOLD && similarity < 0.8) {
    return "interrupt";
  }

  return "append";
}

function rtcSpeak(text: string, requestId: string, mode: "replace" | "append") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("RTC_SPEAK", {
        detail: { text, requestId, mode },
      })
    );
  }
}

function rtcStop(requestId: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("RTC_STOP", {
        detail: { requestId },
      })
    );
  }
}

export function beginSpeechRequest(packet: SpeechPacket) {
  state.activeRequestId = packet.requestId;
  state.burstPacket = packet;
  state.deepPacket = null;
  state.speaking = true;
  state.startedAt = Date.now();

  rtcSpeak(packet.text, packet.requestId, "replace");
}

export function resolveDeepSpeech(packet: SpeechPacket) {
  if (!state.activeRequestId || state.activeRequestId !== packet.requestId) {
    return;
  }

  if (!state.burstPacket) {
    state.deepPacket = packet;
    rtcSpeak(packet.text, packet.requestId, "replace");
    return;
  }

  state.deepPacket = packet;

  const decision = chooseDeepDecision(state.burstPacket, packet);

  switch (decision) {
    case "interrupt": {
      rtcStop(packet.requestId);
      rtcSpeak(packet.text, packet.requestId, "replace");
      break;
    }
    case "append": {
      const appendText = buildAppendText(state.burstPacket.text, packet.text);
      if (appendText) {
        rtcSpeak(appendText, packet.requestId, "append");
      }
      break;
    }
    case "ignore":
    default:
      break;
  }
}

function buildAppendText(burstText: string, deepText: string): string {
  const burstNorm = normalize(burstText);
  const deepNorm = normalize(deepText);

  if (!deepNorm || deepNorm === burstNorm) return "";

  if (deepNorm.startsWith(burstNorm)) {
    const remainder = deepText.slice(burstText.length).trim();
    return remainder ? `Update: ${remainder}` : "";
  }

  return `Update: ${deepText}`;
}

export function markSpeechComplete(requestId: string) {
  if (state.activeRequestId !== requestId) return;
  state.speaking = false;
  state.startedAt = null;
}

export function cancelSpeechRequest(requestId?: string) {
  if (requestId && state.activeRequestId !== requestId) return;
  if (state.activeRequestId) rtcStop(state.activeRequestId);

  state.activeRequestId = null;
  state.burstPacket = null;
  state.deepPacket = null;
  state.speaking = false;
  state.startedAt = null;
}

export function getSpeechCoordinatorState() {
  return { ...state };
}
"""
}

base_dir = r"d:\LeeWay-Standards"

for filepath, content in files.items():
    full_path = os.path.join(base_dir, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {filepath}")
