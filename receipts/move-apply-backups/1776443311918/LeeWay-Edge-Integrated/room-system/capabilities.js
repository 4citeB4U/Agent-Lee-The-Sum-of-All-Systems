/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.CAPABILITIES
TAG: ENGINE.CAPABILITIES
WHAT = Capability matrix system for room-level permission enforcement
WHY = Creates and validates room capability grants at runtime
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


const DEFAULT_CAPABILITIES = {
  voice: false,
  vision: false,
  compute: false,
  link: false,
  deploy: false,
  fileAccess: false,
  ideAccess: false,
};

export const CapabilityEngine = {
  createCapabilityMatrix(overrides = {}) {
    return { ...DEFAULT_CAPABILITIES, ...overrides };
  },

  validateCapability(room, capability) {
    if (!room || !room.capabilities) {
      return false;
    }
    return Boolean(room.capabilities[capability]);
  },

  applyCapabilityMatrix(room, capabilities) {
    return {
      ...room,
      capabilities: this.createCapabilityMatrix(capabilities),
      capabilitiesUpdatedAt: Date.now(),
    };
  },
};
