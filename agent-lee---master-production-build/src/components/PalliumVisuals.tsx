/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.PALLIUMVISUALS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = PalliumVisuals — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/components/PalliumVisuals.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Stars, OrbitControls } from '@react-three/drei';
import { DriveId, DRIVE_COLORS, NeuralFile } from '../types/memory';

// --- 3D Modules for Terminals ---

const LogicModule = ({ color, active }: { color: string, active: boolean }) => (
  <group>
    <mesh position={[0, -0.2, 0]}>
      <boxGeometry args={[0.5, 0.05, 0.5]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {[...Array(4)].map((_, i) => (
      <mesh key={i} position={[0, -0.15, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
        <boxGeometry args={[0.01, 0.01, 0.4]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.5} />
      </mesh>
    ))}
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={1} />
    </mesh>
  </group>
);

const EngineModule = ({ color, active }: { color: string, active: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 2;
  });
  return (
    <group>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <group ref={ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.02, 8, 24]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.5} />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
};

const ObjectModule = ({ color, active }: { color: string, active: boolean }) => (
  <group>
    <mesh>
      <octahedronGeometry args={[0.3]} />
      <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={1} />
    </mesh>
    {[...Array(4)].map((_, i) => (
      <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.4, 0, Math.sin(i * Math.PI / 2) * 0.4]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.5} />
      </mesh>
    ))}
  </group>
);

const MediaModule = ({ color, active }: { color: string, active: boolean }) => (
  <group>
    <mesh position={[0, 0, -0.05]}>
      <planeGeometry args={[0.6, 0.4]} />
      <meshStandardMaterial color="#000" />
    </mesh>
    {[...Array(8)].map((_, i) => (
      <mesh key={i} position={[(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.3, 0]}>
        <planeGeometry args={[0.05, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.4} />
      </mesh>
    ))}
  </group>
);

const AudioModule = ({ color, active }: { color: string, active: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current && active) {
      ref.current.children.forEach((child: any, i) => {
        child.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 6 + i * 0.8) * 0.5;
      });
    }
  });
  return (
    <group ref={ref}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i - 2) * 0.1, 0, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.5} />
        </mesh>
      ))}
    </group>
  );
};

const ResearchModule = ({ color, active }: { color: string, active: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 1;
  });
  return (
    <group ref={ref}>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 1.0) * 0.2, i * 0.1 - 0.25, Math.sin(i * 1.0) * 0.2]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.5} />
        </mesh>
      ))}
    </group>
  );
};

