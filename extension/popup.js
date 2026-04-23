/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.POPUP.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = popup — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = extension/popup.js
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/*
 * ----------------------------------------------------------------------------
 * 5W + H SYSTEM MANIFEST (LEEWAY STANDARDS)
 * ----------------------------------------------------------------------------
 * WHAT: Popup script for the LeeWay Unified Edge extension
 * WHY: Handles user interaction within the browser action popup by opening
 *      the integrated PWA page in a new tab. This allows users to access
 *      the unified GPU/RTC interface directly from the toolbar.
 * WHO: Creator: Leonard Lee | Leeway Innovations | A Leeway Industries Creation
 * WHERE: Browser extension context
 * WHEN: On click of the launch button within the popup
 * HOW: Uses the Chrome extensions API (`chrome.tabs.create`) to open the
 *      bundled `index.html` included within the extension package.
 * TAG: UI.PUBLIC.SCRIPT.EXTENSION.POPUP
 * REGION: 🔵 UI
 * DISCOVERY_PIPELINE:
 *   Voice → Intent → Location → Vertical → Ranking → Render
 * ----------------------------------------------------------------------------
 */

document.getElementById('launchBtn').addEventListener('click', () => {
  // Create a new tab pointing at the extension's bundled PWA page. The
  // `chrome.runtime.getURL` function resolves to a fully qualified URL
  // within the extension package.
  const url = chrome.runtime.getURL('index.html');
  chrome.tabs.create({ url });
});