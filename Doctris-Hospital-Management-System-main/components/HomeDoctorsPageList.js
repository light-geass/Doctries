"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/features/doctors/doctorsSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeDoctorsPageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctorsList: doctors, status } = useSelector((state) => state.doctors);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  const loading = status === "loading" || status === "idle";

  const filteredDoctors = doctors.filter((doctor) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(lowerSearch) ||
      doctor.specialization?.toLowerCase().includes(lowerSearch) ||
      doctor.location?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="px-50 pb-10">
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search by doctor name, specialty, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => router.push(`/doctors/${doctor.id}`)}
              className="border border-[#ebf0fd] rounded-xl cursor-pointer hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {doctor.name.split(" ").slice(1).map(n => n[0]).join("")}
                </span>
              </div>
              <div className="px-6 py-4 text-center">
                <h2 className="font-semibold text-lg text-gray-900">{doctor.name}</h2>
                <p className="text-[13px] text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-[11px] text-gray-400 mt-1 truncate">{doctor.location}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No doctors found matching your search.
        </p>
      )}
    </div>
  );
}
