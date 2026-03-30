'use client';

import { 
  CpuChipIcon, 
  ChatBubbleLeftRightIcon, 
  ShieldCheckIcon, 
  MagnifyingGlassIcon, 
  BeakerIcon,
  BellAlertIcon,
  CalendarIcon,
  CommandLineIcon
} from "@heroicons/react/24/outline";

const AgenticFlowVisualizer = ({ details }) => {
  // Define node positions for calculation (Simulated Canvas)
  const nodes = {
    input: { x: 50, y: 200, label: 'User Intake', icon: ChatBubbleLeftRightIcon, color: 'blue' },
    supervisor: { x: 300, y: 100, label: 'Supervisor AI', icon: ShieldCheckIcon, color: 'purple', sub: 'Validation' },
    diagnostic: { x: 300, y: 300, label: 'Diagnostic AI', icon: MagnifyingGlassIcon, color: 'indigo', sub: 'Scanner' },
    pharmacist: { x: 550, y: 200, label: 'Pharmacist AI', icon: BeakerIcon, color: 'emerald', sub: 'Prescription' },
    triage: { x: 800, y: 200, label: 'Triage Agent', icon: CpuChipIcon, color: 'red', sub: 'Analysis' },
    twilio: { x: 1050, y: 100, label: 'Twilio Alert', icon: BellAlertIcon, color: 'red', active: details?.twilio_alert?.triggered },
    calendar: { x: 1050, y: 300, label: 'GCal Booking', icon: CalendarIcon, color: 'emerald', active: details?.calendar_booking?.booked }
  };

  // Helper to draw curved SVG line
  const Connection = ({ from, to, color = 'slate-700', dash = false }) => {
    const startX = nodes[from].x + 120;
    const startY = nodes[from].y + 40;
    const endX = nodes[to].x;
    const endY = nodes[to].y + 40;
    
    // Control points for Bezier curve
    const cp1X = startX + (endX - startX) / 2;
    const cp1Y = startY;
    const cp2X = startX + (endX - startX) / 2;
    const cp2Y = endY;

    const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    return (
      <path 
        d={path} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        className={`text-${color} ${dash ? 'stroke-dasharray-4 animate-dash' : 'opacity-40 animate-pulse'}`}
      />
    );
  };

  return (
    <div className="w-full bg-[#121417] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative mb-10 h-[500px] select-none group">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 0)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="absolute top-6 left-8 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <CommandLineIcon className="w-3 h-3" /> Live Orchestration Engine: category_meditech_v3
        </span>
      </div>

      <div className="absolute bottom-6 right-8 flex gap-4">
        <div className="bg-[#1a1d21] border border-slate-800 px-4 py-2 rounded-xl text-[10px] text-slate-500 flex items-center gap-2 shadow-xl">
           <div className="w-2 h-2 rounded-full bg-blue-500/20 border border-blue-500"></div>
           GPT-4o Ready
        </div>
        <div className="bg-[#1a1d21] border border-slate-800 px-4 py-2 rounded-xl text-[10px] text-slate-500 flex items-center gap-2 shadow-xl">
           <div className="w-2 h-2 rounded-full bg-purple-500/20 border border-purple-500"></div>
           Self-Correction Loop Active
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="w-[1250px] h-full relative p-10">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Connections */}
            <Connection from="input" to="supervisor" color="blue-500/40" />
            <Connection from="input" to="diagnostic" color="blue-500/40" />
            <Connection from="supervisor" to="pharmacist" dash={true} color="purple-500/60" />
            <Connection from="diagnostic" to="pharmacist" color="indigo-500/40" />
            <Connection from="pharmacist" to="triage" color="emerald-500/40" />
            <Connection from="triage" to="twilio" color="red-500/60" dash={nodes.twilio.active} />
            <Connection from="triage" to="calendar" color="emerald-500/60" dash={nodes.calendar.active} />
          </svg>

          {/* Nodes */}
          {Object.entries(nodes).map(([key, node]) => (
            <div 
              key={key}
              style={{ left: node.x, top: node.y }}
              className={`absolute w-36 bg-[#1a1d21] border-2 rounded-2xl p-4 shadow-2xl transition-all hover:scale-105 z-20 cursor-default
                ${node.active ? `border-${node.color}-500 shadow-${node.color}-500/20` : 'border-slate-800 opacity-90'}
                ${key === 'supervisor' ? 'group/supervisor' : ''}
              `}
            >
              {/* Connector dots */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1d21] border-2 border-slate-700 rounded-full"></div>
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1d21] border-2 border-slate-700 rounded-full"></div>

              <div className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-xl mb-2 flex items-center justify-center bg-${node.color}-500/10 border border-${node.color}-500/20 shadow-inner`}>
                  <node.icon className={`w-5 h-5 text-${node.color}-400`} />
                </div>
                <h4 className="text-[11px] font-bold text-white truncate w-full">{node.label}</h4>
                {node.sub && <span className="text-[8px] text-slate-500 uppercase tracking-tighter mt-0.5">{node.sub}</span>}
                
                {node.active && (
                   <div className={`mt-2 px-2 py-0.5 rounded-full bg-${node.color}-500/20 border border-${node.color}-500/30 text-[7px] font-bold text-${node.color}-400 uppercase`}>
                     Executed
                   </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        .stroke-dasharray-4 {
          stroke-dasharray: 4;
          stroke-dashoffset: 40;
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #121417;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AgenticFlowVisualizer;
