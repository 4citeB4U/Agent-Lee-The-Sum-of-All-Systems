/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.DETERMINISTICVOXELENGINE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = DeterministicVoxelEngine — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-construct/room-on-the-edge/src/engine/DeterministicVoxelEngine.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import * as THREE from 'three';

export type AssetStyle = 'voxel' | 'lowpoly' | 'unreal-prop' | 'blender-blockout';
export type DepthMode = 'flat' | 'brightness' | 'edges' | 'hybrid';

export interface AssetVoxel {
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface AssetBuildPlan {
  id: string;
  name: string;
  style: AssetStyle;
  width: number;
  height: number;
  depth: number;
  voxelSize: number;
  palette: string[];
  voxels: AssetVoxel[];
  estimatedTriangles: number;
  sourceBounds: { minX: number; minY: number; maxX: number; maxY: number };
  depthMode: DepthMode;
}

export interface AssetAnalysisResult {
  buildPlan: AssetBuildPlan;
  object3D: THREE.Group;
  voxelTexture?: THREE.Texture;
  environmentTexture?: THREE.Texture | null;
}

export interface VoxelEngineOptions {
  style?: AssetStyle;
  targetWidth?: number;
  voxelSize?: number;
  alphaThreshold?: number;
  quantizeStep?: number;
  depthMode?: DepthMode;
  edgeStrength?: number;
  maxDepth?: number;
}

interface QuantizedPixel {
  r: number;
  g: number;
  b: number;
  a: number;
  brightness: number;
  edge: number;
  occupied: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function quantizeChannel(value: number, step = 24): number {
  if (step <= 1) return clamp(Math.round(value), 0, 255);
  return clamp(Math.round(value / step) * step, 0, 255);
}

function styleDefaults(style: AssetStyle): Required<Pick<VoxelEngineOptions, 'targetWidth' | 'voxelSize' | 'alphaThreshold' | 'quantizeStep' | 'depthMode' | 'edgeStrength' | 'maxDepth'>> {
  switch (style) {
    case 'unreal-prop':
      return {
        targetWidth: 56,
        voxelSize: 0.045,
        alphaThreshold: 16,
        quantizeStep: 20,
        depthMode: 'hybrid',
        edgeStrength: 0.65,
        maxDepth: 12,
      };
    case 'blender-blockout':
      return {
        targetWidth: 48,
        voxelSize: 0.05,
        alphaThreshold: 16,
        quantizeStep: 28,
        depthMode: 'edges',
        edgeStrength: 0.75,
        maxDepth: 8,
      };
    case 'lowpoly':
      return {
        targetWidth: 44,
        voxelSize: 0.055,
        alphaThreshold: 20,
        quantizeStep: 32,
        depthMode: 'brightness',
        edgeStrength: 0.4,
        maxDepth: 6,
      };
    case 'voxel':
    default:
      return {
        targetWidth: 40,
        voxelSize: 0.055,
        alphaThreshold: 24,
        quantizeStep: 24,
        depthMode: 'hybrid',
        edgeStrength: 0.6,
        maxDepth: 7,
      };
  }
}

async function loadImageBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function computeEdgeMagnitude(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
  const at = (px: number, py: number): number => {
    const cx = clamp(px, 0, width - 1);
    const cy = clamp(py, 0, height - 1);
    const i = (cy * width + cx) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };

  const gx =
    -1 * at(x - 1, y - 1) + 1 * at(x + 1, y - 1) +
    -2 * at(x - 1, y) + 2 * at(x + 1, y) +
    -1 * at(x - 1, y + 1) + 1 * at(x + 1, y + 1);

  const gy =
    -1 * at(x - 1, y - 1) + -2 * at(x, y - 1) + -1 * at(x + 1, y - 1) +
     1 * at(x - 1, y + 1) +  2 * at(x, y + 1) +  1 * at(x + 1, y + 1);

  return clamp(Math.sqrt(gx * gx + gy * gy) / 255, 0, 1);
}

function deriveDepth(
  brightness: number,
  edge: number,
  occupied: boolean,
  mode: DepthMode,
  maxDepth: number,
  edgeStrength: number,
): number {
  if (!occupied) return 0;

  const b = brightness / 255;
  let normalized = 0.15;

  switch (mode) {
    case 'flat':
      normalized = 0.55;
      break;
    case 'brightness':
      normalized = 0.2 + b * 0.8;
      break;
    case 'edges':
      normalized = 0.25 + edge * edgeStrength;
      break;
    case 'hybrid':
    default:
      normalized = 0.18 + b * 0.55 + edge * edgeStrength * 0.65;
      break;
  }

  return clamp(Math.round(normalized * maxDepth), 1, maxDepth);
}

function computeBounds(grid: QuantizedPixel[][]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!grid[y][x].occupied) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return { minX, minY, maxX, maxY };
}

function buildPixelGrid(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold: number,
  quantizeStep: number,
): QuantizedPixel[][] {
  const grid: QuantizedPixel[][] = [];

  for (let y = 0; y < height; y++) {
    const row: QuantizedPixel[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      const occupied = a >= alphaThreshold;
      const r = occupied ? quantizeChannel(data[i], quantizeStep) : 0;
      const g = occupied ? quantizeChannel(data[i + 1], quantizeStep) : 0;
      const b = occupied ? quantizeChannel(data[i + 2], quantizeStep) : 0;
      const brightness = occupied ? (r + g + b) / 3 : 0;
      const edge = occupied ? computeEdgeMagnitude(data, width, height, x, y) : 0;
      row.push({ r, g, b, a, brightness, edge, occupied });
    }
    grid.push(row);
  }

  return grid;
}

function buildVoxelList(
  grid: QuantizedPixel[][],
  height: number,
  mode: DepthMode,
  maxDepth: number,
  edgeStrength: number,
): { voxels: AssetVoxel[]; palette: string[]; maxUsedDepth: number } {
  const voxels: AssetVoxel[] = [];
  const palette = new Set<string>();
  let maxUsedDepth = 1;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const pixel = grid[y][x];
      if (!pixel.occupied) continue;

      const color = rgbToHex(pixel.r, pixel.g, pixel.b);
      palette.add(color);
      
      // TERRAIN MODE: Brightness/Edge becomes HEIGHT (Y)
      const voxelHeight = deriveDepth(pixel.brightness, pixel.edge, pixel.occupied, mode, maxDepth, edgeStrength);
      maxUsedDepth = Math.max(maxUsedDepth, voxelHeight);

      // Build column
      for (let h = 0; h < voxelHeight; h++) {
        voxels.push({
          x,
          y: h, // Vertical height
          z: y, // Image row becomes world Z
          color,
        });
      }
    }
  }

  return { voxels, palette: Array.from(palette), maxUsedDepth };
}

