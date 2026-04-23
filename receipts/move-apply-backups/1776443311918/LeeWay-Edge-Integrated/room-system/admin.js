/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.ADMIN
TAG: ENGINE.ADMIN
WHAT = Admin control API for user approval and QR-based room provisioning
WHY = Orchestrates room onboarding, capability assignment, and traceable invite generation
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import { AuthEngine } from './auth.js';
import { RoomEngine } from './rooms.js';
import { CapabilityEngine } from './capabilities.js';
import { QrEngine } from './qr.js';
import { EventEngine, RoomEvents } from './events.js';

export const AdminEngine = {
  async createRoomForUser(email, capabilities = {}, roles = ['user'], tenantId = 'local') {
    const user = AuthEngine.requestAccess(email);
    AuthEngine.approveUser(user.userId, roles);
    const room = await RoomEngine.createRoom(user.userId, capabilities, tenantId);
    EventEngine.recordEvent(RoomEvents.ROOM_CREATED, { roomId: room.roomId, ownerId: user.userId, tenantId });
    return { user, room };
  },

  assignCapabilities(roomId, capabilities) {
    const room = RoomEngine.getRoom(roomId);
    if (!room) {
      throw new Error(`Room not found: ${roomId}`);
    }
    const updated = CapabilityEngine.applyCapabilityMatrix(room, capabilities);
    return RoomEngine.updateRoom(roomId, updated);
  },

  async issueRoomInvite({ userId, roomId, tenantId = 'local', entry = 'pwa', expiresMinutes = 15 }) {
    const user = AuthEngine.getUser(userId);
    if (!user || user.status !== 'approved') {
      throw new Error('USER_NOT_APPROVED');
    }

    const room = RoomEngine.getRoom(roomId);
    if (!room) {
      throw new Error('ROOM_NOT_FOUND');
    }

    const payload = {
      userId,
      roomId,
      tenantId,
      capabilities: Object.keys(room.capabilities).filter(key => Boolean(room.capabilities[key])),
      installToken: QrEngine.createInstallToken(),
      issuedAt: Date.now(),
      expiresAt: Date.now() + expiresMinutes * 60 * 1000,
      entry,
    };

    const token = await QrEngine.signQrPayload(payload);
    EventEngine.recordEvent(RoomEvents.QR_GENERATED, { roomId: room.roomId, userId, installToken: payload.installToken });
    return { token, payload };
  },

  async approveAndInvite({ email, capabilities = {}, roles = ['user'], tenantId = 'local', entry = 'pwa', expiresMinutes = 15 }) {
    const { user, room } = await this.createRoomForUser(email, capabilities, roles, tenantId);
    return this.issueRoomInvite({ userId: user.userId, roomId: room.roomId, tenantId, entry, expiresMinutes });
  },
};
