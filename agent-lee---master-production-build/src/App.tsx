/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.APP.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = App — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = agent-lee---master-production-build/src/App.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExperienceGateway from './pages/ExperienceGateway';
import MotherboardExperience from './pages/MotherboardExperience';
import Home from './pages/Home';
import Diagnostics from './pages/Diagnostics';
import AdmissionsPortal from './pages/AdmissionsPortal';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExperienceGateway />} />
        <Route path="/motherboard" element={<MotherboardExperience />} />
        <Route path="/legacy-home" element={<Home />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/admissions" element={<AdmissionsPortal />} />
      </Routes>
    </Router>
  );
};

export default App;