export async function buildVoxelAssetFromImage(
  file: File,
  style: AssetStyle = 'voxel',
  overrides: VoxelEngineOptions = {},
): Promise<AssetAnalysisResult> {
  const defaults = styleDefaults(style);
  const options = { ...defaults, style, ...overrides };

  const bitmap = await loadImageBitmap(file);
  const targetWidth = clamp(Math.round(options.targetWidth), 12, 128);
  const aspectRatio = bitmap.height / Math.max(bitmap.width, 1);
  const targetHeight = clamp(Math.round(targetWidth * aspectRatio), 12, 128);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable for deterministic voxel engine.');

  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = false; // VOXEL ART: Sharp pixels
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  const image = ctx.getImageData(0, 0, targetWidth, targetHeight);

  // VOXEL TEXTURE: Pixelated version for environment
  const voxelTexture = new THREE.CanvasTexture(canvas);
  voxelTexture.magFilter = THREE.NearestFilter;
  voxelTexture.minFilter = THREE.NearestFilter;

  const grid = buildPixelGrid(image.data, targetWidth, targetHeight, options.alphaThreshold, options.quantizeStep);
  const bounds = computeBounds(grid);
  const { voxels, palette, maxUsedDepth } = buildVoxelList(
    grid,
    targetHeight,
    options.depthMode,
    options.maxDepth,
    options.edgeStrength,
  );

  const buildPlan: AssetBuildPlan = {
    id: `asset-${Date.now()}`,
    name: file.name.replace(/\.[^.]+$/, ''),
    style,
    width: targetWidth,
    height: targetHeight,
    depth: maxUsedDepth,
    voxelSize: options.voxelSize,
    palette,
    voxels,
    estimatedTriangles: voxels.length * 12,
    sourceBounds: bounds,
    depthMode: options.depthMode,
  };

  return {
    buildPlan,
    object3D: buildVoxelPreviewMesh(buildPlan),
    voxelTexture,
  };
}

export function buildVoxelPreviewMesh(plan: AssetBuildPlan): THREE.Group {
  const group = new THREE.Group();
  group.name = `asset_preview_${plan.id}`;

  const materialCache = new Map<string, THREE.MeshStandardMaterial>();
  const sharedGeometry = new THREE.BoxGeometry(plan.voxelSize, plan.voxelSize, plan.voxelSize);

  // InstancedMesh would be better for performance, but keeping simplicity for world-building
  for (const voxel of plan.voxels) {
    let material = materialCache.get(voxel.color);
    if (!material) {
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(voxel.color),
        roughness: 0.8,
        metalness: 0.1,
      });
      materialCache.set(voxel.color, material);
    }

    const cube = new THREE.Mesh(sharedGeometry, material);
    cube.position.set(
      (voxel.x - plan.width / 2) * plan.voxelSize,
      voxel.y * plan.voxelSize,
      (voxel.z - plan.height / 2) * plan.voxelSize
    );
    group.add(cube);
  }

  // WORLD SCALE: The image is now the entire floor
  group.scale.setScalar(8.0); 
  group.position.set(0, 0, 0);

  group.userData = {
    type: 'asset-preview',
    assetId: plan.id,
    buildPlan: {
      ...plan,
      voxels: undefined,
      voxelCount: plan.voxels.length,
    }
  };

  return group;
}
