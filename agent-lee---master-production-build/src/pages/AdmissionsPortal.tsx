/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.PUBLIC.PAGE.ADMISSIONSPORTAL
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdmissionsPortal — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/pages/AdmissionsPortal.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdmissionUser = {
  id: string;
  name: string;
  email: string;
  qrCode: string;
  active: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'leeway_admissions_users';

function randomCode() {
  return `LEEWAY-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

const AdmissionsPortal: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [users, setUsers] = useState<AdmissionUser[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as AdmissionUser[];
    } catch {
      return [];
    }
  });

  const persist = (next: AdmissionUser[]) => {
    setUsers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const createUser = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const next: AdmissionUser[] = [
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        qrCode: randomCode(),
        active: true,
        createdAt: new Date().toISOString(),
      },
      ...users,
    ];

    persist(next);
    setName('');
    setEmail('');
  };

  const activeCount = useMemo(() => users.filter((user) => user.active).length, [users]);

  const toggleActive = (id: string) => {
    persist(users.map((user) => user.id === id ? { ...user, active: !user.active } : user));
  };

  return (
    <section className="admissions-screen">
      <header>
        <p className="gateway-eyebrow">Admin Access</p>
        <h1>Admissions Portal</h1>
        <p>Provision users, assign QR activation codes, and lock/unlock access.</p>
      </header>

      <div className="admissions-grid">
        <form onSubmit={createUser} className="admissions-card">
          <h2>Create or activate user</h2>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="User display name" />
          </label>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="user@domain.com" />
          </label>
          <button type="submit">Generate QR access</button>
          <button type="button" className="secondary" onClick={() => navigate('/motherboard')}>Back to Motherboard</button>
        </form>

        <article className="admissions-card">
          <h2>Live access status</h2>
          <p>{`${activeCount} active / ${users.length} total`}</p>
          <div className="admissions-list">
            {users.map((user) => (
              <div key={user.id} className="admissions-row">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <p className="qr-code">{user.qrCode}</p>
                </div>
                <button onClick={() => toggleActive(user.id)} className={user.active ? 'danger' : ''}>
                  {user.active ? 'Lock' : 'Unlock'}
                </button>
              </div>
            ))}
            {!users.length ? <p>No users yet.</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
};

export default AdmissionsPortal;
