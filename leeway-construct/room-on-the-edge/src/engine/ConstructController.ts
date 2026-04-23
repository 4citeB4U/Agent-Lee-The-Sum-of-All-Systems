/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.CONSTRUCTCONTROLLER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ConstructController — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-construct/room-on-the-edge/src/engine/ConstructController.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/


import * as THREE from 'three';
import { OrbitControls, DeviceOrientationControls } from 'three-stdlib';

export interface Projection {
  id: string;
  type: 'panel' | 'agent' | 'workflow';
  config: any;
  mesh?: THREE.Object3D;
}

export interface ConstructAdmissionDecision {
  qualified: boolean;
  reason?: string;
}

export class ProjectionRegistry {
  private clones: Map<string, Projection> = new Map();
  private quarantined: Map<string, string> = new Map();
  private admissionGuard?: (projection: Projection) => ConstructAdmissionDecision;

  setAdmissionGuard(guard: (projection: Projection) => ConstructAdmissionDecision) {
    this.admissionGuard = guard;
  }

  register(projection: Projection) {
    if (this.admissionGuard) {
      const decision = this.admissionGuard(projection);
      if (!decision.qualified) {
        this.quarantined.set(projection.id, decision.reason || 'Admission gate blocked projection registration.');
        return false;
      }
    }
    this.clones.set(projection.id, projection);
    this.quarantined.delete(projection.id);
    return true;
  }

  get(id: string) {
    return this.clones.get(id);
  }

  getAll() {
    return Array.from(this.clones.values());
  }

  getQuarantined() {
    return Array.from(this.quarantined.entries()).map(([id, reason]) => ({ id, reason }));
  }
}

export class ConstructController {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  registry: ProjectionRegistry;
  controls: OrbitControls;
  orientationControls?: DeviceOrientationControls;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  environmentTexture: THREE.Texture | null = null;
  worldFloor: THREE.Mesh | null = null;
  skyboxMesh: THREE.Mesh | null = null;
  gridMesh: THREE.Mesh | null = null;
  constructBoundaries: THREE.LineSegments | null = null;
  keys: { [key: string]: boolean } = {};
  onProjectionClose?: (id: string) => void;
  onProjectionUpdate?: (id: string, updates: any) => void;
  onAction?: (action: string, data?: any) => void;
  
  private _onResize: () => void;
  private _onClick: (e: MouseEvent) => void;
  private _container: HTMLElement;
  
  private static _rendererInstance: THREE.WebGLRenderer | null = null;

