/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.PUBLIC.PAGE.MOTHERBOARDEXPERIENCE
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = MotherboardExperience — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/pages/MotherboardExperience.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Home from './Home';

type OnboardingCard = {
  title: string;
  text: string;
};

const PROFILE_KEY = 'leeway_user_profile';

const onboardingCards: OnboardingCard[] = [
  {
    title: 'Welcome to the Motherboard',
    text: 'This is your cinematic command gate. Click through each card to unlock full interaction.',
  },
  {
    title: 'Room on the Edge Concept',
    text: 'This screen is your one-time activation surface. After room provisioning and QR assignment, daily work stays in your Room on the Edge.',
  },
  {
    title: 'Privileges and Safety',
    text: 'You can launch Agent Lee OS modules (Launchpad, Code Studio, Creator Studio), recruit specialist worker agents, and monitor execution through controlled permissions.',
  },
  {
    title: 'Center Cube Interaction',
    text: 'Click the center blue cube to open Agent Lee diagnostics and memory systems. This is your direct bridge into the operating intelligence.',
  },
];

const MotherboardExperience: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [cardIndex, setCardIndex] = useState(params.get('onboarding') === '1' ? 0 : onboardingCards.length);
  const [activePanel, setActivePanel] = useState<'pallium' | 'database' | null>(
    params.get('panel') === 'pallium' || params.get('panel') === 'database'
      ? (params.get('panel') as 'pallium' | 'database')
      : null
  );

  const displayName = useMemo(() => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return 'Operator';

    try {
      const parsed = JSON.parse(raw) as { displayName?: string };
      return parsed.displayName?.trim() || 'Operator';
    } catch {
      return 'Operator';
    }
  }, []);

  const hasCard = cardIndex < onboardingCards.length;

  const panelTitle = activePanel === 'pallium' ? 'Pallium Data Core' : 'Database Hub';
  const panelText = activePanel === 'pallium'
    ? 'Each room receives a dedicated Pallium with Memory Lake, file sorting center, and persistent memory control for Agent Lee and workforce agents.'
    : 'Each room includes the full five-database center: coreDB, memoryDB, fileDB, vectorDB, and logDB. This is the live per-room data backbone.';

  return (
    <div className="motherboard-shell">
      <Home />

      <div className="motherboard-topbar">
        <div>
          <p className="topbar-kicker">Agent Lee Active</p>
          <h2>{`Welcome, ${displayName}.`}</h2>
        </div>
        <div className="topbar-actions">
          <button onClick={() => navigate('/diagnostics')}>Enter Room on the Edge</button>
          <button className="secondary" onClick={() => navigate('/admissions')}>Admissions Portal</button>
        </div>
      </div>

      {hasCard ? (
        <div className="onboarding-mask">
          <article className="onboarding-card" role="dialog" aria-modal="true">
            <p className="onboarding-step">Step {cardIndex + 1} of {onboardingCards.length}</p>
            <h3>{onboardingCards[cardIndex].title}</h3>
            <p>{onboardingCards[cardIndex].text}</p>
            <button
              onClick={() => setCardIndex((current) => current + 1)}
            >
              {cardIndex === onboardingCards.length - 1 ? 'Start Exploring' : 'Continue'}
            </button>
          </article>
        </div>
      ) : null}

      {!hasCard && activePanel ? (
        <div className="onboarding-mask">
          <article className="onboarding-card" role="dialog" aria-modal="true">
            <p className="onboarding-step">Live System Panel</p>
            <h3>{panelTitle}</h3>
            <p>{panelText}</p>
            <div className="topbar-actions">
              <button onClick={() => navigate('/diagnostics')}>Open In Diagnostics</button>
              <button className="secondary" onClick={() => setActivePanel(null)}>Close Panel</button>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
};

export default MotherboardExperience;
