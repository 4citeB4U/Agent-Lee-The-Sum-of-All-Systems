/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SDK.EXECUTIONLAYER.MAIN

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=file

5WH:
WHAT = ExecutionLayer module
WHY = Part of CORE region
WHO = LEEWAY Align Agent
WHERE = core\execution\ExecutionLayer.ts
WHEN = 2026
HOW = Auto-aligned by LEEWAY align-agent

AGENTS:
ASSESS
ALIGN
AUDIT

LICENSE:
MIT
*/

// core/execution/ExecutionLayer.ts
// Execution layer with reasoning stage and model routing
import { generateWithOllama, OllamaModel } from './OllamaAdapter.ts';

export type IntentType = 'conversational' | 'vision' | 'code';

export interface ReasoningRequest {
  intent: IntentType;
  prompt: string;
  context?: any;
}

export interface Proposal {
  model: OllamaModel;
  result: string;
  approved: boolean;
}

// Governance contract stub
export const GovernanceContract = {
  validate: async (proposal: Proposal) => {
    // Add real validation logic here
    return { ...proposal, approved: true };
  }
};

export async function reasoningStage(req: ReasoningRequest): Promise<Proposal> {
  let model: OllamaModel;
  if (req.intent === 'conversational') model = OllamaModel.GEMMA;
  else if (req.intent === 'vision') model = OllamaModel.QWEN_VL;
  else if (req.intent === 'code') model = OllamaModel.CODER;
  else throw new Error('Unknown intent');

  console.log(`[ExecutionLayer] Reasoning via ${model}.`);
  const response = await generateWithOllama({ model, prompt: req.prompt });
  const proposal: Proposal = { model, result: response.response, approved: false };
  const validated = await GovernanceContract.validate(proposal);
  if (validated.approved) {
    if (model === 'qwen2.5-coder:1.5b') {
      console.log('[ExecutionLayer] Reasoning via qwen2.5-coder:1.5b. Proposal approved. Updating DatabaseHub.');
    }
  }
  return validated;
}
