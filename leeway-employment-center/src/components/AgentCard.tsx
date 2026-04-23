/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.AGENTCARD.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AgentCard — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/components/AgentCard.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { motion } from 'motion/react';
import { Agent } from '../types';
import { User, Cpu, Sparkles, Activity, Briefcase, Target } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
}

export default function AgentCard({ agent, onSelect }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-400';
      case 'BUSY': return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <motion.div
      layoutId={`agent-card-${agent.id}`}
      onClick={() => onSelect(agent)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        rotateX: -2,
        rotateY: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
      style={{ perspective: 1000 }}
      className="glass-card p-6 cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="w-16 h-16 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#050505] rounded-full flex items-center justify-center border border-white/10">
            <div className={`w-2 h-2 rounded-full ${agent.status === 'ACTIVE' ? 'bg-emerald-400' : agent.status === 'BUSY' ? 'bg-amber-400' : 'bg-blue-400' } animate-pulse`} />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Status</span>
          <span className={`text-xs font-mono font-medium ${getStatusColor(agent.status)}`}>
            {agent.status}
          </span>
          {agent.clockStatus && (
            <span className={`text-[8px] mt-1 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${
              agent.clockStatus === 'CLOCKED_IN' ? 'bg-emerald-500/20 text-emerald-400' :
              agent.clockStatus === 'BREAK' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {agent.clockStatus.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-display text-xl font-bold tracking-tight mb-0.5 group-hover:text-white transition-colors">
          {agent.name}
        </h3>
        <p className="text-sm font-medium text-white/60 uppercase tracking-wide flex items-center gap-1.5">
          <User size={12} className="opacity-50" />
          {agent.role}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-cyan-400 font-bold">
            <Briefcase size={10} /> {agent.industry}
          </div>
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40 font-bold border-l border-white/10 pl-3">
            <Target size={10} /> {agent.field}
          </div>
        </div>
        {agent.contract && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Task Family:</span>
            <span className="text-[10px] font-mono text-white/50">{agent.contract.taskFamily}</span>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-auto">
        {agent.contract && (
          <div className="flex justify-between items-center text-[10px] font-mono py-2 border-y border-white/5">
            <div className="flex flex-col">
              <span className="text-white/20 uppercase tracking-widest">Shift Hours</span>
              <span className="text-white/60">{agent.contract.shiftStart} – {agent.contract.shiftEnd}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white/20 uppercase tracking-widest">Overtime</span>
              <span className={agent.contract.overtimeAllowed ? 'text-emerald-400' : 'text-red-400/40'}>
                {agent.contract.overtimeAllowed ? 'AUTHORIZED' : 'LOCKED'}
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {(agent.hardSkills || []).slice(0, 3).map((cap, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 border border-white/10 rounded-full text-white/50 uppercase tracking-tighter">
              {cap}
            </span>
          ))}
          {(agent.hardSkills || []).length > 3 && (
            <span className="text-[10px] px-2 py-0.5 text-white/30 uppercase tracking-tighter">
              +{(agent.hardSkills || []).length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase font-mono text-white/40">Employment Center // {agent.id.padStart(3, '0')}</span>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles size={14} className="text-white/40" />
        </motion.div>
      </div>
    </motion.div>
  );
}
