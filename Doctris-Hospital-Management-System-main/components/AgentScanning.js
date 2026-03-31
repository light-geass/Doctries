"use client";
import React, { useState, useEffect } from "react";
import { 
  BeakerIcon, 
  MagnifyingGlassIcon, 
  GlobeAltIcon, 
  BellIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const agents = [
  { 
    id: "radiologist", 
    name: "Radiologist", 
    icon: MagnifyingGlassIcon, 
    color: "text-cyan-400",
    statusText: "Analyzing pixel patterns and anatomical markers...",
    activeGlow: "shadow-cyan-500/20"
  },
  { 
    id: "pharmacist", 
    name: "Pharmacist", 
    icon: BeakerIcon, 
    color: "text-rose-400",
    statusText: "Reviewing medications and potential interactions...",
    activeGlow: "shadow-rose-500/20"
  },
  { 
    id: "websearch", 
    name: "Web Search", 
    icon: GlobeAltIcon, 
    color: "text-blue-400",
    statusText: "Cross-referencing latest clinical research database...",
    activeGlow: "shadow-blue-500/20"
  },
  { 
    id: "triage", 
    name: "Triage", 
    icon: BellIcon, 
    color: "text-amber-400",
    statusText: "Prioritizing case urgency and next clinical steps...",
    activeGlow: "shadow-amber-500/20"
  }
];

export default function AgentScanning() {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const totalDuration = 8000; // 8 seconds total simulation
    const interval = 50;
    const increment = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) return 100;
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Logic to determine which agent is active based on progress
    if (progress < 25) setActiveStep(0);
    else if (progress < 50) setActiveStep(1);
    else if (progress < 75) setActiveStep(2);
    else setActiveStep(3);
  }, [progress]);

  return (
    <div className="mt-10 p-6 lg:p-12 bg-slate-900 rounded-[40px] text-white overflow-hidden relative border border-white/5 shadow-2xl">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] -z-10" />

      {/* Central Spinner Area */}
      <div className="flex justify-center mb-16 relative">
        <div className="halo-ring" />
        <div className="halo-ring" style={{ animationDirection: 'reverse', animationDuration: '4s', width: '110px', height: '110px', marginTop: '-55px', marginLeft: '-55px', borderTopColor: '#3b82f6' }} />
        <div className="relative z-10 w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shadow-inner">
           <BeakerIcon className="w-10 h-10 text-blue-400 animate-pulse" />
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-12 relative z-10">
        {agents.map((agent, index) => {
          const isActive = activeStep === index;
          const isCompleted = activeStep > index || progress === 100;
          const Icon = agent.icon;

          return (
            <div 
              key={agent.id}
              className={`agent-card ${isActive ? 'agent-active' : ''} ${isCompleted ? 'completed shadow-emerald-500/10' : ''}`}
            >
              <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${isActive ? 'scale-110 bg-slate-800 shadow-lg' : 'bg-slate-800/40'}`}>
                {isCompleted ? (
                   <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                ) : (
                   <Icon className={`w-8 h-8 ${isActive ? agent.color : 'text-slate-500'}`} />
                )}
              </div>
              <h4 className={`text-sm font-black tracking-tight mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {agent.name}
              </h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-cyan-400 animate-pulse' : isCompleted ? 'text-emerald-500' : 'text-slate-600'}`}>
                {isActive ? 'Processing...' : isCompleted ? 'Completed' : 'Waiting...'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status Bar Section */}
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight">
             {progress === 100 ? "Analysis Complete" : `${agents[activeStep].name} Agent is active...`}
          </h3>
          <p className="text-sm font-medium text-slate-400 min-h-[1.25rem]">
             {progress === 100 ? "Finalizing your medical report..." : agents[activeStep].statusText}
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 scan-line !w-full !opacity-30" />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>AI Neural Engine</span>
            <span>{Math.round(progress)}% Optimized</span>
        </div>
      </div>
      
    </div>
  );
}
