"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientProfile, fetchPatientMedicalData } from "@/features/patients/patientsSlice";
import { fetchDoctors } from "@/features/doctors/doctorsSlice";
import { addNotification } from "@/features/ui/uiSlice";
import { Dialog, Transition } from "@headlessui/react";
import { 
  UserCircleIcon, 
  MapPinIcon, 
  PhoneIcon, 
  BeakerIcon, 
  InformationCircleIcon,
  IdentificationIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserGroupIcon
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
  const { doctorsList } = useSelector((state) => state.doctors);

  const [isEditing, setIsEditing] = useState(false);
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
      dispatch(fetchDoctors());
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

  // Extract Mock/Real Metrics
  const metrics = {
    bmi: { value: "22.4", status: "Normal", progress: 65, color: "bg-emerald-500 text-emerald-500" },
    bp: { value: "118/76", status: "Optimal", progress: 75, color: "bg-cyan-500 text-cyan-500" },
    heartRate: { value: "88 bpm", status: "Stable", progress: 45, color: "bg-amber-500 text-amber-500" },
    spO2: { value: "98%", status: "Optimal", progress: 95, color: "bg-emerald-500 text-emerald-500" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-20">
        <Skeleton className="w-full h-[120px] rounded-[32px] mb-8" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[600px] rounded-[32px]" />
          <Skeleton className="w-full h-[600px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-8 px-4 md:px-10 lg:px-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 animate-fade-in">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/30 border-4 transition-transform group-hover:scale-105 duration-500" style={{ borderColor: 'var(--surface)' }}>
                {patient?.first_name?.[0]?.toUpperCase()}{patient?.last_name?.[0]?.toUpperCase() || ""}
                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 rounded-full shadow-lg" style={{ borderColor: 'var(--surface)' }}></div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {patient ? `${patient.first_name} ${patient.last_name || ""}` : "Loading..."}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-slate-400 font-bold text-sm">@{user?.email?.split('@')[0]}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="text-slate-400 font-bold text-sm">Member since Jan 2026</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold active:scale-95"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <PencilSquareIcon className="h-5 w-5 text-rose-500" />
            Edit Profile
          </button>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* PERSONAL INFO CARD */}
            <div className="dashboard-card p-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 pb-4" style={{ color: 'var(--text-light)', borderBottom: '1px solid var(--border)' }}>Personal Info</h3>
              <div className="space-y-7">
                {[
                  { label: "Full Name", value: patient ? `${patient.first_name} ${patient.last_name || ""}` : "—" },
                  { label: "Email", value: user?.email || "—", color: "text-cyan-500" },
                  { label: "Phone", value: patient?.phone_number || "—" },
                  { label: "Location", value: patient?.address || "—" },
                  { label: "Date of Birth", value: patient?.birthday || "—" },
                  { label: "Blood Group", value: patient?.blood_group || "—" },
                ].map((info) => (
                  <div key={info.label} className="group cursor-default">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                    <p className={classNames("text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600", info.color)}>{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* HEALTH METRICS CARD */}
            <div className="dashboard-card p-10">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50">Health Metrics</h3>
              <div className="space-y-8">
                {[
                  { label: "BMI", value: metrics.bmi.value, status: metrics.bmi.status, progress: metrics.bmi.progress, color: metrics.bmi.color },
                  { label: "Blood Pressure", value: metrics.bp.value, status: metrics.bp.status, progress: metrics.bp.progress, color: metrics.bp.color },
                  { label: "Heart Rate", value: metrics.heartRate.value, status: metrics.heartRate.status, progress: metrics.heartRate.progress, color: metrics.heartRate.color },
                  { label: "SpO₂", value: metrics.spO2.value, status: metrics.spO2.status, progress: metrics.spO2.progress, color: metrics.spO2.color },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
                      <div className="text-right">
                        <span className={classNames("text-xs font-black mr-2", metric.color.split(' ')[1])}>{metric.value}</span>
                        <span className="text-slate-300 text-[10px] font-bold">• {metric.status}</span>
                      </div>
                    </div>
                    <div className="metric-bar">
                      <div className={classNames("metric-progress", metric.color.split(' ')[0])} style={{ width: `${metric.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* CURRENT CONDITIONS */}
            <div className="dashboard-card p-10">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50">Current Conditions</h3>
              <div className="space-y-4">
                {[
                  { name: "Acute Urticaria", meta: "Detected Mar 31, 2026 - Active", color: "bg-rose-500", badge: "HIGH", badgeColor: "text-rose-500 bg-rose-50" },
                  { name: "Skin Irritation", meta: "Detected Mar 31, 2026 - Active", color: "bg-amber-400", badge: "MED", badgeColor: "text-amber-600 bg-amber-50" },
                ].map((condition) => (
                  <div key={condition.name} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/50 transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={classNames("w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm", condition.color)}></div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{condition.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{condition.meta}</p>
                      </div>
                    </div>
                    <span className={classNames("badge-premium", condition.badgeColor)}>{condition.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CURRENT MEDICATIONS */}
            <div className="dashboard-card p-10">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50">Current Medications</h3>
              <div className="space-y-5">
                {[
                  { name: "Cetirizine 10mg", dosage: "Once daily at night" },
                  { name: "Calamine Lotion", dosage: "Apply on affected area" },
                  { name: "Hydrocortisone Cream", dosage: "2x daily" },
                ].map((med) => (
                  <div key={med.name} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{med.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium tracking-tight">· {med.dosage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MY DOCTORS */}
            <div className="dashboard-card p-10">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50">My Doctors</h3>
              <div className="space-y-4">
                {(doctorsList.length > 0 ? doctorsList.slice(0, 3) : [
                  { first_name: "Amit", last_name: "Desai", specialization: "Pulmonologist", hospital: "Breach Candy Hospital", color: "bg-blue-500" },
                  { first_name: "Ananya", last_name: "Patel", specialization: "Dermatologist", hospital: "Apollo Hospital, Chennai", color: "bg-rose-500" },
                ]).map((doc) => (
                  <div key={doc.first_name || doc.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={classNames("w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm shadow-black/5", doc.color || "bg-emerald-500")}>
                        {doc.first_name?.[0]}{doc.last_name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Dr. {doc.first_name} {doc.last_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{doc.specialization} · {doc.hospital || "General Physician"}</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-600 hover:text-blue-600 shadow-sm transition-all active:scale-95">Contact</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      <Transition show={isEditing} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEditing(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-8"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-8"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[40px] bg-white p-8 md:p-12 text-left align-middle shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <Dialog.Title className="text-3xl font-black text-slate-900 tracking-tight">Edit Profile</Dialog.Title>
                      <p className="text-slate-400 text-sm mt-2 font-medium">Configure your personal and clinical foundation parameters.</p>
                    </div>
                    <button onClick={() => setIsEditing(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:rotate-90">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Form Section 1 */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <UserCircleIcon className="h-5 w-5" />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">General Access</h4>
                      </div>
                      
                      <form className="space-y-6" onSubmit={handleProfileSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-1 focus:ring-blue-100" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-1 focus:ring-blue-100" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identity</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white">
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
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
                        <button type="submit" disabled={savingProfile} className="w-full h-15 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50">
                          {savingProfile ? "Syncing..." : "Update Base Profile"}
                        </button>
                      </form>
                    </div>

                    {/* Form Section 2 */}
                    <div className="space-y-8">
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <BeakerIcon className="h-5 w-5" />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Medical Intelligence</h4>
                      </div>

                      <form className="space-y-6" onSubmit={handleMedicalSubmit}>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Observations & Symptoms</label>
                          <textarea name="symptoms" value={medicalData.symptoms} onChange={handleMedicalChange} rows={3} className="input-field p-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white resize-none" placeholder="e.g. Recurrent fatigue, skin inflammation..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Context (JSON Structure)</label>
                          <textarea name="medical_history" value={medicalData.medical_history} onChange={handleMedicalChange} rows={6} className="input-field p-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white font-mono text-xs" placeholder='{"metrics": {"bmi": "22.4"}}' />
                          <p className="text-[9px] text-slate-400 font-bold ml-1 uppercase tracking-tight opacity-70">Used by AI Models for high-fidelity diagnostics.</p>
                        </div>
                        <button type="submit" disabled={savingMedical} className="w-full h-15 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-black transition-all disabled:opacity-50">
                          {savingMedical ? "Encrypting..." : "Save Health Intelligence"}
                        </button>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Profile;
