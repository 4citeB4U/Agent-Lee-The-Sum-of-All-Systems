/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.PUBLIC.PAGE.EXPERIENCEGATEWAY
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ExperienceGateway — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/pages/ExperienceGateway.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type PermissionState = {
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
  meshCompute: boolean;
};

type Profile = {
  displayName: string;
  email: string;
  password: string;
  permissions: PermissionState;
  createdAt: string;
};

const PROFILE_KEY = 'leeway_user_profile';
const INTEGRATED_SESSION_KEY = 'leeway_integrated_session';
const SESSION_ISSUER = 'leeway-edge-integrated';
const SESSION_SIGNATURE_SALT = 'LEEWAY_EDGE_V1_TRUST_CONTRACT';

type IntegratedSessionEnvelope = {
  issuer: string;
  subject: string;
  displayName: string;
  permissions: PermissionState;
  issuedAt: string;
  expiresAt: string;
  nonce: string;
  signature: string;
};

const buildSessionSignature = (
  issuer: string,
  subject: string,
  issuedAt: string,
  expiresAt: string,
  nonce: string,
) => {
  const payload = `${issuer}|${subject}|${issuedAt}|${expiresAt}|${nonce}|${SESSION_SIGNATURE_SALT}`;
  return btoa(payload);
};

const createIntegratedSessionEnvelope = (profile: Profile): IntegratedSessionEnvelope => {
  const now = Date.now();
  const issuedAt = new Date(now).toISOString();
  // Session is intentionally short-lived so re-entry always starts at integrated edge.
  const expiresAt = new Date(now + 8 * 60 * 60 * 1000).toISOString();
  const nonce = `${now}-${Math.random().toString(36).slice(2, 10)}`;
  const signature = buildSessionSignature(SESSION_ISSUER, profile.email, issuedAt, expiresAt, nonce);

  return {
    issuer: SESSION_ISSUER,
    subject: profile.email,
    displayName: profile.displayName,
    permissions: profile.permissions,
    issuedAt,
    expiresAt,
    nonce,
    signature,
  };
};

const ExperienceGateway: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: true,
    microphone: true,
    notifications: true,
    meshCompute: true,
  });
  const [stage, setStage] = useState<'auth' | 'intro'>('auth');
  const [launchProgress, setLaunchProgress] = useState(0);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (stage !== 'intro') return;

    const timer = window.setInterval(() => {
      setLaunchProgress((value) => {
        const next = Math.min(value + 2, 100);
        if (next === 100) {
          window.clearInterval(timer);
          window.setTimeout(() => navigate('/motherboard?onboarding=1'), 700);
        }
        return next;
      });
    }, 80);

    return () => window.clearInterval(timer);
  }, [stage, navigate]);

  const permissionSummary = useMemo(() => {
    const active = Object.values(permissions).filter(Boolean).length;
    return `${active}/4 permissions selected`;
  }, [permissions]);

  const updatePermission = (key: keyof PermissionState) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const requestSelectedPermissions = async () => {
    try {
      if (permissions.camera || permissions.microphone) {
        await navigator.mediaDevices.getUserMedia({
          video: permissions.camera,
          audio: permissions.microphone,
        });
      }
    } catch {
      // Allow entry even if denied; explicit consent choices are still recorded.
    }

    try {
      if (permissions.notifications && 'Notification' in window) {
        await Notification.requestPermission();
      }
    } catch {
      // Ignore unsupported/blocked notifications.
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorText('');

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setErrorText('Name, email, and password are all required.');
      return;
    }

    if (password.length < 8) {
      setErrorText('Use a password with at least 8 characters.');
      return;
    }

    await requestSelectedPermissions();

    const profile: Profile = {
      displayName: displayName.trim(),
      email: email.trim().toLowerCase(),
      password,
      permissions,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    const sessionEnvelope = createIntegratedSessionEnvelope(profile);
    localStorage.setItem(INTEGRATED_SESSION_KEY, JSON.stringify(sessionEnvelope));
    setStage('intro');
  };

  if (stage === 'intro') {
    return (
      <section className="theater-stage">
        <div className="galaxy-loader" aria-hidden="true">
          <div className="galaxy-core" />
          <div className="galaxy-arm galaxy-arm-a" />
          <div className="galaxy-arm galaxy-arm-b" />
          <div className="galaxy-arm galaxy-arm-c" />
          <div className="star-field" />
        </div>

        <div className="theater-overlay">
          <h1>Welcome to the LeeWay Universe</h1>
          <p>Galaxy formation in progress. Preparing your Room on the Edge.</p>
          <div className="progress-shell" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={launchProgress}>
            <div className="progress-fill" style={{ width: `${launchProgress}%` }} />
          </div>
          <p className="progress-label">{launchProgress}% synchronized</p>
        </div>
      </section>
    );
  }

  return (
    <section className="gateway-screen">
      <div className="gateway-background" aria-hidden="true" />
      <div className="gateway-panel">
        <p className="gateway-eyebrow">Public Entry Point</p>
        <h1>Enter the World of Agents</h1>
        <p className="gateway-subtitle">
          Login and permissions are handled together. Once approved, the cinematic launch begins immediately.
        </p>

        <form onSubmit={onSubmit} className="gateway-form">
          <label>
            Name you want Agent Lee to use
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Example: Leo"
              autoComplete="name"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </label>

          <fieldset>
            <legend>Permissions</legend>
            <label className="permission-row">
              <input type="checkbox" checked={permissions.camera} onChange={() => updatePermission('camera')} />
              <span>Camera access</span>
            </label>
            <label className="permission-row">
              <input type="checkbox" checked={permissions.microphone} onChange={() => updatePermission('microphone')} />
              <span>Microphone access</span>
            </label>
            <label className="permission-row">
              <input type="checkbox" checked={permissions.notifications} onChange={() => updatePermission('notifications')} />
              <span>Notifications</span>
            </label>
            <label className="permission-row">
              <input type="checkbox" checked={permissions.meshCompute} onChange={() => updatePermission('meshCompute')} />
              <span>Mesh compute participation (optional distributed power)</span>
            </label>
          </fieldset>

          <div className="gateway-footer">
            <span>{permissionSummary}</span>
            <button type="submit">Launch Experience</button>
          </div>

          {errorText ? <p className="form-error">{errorText}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default ExperienceGateway;
