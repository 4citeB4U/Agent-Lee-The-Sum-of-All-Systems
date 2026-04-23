/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.AGENTPANEL.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AgentPanel — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/components/AgentPanel.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Agent, Task } from '../types';
import { X, Send, Mic, Play, Terminal, CheckCircle2, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AgentPanelProps {
  agent: Agent;
  onClose: () => void;
  key?: string;
}

export default function AgentPanel({ agent, onClose }: AgentPanelProps) {
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tasks]);

  const handleTaskSubmit = (taskText: string = input) => {
    if (!taskText.trim()) return;
    
    setIsExecuting(true);
    setInput('');
    
    // Simulate multi-step execution
    const taskId = Math.random().toString(36).substr(2, 9);
    const newTask: Task = {
      id: taskId,
      agentId: agent.id,
      type: 'Assignment',
      status: 'ANALYZING',
      message: `Analyzing: "${taskText}"`,
      progress: 25
    };
    
    setTasks(prev => [...prev, newTask]);

    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'EXECUTING', message: 'Applying system changes...', progress: 60 } : t));
    }, 1500);

    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'RENDERING', message: 'Finalizing result...', progress: 90 } : t));
    }, 3000);

    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED', message: 'Task finalized and verified.', progress: 100 } : t));
      setIsExecuting(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#3b82f6', '#10b981'],
        zIndex: 1000
      });
    }, 4500);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="glass-panel fixed right-0 top-0 h-full w-full md:w-[500px] z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
          <div>
            <h2 className="font-display font-bold text-xl leading-none">{agent.name}</h2>
            <p className="text-xs uppercase tracking-widest text-white/40 mt-1">{agent.role}</p>
            <div className="flex items-center gap-2 mt-1.5 opacity-60">
              <span className="text-[9px] uppercase font-bold tracking-tighter bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">{agent.industry}</span>
              <span className="text-[9px] uppercase font-bold tracking-tighter bg-white/5 text-white/60 px-1.5 py-0.5 rounded border border-white/10">{agent.field}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hidden" ref={scrollRef}>
        {/* Intro */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-xl border-white/5 bg-white/[0.02]">
            <p className="text-sm text-white/80 leading-relaxed italic">
              "{agent.purpose}"
            </p>
          </div>
          
            <div className="flex flex-wrap gap-2">
              {[...(agent.hardSkills || []), ...(agent.softSkills || [])].map((cap, i) => (
                <span key={i} className="text-[10px] uppercase font-mono px-2 py-1 bg-white/5 rounded text-white/50 border border-white/5">
                  {cap}
                </span>
              ))}
            </div>
        </div>

        {/* Labor Contract Details */}
        {agent.contract && (
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold flex items-center gap-2">
              <Sparkles size={12} /> Employment Contract
            </h3>
            <div className="glass p-5 rounded-xl border-white/5 bg-white/[0.02] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Task Family</p>
                  <p className="text-xs font-mono text-white/70">{agent.contract.taskFamily}</p>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Shift Window</p>
                  <p className="text-xs font-mono text-white/70">{agent.contract.shiftStart} – {agent.contract.shiftEnd}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-white/20">Approved Operations</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.contract.approvedActions.map((action, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      {action}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-white/20">Authorized Terminal Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.contract.approvedTools.map((tool, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Data Residency & Retention</p>
                <p className="text-xs text-white/60 leading-relaxed italic">{agent.contract.dataPolicy}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8px] uppercase tracking-widest font-bold">
                <span className="text-white/20">Projected Employment Doctrine v1.2</span>
                <span className={agent.clockStatus === 'CLOCKED_IN' ? 'text-emerald-500' : 'text-red-500'}>
                  {agent.clockStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Task Log */}
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold flex items-center gap-2">
            <Terminal size={12} /> Execution Log
          </h3>
          
          {tasks.length === 0 && (
            <div className="text-center py-12 opacity-20 flex flex-col items-center">
              <MessageSquare size={32} className="mb-2" />
              <p className="text-xs uppercase tracking-widest">Awaiting Commands</p>
            </div>
          )}

          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-4 rounded-xl space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {task.status === 'COMPLETED' ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <Loader2 size={16} className="text-blue-400 animate-spin" />
                    )}
                    <span className={`text-xs font-mono uppercase tracking-widest ${task.status === 'COMPLETED' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {task.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/20 font-mono">TASK_{task.id.toUpperCase()}</span>
                </div>
                
                <p className="text-sm font-medium text-white/90">{task.message}</p>
                
                <div className="bg-white/5 h-1 w-full rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className={`h-full ${task.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-blue-400'}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="p-6 border-t border-white/10 bg-black/20">
        <h4 className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-bold">Suggested Actions</h4>
        <div className="flex flex-wrap gap-2">
          {agent.suggestedActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleTaskSubmit(action)}
              disabled={isExecuting}
              className="text-[11px] px-3 py-1.5 glass-card hover:bg-white/10 text-white/70 whitespace-nowrap transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-6 bg-[#050505]">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isExecuting}
            placeholder="Describe your request..."
            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 pr-12 text-sm focus:outline-none focus:border-white/30 transition-all resize-none placeholder:text-white/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTaskSubmit();
              }
            }}
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
             <button className="p-1.5 text-white/30 hover:text-white transition-colors">
              <Mic size={18} />
             </button>
             <button 
                onClick={() => handleTaskSubmit()}
                disabled={isExecuting || !input.trim()}
                className="p-1.5 text-white disabled:text-white/10 transition-colors"
              >
              <Send size={18} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
