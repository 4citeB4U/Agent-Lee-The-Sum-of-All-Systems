/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SDK.OLLAMAADAPTER.MAIN

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=file

5WH:
WHAT = OllamaAdapter module
WHY = Part of CORE region
WHO = LEEWAY Align Agent
WHERE = core\execution\OllamaAdapter.ts
WHEN = 2026
HOW = Auto-aligned by LEEWAY align-agent

AGENTS:
ASSESS
ALIGN
AUDIT

LICENSE:
MIT
*/

// core/execution/OllamaAdapter.ts
// Adapter for local Ollama LLM API

export const OllamaModel = {
  GEMMA: 'gemma4:e2b',
  QWEN_VL: 'qwen2.5vl:3b',
  CODER: 'qwen2.5-coder:1.5b'
} as const;
export type OllamaModel = typeof OllamaModel[keyof typeof OllamaModel];

export interface OllamaGenerateRequest {
  model: OllamaModel;
  prompt: string;
  stream?: boolean;
  options?: Record<string, any>;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

const OLLAMA_URL = 'http://localhost:11434/api';

export async function generateWithOllama(req: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
  const res = await fetch(`${OLLAMA_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) throw new Error(`Ollama generate failed: ${res.status}`);
  return res.json();
}

export async function healthCheckOllama(models: OllamaModel[] = ['gemma4:e2b','qwen2.5vl:3b','qwen2.5-coder:1.5b']): Promise<{running: boolean, missing: OllamaModel[]}> {
  try {
    const res = await fetch(`${OLLAMA_URL}/tags`);
    if (!res.ok) return { running: false, missing: models };
    const data = await res.json();
    const available = (data.models || []).map((m: any) => m.name);
    const missing = models.filter(m => !available.includes(m));
    return { running: true, missing };
  } catch {
    return { running: false, missing: models };
  }
}
