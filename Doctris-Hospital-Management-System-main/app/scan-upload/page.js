"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { uploadScanThunk } from "@/features/scans/scansSlice";
import { addNotification } from "@/features/ui/uiSlice";
import { 
  CloudArrowUpIcon, 
  BeakerIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  PhotoIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import Skeleton from "@/components/Skeleton";
import AgentScanning from "@/components/AgentScanning";

const ScanUploadPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, medicalData } = useSelector((state) => state.patients);
  const { uploadStatus, error } = useSelector((state) => state.scans);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (error) {
      dispatch(addNotification({ type: "error", message: error }));
    }
  }, [error, dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        dispatch(addNotification({ type: "warning", message: "File size too large. Max 10MB allowed." }));
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      dispatch(addNotification({ type: "warning", message: "Please select a file first." }));
      return;
    }

    const result = await dispatch(uploadScanThunk({
      file,
      userId: user.id,
      patientData: medicalData || {}
    }));

    if (uploadScanThunk.fulfilled.match(result)) {
      setAnalysisResult(result.payload.result);
      dispatch(addNotification({ type: "success", message: "AI Analysis Complete!" }));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push("/results")} 
          className="mb-8 flex items-center gap-2 transition-colors font-bold group"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to My Reports
        </button>

        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>AI Medical Scan Analysis</h1>
          <p className="mt-2 text-lg" style={{ color: 'var(--text-muted)' }}>Upload your X-ray, MRI, or CT scan for instant AI-powered diagnostic insights.</p>
        </div>

        {/* Upload Card */}
        <div className="card rounded-[40px] shadow-2xl overflow-hidden fade-in perspective-1000" style={{ animationDelay: "0.1s" }}>
          <div className="p-10 tilt-3d">
            
            {!preview ? (
              <label className="border-4 border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}>
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <CloudArrowUpIcon className="h-10 w-10 text-blue-600" />
                </div>
                <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>Drop your medical scan here</span>
                <span className="text-sm mt-2 font-medium" style={{ color: 'var(--text-light)' }}>Supports JPG, PNG (Max 10MB)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="space-y-8">
                <div className="relative rounded-[32px] overflow-hidden aspect-video flex items-center justify-center group shadow-inner" style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <img src={preview} alt="Scan Preview" className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  <button 
                    onClick={() => {setPreview(null); setFile(null); setAnalysisResult(null)}} 
                    className="absolute top-6 right-6 backdrop-blur-md p-3 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95"
                    title="Remove Image"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 90%, transparent)', color: 'var(--text-light)' }}
                  >
                    <ExclamationCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {uploadStatus !== "loading" && !analysisResult && (
                  <button 
                    onClick={handleUpload}
                    className="w-full btn-primary h-16 text-lg font-black uppercase tracking-widest justify-center shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
                  >
                    <div className="scan-line" />
                    <div className="relative z-10 flex items-center gap-3">
                      <BeakerIcon className="h-6 w-6 group-hover:rotate-[360deg] transition-transform duration-700" />
                      Launch AI Diagnosis
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* AI Agent Analysis Simulation */}
            {uploadStatus === "loading" && (
              <div className="fade-in">
                <AgentScanning />
              </div>
            )}

            {/* Success / Analysis Result */}
            {analysisResult && (
              <div className="mt-10 space-y-8 fade-in">
                <div className="p-8 rounded-[32px] flex items-start gap-6" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-600 leading-tight">Analysis Success</h3>
                    <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Preliminary report has been generated and saved to your records.</p>
                  </div>
                </div>

                <div className="p-10 card rounded-[32px] shadow-xl space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-light)' }}>Diagnostic Findings</span>
                      <h4 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text)' }}>{analysisResult.diagnosis}</h4>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-light)' }}>Confidence Index</span>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-blue-600">{analysisResult.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h5 className="font-black text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text)' }}>
                        <BeakerIcon className="h-4 w-4" style={{ color: 'var(--text-light)' }} /> Observation Key
                      </h5>
                      <ul className="space-y-3">
                        {analysisResult.findings?.map((f, i) => (
                          <li key={i} className="text-sm font-medium flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                            <span className="text-blue-500 font-black">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-black text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text)' }}>
                        <PhotoIcon className="h-4 w-4" style={{ color: 'var(--text-light)' }} /> Next Actions
                      </h5>
                      <ul className="space-y-3">
                        {analysisResult.recommendations?.map((r, i) => (
                          <li key={i} className="text-sm font-medium flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)', color: 'var(--text-muted)' }}>
                            <span className="text-emerald-500 font-black">→</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push("/results")}
                    className="w-full bg-slate-900 text-white rounded-2xl h-16 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 duration-200 mt-6"
                  >
                    View Comprehensive Full Report
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose opacity-60" style={{ color: 'var(--text-light)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Legal Disclaimer:</span> This AI analysis is purely informational. It must be validated by a certified medical specialist. Not a substitute for professional clinical advice.
        </p>

      </div>
    </div>
  );
};

export default ScanUploadPage;
