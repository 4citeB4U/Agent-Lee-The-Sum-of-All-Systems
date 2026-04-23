/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.RUNTIME
TAG: ENGINE.RUNTIME
WHAT = Room runtime bootstrap and lifecycle manager for QR-driven entry
WHY = Boots rooms with Pallium storage, RTC, GPU, and agent runtime context
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import { AuthEngine } from './auth.js';
import { RoomEngine } from './rooms.js';
import { QrEngine } from './qr.js';
import { EventEngine, RoomEvents } from './events.js';

import { StateEngine, ENGINE_SIGNATURE as STATE_ENGINE_SIGNATURE } from '../runtime/state.engine.js';
import { TrustEngine, ENGINE_SIGNATURE as TRUST_ENGINE_SIGNATURE } from '../runtime/trust.engine.js';
import { IdentityEngine, ENGINE_SIGNATURE as IDENTITY_ENGINE_SIGNATURE } from '../runtime/identity.engine.js';
import { PalliumEngine, ENGINE_SIGNATURE as PALLIUM_ENGINE_SIGNATURE } from '../runtime/pallium.engine.js';
import { RtcAdapter, ENGINE_SIGNATURE as RTC_ADAPTER_SIGNATURE } from '../runtime/rtc.adapter.js';
import { GpuAdapter, ENGINE_SIGNATURE as GPU_ADAPTER_SIGNATURE } from '../runtime/gpu.adapter.js';
import { verifyEngineSignatures, verifyRuntimeIntegrity } from '../runtime/signature.engine.js';
import { AuditEngine } from '../runtime/audit.engine.js';
import { LeewayIntegrity } from '../runtime/leeway.integrity.js';

export const ENGINE_SIGNATURE = 'ROOM_RUNTIME_MANAGER::LEEWAY_V1';

export class RoomRuntime {
  static async bootstrap({ qrToken }) {
    // 1) QR validation with audit
    const { QrEngine } = await import('./qr.js');
    const audit = null; // We'll create audit after identity
    const payload = await QrEngine.validateToken(qrToken, audit);

    // 2) Identity + Trust
    const identity = await IdentityEngine.init();
    const trust = await TrustEngine.apply(identity);

    // 3) State (roomId from QR)
    const state = await StateEngine.init({ userId: identity.userId });
    const roomId = payload.roomId;

    // 4) PALLIUM
    const pallium = await PalliumEngine.init({
      userId: identity.userId,
      roomId,
      databases: ['core', 'memory', 'file', 'vector', 'log']
    });

    // 5) Audit (now that we have pallium)
    const { AuditEngine } = await import('../runtime/audit.engine.js');
    const realAudit = new AuditEngine({ pallium, identity, roomId });
    await realAudit.lifecycle('ROOM_BOOTSTRAP_START', { roomId });

    // 6) Integrity (logged)
    const { LeewayIntegrity } = await import('../runtime/leeway.integrity.js');
    const coreVerified = await LeewayIntegrity.verifyCore(realAudit);
    if (!coreVerified) throw new Error('LEEWAY_CORE_SIGNATURE_INVALID');
    await LeewayIntegrity.enforceContext({ identity, pallium, roomId }, realAudit);

    await realAudit.lifecycle('ROOM_BOOTSTRAP_READY', { roomId });

    return { identity, trust, state, pallium, audit: realAudit, roomId, qrPayload: payload, integrityVerified: coreVerified };
  }
}

export const RoomRuntimeManager = {
  async bootstrapWithQr(token) {
    const payload = await QrEngine.validateToken(token);
    const user = AuthEngine.getUser(payload.userId);
    if (!user || user.status !== 'approved') {
      throw new Error('USER_NOT_APPROVED');
    }

    const room = RoomEngine.getRoom(payload.roomId);
    if (!room || room.status !== 'active') {
      throw new Error('ROOM_NOT_ACTIVE');
    }

    if (!room.members.includes(user.userId)) {
      RoomEngine.addMember(room.roomId, user.userId);
    }

    const context = {
      userId: user.userId,
      roomId: room.roomId,
      tenantId: payload.tenantId,
      capabilities: payload.capabilities,
      entry: payload.entry,
      installToken: payload.installToken,
    };
    EventEngine.recordEvent(RoomEvents.QR_SCANNED, { roomId: room.roomId, userId: user.userId, entry: payload.entry });

    context.pallium = await PalliumEngine.init({
      userId: context.userId,
      roomId: context.roomId,
      databases: ['core', 'memory', 'file', 'vector', 'log'],
    });

    verifyEngineSignatures({
      IdentityEngine: IDENTITY_ENGINE_SIGNATURE,
      TrustEngine: TRUST_ENGINE_SIGNATURE,
      PalliumEngine: PALLIUM_ENGINE_SIGNATURE,
      StateEngine: STATE_ENGINE_SIGNATURE,
      RtcAdapter: RTC_ADAPTER_SIGNATURE,
      GpuAdapter: GPU_ADAPTER_SIGNATURE,
      RoomRuntimeManager: ENGINE_SIGNATURE,
    });
    verifyRuntimeIntegrity(context);

    StateEngine.updateRoom(room.roomId, {
      ...room,
      capabilities: room.capabilities,
      joinedAt: Date.now(),
      activeEntry: payload.entry,
    });
    EventEngine.recordEvent(RoomEvents.ROOM_JOINED, { roomId: room.roomId, userId: user.userId });

    const trust = TrustEngine.validateRoomJoin({ identity: { id: user.userId }, room });
    StateEngine.addDiagnostic({ name: 'room.join', detail: trust });
    if (trust.result !== 'allow') {
      throw new Error('ROOM_JOIN_DENIED');
    }

    const rtcResult = await RtcAdapter.connect(context, '-leeway23-edgegpu');
    StateEngine.updateRtcStatus({ status: rtcResult.ok ? 'connected' : 'failed', room: room.roomId });

    if (room.capabilities.compute || payload.capabilities.includes('compute')) {
      await GpuAdapter.initialize();
    }
    EventEngine.recordEvent(RoomEvents.SESSION_STARTED, { roomId: room.roomId, userId: user.userId, entry: payload.entry });

    const agent = await this.spawnAgentLee(context);
    return { context, room, rtcResult, agent };
  },

  async spawnAgentLee(context) {
    const agent = await IdentityEngine.createAgentIdentity({ createdBy: context.userId, roomId: context.roomId, roles: ['agent', 'lee'] });
    const logDB = context.pallium.getDB('log');
    if (logDB && typeof logDB.transaction === 'function') {
      try {
        const tx = logDB.transaction('log', 'readwrite');
        tx.objectStore('log').add({ event: 'AGENT_LAUNCHED', roomId: context.roomId, agentId: agent.id, timestamp: new Date().toISOString() });
      } catch (err) {
        console.warn('[RoomRuntimeManager] failed to log agent startup', err);
      }
    }
    return agent;
  },

  async terminateRoom(roomId) {
    const room = await RoomEngine.terminateRoom(roomId);
    EventEngine.recordEvent(RoomEvents.ROOM_TERMINATED, { roomId, status: room.status });
    return room;
  },

  async cloneRoom(roomId) {
    const clone = await RoomEngine.cloneRoom(roomId);
    EventEngine.recordEvent(RoomEvents.ROOM_CREATED, { roomId: clone.roomId, ownerId: clone.ownerId, tenantId: clone.tenantId, clonedFrom: roomId });
    return clone;
  },
};
