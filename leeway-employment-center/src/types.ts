/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.TYPES.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = types — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/types.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type AgentStatus = 'READY' | 'ACTIVE' | 'BUSY';
export type ClockStatus = 'CLOCKED_IN' | 'CLOCKED_OUT' | 'BREAK';

export interface LaborContract {
  taskFamily: string;
  approvedActions: string[];
  approvedTools: string[];
  approvedDataZones: string[];
  shiftStart: string;
  shiftEnd: string;
  overtimeAllowed: boolean;
  dataPolicy: string;
  returnCondition: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  purpose: string;
  jobTitle: string;
  softSkills: string[];
  hardSkills: string[];
  jobTasks: string[];
  responsibilities: string[];
  assignedDuration: string;
  industry: 
    | 'Operations' 
    | 'Logistics & Distribution' 
    | 'Sales & Customer Service' 
    | 'Marketing & Outreach' 
    | 'Website & Technology' 
    | 'Records & Reporting';
  field: string;
  status: AgentStatus;
  clockStatus: ClockStatus;
  bio: string;
  suggestedActions: string[];
  can?: string[];
  cannot?: string[];
  contract: LaborContract;
}

export interface Task {
  id: string;
  agentId: string;
  type: string;
  status: 'ANALYZING' | 'EXECUTING' | 'RENDERING' | 'COMPLETED';
  message: string;
  progress: number;
}
