/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.MEMORY.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = memory — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/types/memory.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { LucideIcon } from 'lucide-react';

export type DriveId = "L" | "E" | "O" | "N" | "A" | "R" | "D" | "LEE";

export type FileCategory = "doc" | "code" | "media" | "pdf" | "audio" | "sys" | "data";

export interface NeuralFile {
  id: string;
  driveId: DriveId;
  slotId: number;
  cellId: number;
  name: string;
  path: string;
  extension: string;
  sizeBytes: number;
  content: string | null;
  category: FileCategory;
  status: string;
  lastModified: number;
  signature: string;
  annotations: any[];
  origin: string;
  createdBy: string;
  lastHandledBy: string;
  healthStatus: 'healthy' | 'corrupt';
  securityStatus: 'secure' | 'inspected';
  history: Array<{ action: string; actor: string; timestamp: number }>;
  purpose: string;
  locked: boolean;
  deletionDate?: number;
  links?: { driveId: DriveId }[];
}

export const DRIVE_COLORS: Record<DriveId, string> = {
  L: '#7B00FF',
  E: '#9C27B0',
  O: '#00B8D9',
  N: '#00C853',
  A: '#FFD600',
  R: '#FF3D00',
  D: '#00BFAE',
  LEE: '#00E5FF',
};
