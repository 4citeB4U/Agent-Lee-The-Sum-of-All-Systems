/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.CONSTRUCTVIEW.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ConstructView — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-construct/room-on-the-edge/src/components/ConstructView.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  Stars,
  Float,
  Billboard,
} from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { DeviceOrientationControls } from 'three-stdlib';
import { Maximize2, RotateCcw, Smartphone } from 'lucide-react';

import { NEBULA_VERTEX_SHADER, NEBULA_FRAGMENT_SHADER, GRID_VERTEX_SHADER, GRID_FRAGMENT_SHADER } from '../engine/shaders';
import { PANEL_VERTEX_SHADER, PANEL_FRAGMENT_SHADER } from '../engine/SpatialUI';

// Import Components to render inside the construct
import Pallium from './Pallium';
import DatabaseHub from './DatabaseHub';
import AgentVM from './AgentVM';
import { CommandCouncil } from './CommandCouncil';
import type { BlockedProjectionReport, ConstructGovernanceStatus } from '../governance/admissionGate';

// --- Sub-components ---

const Locomotion = ({
  controlsRef,
  enabled = true,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  enabled?: boolean;
}) => {
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!enabled) return;

    const speed = 0.11;
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();

    if (keys.current['w']) direction.add(forward);
    if (keys.current['s']) direction.sub(forward);
    if (keys.current['a']) direction.sub(right);
    if (keys.current['d']) direction.add(right);

    if (direction.lengthSq() > 0) {
      direction.normalize().multiplyScalar(speed);
      camera.position.add(direction);
      const controls = controlsRef.current;
      if (controls) {
        controls.target.add(direction);
      }
    }
  });

  return null;
};

const GyroLook = ({ enabled }: { enabled: boolean }) => {
  const { camera } = useThree();
  const controlsRef = useRef<DeviceOrientationControls | null>(null);

  useEffect(() => {
    controlsRef.current = new DeviceOrientationControls(camera);
    controlsRef.current.enabled = enabled;
    return () => {
      controlsRef.current = null;
    };
  }, [camera]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = enabled;
    }
  }, [enabled]);

  useFrame(() => {
    if (!enabled) return;
    controlsRef.current?.update();
  });

  return null;
};

const NebulaSkybox = ({ color = '#0ea5e9' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: 2.2 },
    uColor: { value: new THREE.Color(color) },
    uMap: { value: null },
    uTextureFactor: { value: 0.0 }
  }), [color]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial 
        vertexShader={NEBULA_VERTEX_SHADER}
        fragmentShader={NEBULA_FRAGMENT_SHADER}
        side={THREE.BackSide}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

const InfiniteGrid = ({ color = '#22d3ee' }) => {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[2000, 2000]} />
      <shaderMaterial 
        vertexShader={GRID_VERTEX_SHADER}
        fragmentShader={GRID_FRAGMENT_SHADER}
        transparent
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

