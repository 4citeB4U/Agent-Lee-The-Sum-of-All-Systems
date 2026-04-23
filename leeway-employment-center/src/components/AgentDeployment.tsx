/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.AGENTDEPLOYMENT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AgentDeployment — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/components/AgentDeployment.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Agent } from '../types';
import { Shield, Monitor, Zap, CheckCircle2, QrCode, Cpu, UserCheck } from 'lucide-react';
import AgentVM from './AgentVM';

interface AgentDeploymentProps {
  agent: Agent;
}

export default function AgentDeployment({ agent }: AgentDeploymentProps) {
  const [showVM, setShowVM] = useState(false);

  const sessionLink = `https://leeway.app/s/${btoa(JSON.stringify({ id: agent.id, exp: agent.contract?.shiftEnd }))}`;

  if (showVM) {
    return (
      <div className="fixed inset-0 z-[60] bg-black">
        <AgentVM agent={agent} />
        <button 
          onClick={() => setShowVM(false)}
          className="fixed top-6 right-6 z-[70] px-4 py-2 bg-red-500 text-white font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-red-400 transition-all shadow-lg"
        >
          Revoke & Close Workstation
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 flex items-center justify-center font-sans tracking-tight">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">
        
        {/* Employee Card - The Projection */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-1 relative overflow-hidden group rounded-[40px]"
        >
          <div className="bg-[#0a0a0a] rounded-[38px] p-8 h-full relative z-10 border border-white/5">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-[24px] overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover grayscale" />
                </div>
                <div>
                  <h3 className="text-3xl font-black font-sans text-white mb-1 uppercase italic tracking-tighter">{agent.name}</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-cyan-400 font-black text-[10px] uppercase tracking-widest bg-cyan-400/5 px-3 py-1 rounded-full border border-cyan-400/20 inline-block w-fit">
                      {agent.role}
                    </p>
                    <p className="text-white/30 font-mono text-[9px] uppercase tracking-widest">Employee Projection // Verified</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active Contract
                </div>
                <p className="text-gray-500 text-[9px] font-mono">CODE: {agent.id.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-6">
              <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <h4 className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Bound Action Scope
                </h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase text-white/20 mb-2">Can Execute</div>
                    {(agent.can || ['Terminal Access', 'Web Interface']).map(c => (
                      <div key={c} className="text-[10px] text-white/60 flex items-center gap-2 font-medium">
                        <CheckCircle2 size={10} className="text-emerald-500" /> {c}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase text-white/20 mb-2">Requires Approval</div>
                    {(agent.cannot || ['Financials', 'Deletions']).map(c => (
                      <div key={c} className="text-[10px] text-white/40 flex items-center gap-2 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Temporal Shift</p>
                  <p className="text-white font-black text-sm italic">{agent.contract?.shiftStart} – {agent.contract?.shiftEnd}</p>
                </div>
                <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Business Lane</p>
                  <p className="text-white font-black text-xs uppercase italic truncate">{agent.field}</p>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                <p className="text-[9px] text-cyan-400/40 leading-relaxed font-mono uppercase tracking-tighter italic">
                  Projection Doctrine Enforced: Data stays in hub // No local persistence // One-way session binding // Automatic return on clock-out.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        </motion.div>

        {/* Deployment Manager */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center gap-8"
        >
          <div>
            <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Contract Active</h2>
            <p className="text-white/40 text-lg leading-tight">
              {agent.name} is now projected into your infrastructure. Use the secure workstation or link your mobile device.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-8">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                <QRCodeSVG 
                  value={sessionLink}
                  size={140}
                  level="H"
                />
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Secure Dispatch Link</div>
                  <div className="bg-black/50 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-white/40 break-all">
                    {sessionLink.substring(0, 40)}...
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                    <UserCheck className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Identity Match</span>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2">
                    <Monitor className="w-3 h-3 text-cyan-500" />
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Device Scoped</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowVM(true)}
              className="flex-1 px-8 py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-500 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <Monitor className="w-5 h-5" /> Open Secure Workstation
            </button>
            <button className="px-5 py-5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl transition-all active:scale-95">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
