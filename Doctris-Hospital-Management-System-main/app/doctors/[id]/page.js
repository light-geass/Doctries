"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import insforge from "@/utils/insforge";
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";
import Skeleton from "@/components/Skeleton";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/ui/uiSlice";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const { data, error } = await insforge.database
          .from("doctors")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setDoctor(data);
      } catch (err) {
        dispatch(addNotification({ type: "error", message: "Failed to load doctor profile." }));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id, dispatch]);

  const handleGetDirections = (travelMode = "driving") => {
    if (!doctor) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(doctor.location)}&travelmode=${travelMode}`,
            "_blank"
          );
        },
        () => {
          window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.location)}`, "_blank");
        }
      );
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.location)}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Skeleton className="w-48 h-6 rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full h-[400px] rounded-2xl" />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="w-full h-[400px] rounded-2xl" />
              <Skeleton className="w-full h-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-32">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
        <Link href="/doctors" className="text-blue-600 hover:underline font-bold mt-4 flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Back to doctors
        </Link>
      </div>
    );
  }

  const initials = doctor.name.split(" ").slice(1).map(n => n[0]).join("") || doctor.name[0];
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(doctor.location)}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to all doctors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Profile Card */}
          <div className="lg:col-span-2 space-y-6 fade-in">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              {/* Avatar Header */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-10 flex flex-col items-center text-white">
                <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-black shadow-2xl mb-6">
                  {initials}
                </div>
                <h1 className="text-3xl font-black tracking-tight">{doctor.name}</h1>
                <span className="mt-3 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-widest">
                  {doctor.specialization}
                </span>
              </div>

              {/* Contact Info */}
              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinic Location</span>
                    <span className="text-slate-700 font-semibold">{doctor.location}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hours</span>
                    <span className="text-slate-700 font-semibold">{doctor.availability}</span>
                  </div>
                </div>
                {doctor.phone && (
                  <div className="flex items-start gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <PhoneIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</span>
                      <a href={`tel:${doctor.phone}`} className="text-blue-600 font-bold hover:underline">{doctor.phone}</a>
                    </div>
                  </div>
                )}
                {doctor.email && (
                  <div className="flex items-start gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <EnvelopeIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                      <a href={`mailto:${doctor.email}`} className="text-blue-600 font-bold hover:underline truncate block max-w-[180px]">{doctor.email}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="px-8 pb-8 space-y-3">
                <button
                  onClick={() => handleGetDirections("driving")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all"
                >
                  <MapPinIcon className="w-5 h-5" />
                  Get Google Maps Directions
                </button>
              </div>
            </div>
          </div>

          {/* Right: Map + Travel Options */}
          <div className="lg:col-span-3 space-y-6 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-black text-slate-800">Interactive Map</h3>
                </div>
              </div>
              <div className="relative w-full aspect-video md:aspect-[4/3] lg:h-[450px]">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${doctor.location}`}
                ></iframe>
              </div>
            </div>

            {/* Travel Mode Options */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-900/30">
              <h3 className="text-xl font-black mb-2">Transport Options</h3>
              <p className="text-sm text-slate-400 mb-8 font-medium italic opacity-80">"Select a mode to launch navigation from your current position"</p>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => handleGetDirections("driving")} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🚗</span>
                  <span className="text-xs font-black uppercase tracking-widest">Drive</span>
                </button>
                <button onClick={() => handleGetDirections("transit")} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🚌</span>
                  <span className="text-xs font-black uppercase tracking-widest">Transit</span>
                </button>
                <button onClick={() => handleGetDirections("walking")} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🚶</span>
                  <span className="text-xs font-black uppercase tracking-widest">Walk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
