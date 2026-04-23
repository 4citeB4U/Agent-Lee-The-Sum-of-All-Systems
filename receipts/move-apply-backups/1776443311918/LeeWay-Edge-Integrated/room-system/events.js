/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.EVENTS
TAG: ENGINE.EVENTS
WHAT = Event system for room lifecycle, admin actions, and diagnostics
WHY = Tracks key room events and publishes audit logs for runtime state
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


import { StateEngine } from '../runtime/state.engine.js';

const EVENT_STORE_KEY = 'leeway_room_system_events_v1';

function loadEvents() {
  try {
    const raw = localStorage.getItem(EVENT_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[EventEngine] failed to load events', err);
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(EVENT_STORE_KEY, JSON.stringify(events));
}

function normalizeEvent(type, details = {}) {
  return {
    id: `event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    details,
    timestamp: Date.now(),
  };
}

export const RoomEvents = {
  USER_REQUESTED_ACCESS: 'USER_REQUESTED_ACCESS',
  USER_APPROVED: 'USER_APPROVED',
  ROOM_CREATED: 'ROOM_CREATED',
  QR_GENERATED: 'QR_GENERATED',
  QR_SCANNED: 'QR_SCANNED',
  ROOM_JOINED: 'ROOM_JOINED',
  CAPABILITY_CHANGED: 'CAPABILITY_CHANGED',
  ROOM_TERMINATED: 'ROOM_TERMINATED',
  SESSION_STARTED: 'SESSION_STARTED',
  SESSION_ENDED: 'SESSION_ENDED',
};

export class EventEngine {
  static handlers = new Map();

  static on(event, fn) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event).push(fn);
  }

  static async emit(event, payload, ctx) {
    // ctx: { audit, rtc, gpu, roomId, blocked, ... }
    await ctx?.audit?.lifecycle(event, payload);

    const fns = this.handlers.get(event) || [];
    for (const fn of fns) {
      await fn(payload, ctx);
      // Check if execution should be blocked after each handler
      if (ctx?.blocked) {
        throw new Error(`EXECUTION_BLOCKED: Event ${event} triggered block`);
      }
    }
  }

  static recordEvent(type, details = {}) {
    const event = normalizeEvent(type, details);
    const events = loadEvents();
    events.unshift(event);
    if (events.length > 200) {
      events.length = 200;
    }
    saveEvents(events);
    StateEngine.addDiagnostic({ name: type, detail: details });
    return event;
  }

  static listEvents() {
    return loadEvents();
  }
}

// Enforcement handlers - wire these during app init
export function wireEventEnforcement() {
  EventEngine.on('ROOM_TERMINATED', async ({ roomId }, ctx) => {
    await ctx.audit.security('ROOM_TERMINATED_ENFORCE', { roomId });
    await ctx.rtc?.disconnect?.(roomId);
    await ctx.gpu?.shutdown?.(roomId);
  });

  EventEngine.on('SECURITY_ALERT', async (payload, ctx) => {
    await ctx.audit.security('SECURITY_ALERT', payload);
    // Block execution for high-severity alerts
    if (payload?.severity === 'HIGH') {
      ctx.blocked = true;
      await ctx.rtc?.disconnect?.(ctx.roomId);
      await ctx.gpu?.shutdown?.(ctx.roomId);
    }
  });
}
