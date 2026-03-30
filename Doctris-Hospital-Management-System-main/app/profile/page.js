"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientProfile, fetchPatientMedicalData } from "@/features/patients/patientsSlice";
import { addNotification } from "@/features/ui/uiSlice";
import { Tab } from "@headlessui/react";
import { 
  UserCircleIcon, 
  MapPinIcon, 
  PhoneIcon, 
  BeakerIcon, 
  InformationCircleIcon,
  IdentificationIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import insforge from "@/utils/insforge";
import Skeleton from "@/components/Skeleton";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, patient, medicalData: reduxMedicalData, medicalDataStatus, status } = useSelector((state) => state.patients);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    birthday: "",
    phone_number: "",
    address: "",
    blood_group: "",
    introduction: "",
  });

  const [medicalData, setMedicalData] = useState({
    age: "",
    symptoms: "",
    medical_history: "",
    notes: "",
  });
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);

  useEffect(() => {
    if (user?.id) {
      if (!patient && status === "idle") dispatch(fetchPatientProfile(user.id));
      if (!reduxMedicalData && medicalDataStatus === "idle") dispatch(fetchPatientMedicalData(user.id));
    }
  }, [user?.id, dispatch, patient, reduxMedicalData, status, medicalDataStatus]);

  useEffect(() => {
    if (patient) {
      setFormData({
        first_name: patient.first_name || "",
        last_name: patient.last_name || "",
        gender: patient.gender || "",
        birthday: patient.birthday || "",
        phone_number: patient.phone_number || "",
        address: patient.address || "",
        blood_group: patient.blood_group || "",
        introduction: patient.introduction || "",
      });
    }
  }, [patient]);

  useEffect(() => {
    if (reduxMedicalData) {
      setMedicalData({
        age: reduxMedicalData.age || "",
        symptoms: Array.isArray(reduxMedicalData.symptoms) ? reduxMedicalData.symptoms.join(", ") : "",
        medical_history: typeof reduxMedicalData.medical_history === "object" ? JSON.stringify(reduxMedicalData.medical_history, null, 2) : (reduxMedicalData.medical_history || ""),
        notes: reduxMedicalData.notes || "",
      });
    }
  }, [reduxMedicalData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicalChange = (e) => {
    setMedicalData({ ...medicalData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingProfile(true);

    const { error } = await insforge.database
      .from("patients")
      .upsert({ ...formData, user_id: user.id });

    if (error) {
      dispatch(addNotification({ type: "error", message: error.message || "Profile update failed." }));
    } else {
      dispatch(fetchPatientProfile(user.id));
      dispatch(addNotification({ type: "success", message: "Profile updated successfully!" }));
    }
    setSavingProfile(false);
  };

  const handleMedicalSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingMedical(true);

    const symptomsArray = medicalData.symptoms
      ? medicalData.symptoms.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    let historyObj = {};
    try {
      historyObj = medicalData.medical_history ? JSON.parse(medicalData.medical_history) : { raw: medicalData.medical_history };
    } catch {
      historyObj = { raw: medicalData.medical_history };
    }

    const payload = {
      user_id: user.id,
      age: medicalData.age ? parseInt(medicalData.age) : null,
      symptoms: symptomsArray,
      medical_history: historyObj,
      notes: medicalData.notes || null,
    };

    const { error } = await insforge.database
      .from("patient_medical_data")
      .upsert(payload);

    if (error) {
      dispatch(addNotification({ type: "error", message: error.message || "Medical data save failed." }));
    } else {
      dispatch(fetchPatientMedicalData(user.id));
      dispatch(addNotification({ type: "success", message: "Medical history updated!" }));
    }
    setSavingMedical(false);
  };

  const loading = (status === "loading" || medicalDataStatus === "loading") && !patient;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8">
          <Skeleton className="w-full h-[500px] rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="w-full h-[60px] rounded-2xl" />
            <Skeleton className="w-full h-[600px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_2.5fr] gap-8">
        
        {/* SIDEBAR / LEFT CARD */}
        <aside className="space-y-6 fade-in">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="h-28 bg-gradient-to-br from-blue-600 to-indigo-600"></div>
            <div className="px-6 pb-8 text-center -mt-14">
              <div className="inline-flex h-28 w-28 items-center justify-center rounded-[32px] border-4 border-white bg-blue-100 text-3xl font-black text-blue-600 shadow-2xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-300">
                {patient?.first_name?.[0]?.toUpperCase() || "?"}
              </div>
              <h2 className="mt-6 text-2xl font-black text-slate-900 leading-tight">
                {patient ? `${patient.first_name} ${patient.last_name || ""}` : "Patient"}
              </h2>
              <p className="text-sm font-bold text-slate-400 mt-1">{user?.email}</p>
            </div>
            <div className="border-t border-slate-50 px-8 py-8 space-y-5">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <IdentificationIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gender</span>
                  <span className="font-bold text-slate-700">{patient?.gender || "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                  <UserCircleIcon className="h-5 w-5 text-cyan-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Age</span>
                  <span className="font-bold text-slate-700">{medicalData.age || "—"} Yrs</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <PhoneIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone</span>
                  <span className="font-bold text-slate-700">{patient?.phone_number || "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <HeartIcon className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Blood Group</span>
                  <span className="font-bold text-slate-700">{patient?.blood_group || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <InformationCircleIcon className="h-4 w-4" />
              Intelligence Tip
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium opacity-90">
              Keep your Medical History updated! Our AI diagnostic tools use this data to provide more accurate scan analysis results.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT / RIGHT TABS */}
        <main className="w-full fade-in" style={{ animationDelay: "0.1s" }}>
          <Tab.Group>
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 flex flex-col min-h-[700px] overflow-hidden">
              <Tab.List className="flex bg-slate-50/50 p-2 m-4 rounded-3xl border border-slate-100">
                {["Overview", "Personal Info", "Medical History"].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        "flex-1 px-4 h-14 text-xs font-black uppercase tracking-widest rounded-2xl transition-all outline-none",
                        selected 
                          ? "bg-white text-blue-600 shadow-xl shadow-blue-500/5 ring-1 ring-slate-100" 
                          : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="p-8 md:p-12 flex-grow">
                {/* OVERVIEW TAB */}
                <Tab.Panel className="fade-in space-y-12">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                        <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Introduction</h3>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 relative">
                      <div className="absolute top-4 right-4 text-4xl text-slate-200 font-serif">"</div>
                      <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                        {patient?.introduction || "Explain your current health goals or provide a short bio to help coordinators understand your needs."}
                      </p>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-500/20 group cursor-pointer" onClick={() => router.push("/results")}>
                      <h4 className="text-xl font-black mb-2">Recent Scans</h4>
                      <p className="text-blue-100 text-sm font-medium opacity-80">View and manage your past medical imagery and AI reports.</p>
                      <div className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Explore Dashboard <span>→</span>
                      </div>
                    </div>
                    <div className="p-8 bg-indigo-900 rounded-[32px] text-white shadow-xl shadow-indigo-900/20 group cursor-pointer" onClick={() => router.push("/scan-upload")}>
                      <h4 className="text-xl font-black mb-2">New Diagnosis</h4>
                      <p className="text-indigo-200 text-sm font-medium opacity-80">Get a second opinion from our medical-grade AI agent instantly.</p>
                      <div className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Upload Scan <span>→</span>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* PERSONAL INFO TAB */}
                <Tab.Panel className="fade-in">
                  <div className="max-w-2xl">
                    <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Personal Details</h3>
                    
                    <form className="space-y-6" onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" placeholder="Doe" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identity</label>
                          <div className="relative">
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white appearance-none">
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">⌄</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                          <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Number</label>
                          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" placeholder="+1..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Type</label>
                          <input type="text" name="blood_group" value={formData.blood_group} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" placeholder="O+" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" placeholder="Street, City, Country" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Profile Bio</label>
                        <textarea name="introduction" value={formData.introduction} onChange={handleChange} rows={4} className="input-field p-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white resize-none" placeholder="Provide a brief health overview or short biography..." />
                      </div>

                      <div className="pt-6">
                        <button type="submit" disabled={savingProfile} className="w-full sm:w-auto h-16 px-12 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                          {savingProfile ? <><ArrowPathIcon className="h-6 w-6 animate-spin"/> Syncing...</> : "Apply Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </Tab.Panel>

                {/* MEDICAL HISTORY TAB */}
                <Tab.Panel className="fade-in">
                  <div className="max-w-2xl">
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-tight">Clinical Foundation</h3>
                    <p className="text-slate-500 font-medium mb-10">This high-priority clinical data directly informs our AI diagnostic models.</p>
                    
                    <form className="space-y-8" onSubmit={handleMedicalSubmit}>
                      <div className="space-y-2 max-w-[140px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documented Age</label>
                        <input type="number" name="age" value={medicalData.age} onChange={handleMedicalChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white" placeholder="e.g. 30" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Active Symptoms</label>
                        <textarea name="symptoms" value={medicalData.symptoms} onChange={handleMedicalChange} rows={3} className="input-field p-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white resize-none" placeholder="Describe symptoms e.g. acute chest pain, recurring fatigue..." />
                        <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider opacity-60">Separate with commas for automated pattern recognition.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialized Medical Context (JSON Preferred)</label>
                        <textarea name="medical_history" value={medicalData.medical_history} onChange={handleMedicalChange} rows={6} className="input-field p-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white font-mono text-sm" placeholder='e.g. { "allergies": ["Latex"], "chronic": ["Asthma"] }' />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Clinician Directives</label>
                        <textarea name="notes" value={medicalData.notes} onChange={handleMedicalChange} rows={3} className="input-field p-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white resize-none" placeholder="Any vital context for specialists..." />
                      </div>

                      <div className="pt-6">
                        <button type="submit" disabled={savingMedical} className="w-full sm:w-auto h-16 px-12 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                          {savingMedical ? <><ArrowPathIcon className="h-6 w-6 animate-spin"/> Encrypting & Saving...</> : "Update Medical Intelligence"}
                        </button>
                      </div>
                    </form>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </main>

      </div>
    </div>
  );
};

export default Profile;
