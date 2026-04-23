/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.PUBLIC.PAGE.HOME
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = Home — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/pages/Home.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { useLocation, useNavigate } from 'react-router-dom';

const CLR = {
    gold: 0xffad33, quantum: 0x00ccff, white: 0xffffff,
    input: 0x00ff88, accel: 0x0088ff, logic: 0xcc00ff, output: 0xffaa00,
    gpu: 0x8a00ff, synapse: 0x00ffff
};

const Home: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = ''; // Prevent duplicates

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.set(145, 110, 145);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.domElement.style.touchAction = 'none';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.pointerEvents = 'auto';
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 50;
        controls.maxDistance = 800;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI; 
        controls.target.set(0, 5, 0);
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.update();
        controls.listenToKeyEvents(window);

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 
            0.4, // strength
            0.3, // radius
            0.3  // threshold
        );
        composer.addPass(bloomPass);

        // --- 1. GALAXY & CITY TEXTURE ---
        const starGeo = new THREE.BufferGeometry();
        const starPos = [];
        for (let i = 0; i < 5000; i++) starPos.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.8, color: 0xffffff, transparent: true, opacity: 0.4 }));
        stars.userData.skipRaycast = true;
        scene.add(stars);

        function createWindowTexture() {
            const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 128, 128); ctx.fillStyle = '#fff';
            for (let y = 10; y < 120; y += 18) { for (let x = 10; x < 120; x += 14) { if (Math.random() > 0.3) ctx.fillRect(x, y, 4, 7); } }
            const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; return tex;
        }
        const winTex = createWindowTexture();

        // --- 2. BOLD LABEL HELPER ---
        function createHwLabel(text: string, color: number, x: number, y: number, z: number, size = 35) {
            const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, 1024, 256);
            ctx.strokeStyle = '#' + new THREE.Color(color).getHexString(); ctx.lineWidth = 15; ctx.strokeRect(10, 10, 1004, 236);
            ctx.font = 'bold 90px Arial Black'; ctx.textAlign = 'center'; ctx.fillStyle = 'white';
            ctx.fillText(text.toUpperCase(), 512, 145);
            const tex = new THREE.CanvasTexture(canvas);
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size / 4.1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
            mesh.position.set(x, y, z); scene.add(mesh); return mesh;
        }

        // --- 3. 3-WAY DATA HIGHWAYS ---
        const highways = new THREE.Group();
        function createHighway(pts: THREE.Vector3[], color: number) {
            const curve = new THREE.CatmullRomCurve3(pts);
            const geo = new THREE.TubeGeometry(curve, 32, 1.2, 8, false);
            highways.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.4, metalness: 1 })));
            return curve;
        }
        const bus1 = createHighway([new THREE.Vector3(-45, 1.5, -25), new THREE.Vector3(-15, 1.5, -25), new THREE.Vector3(0, 1.5, 0)], CLR.input);
        const bus2 = createHighway([new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(25, 1.5, 45), new THREE.Vector3(45, 1.5, 45)], CLR.accel);
        const bus3 = createHighway([new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(30, 1.5, -45), new THREE.Vector3(45, 1.5, -45)], CLR.output);
        scene.add(highways);

        // --- 4. HUB: LEEWAY QUANTUM CPU ---
        const hubCanvas = document.createElement('canvas'); hubCanvas.width = 512; hubCanvas.height = 512;
        const hCtx = hubCanvas.getContext('2d')!; hCtx.fillStyle = '#050505'; hCtx.fillRect(0, 0, 512, 512);
        hCtx.strokeStyle = '#' + new THREE.Color(CLR.quantum).getHexString(); hCtx.lineWidth = 20; hCtx.strokeRect(30, 30, 452, 452);
        hCtx.fillStyle = '#fff'; hCtx.textAlign = 'center'; hCtx.font = 'bold 60px Arial'; hCtx.fillText('LEEWAY', 256, 220);
        hCtx.font = 'bold 40px Arial'; hCtx.fillText('QUANTUM CPU', 256, 290);
        const hubTex = new THREE.CanvasTexture(hubCanvas);

        const hubGroup = new THREE.Group();
        const topDisc = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 4, 64),
            [new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1 }), new THREE.MeshBasicMaterial({ map: hubTex }), new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 1 })]);
        topDisc.position.y = 15; hubGroup.add(topDisc);

        for (let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(Math.cos(angle) * 13, 14, Math.sin(angle) * 13), new THREE.Vector3(Math.cos(angle) * 19, -2, Math.sin(angle) * 19), new THREE.Vector3(Math.cos(angle) * 1.5, -18, Math.sin(angle) * 1.5));
            hubGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.15, 8, false), new THREE.MeshBasicMaterial({ color: CLR.quantum, transparent: true, opacity: 0.4 })));
        }
        hubGroup.position.y = 12;
        hubGroup.userData = { clickable: true };
        scene.add(hubGroup);

        // --- 5. SYNCHRONIZED VOXEL CHIPS ---
        const syncedVoxels: THREE.Group[] = [];

        const synapse = new THREE.Group();
        for (let i = 0; i < 64; i++) {
            const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshBasicMaterial({ color: CLR.synapse }));
            m.position.set((i % 4) * 1.6 - 2.4, (Math.floor(i / 4) % 4) * 1.6 - 2.4, (Math.floor(i / 16) % 4) * 1.6 - 2.4); synapse.add(m);
        }
        synapse.position.y = 52;
        synapse.userData = { clickable: true, targetRoute: '/diagnostics' };
        scene.add(synapse); syncedVoxels.push(synapse);

        const nodeData = [
            { pos: [-35, -35], name: "JOSEPHSON JUNCTION", clr: 0xaaaaaa },
            { pos: [35, 35], name: "KLYSTRON VACUUM", clr: 0xaaaaaa },
            { pos: [35, -35], name: "VRAM BUFFER", clr: 0xaaaaaa },
            { pos: [-35, 35], name: "FPGA LOGIC GATE", clr: 0xaaaaaa }
        ];
        nodeData.forEach(n => {
            const group = new THREE.Group();
            const bMat = new THREE.MeshStandardMaterial({ color: n.clr, metalness: 1, roughness: 0.2, emissive: 0x111111, emissiveIntensity: 0.5 });
            for (let i = 0; i < 32; i++) {
                const m = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), bMat);
                m.position.set((i % 4) * 3.2 - 4.8, (Math.floor(i / 4) % 2) * 3.2 + 1, (Math.floor(i / 8) % 4) * 3.2 - 4.8);
                group.add(m);
            }
            group.position.set(n.pos[0], 5, n.pos[1]);
            group.userData = {
                clickable: true,
                targetPanel: n.name === 'VRAM BUFFER' || n.name === 'FPGA LOGIC GATE' ? 'database' : 'pallium'
            };
            scene.add(group);
            syncedVoxels.push(group);
        });

        // --- 6. GPU & CITY ---
        const gpu = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 16), new THREE.MeshStandardMaterial({ color: CLR.gpu, emissive: CLR.gpu, emissiveIntensity: 0.4, metalness: 1 }));
        gpu.position.set(35, 8, -25); gpu.rotation.y = -Math.PI / 4; scene.add(gpu);

        const floor = new THREE.Mesh(new THREE.CylinderGeometry(70, 71, 3, 80), new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 1, transparent: true, opacity: 0.5 }));
        scene.add(floor);

        const buildGeo = new THREE.BoxGeometry(1, 1, 1);
        const createSec = (c: number) => new THREE.InstancedMesh(buildGeo, new THREE.MeshStandardMaterial({ color: CLR.gold, metalness: 1, roughness: 0.1, emissive: c, emissiveMap: winTex, emissiveIntensity: 1.2 }), 2500);
        const cityMeshes = { input: createSec(CLR.input), accel: createSec(CLR.accel), logic: createSec(CLR.logic), output: createSec(CLR.output) };
        const dummy = new THREE.Object3D();
        const counts = { input: 0, accel: 0, logic: 0, output: 0 };

        for (let x = -65; x < 65; x += 2.8) {
            for (let z = -65; z < 65; z += 2.8) {
                const d = Math.sqrt(x * x + z * z);
                if (d < 25 || d > 68 || Math.abs(x) < 2.5 || Math.abs(z) < 2.5) continue;
                if (Math.abs(x - 35) < 16 && Math.abs(z + 25) < 14) continue;
                let inN = false; nodeData.forEach(n => { if (Math.abs(x - n.pos[0]) < 14 && Math.abs(z - n.pos[1]) < 14) inN = true; }); if (inN) continue;

                const h = Math.random() * 8 + 3 + (Math.random() > 0.96 ? 22 : 0);
                dummy.position.set(x, h / 2 + 2, z); dummy.scale.set(2.4, h, 2.4); dummy.updateMatrix();
                if (x < 0 && z < 0) cityMeshes.input.setMatrixAt(counts.input++, dummy.matrix);
                else if (x > 0 && z > 0) cityMeshes.accel.setMatrixAt(counts.accel++, dummy.matrix);
                else if (x < 0 && z > 0) cityMeshes.logic.setMatrixAt(counts.logic++, dummy.matrix);
                else if (x > 0 && z < 0) cityMeshes.output.setMatrixAt(counts.output++, dummy.matrix);
            }
        }
        Object.values(cityMeshes).forEach(m => scene.add(m));

        // --- 7. LABELS & BASEMENT FLOW ---
        const labels: { [key: string]: THREE.Mesh } = {
            main: createHwLabel("REGISTRY SEED 001-10,000", CLR.white, 0, 85, 0, 80),
            r1: createHwLabel("QUANTUM READOUT", CLR.input, -78, 25, -40, 55),
            r2: createHwLabel("ACCELERATOR POWER", CLR.accel, 78, 25, 40, 55),
            r3: createHwLabel("RENDERING LOGIC", CLR.logic, -40, 25, 78, 55),
            r4: createHwLabel("DISPLAY OUTPUT", CLR.output, 40, 25, -78, 55),
            gpuL: createHwLabel("GPU / QPU CLUSTER", CLR.gpu, 35, 35, -25, 28)
        };
        nodeData.forEach(n => labels[n.name] = createHwLabel(n.name, n.clr, n.pos[0], 28, n.pos[1], 25));

        const neuralMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(75, 2), new THREE.MeshBasicMaterial({ color: CLR.quantum, wireframe: true, transparent: true, opacity: 0.15 }));
        neuralMesh.scale.y = 0.15; neuralMesh.position.y = -8; scene.add(neuralMesh);

        const topF = new THREE.InstancedMesh(new THREE.SphereGeometry(1.5), new THREE.MeshBasicMaterial(), 150);
        const botF = new THREE.InstancedMesh(new THREE.SphereGeometry(0.8), new THREE.MeshBasicMaterial(), 150);
        scene.add(topF, botF);
        const tD: any[] = [], bD: any[] = [];
        for (let i = 0; i < 150; i++) {
            const r = i % 3;
            tD.push({ b: r === 0 ? bus1 : (r === 1 ? bus2 : bus3), p: Math.random(), s: 0.005 + Math.random() * 0.01, c: r === 0 ? CLR.input : (r === 1 ? CLR.accel : CLR.output) });
            bD.push({ b: new THREE.LineCurve3(new THREE.Vector3(0, -12, 0), new THREE.Vector3(nodeData[i % 4].pos[0], -12, nodeData[i % 4].pos[1])), p: Math.random(), s: 0.008 + Math.random() * 0.02, c: [CLR.input, CLR.accel, CLR.logic, CLR.output][i % 4] });
        }

        // --- CLICK INTERACTION ---
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const pointerStart = new THREE.Vector2();

        const onMouseMove = (event: PointerEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            
            const intersects = raycaster.intersectObjects(scene.children, true);
            let found = false;
            for (let i = 0; i < intersects.length; i++) {
                let obj = intersects[i].object;
                if (obj.userData.skipRaycast) continue;
                
                while(obj.parent && !obj.userData.clickable) {
                    obj = obj.parent as any;
                }
                if (obj.userData.clickable) {
                    found = true;
                    break;
                }
            }
            document.body.style.cursor = found ? 'pointer' : 'auto';
        };
        renderer.domElement.addEventListener('pointermove', onMouseMove);

        const onPointerDown = (event: PointerEvent) => {
            pointerStart.set(event.clientX, event.clientY);
        };
        const onPointerUp = (event: PointerEvent) => {
            const dist = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
            if (dist > 5) return; // Dragging, not clicking

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            for (let i = 0; i < intersects.length; i++) {
                let obj = intersects[i].object;
                if (obj.userData.skipRaycast) continue;

                while(obj.parent && !obj.userData.clickable) {
                    obj = obj.parent as any;
                }
                if (obj.userData.clickable) {
                    const targetRoute = obj.userData.targetRoute as string | undefined;
                    const targetPanel = obj.userData.targetPanel as string | undefined;

                    if (targetRoute) {
                        navigate(targetRoute);
                        break;
                    }

                    if (targetPanel) {
                        if (location.pathname === '/motherboard') {
                            navigate(`/motherboard?onboarding=0&panel=${targetPanel}`);
                        } else {
                            navigate('/diagnostics');
                        }
                        break;
                    }

                    navigate('/diagnostics');
                    break;
                }
            }
        };
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointerup', onPointerUp);

        // --- ANIMATION LOOP ---
        let lastTime = performance.now();
        function animate() {
            const now = performance.now();
            const t = now / 1000;
            
            controls.update();

            const bounce = Math.sin(t * 2) * 2.5;
            syncedVoxels.forEach((group, i) => {
                const isCenter = i === 0;
                group.position.y = (isCenter ? 52 : 6) + bounce;
                group.rotation.y = t * 0.8;
            });

            neuralMesh.rotation.y = t * 0.05;
            for (let i = 0; i < 150; i++) {
                const tObj = tD[i]; tObj.p += tObj.s; if (tObj.p > 1) tObj.p = 0; const tp = tObj.b.getPoint(tObj.p); dummy.position.copy(tp); dummy.updateMatrix(); topF.setMatrixAt(i, dummy.matrix); topF.setColorAt(i, new THREE.Color(tObj.c));
                const bObj = bD[i]; bObj.p += bObj.s; if (bObj.p > 1) bObj.p = 0; const bp = bObj.b.getPoint(bObj.p); dummy.position.copy(bp); dummy.updateMatrix(); botF.setMatrixAt(i, dummy.matrix); botF.setColorAt(i, new THREE.Color(bObj.c));
            }
            topF.instanceMatrix.needsUpdate = true; topF.instanceColor.needsUpdate = true;
            botF.instanceMatrix.needsUpdate = true; botF.instanceColor.needsUpdate = true;
            Object.values(labels).forEach(l => l.lookAt(camera.position));
            composer.render();
        }
        renderer.setAnimationLoop(animate);

        scene.add(new THREE.AmbientLight(0xffcc99, 0.2), new THREE.DirectionalLight(0xffffff, 1.2));

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('pointermove', onMouseMove);
            renderer.domElement.removeEventListener('pointerdown', onPointerDown);
            renderer.domElement.removeEventListener('pointerup', onPointerUp);
            renderer.setAnimationLoop(null);
            controls.dispose();
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [navigate, location.pathname]);

    return <div ref={containerRef} tabIndex={0} style={{ width: '100vw', height: '100vh', background: '#000', outline: 'none' }} />;
};

export default Home;
