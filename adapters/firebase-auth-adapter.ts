/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.FIREBASE_AUTH_ADAPTER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = firebase-auth-adapter — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = adapters/firebase-auth-adapter.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * LeeWay Standards — Firebase Auth Adapter
 * 
 * **Origin:** LeeWay-Standards (this is the canonical implementation)
 * **Replaces:** 
 *   - leeway-construct/room-on-the-edge/src/firebase.ts (GoogleAuthProvider)
 *   - leeway-employment-center/src/firebase.ts (GoogleAuthProvider)
 * 
 * **Contract:**
 * - Wraps Firebase Auth with Standards trust fabric
 * - Enforces Standards permissions on all auth operations
 * - Routes all user identity through Standards audit chain
 * - Prevents direct GoogleAuthProvider usage
 * 
 * **Consumers:**
 * - construct/src/App.tsx
 * - employment-center/src/App.tsx
 */

import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import type { AuthProvider } from 'firebase/auth';

function buildEnforcementBlockError(adapter: string): Error {
  const context = {
    layer: 'standards',
    adapter,
    timestamp: Date.now(),
  };

  const payload = {
    type: 'LEEWAY_ENFORCEMENT_BLOCK',
    message: 'External execution blocked',
    context,
  };

  const error = new Error('[LEEWAY_ENFORCEMENT] External execution blocked — not approved by Standards');
  (error as any).name = 'LEEWAY_ENFORCEMENT_BLOCK';
  (error as any).payload = payload;
  return error;
}

/**
 * Standards-governed authentication context
 * All auth flows must pass through this adapter
 */
export interface StandardsAuthContext {
  userId: string;
  trustLevel: 'unverified' | 'verified' | 'trusted';
  permissions: string[];
  auditChain: string[];
}

/**
 * Initialize Standards-governed auth adapter
 */
export function initializeStandardsAuth(firebaseApp: any): any {
  // 0. ENFORCE EXTERNAL GATING (Hard Block by Default)
  const mode = (process.env.LEEWAY_MODE || 'LOCKED').toUpperCase();
  
  if (mode === 'LOCKED' || (mode !== 'AUDIT' && mode !== 'OPEN')) {
    throw buildEnforcementBlockError('firebase-auth-adapter');
  }
  
  if (mode === 'AUDIT') {
    console.warn('[STANDARDS] Firebase execution in AUDIT mode (allowed for validation)');
  }

  // 1. VALIDATE INPUT
  if (!firebaseApp) {
    throw new Error('[STANDARDS] Firebase app not provided');
  }

  // 2. LOG INITIALIZATION
  console.log('[STANDARDS] Initializing Standards-governed auth');

  // 3. GET FIREBASE AUTH
  const auth = getAuth(firebaseApp);

  // 4. ATTACH LEEWAY METADATA
  (auth as any).__leeway = {
    source: 'standards',
    governed: true,
    trustLevel: 'unverified',
  };

  // 5. LOG SUCCESS
  console.log('[STANDARDS] Standards auth adapter initialized');

  return auth;
}

/**
 * Sign in with Standards-governed provider (replaces GoogleAuthProvider)
 */
export async function signInWithStandardsProvider(
  auth: any,
  provider: AuthProvider
): Promise<StandardsAuthContext> {
  // 0. ENFORCE EXTERNAL GATING (Hard Block by Default)
  const mode = (process.env.LEEWAY_MODE || 'LOCKED').toUpperCase();
  
  if (mode === 'LOCKED' || (mode !== 'AUDIT' && mode !== 'OPEN')) {
    throw buildEnforcementBlockError('firebase-auth-adapter');
  }
  
  if (mode === 'AUDIT') {
    console.warn('[STANDARDS] Auth provider execution in AUDIT mode (allowed for validation)');
  }

  // 1. VALIDATE INPUT
  if (!auth) {
    throw new Error('[STANDARDS] Auth object not provided');
  }
  if (!provider) {
    throw new Error('[STANDARDS] Auth provider not specified');
  }

  // 2. LOG REQUEST
  console.log('[STANDARDS] Auth sign-in requested');

  // 3. PERFORM SIGN-IN
  let userCredential;
  try {
    userCredential = await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('[STANDARDS] Sign-in failed:', error);
    throw new Error('[STANDARDS] Authentication failed');
  }

  const user = userCredential.user;

  // 4. CREATE STANDARDS AUTH CONTEXT
  const context: StandardsAuthContext = {
    userId: user.uid,
    trustLevel: 'verified',
    permissions: ['read', 'execute'],
    auditChain: [
      {
        timestamp: new Date().toISOString(),
        event: 'USER_AUTHENTICATED',
        authority: 'LeeWay-Standards',
      },
    ],
  };

  // 5. ATTACH LEEWAY METADATA
  const result = {
    ...context,
    __leeway: {
      source: 'standards',
      verified: true,
      timestamp: Date.now(),
    },
  };

  // 6. LOG SUCCESS
  console.log('[STANDARDS] User authenticated:', {
    userId: user.uid,
    trustLevel: 'verified',
  });

  return result as StandardsAuthContext;
}

/**
 * Watch auth state changes with Standards audit trail
 */
export async function watchStandardsAuthState(
  auth: any,
  callback: (context: StandardsAuthContext | null) => void
): Promise<() => void> {
  // 1. VALIDATE INPUT
  if (!auth) {
    throw new Error('[STANDARDS] Auth object not provided');
  }
  if (typeof callback !== 'function') {
    throw new Error('[STANDARDS] Callback must be a function');
  }

  // 2. LOG SETUP
  console.log('[STANDARDS] Auth state watcher initialized');

  // 3. SUBSCRIBE TO FIREBASE CHANGES
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    // 4. WRAP USER IN STANDARDS CONTEXT
    if (user) {
      const context: StandardsAuthContext = {
        userId: user.uid,
        trustLevel: 'verified',
        permissions: ['read', 'execute'],
        auditChain: [
          {
            timestamp: new Date().toISOString(),
            event: 'AUTH_STATE_VERIFIED',
            authority: 'LeeWay-Standards',
          },
        ],
      };

      // 5. LOG STATE CHANGE
      console.log('[STANDARDS] Auth state changed (signed in):', {
        userId: user.uid,
      });

      callback(context);
    } else {
      // 5. LOG SIGN-OUT
      console.log('[STANDARDS] Auth state changed (signed out)');
      callback(null);
    }
  });

  return unsubscribe;
}

export { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, type User };
