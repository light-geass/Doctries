'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import insforge from "@/utils/insforge";
import { SparklesIcon, XMarkIcon, ChevronRightIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ProactiveAgentBanner = () => {
  const { user } = useSelector((state) => state.patients);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user?.id) {
      generateProactiveSuggestion();
    }
  }, [user]);

  const generateProactiveSuggestion = async () => {
    setLoading(true);
    try {
      // 1. Fetch latest scan result
      const { data: latestScan } = await insforge.database
        .from("scan_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latestScan) {
        setLoading(false);
        return;
      }

      // 2. Synthesize proactive follow-up
      const analysis = await insforge.ai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a PROACTIVE HEALTH AGENT. Analyze the patient's latest diagnosis and the current time. 
            Generate a short, empathetic follow-up message (1-2 sentences). 
            If the diagnosis was recent, ask how the recovery is going. 
            If it's been a few days, suggest a check-up or lifestyle adjustment.
            
            OUTPUT ONLY valid JSON:
            {
              "message": "The follow-up text",
              "action_label": "e.g. Book Follow-up | Buy Medicines",
              "action_url": "/doctors or /scan-upload"
            }`
          },
          { 
            role: 'user', 
            content: `Diagnosis: ${latestScan.diagnosis}. Severity: ${latestScan.details?.severity}. Date: ${latestScan.created_at}. Current Date: ${new Date().toISOString()}`
          }
        ]
      });

      const raw = analysis.choices[0].message.content;
      const jsonMatch = raw.match(/```(?:json)?(.*?)```/s);
      const result = JSON.parse(jsonMatch ? jsonMatch[1].trim() : raw);
      
      setSuggestion(result);
    } catch (err) {
      console.error("Proactive Agent Error:", err);
    }
    setLoading(false);
  };

  if (dismissed || !suggestion) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 fade-in">
      <div className="relative overflow-hidden bg-slate-900 rounded-2xl shadow-2xl shadow-blue-900/20 group">
        {/* Animated background element */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 animate-pulse"></div>
        
        <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-400/10 rounded-full border border-blue-400/20">
                Autonomous Assistant
              </span>
              {loading && <div className="spinner w-3 h-3 border-white/30 border-t-white"></div>}
            </div>
            <p className="text-white font-medium leading-relaxed">
              {suggestion.message}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link 
              href={suggestion.action_url || "/doctors"}
              className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2 shadow-xl shadow-white/5 active:scale-95"
            >
              {suggestion.action_label}
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setDismissed(true)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProactiveAgentBanner;
