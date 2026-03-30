"use client";
import React, { useState } from "react";
import HomeSectionHeader from "./HomeSectionHeader";

const HomeAvailability = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [availability] = useState([]);

  const formatToAmPm = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const groupedByDoctor = availability.reduce((acc, curr) => {
    const id = curr.doctor.id;
    if (!acc[id]) acc[id] = { doctor: curr.doctor, schedule: {} };
    acc[id].schedule[curr.dayOfWeek] = `${formatToAmPm(curr.startTime)} – ${formatToAmPm(curr.endTime)}`;
    return acc;
  }, {});

  const doctorRows = Object.values(groupedByDoctor);

  if (doctorRows.length === 0) return null; // Don't render if no data

  return (
    <div className="bg-white py-20 px-6 md:px-12 lg:px-24">
      <HomeSectionHeader
        tag="Availability"
        title="Doctor's Schedule"
        description="Check each physician's weekly availability and working hours to plan your consultation."
      />

      <div className="overflow-x-auto mt-8 rounded-2xl border border-slate-200 shadow-lg fade-in">
        <table className="min-w-full bg-white text-center text-sm text-slate-700">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <th className="py-4 px-6 font-bold text-left rounded-tl-2xl">Physician</th>
              {days.map((day, i) => (
                <th key={day} className={`py-4 px-3 font-semibold ${i === days.length - 1 ? 'rounded-tr-2xl' : ''}`}>
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctorRows.map((doc, idx) => (
              <tr key={doc.doctor.id} className={`hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.doctor.imageUrl || "/default-doctor.png"}
                      alt={doc.doctor.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">{doc.doctor.name}</div>
                      <div className="text-xs font-medium text-blue-600">{doc.doctor.specialty?.name}</div>
                    </div>
                  </div>
                </td>
                {days.map((day) => (
                  <td key={day} className="py-4 px-3">
                    {doc.schedule[day] ? (
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                        {doc.schedule[day]}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-medium">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeAvailability;
