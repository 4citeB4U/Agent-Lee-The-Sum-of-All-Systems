/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.TTS_BRIDGE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = tts-bridge — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = rtc/tts-bridge.cjs
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

// Minimal WebSocket TTS bridge for LeeWay-Edge-RTC
// Place this in the main app (Node.js/Express or similar)

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8766 });

let lastClient = null;

wss.on('connection', function connection(ws) {
  lastClient = ws;
  ws.on('message', function incoming(message) {
    // Expect: { text: "..." }
    try {
      const data = JSON.parse(message);
      if (typeof data.text === 'string') {
        // Broadcast to all clients (or just use ws.send if single client)
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ speak: data.text }));
          }
        });
      }
    } catch (e) {
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });
  ws.send(JSON.stringify({ status: 'connected' }));
});

console.log('LeeWay-Edge-RTC TTS WebSocket bridge running on ws://localhost:8766');
