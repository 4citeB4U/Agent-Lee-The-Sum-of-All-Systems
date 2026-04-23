/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.AUTH
TAG: ENGINE.AUTH
WHAT = User identity and approval engine for the Room System
WHY = Manages user access requests, approval state, and role assignment
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import { EventEngine, RoomEvents } from './events.js';

const USER_STORE_KEY = 'leeway_room_system_users_v1';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USER_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('[AuthEngine] failed to load users', err);
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
}

function generateUserId(email) {
  const hashed = btoa(email + Date.now().toString(36)).replace(/=/g, '');
  return `user-${hashed.slice(0, 12)}`;
}

function normalizeUser(user) {
  return {
    userId: user.userId,
    email: user.email,
    status: user.status || 'pending',
    roles: user.roles || [],
    createdAt: user.createdAt || Date.now(),
    approvedAt: user.approvedAt || null,
    suspendedAt: user.suspendedAt || null,
  };
}

export const AuthEngine = {
  requestAccess(email) {
    const users = loadUsers();
    const existing = Object.values(users).find(entry => entry.email === email);
    if (existing) {
      return existing;
    }

    const user = normalizeUser({
      userId: generateUserId(email),
      email,
      status: 'pending',
      roles: ['requester'],
      createdAt: Date.now(),
    });
    users[user.userId] = user;
    saveUsers(users);
    EventEngine.recordEvent(RoomEvents.USER_REQUESTED_ACCESS, { userId: user.userId, email });
    return user;
  },

  getUser(userId) {
    const users = loadUsers();
    return users[userId] ? normalizeUser(users[userId]) : null;
  },

  approveUser(userId, roles = ['user']) {
    const users = loadUsers();
    const user = users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    user.status = 'approved';
    user.roles = Array.from(new Set([...user.roles, ...roles]));
    user.approvedAt = Date.now();
    saveUsers(users);
    EventEngine.recordEvent(RoomEvents.USER_APPROVED, { userId: user.userId, roles: user.roles });
    return normalizeUser(user);
  },

  rejectUser(userId) {
    const users = loadUsers();
    const user = users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    user.status = 'rejected';
    saveUsers(users);
    return normalizeUser(user);
  },

  suspendUser(userId) {
    const users = loadUsers();
    const user = users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    user.status = 'suspended';
    user.suspendedAt = Date.now();
    saveUsers(users);
    return normalizeUser(user);
  },

  listUsers() {
    return Object.values(loadUsers()).map(normalizeUser);
  },

  listPendingRequests() {
    return Object.values(loadUsers()).filter(user => user.status === 'pending').map(normalizeUser);
  },
};
