/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.APP.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = App — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/App.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, Component, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AGENTS } from './data';
import { Agent } from './types';
import TopBar from './components/TopBar';
import AgentGrid from './components/AgentGrid';
import AgentPanel from './components/AgentPanel';
import Onboarding from './components/Onboarding';
import AgentDeployment from './components/AgentDeployment';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  signInWithPopup, 
  leewayProvider,
  OperationType,
  handleFirestoreError,
  User
} from './firebase';
import { Layers, Users, Zap, Terminal, Plus, ArrowRight, Monitor, LogIn, LogOut, ShieldAlert } from 'lucide-react';

type AppView = 'DASHBOARD' | 'ONBOARDING' | 'DEPLOYED';

export default function App() {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState('All');
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [newlyCreatedAgent, setNewlyCreatedAgent] = useState<Agent | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  // Firestore Real-time Sync for Hired Agents
  useEffect(() => {
    if (!user) {
      setActiveAgents([]);
      return;
    }

    const path = 'agents';
    const q = query(collection(db, path), where('uid', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agents: Agent[] = [];
      snapshot.forEach((doc) => {
        agents.push(doc.data() as Agent);
      });
      setActiveAgents(agents);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });

    return unsubscribe;
  }, [user]);

  const filteredAgents = useMemo(() => {
    // Combine mock agents with real hired agents
    const all = [...AGENTS, ...activeAgents];
    // De-duplicate if necessary (id overlap)
    const unique = Array.from(new Map(all.map(a => [a.id, a])).values());
    
    if (filter === 'All') return unique;
    return unique.filter(a => a.industry === filter);
  }, [filter, activeAgents]);

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleOnboardingComplete = (agent: Agent) => {
    setNewlyCreatedAgent(agent);
    setView('DEPLOYED');
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, leewayProvider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Terminal className="w-12 h-12 text-blue-500 animate-pulse" />
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Opening App...</p>
        </div>
      </div>
    );
  }

  if (view === 'ONBOARDING') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (view === 'DEPLOYED' && newlyCreatedAgent) {
    return (
      <div className="relative">
        <AgentDeployment agent={newlyCreatedAgent} />
        <button 
          onClick={() => {
            setView('DASHBOARD');
            setNewlyCreatedAgent(null);
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-white hover:text-black transition-all group z-[100] font-bold"
        >
          Go Back <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col selection:bg-white selection:text-black font-sans">
        {/* Dynamic Background */}
        <div className="fixed inset-0 -z-10 bg-[#050505] overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
              backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <TopBar activeFilter={filter} onFilterChange={setFilter} />

        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="p-8 max-w-[1600px] mx-auto">
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                    Projected Employment Doctrine Enabled
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      <button 
                        onClick={() => setView('ONBOARDING')}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black uppercase text-xs tracking-widest rounded-xl flex items-center gap-2 hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" /> Hire an Employee
                      </button>
                      <div className="h-10 w-[1px] bg-white/10 mx-2" />
                      <div className="flex items-center gap-3 glass p-2 pr-4 rounded-xl border-white/5">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                          className="w-10 h-10 rounded-lg border border-white/10" 
                          alt={user.displayName || 'User'} 
                        />
                        <div className="hidden lg:block">
                          <p className="text-xs font-bold text-white leading-none mb-1">{user.displayName || 'Guest'}</p>
                          <button onClick={() => auth.signOut()} className="text-[10px] uppercase font-mono text-white/30 hover:text-red-400 transition-colors">Sign Out</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all"
                    >
                      <LogIn className="w-4 h-4" /> Log In with Google
                    </button>
                  )}
                </div>
              </div>

              <AgentGrid agents={filteredAgents} onSelectAgent={handleSelectAgent} />
            </div>
          </div>
        </main>

        <AnimatePresence>
          {selectedAgent && (
            <AgentPanel 
              key={selectedAgent.id} 
              agent={selectedAgent} 
              onClose={() => setSelectedAgent(null)} 
            />
          )}
        </AnimatePresence>

        <footer className="fixed bottom-0 left-0 w-full z-30 px-8 py-6 pointer-events-none">
          <div className="max-w-[1600px] mx-auto flex justify-between items-end pointer-events-auto">
             <div className="glass px-6 py-4 rounded-2xl flex items-center gap-6 backdrop-blur-3xl border-cyan-500/10">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                   <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-500">Connected</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-3">
                   <Monitor size={14} className="text-white/40" />
                   <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-mono">Saving Progress...</span>
                </div>
             </div>

             <div className="flex gap-2">
                {['CHAT', 'PLAN', 'DATA'].map(btn => (
                  <button key={btn} className="glass w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10 border-white/5 transition-all group">
                    <span className="text-[10px] font-mono font-bold text-white/40 group-hover:text-white">{btn}</span>
                  </button>
                ))}
             </div>
          </div>
        </footer>
      </div>
  );
}
