/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.CLUSTER_REGISTRY.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = cluster.registry — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = receipts/move-apply-backups/1776444143773/LeeWay-Edge-Integrated/gpu/rtc/cluster.registry.js
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export class NodeRegistry {
  constructor() {
    this.nodes = new Map();
  }

  update(node) {
    this.nodes.set(node.nodeId, {
      ...node,
      lastSeen: Date.now(),
      currentLoad: node.currentLoad || 0
    });
  }

  getActive() {
    const now = Date.now();
    return [...this.nodes.values()].filter(n => now - n.lastSeen < 5000);
  }

  monitor() {
    // Heartbeat monitoring to drop dead nodes
    setInterval(() => {
      const now = Date.now();
      for (const [id, node] of this.nodes) {
        if (now - node.lastSeen > 5000) {
          this.nodes.delete(id);
        }
      }
    }, 2000);
  }
}
