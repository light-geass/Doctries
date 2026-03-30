'use client';

import { useState, useEffect } from "react";
import AgenticFlowVisualizer from "@/components/AgenticFlowVisualizer";
import Link from "next/link";
import { ArrowLeftIcon, PlayIcon, BeakerIcon, GlobeAltIcon, BoltIcon, CubeTransparentIcon, CommandLineIcon } from "@heroicons/react/24/outline";

export default function WorkflowPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState({
    latency: '142ms',
    throughput: '8.4 ops/s',
    activeAgents: 6,
    uptime: '99.9%'
  });

  const handleTestWorkflow = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0d0f11] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-[#121417]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-lg tracking-tight">System Workflow Orchestrator</h1>
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">v3.1 Beta</span>
            </div>
            <p className="text-xs text-slate-500">Live Agentic Logic Map: hospital_core_v1</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-4 px-4 border-r border-slate-800 mr-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">System Latency</p>
                <p className="text-sm font-mono text-emerald-400">{stats.latency}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Throughput</p>
                <p className="text-sm font-mono text-blue-400">{stats.throughput}</p>
              </div>
           </div>
           <button 
             onClick={handleTestWorkflow}
             disabled={isSimulating}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xl active:scale-95
               ${isSimulating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'}
             `}
           >
             {isSimulating ? (
               <div className="spinner w-4 h-4 border-white/20 border-t-white"></div>
             ) : (
               <PlayIcon className="w-4 h-4" />
             )}
             {isSimulating ? 'Executing Pipeline...' : 'Test Workflow'}
           </button>
        </div>
      </nav>

      <main className="p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-3">
             {/* THE BIG CANVAS */}
             <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[34px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
               <AgenticFlowVisualizer details={isSimulating ? { twilio_alert: { triggered: true }, calendar_booking: { booked: true } } : {} } />
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#121417] rounded-3xl p-6 border border-slate-800 shadow-xl">
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <BoltIcon className="w-4 h-4 text-amber-400" /> Active System Status
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Memory Agent</span>
                      <span className="text-[10px] font-bold text-emerald-400">ONLINE</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Supervisor Hub</span>
                      <span className="text-[10px] font-bold text-emerald-400">ONLINE</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">API Worker Pool</span>
                      <span className="text-[10px] font-bold text-blue-400">IDLE</span>
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl p-6 border border-blue-500/20 shadow-xl">
                <h3 className="text-white font-bold text-sm mb-2">Orchestration Nodes</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">This view provides technical transparency into how multi-agent reasoning is executed and validated across the pipeline.</p>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-center">
                      <GlobeAltIcon className="w-5 h-5 mx-auto text-blue-400 mb-2" />
                      <p className="text-[9px] font-bold uppercase">Web Search</p>
                   </div>
                   <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-center">
                      <CubeTransparentIcon className="w-5 h-5 mx-auto text-purple-400 mb-2" />
                      <p className="text-[9px] font-bold uppercase">Cross-Check</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Console / Logs */}
        <div className="bg-[#121417] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
           <div className="bg-slate-800/50 px-6 py-3 flex items-center justify-between border-b border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CommandLineIcon className="w-3 h-3" /> System Logs
              </span>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500"></div>
              </div>
           </div>
           <div className="p-6 h-48 overflow-y-auto font-mono text-[11px] space-y-2 text-slate-500">
              <p><span className="text-emerald-500">[INFO]</span> Booting Orchestration Service v3.1...</p>
              <p><span className="text-emerald-500">[INFO]</span> Loading GPT-4o Agent Weights...</p>
              <p><span className="text-blue-500">[DEBUG]</span> Connection established with Insforge DB.</p>
              <p><span className="text-blue-500">[DEBUG]</span> Web search spider warmed up.</p>
              <p><span className="text-amber-500">[STATE]</span> Waiting for User Intake Trigger...</p>
              {isSimulating && (
                <>
                  <p className="text-white brightness-125 animate-pulse"><span className="text-emerald-500">[ACTION]</span> RUNNING TEST WORKFLOW...</p>
                  <p className="text-blue-300 ml-4"><span className="text-slate-600">{" > "}</span> Invoking Supervisor.valid()</p>
                  <p className="text-blue-300 ml-4"><span className="text-slate-600">{" > "}</span> Executing Diagnostic SCAN...</p>
                  <p className="text-emerald-300 ml-4"><span className="text-slate-600">{" > "}</span> Pharmacist result received.</p>
                  <p className="text-red-300 ml-4 animate-bounce underline"><span className="text-slate-600">{" > "}</span> CRITICAL Alert: Twilio API Dispatched.</p>
                </>
              )}
           </div>
        </div>

      </main>

      <style jsx>{`
        .spinner {
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
