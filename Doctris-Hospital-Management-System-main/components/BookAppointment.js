'use client';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const BookAppointment = () => {
  const [message, setMessage] = useState({ text: "", type: "" }); 

  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    comments: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "Appointments are not yet integrated with the new Insforge backend.", type: "error" }); 
  };

  return (
    <div className="w-4/10 mx-auto my-10 rounded-lg border border-[#ebf0fd] text-[14px] shadow-md">
      <h1 className="text-white font-semibold text-center py-3 bg-[#396cf0] rounded-t-lg">
        Clinic Appointment
      </h1>
      <div className="px-4 py-3">
        {message.text && (
          <div
            className={`text-center mb-3 py-2 rounded-md font-medium ${
              message.type === "success"
                ? "text-green-700 "
                : "text-red-700 "
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <label>Patient Name *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Patient Name"
              className="w-full rounded-sm my-1 border border-[#ebf0fd] px-2 py-1 focus:border-[#396cf0] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-5 my-5">
            <div>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-sm my-1 border border-[#ebf0fd] px-2 py-1 focus:border-[#396cf0] outline-none"
                required
              />
            </div>
            <div>
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full rounded-sm my-1 border border-[#ebf0fd] px-2 py-1 focus:border-[#396cf0] outline-none"
                required
              />
            </div>
          </div>

          <div className="my-3">
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Any comments"
              className="w-full rounded-sm border border-[#ebf0fd] px-2 py-1 focus:border-[#396cf0] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-sm text-white text-center py-2 bg-[#396cf0] hover:bg-blue-600 font-semibold"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
