/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.INTEGRATED.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = integrated — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = extension/integrated.js
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/*
 * ----------------------------------------------------------------------------
 * 5W + H SYSTEM MANIFEST (LEEWAY STANDARDS)
 * ----------------------------------------------------------------------------
 * WHAT: Browser module orchestrating unified LeeWay GPU and RTC functionality
 * WHY: Provides a simple entry point for creating/joining rooms and running
 *      a sample WebGPU task directly from a PWA or extension. This bridges
 *      compute and communication fabrics under a unified interface.
 * WHO: Creator: Leonard Lee | Leeway Innovations | A Leeway Industries Creation
 * WHERE: Browser (PWA & extension contexts) using ES modules
 * WHEN: On user interaction – create/join room or run GPU task
 * HOW: Imports GPU bootstrap, controller bridge and compute dispatcher from
 *      the GPU layer, as well as the RTC bridge. Generates a random room
 *      identifier and uses qrcode-generator to produce a QR code. Connects
 *      to the WebRTC hive when a room is created or joined. Executes a
 *      demonstration matrix multiplication on the GPU when requested.
 * TAG: UI.PUBLIC.PAGE.UNIFIED.MAIN.SCRIPT
 * REGION: 🔵 UI
 * DISCOVERY_PIPELINE:
 *   Voice → Intent → Location → Vertical → Ranking → Render
 * ----------------------------------------------------------------------------
 */

import { initGPU } from './gpu/core/gpu.bootstrap.js';
import { executeGPU } from './gpu/control/gpu.controller.bridge.js';
import { prepareMatMulTask } from './gpu/dispatch/compute.dispatch.js';
import { rtcBridge } from './gpu/rtc/gpu.rtc.bridge.js';

// Simple controller that always approves tasks. In a production system this
// would evaluate the task signature against governance rules. The method
// signature matches the Controller from the GPU app (approve(task): boolean).
const controller = {
  approve: (task) => {
    return true;
  }
};

// Elements
const createBtn = document.getElementById('createRoomBtn');
const roomDisplay = document.getElementById('roomDisplay');
const qrEl = document.getElementById('qr');
const joinInput = document.getElementById('joinId');
const joinBtn = document.getElementById('joinRoomBtn');
const statusEl = document.getElementById('status');
const startGpuBtn = document.getElementById('startGpuBtn');
const gpuResultEl = document.getElementById('gpuResult');

// Generate a unique room identifier using crypto if available, otherwise
// fallback to a timestamp-based pseudo identifier. This ensures high entropy
// and uniqueness for each session.
function generateRoomId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'room-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
}

// Render a QR code into the #qr element using qrcode-generator. The version and
// error correction level are automatically determined. The QR encodes a
// simple JSON string with the room ID so that a scanning client can parse
// the identifier and join the same room.
function renderQrCode(roomId) {
  // Clear any previous QR code
  qrEl.innerHTML = '';
  try {
    const typeNumber = 0; // automatic type detection
    const errorCorrection = 'M'; // medium error correction
    const qr = qrcode(typeNumber, errorCorrection);
    qr.addData(JSON.stringify({ room: roomId }));
    qr.make();
    const imgTag = qr.createImgTag(4, 4); // cell size and margin
    qrEl.innerHTML = imgTag;
  } catch (err) {
    qrEl.textContent = 'Failed to generate QR: ' + err.message;
  }
}

// Connect to the RTC hive using the LeewayRTCBridge. If already connected
// or connecting, this will update the status. After connecting, telemetry
// events can be exchanged. The API key is passed through the query string
// for demonstration; in production it should be stored securely.
async function connectToRoom(roomId) {
  rtcBridge.room = roomId;
  statusEl.textContent = 'Connecting to hive…';
  const ok = await rtcBridge.connectToHive('-leeway23-edgegpu');
  if (ok) {
    statusEl.textContent = `Connected to room ${roomId}. Status: ${rtcBridge.status}`;
  } else {
    statusEl.textContent = `Failed to connect. Operating in isolated mode. Status: ${rtcBridge.status}`;
  }
}

// Event: Create new room
createBtn.addEventListener('click', async () => {
  const roomId = generateRoomId();
  roomDisplay.textContent = `Room ID: ${roomId}`;
  renderQrCode(roomId);
  await connectToRoom(roomId);
});

// Event: Join an existing room
joinBtn.addEventListener('click', async () => {
  const roomId = joinInput.value.trim();
  if (!roomId) {
    statusEl.textContent = 'Please enter a room ID to join.';
    return;
  }
  roomDisplay.textContent = `Joined room: ${roomId}`;
  qrEl.innerHTML = '';
  await connectToRoom(roomId);
});

// Event: Run a sample GPU task. This initializes the GPU (if not already
// initialised), prepares two random matrices and multiplies them on the
// device. The result is rendered into the gpuResultEl. If WebGPU is not
// available, a message is displayed instead.
startGpuBtn.addEventListener('click', async () => {
  gpuResultEl.textContent = 'Starting GPU task…';
  const state = await initGPU();
  if (!state || !state.device) {
    gpuResultEl.textContent = 'WebGPU not supported or cannot initialise device.';
    return;
  }
  const size = 16;
  const matA = new Float32Array(size * size);
  const matB = new Float32Array(size * size);
  for (let i = 0; i < matA.length; i++) {
    matA[i] = Math.random();
    matB[i] = Math.random();
  }
  const task = prepareMatMulTask(state.device, matA, matB, size);
  try {
    const result = await executeGPU(task, controller);
    // Format part of the result for display
    const preview = Array.from(result.slice(0, 16)).map(n => n.toFixed(2)).join(', ');
    gpuResultEl.textContent = `Result (first 16 values):\n${preview}`;
  } catch (err) {
    gpuResultEl.textContent = 'GPU task failed: ' + err.message;
  }
});

// On page load, display current RTC status
statusEl.textContent = `RTC status: ${rtcBridge.status}`;