const DataModule = ({ color, active }: { color: string, active: boolean }) => (
  <group>
    {[...Array(2)].map((_, i) => (
      <group key={i} position={[0, (i - 0.5) * 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.15, 0.4]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </group>
    ))}
  </group>
);

const CoreModule = ({ color, active }: { color: string, active: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
};

const SolidBeam = ({ start, end, color, active }: { start: [number, number, number], end: [number, number, number], color: string, active: boolean }) => {
  const { midPoint, distance, quaternion } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().lerpVectors(s, e, 0.5);
    const dist = s.distanceTo(e);
    const dir = new THREE.Vector3().subVectors(e, s).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { midPoint: mid, distance: dist, quaternion: quat };
  }, [start, end]);

  return (
    <mesh position={midPoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={active ? 0.8 : 0.2} 
      />
    </mesh>
  );
};

const Terminal = ({ position, color, label, subLabel, active, onClick, securityNodePos }: { position: [number, number, number], color: string, label: string, subLabel: string, active: boolean, onClick: () => void, securityNodePos: [number, number, number] }) => {
  const renderModule = () => {
    switch (label) {
      case "L": return <LogicModule color={color} active={active} />;
      case "E": return <EngineModule color={color} active={active} />;
      case "O": return <ObjectModule color={color} active={active} />;
      case "N": return <MediaModule color={color} active={active} />;
      case "A": return <AudioModule color={color} active={active} />;
      case "R": return <ResearchModule color={color} active={active} />;
      case "D": return <DataModule color={color} active={active} />;
      case "LEE": return <CoreModule color={color} active={active} />;
      default: return null;
    }
  };

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Base Pedestal */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.2]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Main Terminal Housing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.4, 1]} />
        <meshStandardMaterial 
          color={active ? "#aaa" : "#666"} 
          emissive={active ? color : "#222"} 
          emissiveIntensity={active ? 0.8 : 0.2}
          metalness={0.4} 
          roughness={0.6} 
        />
      </mesh>

      {/* Internal Module Display Area */}
      <group position={[0, 0.1, 0]}>
        {renderModule()}
      </group>

      {/* Screen Interface */}
      <mesh position={[0, 0.1, 0.51]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={active ? 0.7 : 0.3} 
        />
        <Text 
          position={[0, -0.25, 0.01]} 
          fontSize={0.07} 
          color="white" 
          maxWidth={0.8}
        >
          {subLabel} SYSTEM
        </Text>
      </mesh>

      {/* Top Identification Plate */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshBasicMaterial color={color} />
        <Text position={[0, 0, 0.06]} fontSize={0.12} color="white" fontWeight="900">
          {label}
        </Text>
      </mesh>

      {/* Connection Beam to Security Node */}
      <SolidBeam 
        start={[0, 0, 0]} 
        end={[securityNodePos[0] - position[0], securityNodePos[1] - position[1], securityNodePos[2] - position[2]]} 
        color={color} 
        active={active} 
      />

      {/* Ground Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1], 0]}>
        <ringGeometry args={[1.5, 1.6, 64]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.1} />
      </mesh>
    </group>
  );
};

const SecurityNode = ({ position, corruptFiles, onClick }: { position: [number, number, number], corruptFiles: NeuralFile[], onClick: () => void }) => {
  const cubePositions: [number, number, number][] = [
    [0.25, 0.25, 0],
    [-0.25, 0.25, 0],
    [0.25, -0.25, 0],
    [-0.25, -0.25, 0]
  ];

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {cubePositions.map((pos, idx) => {
        const isQuarantine = (idx === 0 && corruptFiles.length > 0) || (idx === 1 && corruptFiles.length > 10);
        
        return (
          <group key={idx} position={pos}>
            <mesh>
              <boxGeometry args={[0.45, 0.45, 0.45]} />
              <meshBasicMaterial color="#0088ff" wireframe transparent opacity={0.3} />
            </mesh>
            {isQuarantine && (
              <mesh>
                <boxGeometry args={[0.4, 0.4, 0.4]} />
                <meshStandardMaterial 
                  color="#ff0000" 
                  emissive="#ff0000" 
                  emissiveIntensity={2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        );
      })}
      <pointLight color={corruptFiles.length > 0 ? "#ff0000" : "#0088ff"} intensity={1} distance={2} />
      <SolidBeam start={[0, 0, 0]} end={[-position[0], -position[1], -position[2]]} color="#0088ff" active={true} />
    </group>
  );
};

const DataPacket = ({ start, end, color, onComplete, speed = 1500 }: { start: THREE.Vector3, end: THREE.Vector3, color: string, onComplete: () => void, speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useMemo(() => Date.now(), []);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / speed, 1);
    
    const pos = new THREE.Vector3().lerpVectors(start, end, progress);
    meshRef.current.position.copy(pos);
    
    const s = 1 + Math.sin(progress * Math.PI) * 0.5;
    meshRef.current.scale.setScalar(s * 0.1);
    
    if (progress >= 1) onComplete();
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const SecurityAgent = ({ start, end, onComplete }: { start: THREE.Vector3, end: THREE.Vector3, onComplete: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useMemo(() => Date.now(), []);
  const duration = 3000;

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const pos = new THREE.Vector3().lerpVectors(start, end, progress);
    const angle = progress * Math.PI * 4;
    const radius = Math.sin(progress * Math.PI) * 2;
    pos.x += Math.cos(angle) * radius;
    pos.z += Math.sin(angle) * radius;
    
    meshRef.current.position.copy(pos);
    meshRef.current.rotation.y += 0.1;
    
    if (progress >= 1) onComplete();
  });

  return (
    <group ref={meshRef as any}>
        <mesh>
            <octahedronGeometry args={[0.15]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} transparent opacity={0.8} />
        </mesh>
        <pointLight color="#00ffff" intensity={0.5} distance={2} />
    </group>
  );
};

const DataFlowManager = ({ terminals, activeDrive, activeFileLinks, securityNodes }: any) => {
  const [packets, setPackets] = React.useState<{ id: number, start: THREE.Vector3, end: THREE.Vector3, color: string, type: 'standard' | 'agent' }[]>([]);
  const nextId = useRef(0);
  
  const getSecurityNodeForDrive = (driveLabel: string) => {
    return securityNodes.find((n: any) => n.drives.includes(driveLabel))?.pos || [0,0,0];
  };

  React.useEffect(() => {
    if (!activeDrive) return;

    const startTerminal = terminals.find((t: any) => t.label === activeDrive);
    if (!startTerminal) return;

    const startPos = new THREE.Vector3(...startTerminal.pos);
    const corePos = new THREE.Vector3(0, 0, 0);
    const securityNodePos = new THREE.Vector3(...getSecurityNodeForDrive(activeDrive));

    const burstCount = 5;
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            setPackets(prev => [
                ...prev,
                {
                    id: nextId.current++,
                    start: startPos,
                    end: securityNodePos,
                    color: startTerminal.color,
                    type: 'standard'
                }
            ]);
            
            setTimeout(() => {
                setPackets(prev => [
                    ...prev,
                    {
                        id: nextId.current++,
                        start: securityNodePos,
                        end: corePos,
                        color: startTerminal.color,
                        type: 'standard'
                    }
                ]);
            }, 800);
        }, i * 300);
    }

    if (activeFileLinks.length > 0) {
        activeFileLinks.forEach((link: any, idx: number) => {
            const targetTerminal = terminals.find((t: any) => t.label === link.driveId);
            if (targetTerminal) {
                const targetPos = new THREE.Vector3(...targetTerminal.pos);
                setTimeout(() => {
                    setPackets(prev => [
                        ...prev,
                        {
                            id: nextId.current++,
                            start: corePos,
                            end: targetPos,
                            color: targetTerminal.color,
                            type: 'standard'
                        }
                    ]);
                }, 2000 + idx * 300);
            }
        });
    }
  }, [activeDrive, activeFileLinks, terminals, securityNodes]);

  useFrame((state, delta) => {
    if (Math.floor(state.clock.elapsedTime * 1.0) > Math.floor((state.clock.elapsedTime - delta) * 1.0)) {
      const type = Math.random();
      if (type < 0.8) {
        const terminal = terminals[Math.floor(Math.random() * terminals.length)];
        const securityNodePos = new THREE.Vector3(...getSecurityNodeForDrive(terminal.label));
        const terminalPos = new THREE.Vector3(...terminal.pos);

        setPackets(prev => [
          ...prev.slice(-40),
          {
            id: nextId.current++,
            start: terminalPos,
            end: securityNodePos,
            color: terminal.color,
            type: 'standard'
          }
        ]);
      }
    }
  });

  const removePacket = (id: number) => setPackets(prev => prev.filter(p => p.id !== id));

  return (
    <group>
      {packets.map(p => (
        p.type === 'agent' ? (
            <SecurityAgent key={p.id} start={p.start} end={p.end} onComplete={() => removePacket(p.id)} />
        ) : (
            <DataPacket key={p.id} start={p.start} end={p.end} color={p.color} onComplete={() => removePacket(p.id)} />
        )
      ))}
    </group>
  );
};

const CoreCube = ({ activeDrive, onCellClick, allFiles }: { activeDrive: DriveId, onCellClick: any, allFiles: NeuralFile[] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cubes = useMemo(() => {
    const arr = [];
    for (let slotId = 0; slotId < 8; slotId++) {
      for (let cellId = 0; cellId < 8; cellId++) {
        arr.push({ slotId, cellId, pos: [slotId - 3.5, 0, cellId - 3.5] });
      }
    }
    return arr;
  }, []);
  const driveColor = DRIVE_COLORS[activeDrive];

  const cellOccupancy = useMemo(() => {
    const map = new Map<string, number>();
    allFiles.filter(f => f.driveId === activeDrive).forEach(f => {
      const key = `${f.slotId}-${f.cellId}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [allFiles, activeDrive]);

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => {
        const hasFiles = cellOccupancy.has(`${cube.slotId}-${cube.cellId}`);
        const fileCount = cellOccupancy.get(`${cube.slotId}-${cube.cellId}`) || 0;
        
        return (
          <mesh 
            key={i} 
            position={cube.pos as [number, number, number]}
            onClick={(e) => {
              e.stopPropagation();
              onCellClick(cube.slotId, cube.cellId);
            }}
          >
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial 
              color={hasFiles ? driveColor : "#777"} 
              emissive={hasFiles ? driveColor : "#333"} 
              emissiveIntensity={hasFiles ? 2.0 + Math.min(fileCount * 0.5, 5) : 0.5} 
              transparent
              opacity={0.95}
            />
            <mesh>
              <boxGeometry args={[0.36, 0.36, 0.36]} />
              <meshBasicMaterial color={driveColor} wireframe transparent opacity={hasFiles ? 0.3 : 0.05} />
            </mesh>
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 15, 32]} />
        <meshBasicMaterial color={driveColor} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const Scene = ({ activeDrive, setActiveDrive, onCellClick, allFiles, terminals }: any) => {
  const securityNodes = useMemo(() => [
    { pos: [-3.5, 0, -3.5], drives: ["L", "E"] },
    { pos: [3.5, 0, -3.5], drives: ["O", "N"] },
    { pos: [3.5, 0, 3.5], drives: ["A", "R"] },
    { pos: [-3.5, 0, 3.5], drives: ["D", "LEE"] },
  ], []);

  const activeFileLinks = useMemo(() => {
    const links: { driveId: DriveId }[] = [];
    allFiles.filter((f: any) => f.driveId === activeDrive).forEach((f: any) => {
      if (f.links) links.push(...f.links);
    });
    return links;
  }, [allFiles, activeDrive]);

  return (
    <>
      <color attach="background" args={["#020204"]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <CoreCube activeDrive={activeDrive} onCellClick={onCellClick} allFiles={allFiles} />
      <DataFlowManager 
        terminals={terminals} 
        activeDrive={activeDrive} 
        activeFileLinks={activeFileLinks} 
        securityNodes={securityNodes}
      />
      
      {securityNodes.map((n, i) => (
        <SecurityNode 
          key={i} 
          position={n.pos as [number, number, number]} 
          corruptFiles={allFiles.filter((f: any) => f.healthStatus === 'corrupt' && n.drives.includes(f.driveId))}
          onClick={() => onCellClick(undefined, undefined, n.drives)}
        />
      ))}
      
      {terminals.map((t: any, i: number) => (
        <Terminal 
          key={i} 
          position={t.pos as [number, number, number]} 
          color={t.color} 
          label={t.label} 
          subLabel={t.subLabel} 
          active={activeDrive === t.label}
          onClick={() => setActiveDrive(t.label as DriveId)}
          securityNodePos={securityNodes.find(n => n.drives.includes(t.label))?.pos as [number, number, number]}
        />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.4} metalness={0.3} />
      </mesh>
      <gridHelper args={[100, 50, "#444", "#222"]} position={[0, -1.99, 0]} />

      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={4.0} />
      <pointLight position={[-10, -10, -10]} color="#0088ff" intensity={2.0} />
      
      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={1} 
        maxDistance={25} 
        autoRotate={!activeDrive}
        autoRotateSpeed={0.3}
      />
    </>
  );
};

const PalliumVisuals = ({ memoryData }: { memoryData: NeuralFile[] }) => {
  const [activeDrive, setActiveDrive] = React.useState<DriveId>("LEE");
  
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
    <div className="absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 45 }}>
        <Scene 
          activeDrive={activeDrive} 
          setActiveDrive={setActiveDrive} 
          onCellClick={() => {}} 
          allFiles={memoryData} 
          terminals={terminals}
        />
      </Canvas>
    </div>
  );
};

export default PalliumVisuals;
