/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.SHADERS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = shaders — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-construct/room-on-the-edge/src/engine/shaders.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/


export const NEBULA_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const NEBULA_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform sampler2D uMap;
  uniform float uTextureFactor;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Faster 3D noise
  float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  // Smooth 3D noise for nebulae
  float smoothNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec3(1.0, 0.0, 0.0));
    float c = noise(i + vec3(0.0, 1.0, 0.0));
    float d = noise(i + vec3(1.0, 1.0, 0.0));
    float e = noise(i + vec3(0.0, 0.0, 1.0));
    float f1 = noise(i + vec3(1.0, 0.0, 1.0));
    float g = noise(i + vec3(0.0, 1.0, 1.0));
    float h = noise(i + vec3(1.0, 1.0, 1.0));
    return mix(mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
               mix(mix(e, f1, f.x), mix(g, h, f.x), f.y), f.z);
  }

  void main() {
    float time = uTime * 0.05;
    vec3 p = normalize(vPosition);
    vec3 color = vec3(0.0);

    // 1. NEBULA CLOUDS (Deep Space Backdrop)
    for(float i=1.0; i<4.0; i++) {
        float n = smoothNoise(p * (1.5 * i) + time * 0.2);
        color += uColor * pow(n, 3.0) * (2.0 / i) * uIntensity;
    }

    // 2. THE SUN (Dominant Light Source)
    vec3 sunDir = normalize(vec3(0.5, 0.4, -1.0));
    float sunDot = max(0.0, dot(p, sunDir));
    float sun = pow(sunDot, 600.0) * 40.0; // Brighter core
    float sunGlow = pow(sunDot, 8.0) * 6.0; // More radiance
    color += (vec3(1.0, 0.95, 0.9) * sun) + (uColor * sunGlow);

    // 3. PLANETS (Distant Glowing Orbs)
    // Planet 1: Large Gas Giant
    vec3 p1Dir = normalize(vec3(-0.8, -0.2, 0.5));
    float p1Dot = max(0.0, dot(p, p1Dir));
    if (p1Dot > 0.998) color += vec3(1.0, 0.5, 0.3) * 12.0; 
    color += vec3(1.0, 0.6, 0.4) * pow(p1Dot, 150.0) * 8.0; 
    
    // Planet 2: Ringed Planet / Blue Giant
    vec3 p2Dir = normalize(vec3(0.2, -0.7, -0.2));
    float p2Dot = max(0.0, dot(p, p2Dir));
    if (p2Dot > 0.999) color += vec3(0.4, 0.8, 1.0) * 15.0; 
    color += vec3(0.3, 0.5, 1.0) * pow(p2Dot, 250.0) * 10.0; 

    // 4. STARFIELD (High Frequency)
    float stars = pow(smoothNoise(p * 150.0), 20.0);
    color += vec3(stars) * 4.0;

    // 5. SHOOTING STARS (Multiple Trajectories)
    float burst1 = fract(uTime * 0.12 + 0.5);
    vec3 s1Dir = normalize(vec3(1.0, -0.4, 0.3));
    float s1 = pow(max(0.0, dot(p, s1Dir)), 3000.0);
    if (burst1 < 0.15) color += vec3(0.9, 0.9, 1.0) * s1 * 50.0;

    float burst2 = fract(uTime * 0.08);
    vec3 s2Dir = normalize(vec3(-0.5, 0.2, -0.8));
    float s2 = pow(max(0.0, dot(p, s2Dir)), 4000.0);
    if (burst2 < 0.12) color += vec3(1.0, 0.8, 0.5) * s2 * 60.0;

    // 6. ENVIRONMENT TEXTURE BLEND (Uploaded World)
    vec4 texColor = texture2D(uMap, vUv);
    // Additive blend ensures the galaxy remains visible around the world
    color += texColor.rgb * 1.5 * uTextureFactor; 

    // Final Post-Process
    color *= 1.1 + sin(uTime * 0.3) * 0.05; // Pulse
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const GRID_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const GRID_FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    vec2 grid = abs(fract(vWorldPosition.xz - 0.5) - 0.5) / fwidth(vWorldPosition.xz);
    float line = min(grid.x, grid.y);
    float color = 1.0 - min(line, 1.0);
    
    // Radial fade
    float dist = length(vWorldPosition.xz);
    float alpha = exp(-dist * 0.05) * color;
    
    // Grid glow
    float pulse = sin(uTime + dist * 0.1) * 0.5 + 0.5;
    
    gl_FragColor = vec4(uColor * pulse, alpha * 0.5);
  }
`;
