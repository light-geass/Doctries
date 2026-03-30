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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push("/results")} 
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to My Reports
        </button>

        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Medical Scan Analysis</h1>
          <p className="mt-2 text-slate-500 text-lg">Upload your X-ray, MRI, or CT scan for instant AI-powered diagnostic insights.</p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="p-10">
            
            {!preview ? (
              <label className="border-4 border-dashed border-slate-100 rounded-[32px] p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all group">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                  <CloudArrowUpIcon className="h-10 w-10 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-slate-700">Drop your medical scan here</span>
                <span className="text-sm text-slate-400 mt-2 font-medium">Supports JPG, PNG (Max 10MB)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="space-y-8">
                <div className="relative rounded-[32px] overflow-hidden border border-slate-100 aspect-video bg-slate-50 flex items-center justify-center group shadow-inner">
                  <img src={preview} alt="Scan Preview" className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  <button 
                    onClick={() => {setPreview(null); setFile(null); setAnalysisResult(null)}} 
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl text-slate-400 hover:text-rose-600 shadow-xl transition-all hover:scale-110 active:scale-95"
                    title="Remove Image"
                  >
                    <ExclamationCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {uploadStatus !== "loading" && !analysisResult && (
                  <button 
                    onClick={handleUpload}
                    className="w-full btn-primary h-16 text-lg font-black uppercase tracking-widest justify-center shadow-2xl shadow-blue-500/20"
                  >
                    <BeakerIcon className="h-6 w-6 mr-2" />
                    Launch AI Diagnosis
                  </button>
                )}
              </div>
            )}

            {/* Processing State */}
            {uploadStatus === "loading" && (
              <div className="mt-10 p-10 bg-slate-900 rounded-[32px] text-white space-y-8 fade-in">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-white rounded-full animate-spin"></div>
                  <h3 className="text-2xl font-black tracking-tight">AI Engine Processing...</h3>
                  <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
                    Analyzing pixel patterns and cross-referencing with your medical profile for an accurate diagnostic summary.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                  <Skeleton className="h-24 rounded-2xl bg-white/5" />
                  <Skeleton className="h-24 rounded-2xl bg-white/5" />
                </div>
              </div>
            )}

            {/* Success / Analysis Result */}
            {analysisResult && (
              <div className="mt-10 space-y-8 fade-in">
                <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-start gap-6">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-900 leading-tight">Analysis Success</h3>
                    <p className="text-emerald-700 font-medium">Preliminary report has been generated and saved to your records.</p>
                  </div>
                </div>

                <div className="p-10 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-slate-50">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Findings</span>
                      <h4 className="text-4xl font-black text-slate-900 tracking-tight">{analysisResult.diagnosis}</h4>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence Index</span>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-blue-600">{analysisResult.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h5 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                        <BeakerIcon className="h-4 w-4 text-slate-400" /> Observation Key
                      </h5>
                      <ul className="space-y-3">
                        {analysisResult.findings?.map((f, i) => (
                          <li key={i} className="text-slate-600 text-sm font-medium flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                            <span className="text-blue-500 font-black">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                        <PhotoIcon className="h-4 w-4 text-slate-400" /> Next Actions
                      </h5>
                      <ul className="space-y-3">
                        {analysisResult.recommendations?.map((r, i) => (
                          <li key={i} className="text-slate-600 text-sm font-medium flex items-start gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
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
        <p className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose opacity-60">
          <span className="text-slate-500">Legal Disclaimer:</span> This AI analysis is purely informational. It must be validated by a certified medical specialist. Not a substitute for professional clinical advice.
        </p>

      </div>
    </div>
  );
};

export default ScanUploadPage;
