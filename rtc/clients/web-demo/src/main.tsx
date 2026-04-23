/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: CLIENT.WEB-DEMO
TAG: CLIENT.ENTRY
WHO = LeeWay Industries | LeeWay Innovation | Creator: Leonard Lee
LICENSE: PROPRIETARY
*/
// CHAIN: Standards → Integrated → Runtime → Projections

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
