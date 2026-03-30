"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientMedicalData } from "@/features/patients/patientsSlice";
import { addNotification } from "@/features/ui/uiSlice";
import AgentChatbot from "./AgentChatbot";
import { usePathname } from "next/navigation";

export default function GlobalChatbot() {
  const dispatch = useDispatch();
  const { user, medicalData, medicalStatus } = useSelector((state) => state.patients);
  const pathname = usePathname();
  
  const [latestScanResult, setLatestScanResult] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // Do not show global bot on the specific results detail page (it has its own instance)
  const isResultDetailRegex = /^\/results\/[0-9]+$/;
  const showChatbot = user && !isResultDetailRegex.test(pathname);

  useEffect(() => {
    if (showChatbot && user?.id && medicalStatus === "idle") {
      dispatch(fetchPatientMedicalData(user.id));
    }
  }, [showChatbot, user?.id, medicalStatus, dispatch]);

  useEffect(() => {
    if (!showChatbot || !user?.id) return;

    const fetchLatestContext = async () => {
      try {
        setLoadingContext(true);
        // Fetch latest scan and its result (we only need the latest scan, patient data is in Redux)
        const { data: latestScan } = await insforge.database
          .from("scans")
          .select("*, scan_results(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestScan && latestScan.scan_results && latestScan.scan_results.length > 0) {
          setLatestScanResult(latestScan.scan_results[0]);
        }
      } catch (err) {
        dispatch(addNotification({ type: "error", message: "Chatbot context failed to load." }));
        console.error("Failed to load chatbot context", err);
      } finally {
        setLoadingContext(false);
      }
    };

    fetchLatestContext();
  }, [user?.id, showChatbot, dispatch]);

  if (!showChatbot || loadingContext || medicalStatus === "loading") return null;


  return <AgentChatbot scanResult={latestScanResult} patientData={medicalData} />;
}
