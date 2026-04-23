/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards

REGION: UI.COMPONENT.MEMORY
TAG: UI.COMPONENT.MEMORY.LAKE

COLOR_ONION_HEX:
NEON=#7B00FF
FLUO=#9C27B0
PASTEL=#E1BEE7

ICON_ASCII:
family=lucide
glyph=archive

5WH:
WHAT = Memory Lake — full-featured UI for storing, browsing, and exporting Agent Lee's memory
WHY = Gives users complete visibility and control over Agent Lee's persistent memory state
WHO = Agent Lee OS
WHERE = components/MemoryLake.tsx
WHEN = 2026
HOW = React component with IndexedDB CRUD, JSZip export, and search/filter capabilities

AGENTS:
ASSESS
ALIGN
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ShieldAlert, Database, Archive, Folder, FileText, Mic, Globe, RefreshCw, Code, Download, Zap, Settings, FileType, MessageSquare } from 'lucide-react';
import JSZip from 'jszip';

import PalliumVisuals from './PalliumVisuals';
import { cn } from '../lib/utils';
import { DriveId, DRIVE_COLORS, NeuralFile, FileCategory } from '../types/memory';

export const CATEGORY_ICONS: Record<FileCategory, any> = {
  doc: FileText,
  code: Code,
  media: Globe,
  pdf: FileType,
  audio: Mic,
  sys: Database,
  data: Folder,
};

