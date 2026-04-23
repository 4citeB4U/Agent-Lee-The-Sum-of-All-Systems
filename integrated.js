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
WHERE = integrated.js
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

import { IdentityEngine, ENGINE_SIGNATURE as IDENTITY_ENGINE_SIGNATURE } from './runtime/identity.engine.js';
import { TrustEngine, ENGINE_SIGNATURE as TRUST_ENGINE_SIGNATURE } from './runtime/trust.engine.js';
import { StateEngine, ENGINE_SIGNATURE as STATE_ENGINE_SIGNATURE } from './runtime/state.engine.js';
import { GraphEngine, ENGINE_SIGNATURE as GRAPH_ENGINE_SIGNATURE } from './runtime/graph.engine.js';
import { PalliumEngine, ENGINE_SIGNATURE as PALLIUM_ENGINE_SIGNATURE } from './runtime/pallium.engine.js';
import { RtcAdapter, ENGINE_SIGNATURE as RTC_ADAPTER_SIGNATURE } from './runtime/rtc.adapter.js';
import { GpuAdapter, ENGINE_SIGNATURE as GPU_ADAPTER_SIGNATURE } from './runtime/gpu.adapter.js';
import { verifyEngineSignatures, verifyRuntimeIntegrity } from './runtime/signature.engine.js';
import { LeewayIntegrity } from './runtime/leeway.integrity.js';
import { getRoomSystemAdapter } from './runtime/room-system.adapter.js';

let currentRoom = null;
let currentSession = null;
let currentRuntimeContext = null;

// Initialize core integrity and wire event enforcement
const coreVerified = await LeewayIntegrity.verifyCore();
if (!coreVerified) throw new Error('LEEWAY_CORE_SIGNATURE_INVALID');
const roomSystem = await getRoomSystemAdapter();
roomSystem.wireEventEnforcement();

