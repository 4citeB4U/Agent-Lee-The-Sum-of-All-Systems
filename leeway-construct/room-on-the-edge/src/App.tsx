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
WHERE = leeway-construct/room-on-the-edge/src/App.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { ConstructView } from './components/ConstructView';
import { CommandCouncil } from './components/CommandCouncil';
import Pallium from './components/Pallium';
import DatabaseHub from './components/DatabaseHub';
import AgentVM from './components/AgentVM';
import { evaluateConstructAdmissions, type BlockedProjectionReport, type ConstructGovernanceStatus } from './governance/admissionGate';
import { 
  auth, 
  db, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  User,
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  query,
  where
} from './firebase';
import { analyzeAssetForConstruct } from './engine/DeterministicConstructService';
import { buildVoxelAssetFromImage } from './engine/DeterministicVoxelEngine';
import { handleFirestoreError, OperationType } from './firebase';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ProjectionData {
  id: string;
  status: 'open' | 'closed';
  type: 'pallium' | 'database' | 'agentvm' | 'foundry' | 'asset' | string;
  title: string;
  color?: string;
  position?: { x: number; y: number; z: number };
  scale?: number;
  detail?: number;
  owner?: string;
}

const CORE_PERSISTENT_NODE = 'agentvm';

const ensureCoreAgentVmProjection = async (userId: string, projections: ProjectionData[]) => {
  const existing = projections.find((projection) => projection.type === CORE_PERSISTENT_NODE);
  const basePayload = {
    type: CORE_PERSISTENT_NODE,
    title: 'AGENT VM (CORE)',
    status: 'open' as const,
    owner: userId,
    color: '#d946ef',
    position: { x: 0, y: 1.6, z: -4 },
    scale: 1,
    detail: 1,
  };

  if (!existing) {
    const id = `${userId}_${CORE_PERSISTENT_NODE}`;
    await setDoc(doc(db, 'projections', id), {
      id,
      ...basePayload,
    });
    return;
  }

  if (existing.status !== 'open') {
    await updateDoc(doc(db, 'projections', existing.id), { status: 'open' });
  }
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [projections, setProjections] = useState<ProjectionData[]>([]);
  const [assetMesh, setAssetMesh] = useState<THREE.Group | null>(null);
  const [localEnvTexture, setLocalEnvTexture] = useState<THREE.Texture | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [isImmersive, setIsImmersive] = useState(false);
  const [blockedProjections, setBlockedProjections] = useState<BlockedProjectionReport[]>([]);
  const [governanceStatus, setGovernanceStatus] = useState<ConstructGovernanceStatus>({
    healthy: true,
    blockedCount: 0,
    summary: 'Admission Gate Active',
  });

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  // Sync Construct Template
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'constructs', 'default'), (docSnap) => {
       if (docSnap.exists()) {
         setTemplate(docSnap.data());
       }
    });
    return unsub;
  }, [user]);

  // Sync Projections
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'projections'), where('owner', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ProjectionData[];
      const admission = evaluateConstructAdmissions(data);
      setBlockedProjections(admission.blocked);
      setGovernanceStatus(admission.status);
      setProjections(admission.qualified as ProjectionData[]);
      
      // Update activeNodes based on projections filter
      const currentActive = admission.qualified
        .filter(d => d.status === 'open' && (d.type === 'pallium' || d.type === 'database' || d.type === 'agentvm'))
        .map(d => d.type);
      setActiveNodes(Array.from(new Set(currentActive)));
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    void ensureCoreAgentVmProjection(user.uid, projections).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `projections/${user.uid}_${CORE_PERSISTENT_NODE}`);
    });
  }, [user, projections]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsAnalyzing(true);
    try {
      const assetResult = await buildVoxelAssetFromImage(file, 'unreal-prop');
      const config = analyzeAssetForConstruct(assetResult.buildPlan);
      
      setAssetMesh(assetResult.object3D);
      setLocalEnvTexture(assetResult.environmentTexture ?? null);
      
      // Save template
      const constructPath = 'constructs/default';
      try {
        await setDoc(doc(db, 'constructs', 'default'), {
          ...config,
          id: 'default',
          owner: user.uid,
          updatedAt: Date.now()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, constructPath);
      }

      // Initialize panels from config
      // Clear old ones first (except active nodes)
      for (const p of projections) {
         if (['pallium', 'database', 'agentvm'].includes(p.type)) continue;
         try {
           await deleteDoc(doc(db, 'projections', p.id));
         } catch (err) {
           handleFirestoreError(err, OperationType.DELETE, `projections/${p.id}`);
         }
      }

      for (const p of config.panels) {
         try {
           await setDoc(doc(db, 'projections', p.id), {
             ...p,
             status: 'open',
             owner: user.uid
           });
         } catch (err) {
           handleFirestoreError(err, OperationType.WRITE, `projections/${p.id}`);
         }
      }
    } catch (err) {
      console.error('Deterministic Analysis failed', err);
      alert('Operation failed. Check the console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateProjection = async (id: string, updates: any) => {
    try {
      await updateDoc(doc(db, 'projections', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projections/${id}`);
    }
  };

  const handleCloseProjection = (id: string) => {
    const projection = projections.find((item) => item.id === id);

    if (projection?.type === CORE_PERSISTENT_NODE) {
      return;
    }

    handleUpdateProjection(id, { status: 'closed' });
  };

  const handleToggleNode = async (nodeType: 'pallium' | 'database' | 'agentvm') => {
    if (!user) return;
    
    const existing = projections.find(p => p.type === nodeType);
    
    if (nodeType === CORE_PERSISTENT_NODE) {
      if (existing?.status !== 'open') {
        await handleUpdateProjection(existing.id, { status: 'open' });
      } else if (!existing) {
        await ensureCoreAgentVmProjection(user.uid, projections);
      }
      return;
    }

    if (existing) {
      const newStatus = existing.status === 'open' ? 'closed' : 'open';
      await handleUpdateProjection(existing.id, { status: newStatus });
    } else {
      // Create new projection for this node (Scoped to user)
      const id = `${user.uid}_${nodeType}`;
      const configs = {
        pallium: { title: 'PALLIUM (MEMORY LAKE)', color: '#22d3ee', pos: { x: -3, y: 1.6, z: -3 } },
        database: { title: 'DATABASE HUB', color: '#a855f7', pos: { x: 3, y: 1.6, z: -3 } },
        agentvm: { title: 'AGENT VM (CORE)', color: '#d946ef', pos: { x: 0, y: 1.6, z: -4 } }
      };
      
      const config = configs[nodeType];
      try {
        await setDoc(doc(db, 'projections', id), {
          id,
          type: nodeType,
          title: config.title,
          status: 'open',
          owner: user.uid,
          color: config.color,
          position: config.pos,
          scale: 1,
          detail: 1
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `projections/${id}`);
      }
    }
  };

  const handleAction = async (action: string, data?: any) => {
    console.log(`Action triggered: ${action}`, data);
    
    if (action.startsWith('toggle_')) {
       const nodeType = action.replace('toggle_', '') as 'pallium' | 'database' | 'agentvm';
       handleToggleNode(nodeType);
       return;
    }

    if (action === 'extrude') {
      alert('Asset Generation Engine: Starting deterministic extrusion process...');
    }
    
    if (action === 'openFoundry') {
      const foundryId = `foundry_${Date.now()}`;
      try {
        await setDoc(doc(db, 'projections', foundryId), {
          id: foundryId,
          title: 'ASSET FOUNDRY [ACTIVE]',
          type: 'foundry',
          status: 'open',
          owner: user?.uid,
          color: '#22d3ee',
          position: { x: 0, y: 1.6, z: -3.5 },
          scale: 0.8,
          detail: 0.9
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `projections/${foundryId}`);
      }
    }

    if (action === 'resetView') {
      window.dispatchEvent(new Event('construct:reset-view'));
    }
  };

  useEffect(() => {
    const handleToggleEvent = (e: any) => handleToggleNode(e.detail);
    window.addEventListener('toggle_node', handleToggleEvent);
    return () => window.removeEventListener('toggle_node', handleToggleEvent);
  }, [projections, user]);

  if (!user) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/40 via-black to-black">
        <div className="max-w-md w-full p-12 border border-teal-500/20 bg-black/60 backdrop-blur-3xl rounded-3xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-sans font-bold tracking-tighter text-teal-400">LeeWay Construct</h1>
            <p className="text-teal-500/60 font-mono text-sm uppercase tracking-[0.3em]">Accessing Governance Node</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-teal-500 text-black font-sans font-bold text-lg rounded-2xl hover:bg-teal-400 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(20,255,255,0.2)]"
          >
            Authorize via LeeWay Standards
          </button>
        </div>
      </div>
    );
  }

  const activeNodeItems = projections.filter(p => p.status === 'open' && (p.type === 'pallium' || p.type === 'database' || p.type === 'agentvm'));

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none relative h-full">
      <ConstructView 
        template={{ ...template, environmentTexture: localEnvTexture }} 
        projections={projections} 
        assetMesh={assetMesh}
        onCloseProjection={handleCloseProjection}
        onUpdateProjection={handleUpdateProjection}
        onAction={handleAction}
        onImmersiveChange={setIsImmersive}
        governanceStatus={governanceStatus}
        blockedProjections={blockedProjections}
      />
      
      {/* MINIMAL HUD OVERLAY */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10 pointer-events-none">
        <div className="space-y-1">
          <h1 className="text-3xl font-sans font-black tracking-tight text-white/90 uppercase italic">Agent Lee OS</h1>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px] ${governanceStatus.healthy ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'}`} />
            <p className={`font-mono text-[10px] uppercase tracking-widest whitespace-nowrap ${governanceStatus.healthy ? 'text-teal-400/80' : 'text-amber-300/90'}`}>
              Node: Construct // {governanceStatus.summary}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center pointer-events-auto">
          {/* Recovery Tools */}
          <button 
            onClick={() => handleAction('resetView')}
            className="p-2 px-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-mono text-white/60 uppercase tracking-[0.3em] transition-all"
          >
            Reset
          </button>

          {/* Upload Tooltip */}
          <div className="p-1 px-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-4">
             <label className="cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={isAnalyzing}
                />
                <span className={`text-[10px] font-mono uppercase font-bold transition-all px-4 py-1.5 rounded-full block ${isAnalyzing ? 'bg-teal-500 text-black shadow-[0_0_20px_rgba(20,255,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  {isAnalyzing ? 'INITIATING RECONSTRUCT...' : 'Upload Image'}
                </span>
             </label>
             <button 
               onClick={() => auth.signOut()}
               className="text-white/20 hover:text-white/60 transition-all font-mono text-[10px] uppercase tracking-widest border-l border-white/5 pl-4"
             >
               Exit
             </button>
          </div>
        </div>
      </div>

      {projections.filter(p => p.status === 'closed' && !['pallium', 'database', 'agentvm'].includes(p.type)).length > 0 && (
        <div className="absolute bottom-8 right-8 z-10 w-48 pointer-events-auto">
           <div className="p-3 border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl space-y-2">
             <h3 className="text-white/30 font-mono text-[8px] uppercase tracking-widest">Projection Vault</h3>
             <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                {projections.filter(p => p.status === 'closed' && !['pallium', 'database', 'agentvm'].includes(p.type)).map(p => (
                   <button 
                     key={p.id}
                     onClick={() => updateDoc(doc(db, 'projections', p.id), { status: 'open' })}
                     className="w-full px-3 py-2 bg-white/5 hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 rounded-lg text-left transition-all"
                   >
                     <p className="text-white/70 font-sans font-medium text-[10px] truncate">{p.title}</p>
                   </button>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
