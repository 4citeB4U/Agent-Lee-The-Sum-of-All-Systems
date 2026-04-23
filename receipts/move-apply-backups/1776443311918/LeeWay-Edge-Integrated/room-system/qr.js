/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: ROOM.SYSTEM.QR
TAG: ENGINE.QR
WHAT = QR payload generator, signer, and validator for secure room entry
WHY = Produces signed time-limited single-use QR tokens for room access
WHO = Leeway Innovations
*/
// CHAIN: Standards → Integrated → Runtime → Projections


const QR_SECRET = import.meta.env?.VITE_LEEWAY_QR_SECRET || window?.LEEWAY_QR_SECRET || 'lee-way-edge-default-secret';
const QR_USED_KEY = 'leeway_room_system_qr_used_v1';

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getSigningKey() {
  const keyData = new TextEncoder().encode(QR_SECRET);
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signPayload(payloadJson) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadJson));
  return base64UrlEncode(signature);
}

function loadUsedTokens() {
  try {
    const raw = localStorage.getItem(QR_USED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('[QrEngine] failed to load used tokens', err);
    return {};
  }
}

function saveUsedTokens(tokens) {
  localStorage.setItem(QR_USED_KEY, JSON.stringify(tokens));
}

function markTokenUsed(token) {
  const tokens = loadUsedTokens();
  tokens[token] = Date.now();
  saveUsedTokens(tokens);
}

function isTokenUsed(token) {
  return Boolean(loadUsedTokens()[token]);
}

function createInstallToken() {
  return `install-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export const QrEngine = {
  async signQrPayload(payload) {
    const normalizedPayload = {
      userId: payload.userId,
      roomId: payload.roomId,
      tenantId: payload.tenantId || 'local',
      capabilities: payload.capabilities || [],
      installToken: payload.installToken || createInstallToken(),
      issuedAt: payload.issuedAt || Date.now(),
      expiresAt: payload.expiresAt || Date.now() + 1000 * 60 * 15,
      entry: payload.entry || 'pwa',
    };
    const body = JSON.stringify(normalizedPayload);
    const encoded = base64UrlEncode(new TextEncoder().encode(body));
    const signature = await signPayload(body);
    return `${encoded}.${signature}`;
  },

  async validateToken(token, audit) {
    if (!token || typeof token !== 'string') {
      await audit?.security('QR_INVALID', { reason: 'INVALID_FORMAT' });
      throw new Error('INVALID_QR_TOKEN');
    }
    if (isTokenUsed(token)) {
      await audit?.security('QR_INVALID', { reason: 'ALREADY_USED' });
      throw new Error('QR_TOKEN_ALREADY_USED');
    }
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) {
      await audit?.security('QR_INVALID', { reason: 'FORMAT_INVALID' });
      throw new Error('QR_TOKEN_FORMAT_INVALID');
    }
    const payloadJson = new TextDecoder().decode(base64UrlDecode(encoded));
    const key = await getSigningKey();
    const verified = await crypto.subtle.verify('HMAC', key, base64UrlDecode(signature), new TextEncoder().encode(payloadJson));
    if (!verified) {
      await audit?.security('QR_INVALID', { reason: 'SIGNATURE_INVALID' });
      throw new Error('QR_SIGNATURE_INVALID');
    }
    const payload = JSON.parse(payloadJson);
    if (payload.expiresAt < Date.now()) {
      await audit?.security('QR_INVALID', { reason: 'EXPIRED' });
      throw new Error('QR_TOKEN_EXPIRED');
    }

    markTokenUsed(token);
    await audit?.security('QR_VALIDATED', {
      userId: payload.userId,
      roomId: payload.roomId,
      expiresAt: payload.expiresAt
    });
    return payload;
  },

  createInstallToken,
};