const controller = {
  approve: (task) => true,
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
// signed token payload for secure room entry.
function renderQrCode(token) {
  qrEl.innerHTML = '';
  try {
    const typeNumber = 0;
    const errorCorrection = 'M';
    const qr = qrcode(typeNumber, errorCorrection);
    qr.addData(token);
    qr.make();
    const imgTag = qr.createImgTag(4, 4);
    qrEl.innerHTML = imgTag;
  } catch (err) {
    qrEl.textContent = 'Failed to generate QR: ' + err.message;
  }
}

async function bootRoomRuntime(context) {
  const { userId, roomId } = context;
  const pallium = await PalliumEngine.init({
    userId,
    roomId,
    databases: ['core', 'memory', 'file', 'vector', 'log'],
  });

  context.pallium = pallium;
  verifyEngineSignatures({
    IdentityEngine: IDENTITY_ENGINE_SIGNATURE,
    TrustEngine: TRUST_ENGINE_SIGNATURE,
    GraphEngine: GRAPH_ENGINE_SIGNATURE,
    PalliumEngine: PALLIUM_ENGINE_SIGNATURE,
    StateEngine: STATE_ENGINE_SIGNATURE,
    RtcAdapter: RTC_ADAPTER_SIGNATURE,
    GpuAdapter: GPU_ADAPTER_SIGNATURE,
    RoomRuntimeManager: roomSystem.RoomRuntimeManager?.ENGINE_SIGNATURE || 'ROOM_RUNTIME_MANAGER::LEEWAY_V1',
  });
  verifyRuntimeIntegrity(context);

  return context;
}

// Connect to the RTC hive through the runtime adapter. This abstracts the
// lower-level RTC bridge and manages connection state in the runtime store.
async function connectToRoom(roomId) {
  if (!currentSession) {
    currentSession = await IdentityEngine.createSessionIdentity({ createdBy: 'local-user' });
    StateEngine.updateTask(currentSession.id, { type: 'session', status: 'initialized', roomId });
  }

  statusEl.textContent = 'Validating room trust…';
  const roomRecord = { id: roomId, locked: false };
  const trust = TrustEngine.validateRoomJoin({ identity: currentSession, room: roomRecord });
  StateEngine.addDiagnostic({ name: 'room.join', detail: trust });

  if (trust.result !== 'allow') {
    statusEl.textContent = `Room join denied: ${trust.reason}`;
    return false;
  }

  statusEl.textContent = 'Booting room runtime…';
  currentRuntimeContext = await bootRoomRuntime({ userId: currentSession.id, roomId });

  statusEl.textContent = 'Connecting to hive…';
  const result = await RtcAdapter.connect(currentRuntimeContext, '-leeway23-edgegpu');
  StateEngine.updateRtcStatus({ status: result.ok ? 'connected' : 'failed', room: roomId });

  if (result.ok) {
    statusEl.textContent = `Connected to room ${roomId}. Status: ${result.status}`;
    StateEngine.updateRoom(roomId, { id: roomId, status: 'active', owner: currentSession.id, lastConnectedAt: new Date().toISOString() });
    currentRoom = roomRecord;
    return true;
  }

  statusEl.textContent = `Failed to connect. Status: ${result.status}`;
  return false;
}

// Event: Create new room and issue a signed invite QR for approval-based entry
createBtn.addEventListener('click', async () => {
  const email = 'local@leeway.local';
  const capabilities = roomSystem.CapabilityEngine.createCapabilityMatrix({ voice: true, compute: true, deploy: true, fileAccess: true, ideAccess: true });
  try {
    const { user, room } = await roomSystem.AdminEngine.createRoomForUser(email, capabilities, ['owner'], 'local');
    const invite = await roomSystem.AdminEngine.issueRoomInvite({ userId: user.userId, roomId: room.roomId, tenantId: room.tenantId, entry: 'pwa', expiresMinutes: 15 });
    roomDisplay.textContent = `Room ID: ${room.roomId}`;
    statusEl.textContent = `Room created. Invite expires in 15 minutes.`;
    renderQrCode(invite.token);
  } catch (err) {
    statusEl.textContent = `Failed to create room: ${err.message}`;
  }
});

// Event: Join an existing room using a signed QR token
joinBtn.addEventListener('click', async () => {
  const token = joinInput.value.trim();
  if (!token) {
    statusEl.textContent = 'Please enter a signed QR token to join.';
    return;
  }
  qrEl.innerHTML = '';
  try {
    const result = await roomSystem.RoomRuntime.bootstrap({ qrToken: token });
    roomDisplay.textContent = `Joined room: ${result.roomId}`;
    statusEl.textContent = `Joined ${result.roomId} as ${result.identity.userId}.`;
  } catch (err) {
    statusEl.textContent = `Join failed: ${err.message}`;
  }
});

// Event: Run a sample GPU task. This initializes the GPU (if not already
// initialised), prepares two random matrices and multiplies them on the
// device. The result is rendered into the gpuResultEl. If WebGPU is not
// available, a message is displayed instead.
startGpuBtn.addEventListener('click', async () => {
  gpuResultEl.textContent = 'Starting GPU task…';

  if (!currentRoom) {
    const room = await IdentityEngine.createRoomIdentity({ createdBy: 'local-user', purpose: 'local-edge' });
    await connectToRoom(room.id);
  }

  const trust = TrustEngine.validateTaskExecution({ identity: currentSession, task: { type: 'gpu-matmul' }, capabilityProfile: { trusted: true } });
  if (trust.result !== 'allow') {
    gpuResultEl.textContent = `Execution denied: ${trust.reason}`;
    return;
  }

  const state = await GpuAdapter.initialize();
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
  const task = GpuAdapter.prepareMatMulTask(state.device, matA, matB, size);
  const plan = GraphEngine.buildExecutionPlan({ type: 'gpu-matmul', roomId: currentRoom?.id || 'local-edge' }, { identity: currentSession });
  StateEngine.updateTask(plan.id, { type: 'graph', status: 'scheduled', roomId: currentRoom?.id || 'local-edge' });

  if (!currentRuntimeContext || !currentRuntimeContext.pallium) {
    gpuResultEl.textContent = 'Runtime context not initialized.';
    return;
  }

  try {
    const graph = await GraphEngine.runGraph(
      plan,
      async (node, runContext) => {
        if (node.type === 'compute') {
          const result = await GpuAdapter.execute(task, controller, runContext);
          StateEngine.updateTask(node.id, { status: 'completed', result: 'gpu_result' });
          return result;
        }
        return { ok: true };
      },
      currentRuntimeContext
    );

    const computeNode = Array.from(graph.nodes.values()).find(n => n.type === 'compute');
    const result = computeNode?.result || new Float32Array(0);
    const preview = Array.from(result.slice(0, 16)).map(n => n.toFixed(2)).join(', ');
    gpuResultEl.textContent = `Result (first 16 values):\n${preview}`;
    StateEngine.updateTask(plan.id, { status: 'completed' });
  } catch (err) {
    gpuResultEl.textContent = 'GPU task failed: ' + err.message;
    StateEngine.addDiagnostic({ name: 'gpu.execution.error', detail: err.message });
  }
});

// On page load, display current RTC status
statusEl.textContent = `RTC status: ${RtcAdapter.getStatus().status}`;