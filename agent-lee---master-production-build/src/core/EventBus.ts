/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: AI.AGENT.EVENTBUS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = EventBus — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/core/EventBus.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

// Mock Event Bus
class EventBus {
  on(event: string, callback: Function) {
    console.log(`Subscribed to ${event}`);
    return () => console.log(`Unsubscribed from ${event}`);
  }
  emit(event: string, data: any) {
    console.log(`Emitted ${event}`, data);
  }
}
export const eventBus = new EventBus();
