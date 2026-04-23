/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: UI.COMPONENT.ONBOARDING.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = Onboarding — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = leeway-employment-center/src/components/Onboarding.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Briefcase, Target, Clock, Shield, User, CheckCircle2 } from 'lucide-react';
import { generateAgentFromSurvey } from '@leeway/standards/services/agent-generation-service';
import { Agent } from '../types';
import { AGENTS } from '../data';
import { auth, db, setDoc, doc, OperationType, handleFirestoreError } from '../firebase';

interface OnboardingProps {
  onComplete: (agent: Agent) => void;
}

const BUSINESS_AREAS = [
  { 
    id: 'Operations', 
    name: 'Operations', 
    description: 'Keep daily work organized, tracked, and moving.',
    subfields: ['Scheduling', 'Task Coordination', 'Internal Follow-Up', 'Workflow Management', 'Process Tracking', 'Administrative Support', 'Team Dispatch', 'Calendar/Appointment Handling']
  },
  { 
    id: 'Logistics & Distribution', 
    name: 'Logistics & Distribution', 
    description: 'Move products, vehicles, freight, or materials more efficiently.',
    subfields: ['Dispatch & Routing', 'Land Freight & Trucking', 'Warehouse & Fulfillment', 'Shipping & Receiving', 'Fleet Operations', 'Freight Coordination', 'Air Cargo', 'Maritime Shipping', 'Inventory Movement', 'Load Planning']
  },
  { 
    id: 'Sales & Customer Service', 
    name: 'Sales & Customer Service', 
    description: 'Handle customers, follow-ups, and front-line business communication.',
    subfields: ['Outbound Calls', 'Inbound Support', 'Lead Follow-Up', 'Client Check-Ins', 'Proposal Sending', 'Estimate and Quote Support', 'CRM Updates', 'Appointment Booking', 'Email Response Handling']
  },
  { 
    id: 'Marketing & Outreach', 
    name: 'Marketing & Outreach', 
    description: 'Help attract attention, bring in leads, and keep outreach consistent.',
    subfields: ['Campaign Coordination', 'Email Outreach', 'Social Content', 'Offer Promotion', 'Local Visibility', 'SEO Content Support', 'Prospect Nurturing', 'Brand Consistency']
  },
  { 
    id: 'Website & Technology', 
    name: 'Website & Technology', 
    description: 'Maintain and improve websites, apps, and connected business tools.',
    subfields: ['Website Updates', 'App Support', 'Bug Fixing', 'UI/UX Improvements', 'Form and Automation Setup', 'Integrations', 'Technical Maintenance', 'Dashboard Support', 'Web Content Changes']
  },
  { 
    id: 'Records & Reporting', 
    name: 'Records & Reporting', 
    description: 'Keep documents, reports, metrics, and records accurate and organized.',
    subfields: ['Inventory Records', 'Business Reporting', 'Compliance Documentation', 'KPI Tracking', 'Document Assembly', 'Filing & Organization', 'Dashboard Preparation', 'Audit Support', 'Shipment or Order Records']
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    industry: '' as Agent['industry'] | '',
    workType: '',
    duration: '3 Months (Operational cycle)',
    shift: '09:00 - 17:00'
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const selectedArea = BUSINESS_AREAS.find(a => a.id === formData.industry);

  const filteredEmployees = useMemo(() => {
    if (!formData.industry) return [];
    return AGENTS.filter(a => a.industry === formData.industry);
  }, [formData.industry]);

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert("Please log in first!");
      return;
    }

    setLoading(true);
    try {
      let agentToDeploy: Agent;

      if (selectedAgent) {
        // Use existing template but customize with selected shift/duration
        agentToDeploy = {
          ...selectedAgent,
          id: Math.random().toString(36).substr(2, 9), // New unique ID for this instance
          assignedDuration: formData.duration,
          contract: {
            ...selectedAgent.contract,
            shiftStart: formData.shift.split(' - ')[0],
            shiftEnd: formData.shift.split(' - ')[1] || '17:00'
          }
        };
      } else {
        // Generate new if needed (fallback)
        const generated = await generateAgentFromSurvey({
          ...formData,
          workType: formData.workType,
          duration: formData.duration,
          shift: formData.shift
        });
        
        const agentId = Math.random().toString(36).substr(2, 9);
        agentToDeploy = {
          id: agentId,
          avatar: `https://picsum.photos/seed/${generated.name}/200/200`,
          industry: formData.industry as any,
          field: formData.workType,
          status: 'READY',
          clockStatus: 'CLOCKED_OUT',
          assignedDuration: formData.duration,
          ...(generated as any)
        };
      }

      const finalAgent = { ...agentToDeploy, uid: auth.currentUser.uid };

      // Save to Firestore
      const path = `agents/${finalAgent.id}`;
      try {
        await setDoc(doc(db, 'agents', finalAgent.id), finalAgent);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }

      onComplete(finalAgent as Agent);
    } catch (error) {
      console.error("Oops! Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Choose a Business Area",
      description: "Select the part of your business you want support with.",
      icon: <Briefcase className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BUSINESS_AREAS.map(area => (
            <button
              key={area.id}
              onClick={() => { setFormData({ ...formData, industry: area.id as any }); handleNext(); }}
              className={`p-4 text-left rounded-xl border transition-all ${
                formData.industry === area.id 
                  ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10' 
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="font-black text-xs uppercase tracking-widest mb-2 text-cyan-500/70">Department</div>
              <div className="font-bold text-sm mb-1">{area.name}</div>
              <div className="text-[10px] opacity-70 leading-tight">{area.description}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Choose a Work Type",
      description: "Select the kind of work you need covered.",
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hidden">
          {selectedArea?.subfields.map(sub => (
            <button
              key={sub}
              onClick={() => { setFormData({ ...formData, workType: sub }); handleNext(); }}
              className={`p-3 text-left rounded-xl border transition-all ${
                formData.workType === sub 
                  ? 'border-cyan-500 bg-cyan-500/10 text-white' 
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-bold tracking-tight">{sub}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Choose an Employee",
      description: "Review available employees for this type of work.",
      icon: <User className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2 scrollbar-hidden">
          {filteredEmployees.map(emp => (
            <button
              key={emp.id}
              onClick={() => { setSelectedAgent(emp); handleNext(); }}
              className={`w-full flex items-center gap-4 p-4 text-left rounded-2xl border transition-all ${
                selectedAgent?.id === emp.id
                  ? 'border-cyan-500 bg-cyan-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-xl object-cover grayscale opacity-60" />
              <div className="flex-1">
                <div className="font-bold text-sm">{emp.name}</div>
                <div className="text-[10px] uppercase tracking-widest opacity-50">{emp.role}</div>
                <div className="text-[10px] font-mono mt-1 text-cyan-500/70">{emp.industry} // {emp.field}</div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-20" />
            </button>
          ))}
          <button
            onClick={() => { setSelectedAgent(null); handleNext(); }}
            className={`w-full p-4 text-center rounded-2xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 transition-all font-bold text-xs uppercase tracking-widest`}
          >
            + Auto-Assign Best Fit Employee
          </button>
        </div>
      )
    },
    {
      title: "Review Boundaries",
      description: "Review what this employee can and cannot touch.",
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Can Handle</div>
              <div className="space-y-2">
                {(selectedAgent?.can || ['Standard Operations', 'UI Interaction']).map(c => (
                  <div key={c} className="text-[11px] text-emerald-300/80 flex items-center gap-2">
                    <CheckCircle2 size={10} className="shrink-0" /> <span className="leading-none">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
              <div className="text-[10px] font-black uppercase text-red-500 tracking-widest">Requires Approval</div>
              <div className="space-y-2">
                {(selectedAgent?.cannot || ['Financial exports', 'System deletions']).map(c => (
                  <div key={c} className="text-[11px] text-red-300/80 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> <span className="leading-none">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Projected Employment Doctrine LAW</div>
            <p className="text-[9px] font-mono leading-relaxed text-white/30 lowercase">
              // NO LOCAL DATA PERSISTENCE<br/>
              // ENFORCED DATA WINDOWING<br/>
              // ONE-WAY AGENT EXIT ON SHIFT END
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Confirm Contract",
      description: "Finalize the temporal boundaries and start work.",
      icon: <Clock className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-cyan-500/50 tracking-widest">Shift Window</label>
              <select 
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="09:00 - 17:00">09:00 - 17:00</option>
                <option value="08:00 - 16:00">08:00 - 16:00</option>
                <option value="20:00 - 04:00">Night Shift</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-cyan-500/50 tracking-widest">Deployment Duration</label>
              <select 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="3 Months (Operational cycle)">3 Months</option>
                <option value="1 Month">1 Month</option>
                <option value="1 Week">1 Week</option>
              </select>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white text-black">
            <div className="flex items-center justify-between mb-4">
               <div>
                 <div className="font-black uppercase text-[10px] tracking-tight text-cyan-600">Employee Candidate</div>
                 <div className="text-lg font-black tracking-tight leading-none">{selectedAgent?.name || 'Assigned Worker'}</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                 <User size={20} className="text-black/40" />
               </div>
            </div>
            <div className="text-[10px] font-bold opacity-60 leading-tight">By signing, you authorize this worker to operate within the specific digital lanes defined in the boundaries review.</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/98 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl glass rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(34,211,238,0.4)]">L</div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white">LeeWay</span>
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">Projection.System_v1.2</div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 rounded-[20px] bg-white/5 border border-white/5">
              {steps[step].icon}
            </div>
            <div>
              <h2 className="text-2xl font-black font-sans text-white tracking-tight uppercase italic leading-none mb-1">{steps[step].title}</h2>
              <p className="text-white/40 text-sm font-medium">{steps[step].description}</p>
            </div>
          </div>
          
          <div className="flex gap-1.5 mt-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-700 ${
                  i <= step ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-white/5'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8 min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 pt-0 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              step === 0 ? 'opacity-0 pointer-events-none' : 'text-white/40 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={step === 0 && !formData.industry}
              className="px-8 py-3 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-xl active:scale-95"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-cyan-500 text-black font-black uppercase text-[11px] tracking-[0.2em] flex items-center gap-2 hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              {loading ? (
                <>Deploying Employee <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                <>Meet Your Employee <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
