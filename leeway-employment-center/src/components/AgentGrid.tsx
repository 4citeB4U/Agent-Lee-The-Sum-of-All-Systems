/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.AGENTGRID.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AgentGrid — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/components/AgentGrid.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { motion } from 'motion/react';
import { Agent } from '../types';
import AgentCard from './AgentCard';

interface AgentGridProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

export default function AgentGrid({ agents, onSelectAgent }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 pb-32 max-w-[1600px] mx-auto overflow-y-auto h-full scrollbar-hidden">
      {agents.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AgentCard agent={agent} onSelect={onSelectAgent} />
        </motion.div>
      ))}
      
      {/* Decorative Empty Slots */}
      {[...Array(4)].map((_, i) => (
        <div key={`empty-${i}`} className="border-2 border-dashed border-white/5 rounded-2xl min-h-[280px] hidden xl:flex items-center justify-center group">
          <span className="text-[10px] uppercase tracking-widest text-white/10 group-hover:text-white/20 transition-colors">Reserved Slot // Available</span>
        </div>
      ))}
    </div>
  );
}
