
/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards

REGION: UI.CORE.HUD
TAG: UI.CORE.HUD.COMMAND_COUNCIL

COLOR_ONION_HEX:
NEON=#00E5FF
FLUO=#22D3EE
PASTEL=#CFFAFE

ICON_ASCII:
family=lucide
glyph=layout-dashboard

5WH:
WHAT = Command Council HUD for Agent Lee OS
WHY = Centralized interface for managing Memory Lake (Pallium), Agent VM, and Database Hub
WHO = Agent Lee OS
WHERE = components/CommandCouncil.tsx
WHEN = 2026
HOW = React + Framer Motion + Lucide Icons

AGENTS:
ASSESS
ALIGN
COMMAND
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import React from 'react';
import { 
  Database, 
  Cpu, 
  Folder, 
  Settings, 
  Zap, 
  Activity, 
  Shield, 
  LayoutDashboard,
  Maximize2,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

interface CommandCouncilProps {
  onToggleNode: (node: 'pallium' | 'database' | 'agentvm') => void;
  activeNodes: string[];
  isImmersive?: boolean;
  governanceStatus?: {
    healthy: boolean;
    blockedCount: number;
    summary: string;
  };
}

export const CommandCouncil: React.FC<CommandCouncilProps> = ({ 
  onToggleNode, 
  activeNodes,
  isImmersive,
  governanceStatus,
}) => {
  const nodes = [
    { id: 'pallium', name: 'Pallium', sub: 'Memory Lake', icon: Folder, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { id: 'agentvm', name: 'Agent VM', sub: 'Always On', icon: Terminal, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', persistent: true },
    { id: 'database', name: 'Data Hub', sub: 'Synapse Store', icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  ];

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-700 pointer-events-none",
      isImmersive ? "top-1/2 -translate-y-1/2 left-8 w-16" : "bottom-12 left-1/2 -translate-x-1/2 flex items-end gap-6"
    )}>
      {/* COUNCIL BASE */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "pointer-events-auto backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 flex",
          isImmersive ? "flex-col items-center gap-6" : "items-center gap-8 bg-black/40"
        )}
      >
        {/* LOGO AREA */}
        <div className={cn("flex flex-col", isImmersive ? "items-center" : "items-start")}>
           <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mb-2">
              <Activity size={24} className="text-white/40 animate-pulse" />
           </div>
           {!isImmersive && (
             <div className="flex flex-col">
               <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Command</span>
               <span className="text-lg font-black italic text-white leading-none">COUNCIL</span>
             </div>
           )}
        </div>

        {/* NODE SELECTORS */}
        <div className={cn("flex", isImmersive ? "flex-col gap-4" : "gap-4")}>
          {nodes.map((node) => {
            const isActive = activeNodes.includes(node.id);
            const Icon = node.icon;

            return (
              <button
                key={node.id}
                onClick={() => onToggleNode(node.id as any)}
                className={cn(
                  "relative group flex items-center transition-all duration-500 rounded-3xl overflow-hidden",
                  isActive ? `${node.bg} ${node.border} ring-1 ring-white/20` : "bg-white/5 border border-white/5 hover:bg-white/10",
                  isImmersive ? "w-14 h-14 justify-center" : "px-6 py-4 gap-4 min-w-[180px]"
                )}
              >
                {/* ACTIVE GLOW */}
                {isActive && (
                  <motion.div 
                    layoutId="glow"
                    className={cn("absolute inset-0 opacity-20 blur-xl", node.bg)} 
                  />
                )}

                <div className={cn("p-2 rounded-xl transition-colors", isActive ? node.color : "text-white/20 group-hover:text-white/40")}>
                  <Icon size={isImmersive ? 28 : 22} />
                </div>

                {!isImmersive && (
                  <div className="flex flex-col items-start">
                    <span className={cn("text-[8px] font-mono uppercase tracking-widest", isActive ? node.color : "text-white/20")}>
                      {node.persistent ? 'Pinned' : isActive ? 'Active' : 'Standby'}
                    </span>
                    <span className={cn("text-sm font-bold tracking-tight", isActive ? "text-white" : "text-white/40")}>
                      {node.name}
                    </span>
                    {node.persistent && (
                      <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-fuchsia-300/80">
                        Visible Anytime
                      </span>
                    )}
                  </div>
                )}

                {/* STATUS LIGHT */}
                {!isImmersive && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* GLOBAL ACTIONS */}
        {!isImmersive && (
          <div className="h-12 w-px bg-white/10 mx-2" />
        )}

        <div className={cn("flex", isImmersive ? "flex-col gap-3" : "gap-3")}>
           <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
              <Zap size={20} className="text-white/30 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
           </button>
           <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
              <Shield size={20} className="text-white/30 group-hover:text-emerald-400" />
           </button>
        </div>

        {!isImmersive && governanceStatus && (
          <div className="ml-2 px-4 py-3 rounded-2xl border border-white/10 bg-black/30 min-w-[190px]">
            <div className="text-[8px] font-mono uppercase tracking-[0.25em] text-white/40">Admission Gate</div>
            <div className={cn("mt-1 text-xs font-bold uppercase tracking-[0.18em]", governanceStatus.healthy ? 'text-emerald-300' : 'text-amber-300')}>
              {governanceStatus.healthy ? 'Protected' : `${governanceStatus.blockedCount} Blocked`}
            </div>
            <div className="mt-1 text-[9px] font-mono text-white/45 leading-relaxed">
              {governanceStatus.summary}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
