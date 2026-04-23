/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.TOPBAR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = TopBar — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/components/TopBar.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { Search, SlidersHorizontal, Layers, Orbit } from 'lucide-react';
import { Agent } from '../types';

interface TopBarProps {
  onFilterChange: (industry: string) => void;
  activeFilter: string;
}

export default function TopBar({ onFilterChange, activeFilter }: TopBarProps) {
  const industries = ['All', 'Operations', 'Logistics & Distribution', 'Sales & Customer Service', 'Marketing & Outreach', 'Website & Technology', 'Records & Reporting'];

  return (
    <div className="sticky top-0 z-40 glass border-x-0 border-t-0 border-b border-white/5 px-8 h-20 flex items-center justify-between backdrop-blur-3xl bg-black/40">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <Orbit size={20} />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight leading-none uppercase">LeeWay Employment Center</h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => onFilterChange(ind)}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${
                activeFilter === ind 
                ? 'bg-white text-black' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search agents..." 
            className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-6 text-xs w-[240px] focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 glass rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <SlidersHorizontal size={18} />
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border-emerald-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">System Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
