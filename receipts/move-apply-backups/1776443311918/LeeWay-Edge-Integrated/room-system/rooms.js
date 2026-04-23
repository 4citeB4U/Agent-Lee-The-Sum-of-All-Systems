/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.ROOMS
TAG: ENGINE.ROOMS
WHAT = Room manager for private, isolated room environments
WHY = Creates, updates, and controls room lifecycle state
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import { IdentityEngine } from '../runtime/identity.engine.js';
import { StateEngine } from '../runtime/state.engine.js';
import { CapabilityEngine } from './capabilities.js';

const ROOM_STORE_KEY = 'leeway_room_system_rooms_v1';

function loadRooms() {
  try {
    const raw = localStorage.getItem(ROOM_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('[RoomEngine] failed to load rooms', err);
    return {};
  }
}

function saveRooms(rooms) {
  localStorage.setItem(ROOM_STORE_KEY, JSON.stringify(rooms));
}

function normalizeRoom(room) {
  return {
    roomId: room.roomId,
    ownerId: room.ownerId,
    members: Array.isArray(room.members) ? [...new Set(room.members)] : [],
    capabilities: room.capabilities || CapabilityEngine.createCapabilityMatrix(),
    createdAt: room.createdAt || Date.now(),
    status: room.status || 'active',
    tenantId: room.tenantId || 'local',
    updatedAt: room.updatedAt || null,
  };
}

export const RoomEngine = {
  async createRoom(ownerId, capabilities = {}, tenantId = 'local') {
    const roomIdentity = await IdentityEngine.createRoomIdentity({ createdBy: ownerId, tenantId });
    const room = normalizeRoom({
      roomId: roomIdentity.id,
      ownerId,
      members: [ownerId],
      capabilities: CapabilityEngine.createCapabilityMatrix(capabilities),
      createdAt: Date.now(),
      status: 'active',
      tenantId,
    });
    const rooms = loadRooms();
    rooms[room.roomId] = room;
    saveRooms(rooms);
    StateEngine.updateRoom(room.roomId, room);
    return room;
  },

  getRoom(roomId) {
    const rooms = loadRooms();
    return rooms[roomId] ? normalizeRoom(rooms[roomId]) : null;
  },

  updateRoom(roomId, patch = {}) {
    const rooms = loadRooms();
    const room = normalizeRoom({ ...rooms[roomId], ...patch });
    rooms[roomId] = room;
    saveRooms(rooms);
    StateEngine.updateRoom(roomId, room);
    return room;
  },

  addMember(roomId, userId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room not found: ${roomId}`);
    }
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      return this.updateRoom(roomId, { members: room.members });
    }
    return room;
  },

  lockRoom(roomId) {
    return this.updateRoom(roomId, { status: 'locked' });
  },

  terminateRoom(roomId) {
    return this.updateRoom(roomId, { status: 'terminated' });
  },

  resetRoom(roomId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room not found: ${roomId}`);
    }
    return this.updateRoom(roomId, {
      members: [room.ownerId],
      status: 'active',
      capabilities: CapabilityEngine.createCapabilityMatrix(),
      updatedAt: Date.now(),
    });
  },

  cloneRoom(roomId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room not found: ${roomId}`);
    }
    const clone = this.createRoom(room.ownerId, room.capabilities, room.tenantId);
    clone.members = [...room.members];
    clone.capabilities = { ...room.capabilities };
    this.updateRoom(clone.roomId, clone);
    return clone;
  },

  listRooms() {
    return Object.values(loadRooms()).map(normalizeRoom);
  },
};
