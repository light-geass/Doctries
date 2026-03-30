"use client";

export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { fetchScanResults } from "@/features/results/resultsSlice";
import { addNotification } from "@/features/ui/uiSlice";
import Skeleton from "@/components/Skeleton";
import { 
  ArrowLeftIcon, 
  BeakerIcon, 
  PhotoIcon, 
  ExclamationCircleIcon,
  HandThumbUpIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

const ResultDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.results);

  useEffect(() => {
    if (items.length === 0 && status === "idle") {
      dispatch(fetchScanResults());
    }
  }, [dispatch, status, items.length]);

  useEffect(() => {
    if (error) {
      dispatch(addNotification({ type: "error", message: error }));
    }
  }, [error, dispatch]);

  const result = items.find(item => item.id === id);
  const loading = (status === "loading" || status === "idle") && !result;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <Skeleton className="w-48 h-6 rounded-md" />
          <div className="bg-white rounded-[40px] overflow-hidden border border-slate-100 p-0 shadow-lg">
            <Skeleton className="w-full h-80 rounded-none" />
            <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Skeleton className="w-full aspect-square rounded-3xl" />
              <div className="space-y-6">
                <Skeleton className="w-1/2 h-8" />
                <Skeleton className="w-full h-24 rounded-2xl" />
                <Skeleton className="w-full h-24 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result && status === "succeeded") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Report not found</h2>
        <Link href="/results" className="text-blue-600 hover:underline font-bold mt-4 flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Back to reports
        </Link>
      </div>
    );
  }

  const details = result?.details || {};

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto fade-in">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/results" 
            className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Reports
          </Link>
        </div>

        {/* Report Container */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Top Banner */}
          <div className="bg-slate-900 px-10 py-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-blue-500 rounded-full flex items-center gap-1.5">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Report</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {dayjs(result?.created_at).format('MMM DD, YYYY • HH:mm')}
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    {result?.diagnosis}
                </h1>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                 <div className="flex items-center gap-2">
                    <span className="text-4xl font-black text-blue-400">{Math.round(result?.confidence)}%</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Model Confidence Score</span>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-12">
            
            {/* Image and Severity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 aspect-square flex items-center justify-center group shadow-sm">
                <img 
                  src={result?.scans?.file_url} 
                  alt="Medical Scan" 
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Diagnostic Priority</h3>
                  <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border ${
                    details.severity === 'high' || details.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    <ExclamationCircleIcon className="h-6 w-6" />
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-black uppercase tracking-widest">{details.severity || 'MODERATE'} SEVERITY</span>
                      <span className="text-[10px] opacity-70 mt-1">Specialist Consultation Recommended</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Patient Profile (Report Time)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scan ID</p>
                      <p className="font-bold text-slate-900">HMS-{result?.id?.toString().padStart(6, '0')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Source Device</p>
                      <p className="font-bold text-slate-900">Standard {result?.scans?.file_type?.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                   <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <BeakerIcon className="h-4 w-4" /> AI Model Engine
                   </h3>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-blue-900/60 font-medium">Model</span>
                       <span className="text-blue-900 font-bold">{result?.model_used}</span>
                     </div>
                     <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{width: `${result?.confidence}%`}}></div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Findings and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-50">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                      <PhotoIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Findings</h3>
                  </div>
                  <ul className="space-y-4">
                    {details.findings?.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-slate-900">
                        <span className="text-xs font-bold text-slate-300 transition-colors">{i+1}</span>
                        <p className="text-slate-600 text-sm leading-relaxed">{f}</p>
                      </li>
                    ))}
                  </ul>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <HandThumbUpIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Next Steps</h3>
                  </div>
                  <ul className="space-y-4">
                    {details.recommendations?.map((r, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-50/50 border-l-4 border-l-blue-600">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                        <p className="text-slate-700 text-sm font-medium leading-relaxed">{r}</p>
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            {/* Specialist Connect */}
            <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="max-w-md">
                <h3 className="text-2xl font-black mb-2">Connect with a Specialist</h3>
                <p className="text-blue-100 text-sm font-medium opacity-80">
                  Discuss this report with one of our certified radiologists or medical specialists for a final clinical judgment.
                </p>
              </div>
              <Link href="/doctors" className="bg-white text-blue-600 px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl shadow-blue-900/20 active:scale-95 duration-200 flex items-center justify-center shrink-0">
                Book Consultation Now
              </Link>
            </div>

          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-2xl mx-auto leading-loose">
          REPORT ID: {result?.id} | GENERATED AT: {result?.created_at} | THIS DOCUMENT IS PRODUCED FOR PATIENT AWARENESS AND PRE-DIAGNOSTIC GUIDANCE.
        </p>

      </div>
    </div>
  );
};

export default ResultDetailPage;
