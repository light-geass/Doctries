"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/features/doctors/doctorsSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomeDoctorsList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctorsList, status } = useSelector((state) => state.doctors);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  const doctors = doctorsList.slice(0, 4);
  const loading = status === "loading" || status === "idle";

  return (
    <div className="px-50">
      {doctors.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-10">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => router.push(`/doctors/${doctor.id}`)}
                className="border-1 border-[#ebf0fd] rounded-xl cursor-pointer hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {doctor.name.split(" ").slice(1).map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="px-10 py-6 text-center">
                  <h2 className="font-semibold text-lg">{doctor.name}</h2>
                  <p className="text-[12px] text-gray-500">{doctor.specialization}</p>
                  <p className="text-[11px] text-gray-400 mt-1 truncate">{doctor.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/doctors"
              className="bg-[#396cf0] text-white px-6 py-2 rounded-md hover:bg-[#2f57c9] transition"
            >
              See More
            </Link>
          </div>
        </>
      ) : (
        <p className="col-span-4 text-center text-gray-500 py-5">
          No doctors available
        </p>
      )}
    </div>
  );
}
