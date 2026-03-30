"use client";

import React, { useState, useEffect } from "react";
import HomePatientSaysScroll from "./HomePatientSaysScroll";
import { FaClock } from "react-icons/fa6";
import HomeServices2 from "./HomeServices2";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function DoctorExperienceList({ doctorId }) {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Removed old backend fetch logic


  if (loading) return <p className="text-gray-600 text-center">Loading experience...</p>;

  if (experienceList.length === 0)
    return <p className="text-gray-600 text-center">No experience records available.</p>;

  return (
    <div className="space-y-5">
      {experienceList.map((exp, idx) => (
        <div
          key={idx}
          className=" bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between text-sm text-gray-500">
            <span className="font-medium text-blue-600">
              {exp.startYear} - {exp.endYear || "Present"}
            </span>
            <span className="text-gray-700">{exp.location}</span>
          </div>

          <h4 className="text-lg font-semibold text-gray-800 mt-1">
            {exp.title}
          </h4>

          <p className="text-gray-700">{exp.hospital}</p>

          {exp.description && (
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {exp.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}



export default function DoctorProfileTabs({ doctor, className = "", initialTab = "overview" }) {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "experience", label: "Experience" },
    { key: "reviews", label: "Reviews" },
    { key: "timetable", label: "Timetable" },
  ];

  const [active, setActive] = useState(initialTab);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    // Backend removed
    setTimetable([]);
  }, [doctor?.id]);

  const testimonials = [
    {
      text: "There is now an abundance of readable dummy texts. These are usually used when a text is required purely to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories. ",
      name: "Dean Tolle",
      role: "Patient",
      rating: 5,
      image: "/profileImages/01.jpg",
    },
    {
      text: "There is now an abundance of readable dummy texts. These are usually used when a text is required purely to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories. ",
      name: "Sarah Lewis",
      role: "Manager",
      rating: 4,
      image: "/profileImages/09.jpg",
    },
    {
      text: "There is now an abundance of readable dummy texts. These are usually used when a text is required purely to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories. ",
      name: "John Doe",
      role: "Developer",
      rating: 5,
      image: "/profileImages/01.jpg",
    },
  ];

  return (
    <div className={`bg-white rounded-xl mt-5 p-4 ${className}`}>
      <nav className="grid grid-cols-4 w-full">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`py-3 text-center font-medium focus:outline-none transition-all duration-150 ${active === t.key
              ? "bg-blue-500 text-white shadow"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            aria-current={active === t.key ? "page" : undefined}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="mt-6">
          {active === "overview" && (
            <div className="bg-blue-50 p-4 rounded-xl shadow-md border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {doctor.specialty?.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {doctor.specialty?.description || "No description available for this specialty."}
              </p>
            </div>
          )}

        {active === "experience" && (
          <div className="bg-blue-50 p-5 rounded-xl shadow-md border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Professional Experience
            </h3>

            {doctor?.id ? (
              <DoctorExperienceList doctorId={doctor.id} />
            ) : (
              <p className="text-gray-600 text-center">No doctor selected.</p>
            )}
          </div>
        )}


        {active === "reviews" && (
          <div className="text-gray-700 space-y-4">
            <HomePatientSaysScroll testimonials={testimonials} />
          </div>
        )}

        {active === "timetable" && (
          <div className="grid grid-cols-[3fr_2fr_2fr] gap-5">
            <div className="w-full bg-blue-50 p-5 rounded-xl shadow-md border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Weekly Timings
              </h3>

              <div className="space-y-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => {
                    const daySlots = timetable?.filter((t) => t.dayOfWeek === day);

                    const formatTime = (time24) => {
                      if (!time24) return "";
                      const [hourStr, min] = time24.split(":");
                      let hour = parseInt(hourStr);
                      const ampm = hour >= 12 ? "PM" : "AM";
                      hour = hour % 12 || 12;
                      return `${hour}:${min} ${ampm}`;
                    };

                    const timings =
                      daySlots?.length > 0
                        ? daySlots
                          .map((t) => `${formatTime(t.startTime)} - ${formatTime(t.endTime)}`)
                          .join(", ")
                        : "No timings available";

                    return (
                      <div
                        key={day}
                        className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <span className="text-blue-500"><FaClock /></span>
                          <span>{day}</span>
                        </div>
                        <div className="text-gray-700">
                          <span className="font-semibold text-gray-800">Time:</span>{" "}
                          <span className="text-blue-700">{timings}</span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="p-5 text-center my-auto">
              <HomeServices2 name={"Phone"} desc={"Great doctor if you need your family member to get effective immediate assistance"} icon={<FaPhoneAlt />} link={"+91 8876452653"} />
            </div>
            <div className="p-5 text-center my-auto">
              <HomeServices2 name={"Email"} desc={"Great doctor if you need your family member to get effective immediate assistance"} icon={<MdEmail />} link={"support@gmail.com"} />
            </div>
          </div>
        )}



      </section>
    </div>
  );
}