const Pallium = ({ onClose }: { onClose?: () => void }) => {
  console.log('MemoryLake component rendering...');
  useEffect(() => {
    console.log('MemoryLake component mounted');
  }, []);
  const [activeDrive, setActiveDrive] = useState<DriveId>("LEE");
  const [activeDatabase, setActiveDatabase] = useState<string>("Neural Core");
  const [explorerConfig, setExplorerConfig] = useState<{ driveId?: DriveId, driveIds?: DriveId[], slotId?: number, cellId?: number } | null>(null);
  const [allFiles, setAllFiles] = useState<NeuralFile[]>([]);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'agent', content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<NeuralFile | null>(null);
  const [botActivity, setBotActivity] = useState<{ id: number, driveId: DriveId, fileName: string } | null>(null);

  // Minimal stub: no neuralDB, just keep allFiles as local state
  const refreshFiles = useCallback(() => {}, []);

  useEffect(() => {
    // Mock initial files
    const mockFiles: NeuralFile[] = [
      {
        id: 'pallium-file',
        driveId: 'LEE',
        slotId: 1,
        cellId: 1,
        name: 'Pallium.tsx',
        path: '/src/components/Pallium.tsx',
        extension: 'tsx',
        sizeBytes: 25600,
        content: `/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI.COMPONENT.MEMORY
TAG: UI.COMPONENT.MEMORY.LAKE

COLOR_ONION_HEX:
NEON=#7B00FF
FLUO=#9C27B0
PASTEL=#E1BEE7

ICON_ASCII:
family=lucide
glyph=archive

5WH:
WHAT = Memory Lake — full-featured UI for storing, browsing, and exporting Agent Lee's memory
WHY = Gives users complete visibility and control over Agent Lee's persistent memory state
WHO = Agent Lee OS
WHERE = components/MemoryLake.tsx
WHEN = 2026
HOW = React component with IndexedDB CRUD, JSZip export, and search/filter capabilities

AGENTS:
ASSESS
ALIGN
*/


import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ShieldAlert, Database, Archive, Folder, FileText, Mic, Globe, RefreshCw, Code, Download, Zap, Settings, FileType, MessageSquare } from 'lucide-react';
import JSZip from 'jszip';


import PalliumVisuals from './PalliumVisuals';
import { cn } from '../lib/utils';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Stars, OrbitControls } from '@react-three/drei';

// ... (Full Component Implementation)
`,
        category: 'code',
        status: 'active',
        lastModified: Date.now(),
        signature: 'pallium_sig',
        annotations: [],
        origin: 'user',
        createdBy: 'AgentLee',
        lastHandledBy: 'AgentLee',
        healthStatus: 'healthy',
        securityStatus: 'secure',
        history: [{ action: 'Created', actor: 'AgentLee', timestamp: Date.now() }],
        purpose: 'Neural Interface Component',
        locked: false
      }
    ];
    setAllFiles(mockFiles);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversionStatus('File upload not available (neuralDB missing).');
    setTimeout(() => setConversionStatus(null), 2000);
  };

  const handleAgentAction = async () => {
    setChatMessages(prev => [...prev, { role: 'agent', content: 'Agent actions unavailable (neuralDB missing).' }]);
  };

  const handleSaveEdit = async () => {
    setConversionStatus('Save unavailable (neuralDB missing).');
    setTimeout(() => setConversionStatus(null), 2000);
  };

  const handleTransferFile = async () => {
    setConversionStatus('Transfer unavailable (neuralDB missing).');
    setTimeout(() => setConversionStatus(null), 2000);
  };

  const terminals = [
    { pos: [-6, 0, -2], color: DRIVE_COLORS["L"], label: "L", subLabel: "LOGIC" },
    { pos: [-2, 0, -6], color: DRIVE_COLORS["E"], label: "E", subLabel: "ENGINE" },
    { pos: [3, 0, -6], color: DRIVE_COLORS["O"], label: "O", subLabel: "OBJECT" },
    { pos: [6, 0, -2], color: DRIVE_COLORS["N"], label: "N", subLabel: "MEDIA" },
    { pos: [6, 0, 3], color: DRIVE_COLORS["A"], label: "A", subLabel: "AUDIO" },
    { pos: [2, 0, 6], color: DRIVE_COLORS["R"], label: "R", subLabel: "RESEARCH" },
    { pos: [-3, 0, 6], color: DRIVE_COLORS["D"], label: "D", subLabel: "DATA" },
    { pos: [-6, 0, 3], color: DRIVE_COLORS["LEE"], label: "LEE", subLabel: "CORE" },
  ];

  return (
    <div className="fixed inset-0 z-[1000] w-full h-screen bg-[#020204] overflow-hidden font-sans text-slate-200">
      {/* 3D Visuals */}
      <Suspense fallback={<div className="absolute inset-0 z-0 flex items-center justify-center text-cyan-400">Loading 3D Visuals...</div>}>
        <PalliumVisuals memoryData={allFiles} />
      </Suspense>

      {/* Header UI */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-4 text-white">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 pointer-events-auto cursor-pointer" onClick={() => setIsCommandCenterOpen(!isCommandCenterOpen)}>
              <Menu className={cn("w-6 h-6 transition-colors", isCommandCenterOpen ? "text-cyan-400" : "text-white")} />
            </div>
            MEMORY LAKE
          </h1>
          <p className="text-[8px] font-mono opacity-40 tracking-[0.4em] uppercase mt-1 ml-1">Neural Interface v4.0</p>
        </motion.div>
      </div>

      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[1001] p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all backdrop-blur-xl"
        >
          <X size={24} />
        </button>
      )}

      {/* Bot Activity Status */}
      <div className="absolute top-8 right-24 z-10">
        <AnimatePresence>
          {botActivity && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl backdrop-blur-xl"
            >
              <Shield className="text-cyan-400 w-4 h-4 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest font-black">Security Bot Active</span>
                <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{botActivity.fileName}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unified Side Panel */}
      <AnimatePresence>
        {isCommandCenterOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0c10]/95 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">Neural Core</h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">System Control Panel</p>
              </div>
              <button onClick={() => setIsCommandCenterOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <section>
                <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4">Neural Sectors</h3>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(DRIVE_COLORS) as DriveId[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setActiveDrive(d)}
                      className={cn(
                        "h-12 rounded-xl border transition-all flex flex-col items-center justify-center gap-1",
                        activeDrive === d 
                          ? "bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                          : "bg-black/40 border-white/5 opacity-40 hover:opacity-100"
                      )}
                      style={{ 
                        color: DRIVE_COLORS[d], 
                        borderColor: activeDrive === d ? DRIVE_COLORS[d] : undefined,
                        boxShadow: activeDrive === d ? `0 0 15px ${DRIVE_COLORS[d]}33` : undefined
                      }}
                    >
                      <span className="text-[10px] font-black">{d}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Sector</span>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: DRIVE_COLORS[activeDrive] }} />
                  </div>
                  <div className="text-2xl font-black uppercase tracking-tight mb-1" style={{ color: DRIVE_COLORS[activeDrive] }}>
                    {activeDrive} DRIVE
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase opacity-60">
                    {terminals.find(t => t.label === activeDrive)?.subLabel} MODULE
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((allFiles.filter(f => f.driveId === activeDrive).length / 64) * 100, 100)}%` }}
                        className="h-full"
                        style={{ backgroundColor: DRIVE_COLORS[activeDrive] }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase">
                      <span>Capacity</span>
                      <span>{allFiles.filter(f => f.driveId === activeDrive).length} / 64 Nodes</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <button 
                      onClick={() => setExplorerConfig({ driveId: activeDrive })}
                      className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Explore
                    </button>
                    <label className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-center cursor-pointer">
                      Upload
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4">Database Connection</h3>
                <div className="flex gap-2">
                  {["Neural Core", "External Archive", "Web Cache"].map(db => (
                    <button 
                      key={db}
                      onClick={() => setActiveDatabase(db)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                        activeDatabase === db ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                      )}
                    >
                      {db}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-3 transition-all group" disabled>
                    <Globe className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Web DB</span>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-3 transition-all group" disabled>
                    <Shield className="w-3 h-3 text-slate-400 group-hover:text-emerald-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Scan</span>
                  </button>
                </div>
              </section>

              <section className="flex flex-col h-[400px]">
                <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4">Agent Lee Assistant</h3>
                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 overflow-y-auto space-y-4 mb-4 no-scrollbar">
                  {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                      <MessageSquare size={32} className="mb-4" />
                      <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting neural commands...</p>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                      <div className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed",
                        m.role === 'user' ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-100" : "bg-white/5 border-white/10 text-slate-300"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-500 animate-pulse">
                      <Zap size={10} />
                      THINKING...
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAgentAction()}
                    placeholder="Ask Agent Lee..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-cyan-500/50 transition-all pr-12"
                  />
                  <button 
                    onClick={handleAgentAction}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 transition-colors"
                  >
                    <Zap size={16} />
                  </button>
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Neural Status</span>
                <span className="text-[10px] font-mono text-emerald-500 uppercase">Synchronized</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Settings size={14} />
                  Config
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  <RefreshCw size={14} />
                  Sync
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explorer Modal */}
      <AnimatePresence>
        {explorerConfig && (
          <FileExplorer 
            driveId={explorerConfig.driveId} 
            driveIds={explorerConfig.driveIds}
            slotId={explorerConfig.slotId} 
            cellId={explorerConfig.cellId} 
            onClose={() => setExplorerConfig(null)} 
            allFiles={allFiles}
            onEdit={setEditingFile}
            onTransfer={handleTransferFile}
          />
        )}
      </AnimatePresence>

      {/* File Editor Modal */}
      <AnimatePresence>
        {editingFile && (
          <FileEditor 
            file={editingFile} 
            onClose={() => setEditingFile(null)} 
            onSave={handleSaveEdit} 
          />
        )}
      </AnimatePresence>

      {/* Global Conversion Toast */}
      <AnimatePresence>
        {conversionStatus && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-3"
          >
            <RefreshCw size={14} className="animate-spin" />
            {conversionStatus}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        :root {
          font-family: 'Inter', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </div>
  );
};

const FileExplorer = ({ driveId, driveIds, slotId, cellId, onClose, allFiles, onEdit, onTransfer }: any) => {
  const [files, setFiles] = useState<NeuralFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let fs: NeuralFile[] = [];
    if (driveIds) {
      fs = allFiles.filter((f: any) => driveIds.includes(f.driveId) && f.healthStatus === 'corrupt');
    } else {
      fs = allFiles.filter((f: any) => f.driveId === driveId);
    }
    setFiles(fs);
    setLoading(false);
  }, [driveId, driveIds, slotId, cellId, allFiles]);

  const handleDownload = (file: NeuralFile) => {
    const blob = new Blob([file.content as string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="w-full max-w-4xl bg-[#0a0c10] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner" style={{ color: driveId ? DRIVE_COLORS[driveId as DriveId] : '#ff0000' }}>
              {driveIds ? <ShieldAlert size={32} /> : <Folder size={32} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">{driveIds ? "Quarantine Zone" : "Neural Explorer"}</h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mt-1">
                {driveIds ? `Sectors: ${driveIds.join(', ')}` : `Drive: ${driveId}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-30">
              <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Accessing Neural Sector...</span>
            </div>
          ) : files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map(f => {
                const Icon = CATEGORY_ICONS[f.category] || FileText;
                const isCorrupt = f.healthStatus === 'corrupt';

                return (
                  <div 
                    key={f.id} 
                    className={cn(
                      "relative flex flex-col gap-4 p-6 rounded-3xl transition-all group border",
                      isCorrupt 
                        ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20" 
                        : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner",
                          isCorrupt ? "bg-red-500/20 border-red-500/40" : "bg-black/50 border-white/5"
                        )} 
                        style={{ color: isCorrupt ? '#ef4444' : DRIVE_COLORS[driveId as DriveId] }}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-base font-bold truncate", isCorrupt ? "text-red-200" : "text-slate-200")}>
                          {f.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          <span>{(f.sizeBytes / 1024).toFixed(1)} KB</span>
                          <span>{f.category}</span>
                          <span className={isCorrupt ? "text-red-400 font-bold" : "text-cyan-500"}>{f.healthStatus}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownload(f)}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
              <Database size={48} className="mb-6" />
              <span className="text-[10px] font-mono tracking-widest uppercase">No data fragments found in this sector</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Total Nodes: {files.length}
          </div>
          <button onClick={onClose} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            Close Explorer
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FileEditor = ({ file, onClose, onSave }: any) => {
  const [content, setContent] = useState(file.content || "");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      <div className="w-full max-w-5xl bg-[#0a0c10] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Code size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Neural Editor</h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Editing: {file.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 p-8">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-300 focus:outline-none focus:border-amber-500/30 resize-none leading-relaxed"
          />
        </div>
        <div className="p-8 border-t border-white/5 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={() => onSave(content)} className="px-10 py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            Commit Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Pallium;