const ConstructBoundaries = ({ color = '#00ff00', visible = true }) => {
  if (!visible) return null;

  return (
    <group position={[0, 10, 0]}>
      {/* Structural Box */}
      <mesh>
        <boxGeometry args={[20, 20, 20]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Solid Floor Plane (Grid Helper Alternative) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9.99, 0]}>
         <planeGeometry args={[20, 20]} />
         <meshBasicMaterial color={color} transparent opacity={0.05} />
      </mesh>

      {/* Lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(20, 20, 20)]} />
        <lineBasicMaterial color={color} linewidth={2} transparent opacity={1} />
      </lineSegments>

      {/* Corner Voxels */}
      {[
        [10, 10, 10], [10, 10, -10], [-10, 10, 10], [-10, 10, -10],
        [10, -10, 10], [10, -10, -10], [-10, -10, 10], [-10, -10, -10]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
};

interface ProjectionPanelProps {
  id: string;
  type: string;
  title: string;
  color: string;
  position: [number, number, number];
  scale?: number;
  detail?: number;
  canClose?: boolean;
  onClose: () => void;
  onAction: (action: string, data?: any) => void;
  onUpdateProjection: (id: string, updates: any) => void;
  governanceStatus?: ConstructGovernanceStatus;
}

const ProjectionPanel = ({
  id,
  type,
  title,
  color,
  position,
  scale,
  detail,
  canClose = true,
  onClose,
  onAction,
  onUpdateProjection,
  governanceStatus,
}: ProjectionPanelProps) => {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const width = (type === 'pallium' || type === 'database' || type === 'agentvm') ? 14 : 4;
  const height = (type === 'pallium' || type === 'database' || type === 'agentvm') ? 9 : 3;

  return (
    <group position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.35}>
          <group>
            {/* Header UI */}
            <Html
              position={[0, height / 2, 0.1]}
              center
              transform
              distanceFactor={10}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex items-center gap-4 px-6 py-2 bg-black/80 border border-white/20 rounded-full whitespace-nowrap">
                <span style={{ color }} className="font-mono text-xl font-black uppercase tracking-[0.2em]">{title}</span>
                {canClose ? (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                  </button>
                ) : (
                  <div className="px-3 py-1 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-fuchsia-300">
                    Always Visible
                  </div>
                )}
              </div>
            </Html>

            {/* Background Plane */}
            <mesh rotation={[0, 0, 0]}>
              <planeGeometry args={[width, height]} />
              <shaderMaterial
                vertexShader={PANEL_VERTEX_SHADER}
                fragmentShader={PANEL_FRAGMENT_SHADER}
                transparent
                side={THREE.DoubleSide}
                uniforms={uniforms}
              />
            </mesh>

            {/* Content Portal */}
            <Html
              transform
              distanceFactor={5}
              position={[0, -0.2, 0.05]}
              style={{
                width: `${width * 140}px`,
                height: `${(height - 1.2) * 140}px`,
                background: '#0a0a0a',
                borderRadius: '2rem',
                overflow: 'hidden',
                pointerEvents: 'auto',
                border: `2px solid ${color}`
              }}
            >
              <div className="w-full h-full relative overflow-auto custom-scrollbar bg-black">
                {type === 'pallium' && <Pallium />}
                {type === 'database' && <DatabaseHub />}
                {type === 'agentvm' && <AgentVM governanceStatus={governanceStatus} />}

                {(type === 'asset' || type === 'foundry') && (
                  <div className="p-8 text-white space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color }}>{title}</h2>
                    <div className="space-y-4">
                      <label className="block text-xs uppercase tracking-[0.25em] text-white/60">Scale Influence</label>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={scale ?? 0.5}
                        onChange={(e) => onUpdateProjection(id, { scale: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs uppercase tracking-[0.25em] text-white/60">Form Detail</label>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={detail ?? 0.8}
                        onChange={(e) => onUpdateProjection(id, { detail: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={() => onAction('extrude', { projectionId: id })}
                      className="px-6 py-3 bg-cyan-400 text-black rounded-xl font-bold uppercase text-xs tracking-[0.2em]"
                    >
                      Extrude Mesh
                    </button>
                  </div>
                )}

                {!(type === 'pallium' || type === 'database' || type === 'agentvm' || type === 'asset' || type === 'foundry') && (
                  <div className="p-12 text-white">
                    <h2 className="text-4xl font-black mb-6 uppercase italic tracking-tighter" style={{ color }}>{title}</h2>
                    <div className="h-px w-full bg-white/10 mb-6" />
                    <p className="opacity-40 uppercase text-xs tracking-[0.5em] font-mono">Quantum Node Session Established</p>
                  </div>
                )}
              </div>
            </Html>
          </group>
        </Float>
      </Billboard>
    </group>
  );
};

// --- Main View ---

interface ConstructViewProps {
  template: any;
  projections: any[];
  assetMesh: THREE.Group | null;
  onCloseProjection: (id: string) => void;
  onUpdateProjection: (id: string, updates: any) => void;
  onAction: (action: string, data?: any) => void;
  onImmersiveChange?: (isImmersive: boolean) => void;
  governanceStatus?: ConstructGovernanceStatus;
  blockedProjections?: BlockedProjectionReport[];
}

export const ConstructView: React.FC<ConstructViewProps> = ({
  template,
  projections,
  assetMesh,
  onCloseProjection,
  onUpdateProjection,
  onAction,
  onImmersiveChange,
  governanceStatus,
  blockedProjections = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<OrbitControlsImpl | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isImmersive, setIsImmersive] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsImmersive(active || gyroEnabled);
      onImmersiveChange?.(active || gyroEnabled);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [gyroEnabled, onImmersiveChange]);

  useEffect(() => {
    const handleResetView = () => {
      const camera = cameraRef.current;
      const controls = orbitRef.current;
      if (!camera || !controls) return;
      camera.position.set(0, 1.6, 5);
      controls.target.set(0, 1.6, 0);
      controls.update();
    };

    window.addEventListener('construct:reset-view', handleResetView as EventListener);
    return () => window.removeEventListener('construct:reset-view', handleResetView as EventListener);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const toggleMotion = async () => {
    const next = !gyroEnabled;
    if (next && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === 'function') {
        const permission = await requestPermission.call(DeviceOrientationEvent);
        if (permission !== 'granted') return;
      }
    }
    setGyroEnabled(next);
    const immersive = next || Boolean(document.fullscreenElement);
    setIsImmersive(immersive);
    onImmersiveChange?.(immersive);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black select-none z-0">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true, stencil: false }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
        }}
      >
        <OrbitControls
          ref={orbitRef as any}
          enableDamping
          dampingFactor={0.05}
          target={[0, 1.6, 0]}
          enabled={!gyroEnabled}
          makeDefault
        />

        <ambientLight intensity={1.5} />
        <pointLight position={[0, 10, 0]} intensity={4} color="#00ff00" />

        <Suspense fallback={<Html center className="text-white font-mono uppercase tracking-[1em]">Constructing Environment...</Html>}>
          <Locomotion controlsRef={orbitRef} enabled={!gyroEnabled} />
          <GyroLook enabled={gyroEnabled} />
          
          {/* CELESTIAL ELEMENTS */}
          <NebulaSkybox color={template?.skyboxColor || '#0ea5e9'} />
          <Stars radius={200} depth={50} count={8000} factor={4} saturation={0} fade speed={2} />
          
          {/* STRUCTURAL ELEMENTS */}
          <InfiniteGrid color={template?.gridColor || '#22d3ee'} />
          <ConstructBoundaries color="#00ff00" visible={!template?.environmentTexture} />

          {/* 3D HUD COUNCIL */}
          <group position={[0, 1.0, 2.5]}>
             <Html
                transform
                distanceFactor={1.8}
                position={[0, 0, 0]}
                rotation={[-Math.PI / 10, 0, 0]}
                style={{ pointerEvents: 'auto' }}
             >
                <div className="scale-75 origin-bottom bg-black/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                  <CommandCouncil
                     activeNodes={projections
                       .filter((p) => p.status === 'open' && (p.type === 'pallium' || p.type === 'database' || p.type === 'agentvm'))
                       .map((p) => p.type)}
                     onToggleNode={(nodeId) => window.dispatchEvent(new CustomEvent('toggle_node', { detail: nodeId }))}
                     isImmersive={isImmersive}
                    governanceStatus={governanceStatus}
                  />
                </div>
             </Html>
          </group>

          {/* PROJECTION MATRICES */}
          {projections.map((proj, i) => {
            if (proj.status !== 'open') return null;
            const fallbackPosition: [number, number, number] = [
              (i % 2 === 0 ? 4 : -4),
              1.8,
              -4 - (Math.floor(i / 2) * 1.75),
            ];
            const panelPosition: [number, number, number] = proj.position
              ? [proj.position.x, proj.position.y, proj.position.z]
              : fallbackPosition;

            return (
              <ProjectionPanel
                key={proj.id}
                id={proj.id}
                type={proj.type}
                title={proj.title}
                color={proj.color || '#00ffcc'}
                position={panelPosition}
                scale={proj.scale}
                detail={proj.detail}
                canClose={proj.type !== 'agentvm'}
                onClose={() => onCloseProjection(proj.id)}
                onAction={onAction}
                onUpdateProjection={onUpdateProjection}
                governanceStatus={governanceStatus}
              />
            );
          })}

          {assetMesh && <primitive object={assetMesh} position={[0, 0, 0]} />}
        </Suspense>
      </Canvas>

      {/* FIXED UI OVERLAY (Guaranteed Visibility) */}
      <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between p-12">
        <div className="flex justify-between items-start">
           <div className="space-y-2">
             <div className="flex items-center gap-4">
               <div className="w-12 h-1 bg-green-500 rounded-full" />
               <h1 className="text-4xl font-sans font-black tracking-tighter text-white uppercase italic">Agent Lee OS</h1>
             </div>
             <div className="flex items-center gap-2 pl-16">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
               <span className="text-green-500 font-mono text-[10px] uppercase tracking-[0.6em]">Construct // Core: Active</span>
             </div>
           </div>

           <div className="flex gap-4 pointer-events-auto">
             <button
               onClick={() => window.dispatchEvent(new Event('construct:reset-view'))}
               className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/40"
               title="Reset View"
             >
               <RotateCcw size={18} />
             </button>
             <button
               onClick={toggleMotion}
               className={`flex items-center gap-3 px-6 py-4 rounded-full font-sans font-black uppercase text-xs transition-all ${gyroEnabled ? 'bg-cyan-400 text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
               title="Toggle Motion Controls"
             >
               <Smartphone size={16} />
               <span>{gyroEnabled ? 'Motion On' : 'Motion Off'}</span>
             </button>
             <button
               onClick={toggleFullscreen}
               className="flex items-center gap-4 px-8 py-4 bg-green-500 text-black font-sans font-black uppercase text-sm rounded-full shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all"
             >
               <Maximize2 size={18} />
               <span>{isImmersive ? 'Immersed' : 'Immerse'}</span>
             </button>
           </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="bg-black/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/5 font-mono text-[9px] uppercase tracking-[0.4em] text-white/40 space-y-2">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 bg-green-500" />
              <span>Translation: WASD</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 bg-white/20" />
              <span>Rotation: Orbit</span>
            </div>
          </div>

          {blockedProjections.length > 0 && (
            <div className="max-w-md bg-amber-500/10 backdrop-blur-2xl p-5 rounded-2xl border border-amber-500/20 font-mono text-[9px] text-amber-200 space-y-2 pointer-events-auto">
              <div className="uppercase tracking-[0.35em] text-amber-300">Runtime Gate</div>
              <div className="text-[10px] leading-relaxed text-amber-100/85">
                {blockedProjections.length} projection(s) were blocked before render.
              </div>
              <div className="space-y-2 max-h-28 overflow-y-auto custom-scrollbar">
                {blockedProjections.slice(0, 3).map((blocked) => (
                  <div key={blocked.id} className="border border-amber-500/10 rounded-xl px-3 py-2 bg-black/20">
                    <div className="uppercase tracking-[0.2em] text-[9px] text-amber-100">{blocked.title}</div>
                    <div className="normal-case tracking-normal text-[10px] text-amber-100/70 mt-1">
                      {blocked.findings[0]?.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
