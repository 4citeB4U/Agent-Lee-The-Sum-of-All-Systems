/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.AGENT_GENERATION_SERVICE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = agent-generation-service — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = services/agent-generation-service.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * LeeWay Standards — Agent Generation Service
 * 
 * **Origin:** LeeWay-Standards (this is the canonical implementation)
 * **Replaces:**
 *   - leeway-employment-center/src/services/geminiService.ts (GoogleGenAI direct)
 * 
 * **Contract:**
 * - All agents MUST be born with Standards birth certificate
 * - Every generation is logged to audit chain
 * - Agent identity is Standards-verified, not external-verified
 * - Enforces agent contract on output
 * 
 * **Consumers:**
 * - employment-center/src/components/Onboarding.tsx
 */

/**
 * Agent birth certificate — REQUIRED for all generated agents
 * This proves the agent was created under Standards authority
 */
export interface AgentBirthCertificate {
  agentId: string;
  createdAt: string;
  birthAuthority: 'LeeWay-Standards';
  generationService: 'agent-generation-service';
  parentSurvey: any;
  auditChain: Array<{
    timestamp: string;
    event: string;
    authority: string;
  }>;
}

/**
 * Standard Agent contract (enforced by Standards)
 * All generated agents MUST conform to this
 */
export interface StandardsAgent {
  id: string;
  name: string;
  jobTitle: string;
  purpose: string;
  softSkills: string[];
  hardSkills: string[];
  jobTasks: string[];
  responsibilities: string[];
  bio: string;
  suggestedActions: string[];
  clockStatus: 'CLOCKED_IN' | 'CLOCKED_OUT';
  contract: {
    taskFamily: string;
    approvedActions: string[];
    approvedTools: string[];
    approvedDataZones: string[];
    shiftStart: string;
    shiftEnd: string;
    overtimeAllowed: boolean;
    dataPolicy: string;
    returnCondition: string;
  };
  birthCertificate: AgentBirthCertificate;
}

function buildEnforcementBlockError(adapter: string): Error {
  const context = {
    layer: 'standards',
    adapter,
    timestamp: Date.now(),
  };

  const payload = {
    type: 'LEEWAY_ENFORCEMENT_BLOCK',
    message: 'External execution blocked',
    context,
  };

  const error = new Error('[LEEWAY_ENFORCEMENT] External execution blocked — not approved by Standards');
  (error as any).name = 'LEEWAY_ENFORCEMENT_BLOCK';
  (error as any).payload = payload;
  return error;
}

/**
 * Generate agent with Standards birth contract
 * 
 * Replaces: geminiService.generateAgentFromSurvey()
 * 
 * @param surveyData User requirements for agent role
 * @returns StandardsAgent with birth certificate (not raw LLM output)
 */
export async function generateAgentFromSurvey(surveyData: {
  industry: string;
  workType: string;
  duration: string;
  shift: string;
}): Promise<StandardsAgent> {
  // 0. ENFORCE EXTERNAL GATING (Hard Block by Default)
  const mode = (process.env.LEEWAY_MODE || 'LOCKED').toUpperCase();
  
  if (mode === 'LOCKED' || (mode !== 'AUDIT' && mode !== 'OPEN')) {
    throw buildEnforcementBlockError('agent-generation-service');
  }
  
  if (mode === 'AUDIT') {
    console.warn('[STANDARDS] LLM execution in AUDIT mode (allowed for validation)');
  }

  // 1. VALIDATE INPUT
  if (!surveyData || !surveyData.industry || !surveyData.workType) {
    throw new Error('[STANDARDS] Invalid survey data: missing required fields');
  }

  // 2. LOG REQUEST
  console.log('[STANDARDS] Agent generation requested:', {
    industry: surveyData.industry,
    workType: surveyData.workType,
  });

  // 3. GENERATE BIRTH CERTIFICATE
  const birthId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  const birthCertificate: AgentBirthCertificate = {
    agentId: birthId,
    createdAt: timestamp,
    birthAuthority: 'LeeWay-Standards',
    generationService: 'agent-generation-service',
    parentSurvey: surveyData,
    auditChain: [
      {
        timestamp,
        event: 'GENERATION_INITIATED',
        authority: 'LeeWay-Standards',
      },
    ],
  };

  // 4. CALL EXTERNAL LLM (temporary bridge - will route through Standards)
  // For now, create a minimal agent structure
  // In production, this would call the LLM with Standards gating
  const agent: StandardsAgent = {
    id: birthId,
    name: `Agent-${surveyData.industry.substring(0, 3).toUpperCase()}`,
    jobTitle: surveyData.workType,
    purpose: `Support for ${surveyData.industry}`,
    softSkills: ['Communication', 'Problem-solving', 'Adaptability'],
    hardSkills: [surveyData.workType],
    jobTasks: [`Execute ${surveyData.workType} tasks`],
    responsibilities: [`Manage ${surveyData.industry} operations`],
    bio: `Remote projection agent for ${surveyData.industry}`,
    suggestedActions: ['Run a status check', 'Review the new logs'],
    clockStatus: 'CLOCKED_OUT',
    contract: {
      taskFamily: surveyData.workType.toUpperCase(),
      approvedActions: [`Execute ${surveyData.workType}`],
      approvedTools: ['StandardsToolkit'],
      approvedDataZones: ['project-hub'],
      shiftStart: surveyData.shift.split(' - ')[0] || '09:00',
      shiftEnd: surveyData.shift.split(' - ')[1] || '17:00',
      overtimeAllowed: false,
      dataPolicy: 'Data remains within LeeWay project environment. No external exports.',
      returnCondition: 'When shift ends or contract expires',
    },
    birthCertificate,
  };

  // 5. ATTACH LEEWAY METADATA
  const result = {
    ...agent,
    __leeway: {
      source: 'standards',
      timestamp,
      verified: true,
      birthAuthority: 'LeeWay-Standards',
    },
  };

  // 6. LOG COMPLETION
  console.log('[STANDARDS] Agent generation complete:', {
    agentId: birthId,
    timestamp,
  });

  return result as StandardsAgent;
}

/**
 * Verify agent birth certificate
 * Used when loading agents from storage
 */
export async function verifyAgentBirthCertificate(agent: StandardsAgent): Promise<boolean> {
  // 1. VALIDATE INPUT
  if (!agent || !agent.birthCertificate) {
    console.warn('[STANDARDS] Agent birth certificate missing');
    return false;
  }

  // 2. CHECK AUTHORITY
  if (agent.birthCertificate.birthAuthority !== 'LeeWay-Standards') {
    console.error('[STANDARDS] Agent birth authority is not LeeWay-Standards:', agent.birthCertificate.birthAuthority);
    return false;
  }

  // 3. VERIFY GENERATION SERVICE
  if (agent.birthCertificate.generationService !== 'agent-generation-service') {
    console.error('[STANDARDS] Agent generation service unrecognized:', agent.birthCertificate.generationService);
    return false;
  }

  // 4. CHECK AUDIT CHAIN
  if (!agent.birthCertificate.auditChain || agent.birthCertificate.auditChain.length === 0) {
    console.error('[STANDARDS] Agent audit chain is empty');
    return false;
  }

  // 5. LOG VERIFICATION
  console.log('[STANDARDS] Agent birth certificate verified:', {
    agentId: agent.id,
    birthAuthority: agent.birthCertificate.birthAuthority,
  });

  return true;
}
