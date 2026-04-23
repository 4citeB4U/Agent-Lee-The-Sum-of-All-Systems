/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.SPATIALUI.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = SpatialUI — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-construct/room-on-the-edge/src/engine/SpatialUI.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/


import * as THREE from 'three';
import { Text } from 'troika-three-text';

export const PANEL_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const PANEL_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    float border = 0.01;
    float alpha = 0.2;
    
    // Scanline effect
    float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.05 + 0.95;
    
    // Border glow
    if(vUv.x < border || vUv.x > 1.0 - border || vUv.y < border || vUv.y > 1.0 - border) {
      alpha = 0.8;
    }
    
    // Corner accents
    float cornerSize = 0.1;
    if((vUv.x < cornerSize || vUv.x > 1.0 - cornerSize) && (vUv.y < border * 2.0 || vUv.y > 1.0 - border * 2.0)) {
       alpha = 1.0;
    }

    gl_FragColor = vec4(uColor * scanline, alpha);
  }
`;

export class SpatialPanel {
  mesh: THREE.Group;
  background: THREE.Mesh;
  titleText: any;
  content: THREE.Group;

  constructor(title: string, width: number = 2.4, height: number = 1.6, color: THREE.Color) {
    this.mesh = new THREE.Group();

    // Background plane
    const geo = new THREE.PlaneGeometry(width, height);
    const mat = new THREE.ShaderMaterial({
      vertexShader: PANEL_VERTEX_SHADER,
      fragmentShader: PANEL_FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color }
      },
      side: THREE.DoubleSide
    });
    this.background = new THREE.Mesh(geo, mat);
    this.mesh.add(this.background);

    // Title Text
    this.titleText = new Text();
    this.titleText.text = title.toUpperCase();
    this.titleText.fontSize = 0.1;
    this.titleText.color = 0xffffff;
    this.titleText.font = 'https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2oW7p1TOf-yS-p7z_3E.ttf';
    this.titleText.position.set(-width / 2 + 0.05, height / 2 - 0.1, 0.01);
    this.titleText.sync();
    this.mesh.add(this.titleText);

    this.content = new THREE.Group();
    this.mesh.add(this.content);
    
    // Closer (red X)
    const closerText = new Text();
    closerText.text = 'X';
    closerText.fontSize = 0.08;
    closerText.color = 0xff0000;
    closerText.font = 'https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2oW7p1TOf-yS-p7z_3E.ttf';
    closerText.position.set(width / 2 - 0.1, height / 2 - 0.1, 0.05);
    closerText.sync();
    closerText.name = "closer_button";
    this.mesh.add(closerText);
    
    // Pointer Events Metadata
    this.mesh.userData = { type: 'panel', title: title };
  }

  addListItem(text: string, yOffset: number) {
    const item = new Text();
    item.text = text;
    item.fontSize = 0.04;
    item.color = 0xcccccc;
    item.position.set(-0.45, yOffset, 0.01);
    item.sync();
    this.content.add(item);
    return item;
  }

  update(time: number) {
    (this.background.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
  }

  addSlider(label: string, property: string, value: number, x: number, y: number, width: number = 0.8) {
    const group = new THREE.Group();
    group.position.set(x, y, 0.01);

    const labelText = new Text();
    labelText.text = `${label}: ${Math.round(value * 100)}%`;
    labelText.fontSize = 0.04;
    labelText.color = 0xffffff;
    labelText.position.set(0, 0.08, 0);
    labelText.sync();
    group.add(labelText);

    // Track
    const trackGeo = new THREE.PlaneGeometry(width, 0.02);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    group.add(track);

    // Fill
    const fillGeo = new THREE.PlaneGeometry(width * value, 0.02);
    const fillMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const fill = new THREE.Mesh(fillGeo, fillMat);
    fill.position.x = -width / 2 + (width * value) / 2;
    group.add(fill);

    // Handle (Visual Only)
    const handleGeo = new THREE.BoxGeometry(0.04, 0.08, 0.02);
    const handleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.x = -width / 2 + width * value;
    group.add(handle);

    // Hit Area
    const hitGeo = new THREE.PlaneGeometry(width, 0.15);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitArea = new THREE.Mesh(hitGeo, hitMat);
    hitArea.userData = { 
      type: 'slider', 
      property, 
      width, 
      value 
    };
    group.add(hitArea);

    this.content.add(group);
    return group;
  }

  addButton(label: string, action: string, x: number, y: number, width: number = 0.5, height: number = 0.15) {
    const group = new THREE.Group();
    group.position.set(x, y, 0.01);

    const bgGeo = new THREE.PlaneGeometry(width, height);
    const bgMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.2 
    });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.userData = { type: 'button', action };
    group.add(bg);

    const text = new Text();
    text.text = label;
    text.fontSize = 0.05;
    text.color = 0xffffff;
    text.textAlign = 'center';
    text.anchorX = 'center';
    text.anchorY = 'middle';
    text.sync();
    group.add(text);

    this.content.add(group);
    return group;
  }

  dispose() {
    this.titleText.dispose();
    this.content.children.forEach(c => {
      if ((c as any).dispose) (c as any).dispose();
    });
    this.background.geometry.dispose();
    (this.background.material as THREE.ShaderMaterial).dispose();
  }
}