  constructor(container: HTMLElement) {
    this._container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Singleton Renderer to avoid "too many contexts" error
    if (!ConstructController._rendererInstance) {
      ConstructController._rendererInstance = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      });
      ConstructController._rendererInstance.xr.enabled = true;
    }
    this.renderer = ConstructController._rendererInstance;
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (this.renderer.domElement.parentNode !== container) {
      container.appendChild(this.renderer.domElement);
    }

    this.registry = new ProjectionRegistry();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.camera.position.set(0, 1.6, 3);
    
    // LIGHTING: Essential for StandardMaterials
    this.scene.background = new THREE.Color(0x000205); // Deep space base
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 10, 7);
    sunLight.castShadow = true;
    this.scene.add(sunLight);

    // Controls for single-screen view
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 100; // Increased for boundaries
    this.controls.target.set(0, 1.6, 0); // Focus on eye level
    this.controls.update();

    // Defined Construct Borders (The Cube)
    const boundaryGeo = new THREE.BoxGeometry(20, 20, 20);
    const wireframe = new THREE.WireframeGeometry(boundaryGeo);
    const lineMat = new THREE.LineBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 1.0, // MAXIMUM VISIBILITY
      depthWrite: false,
      blending: THREE.AdditiveBlending 
    });
    this.constructBoundaries = new THREE.LineSegments(wireframe, lineMat);
    this.constructBoundaries.position.set(0, 10, 0); // Center on floor
    this.scene.add(this.constructBoundaries);

    // Floor accent lines
    const floorFrameGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(20, 20));
    const floorFrameMat = new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 1.0 });
    const floorFrame = new THREE.LineSegments(floorFrameGeo, floorFrameMat);
    floorFrame.rotation.x = -Math.PI / 2;
    floorFrame.position.y = 0.05;
    this.scene.add(floorFrame);

    // TEST CUBE (Reference Point)
    const testGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const testMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const testCube = new THREE.Mesh(testGeo, testMat);
    testCube.position.set(0, 1.6, -1);
    this.scene.add(testCube);

    // Check if device orientation is available for VR motion effect
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      this.orientationControls = new DeviceOrientationControls(this.camera);
      this.orientationControls.enabled = false; // Wait for user activation
    }

    this._onResize = this.onWindowResize.bind(this);
    this._onClick = this.onClick.bind(this);

    window.addEventListener('resize', this._onResize);
    container.addEventListener('click', this._onClick);

    // Keyboard support for walking
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  onClick(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      const point = intersects[0].point;
      
      // Find projection ID in parent hierarchy
      let current: THREE.Object3D | null = target;
      let projectionId: string | null = null;
      while(current) {
        if (current.userData.id) {
          projectionId = current.userData.id;
          break;
        }
        current = current.parent;
      }

      // Handle Closer Button
      if (target.name === 'closer_button') {
         if (projectionId && this.onProjectionClose) {
           this.onProjectionClose(projectionId);
         }
         return;
      }

      // Handle Generic Buttons
      if (target.userData.type === 'button') {
        if (this.onAction) {
          this.onAction(target.userData.action, { projectionId });
        }
        return;
      }

      // Handle Sliders
      if (target.userData.type === 'slider') {
        const localPoint = target.worldToLocal(point.clone());
        const width = target.userData.width || 1;
        const newValue = Math.max(0, Math.min(1, (localPoint.x + width / 2) / width));
        
        if (projectionId && this.onProjectionUpdate) {
          this.onProjectionUpdate(projectionId, { [target.userData.property]: newValue });
        }
        return;
      }
    }
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.controls.update();
  }

  clearProjections() {
    this.registry.getAll().forEach(p => {
      if (p.mesh) {
        this.scene.remove(p.mesh);
        p.mesh.traverse((object: any) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
          if (typeof object.dispose === 'function' && object !== p.mesh) {
            object.dispose();
          }
        });
      }
    });
    this.registry = new ProjectionRegistry();
  }

  spawnProjection(projection: Projection) {
    const accepted = this.registry.register(projection);
    if (!accepted) {
      return false;
    }
    if (projection.mesh) {
      projection.mesh.userData.id = projection.id;
      this.scene.add(projection.mesh);
    }
    return true;
  }

  morphReality(envId: string) {
    console.log(`Morphing reality to: ${envId}`);
    // Logic to change skybox, lighting, floor
  }

  mergeConstructs(roomConfig: any) {
    // Logic to sync with another registry
    console.log('Merging constructs...', roomConfig);
  }

  private _assetMesh: THREE.Group | null = null;

  setAssetMesh(mesh: THREE.Group | null) {
    if (this._assetMesh) {
      this.scene.remove(this._assetMesh);
    }
    this._assetMesh = mesh;
    if (this._assetMesh) {
      this.scene.add(this._assetMesh);
      
      // KEEP ALL STRUCTURAL ELEMENTS VISIBLE AS REQUESTED
      if (this.gridMesh) this.gridMesh.visible = true; 
      if (this.worldFloor) this.worldFloor.visible = true;
      if (this.constructBoundaries) this.constructBoundaries.visible = true;
      
      // Ensure galaxy is visible
      if (this.skyboxMesh) this.skyboxMesh.visible = true;
      
      this.scene.background = null; // Use the skybox
      
      // Position camera for the 'World Reveal'
      this.camera.position.set(0, 5, 25);
      this.controls.target.set(0, 2, 0);
      this.controls.update();

      // MATERIALIZATION ANIMATION: Stagger the voxel appearance
      this._assetMesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.type !== 'button') {
          const targetY = child.position.y;
          // Start moderately high for a visible descent
          child.position.y += 15 + Math.random() * 10; 
          child.userData.targetY = targetY;
          child.userData.animating = true;
        }
      });
    } else {
      // REVERT TO ROOM
      if (this.skyboxMesh) this.skyboxMesh.visible = true;
      if (this.gridMesh) this.gridMesh.visible = true;
      if (this.constructBoundaries) this.constructBoundaries.visible = true;
      this.scene.background = null;
    }
  }

  setEnvironmentTexture(texture: THREE.Texture | null) {
    this.environmentTexture = texture;
    
    // Skip environmental floor if we are in Full Voxel Reconstruction mode
    if (this._assetMesh) {
       if (this.worldFloor) this.worldFloor.visible = false;
       return;
    }

    if (texture) {
      // Create or update world floor
      if (!this.worldFloor) {
        const floorGeo = new THREE.CircleGeometry(50, 64);
        const floorMat = new THREE.MeshBasicMaterial({ 
          map: texture, 
          transparent: true, 
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        // We only want the "ground" part of the image, let's repeat/offset or just project
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4); 
        
        this.worldFloor = new THREE.Mesh(floorGeo, floorMat);
        this.worldFloor.rotation.x = -Math.PI / 2;
        this.worldFloor.position.y = 0.01; // Slightly above grid
        this.scene.add(this.worldFloor);
        // Instructions for the user
        const instructionDiv = document.createElement('div');
        instructionDiv.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none text-white/40 font-mono text-[10px] uppercase tracking-widest bg-black/20 p-2 rounded-full backdrop-blur-sm z-50';
        instructionDiv.innerText = 'Use WASD to Walk • Drag to Look';
        document.body.appendChild(instructionDiv);
        setTimeout(() => instructionDiv.style.opacity = '0', 5000);
      } else {
        (this.worldFloor.material as THREE.MeshBasicMaterial).map = texture;
      }
      
      // Sophisticated Ground Projection: 
      // Offset the texture so the bottom portion of the image is at the center of the floor
      texture.offset.set(0, -0.2); 
      texture.repeat.set(1, 1);
    }

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry) {
        const mat = obj.material as THREE.ShaderMaterial;
        if (mat.uniforms.uMap) {
          mat.uniforms.uMap.value = texture;
          mat.uniforms.uTextureFactor.value = texture ? 1.0 : 0.0;
        }
      }
    });

    // Also update grid color to be immersive
    if (texture) {
      // Future: sample texture for average color
    }
  }

  update(time: number) {
    // Voxel Materialization Lerp
    if (this._assetMesh) {
      this._assetMesh.traverse((child) => {
        if (child.userData.animating) {
          child.position.y = THREE.MathUtils.lerp(child.position.y, child.userData.targetY, 0.05);
          if (Math.abs(child.position.y - child.userData.targetY) < 0.01) {
            child.position.y = child.userData.targetY;
            child.userData.animating = false;
          }
        }
      });
    }

    // Locomotion (Walking)
    const speed = 0.05;
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    right.crossVectors(forward, this.camera.up).normalize();

    if (this.keys['w']) direction.add(forward);
    if (this.keys['s']) direction.sub(forward);
    if (this.keys['a']) direction.sub(right);
    if (this.keys['d']) direction.add(right);

    if (direction.lengthSq() > 0) {
      direction.normalize().multiplyScalar(speed);
      this.camera.position.add(direction);
      this.controls.target.add(direction);
    }

    if (this.orientationControls && this.orientationControls.enabled) {
      this.orientationControls.update();
      // Disable orbit controls when orientation is driving the camera
      this.controls.enabled = false;
    } else {
      this.controls.update();
    }
  }

  async activateMotion() {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          if (this.orientationControls) {
            this.orientationControls.enabled = true;
            this.controls.enabled = false;
          }
        }
      } catch (e) {
        console.error('DeviceOrientation permission denied', e);
      }
    } else {
      // Normal browser (non-iOS)
      if (this.orientationControls) {
        this.orientationControls.enabled = true;
        this.controls.enabled = false;
      }
    }
  }

  deactivateMotion() {
    if (this.orientationControls) {
      this.orientationControls.enabled = false;
    }
    this.controls.enabled = true;
    this.resetCamera();
  }

  resetCamera() {
    this.camera.position.set(0, 1.6, 3);
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    if (this._container) {
      this._container.removeEventListener('click', this._onClick);
      if (this.renderer.domElement && this.renderer.domElement.parentNode === this._container) {
        this._container.removeChild(this.renderer.domElement);
      }
    }
    
    this.controls.dispose();
    
    // Stop the loop completely
    this.renderer.setAnimationLoop(null);
    
    // Do NOT dispose shared renderer singleton
    // Just clear the scene instead
    this.clearProjections();
    this.scene.clear();
  }
}
