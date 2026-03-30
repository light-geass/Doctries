"use client";

import React from "react";
import { useRouter } from "next/navigation"; // app router
import { SlCalender } from "react-icons/sl";
import { FaRegClock, FaRegHeart, FaRegComment } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";

const BlogCards = ({ id, image, date, description, title, author }) => {
  const router = useRouter();

  const finalImageUrl = image || "/placeholder.png";

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    const isoDate = `${year}-${month}-${day}`;
    const dateObj = new Date(isoDate);

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const dayWithOrdinal = getOrdinal(dateObj.getDate());
    const monthName = dateObj.toLocaleString("default", { month: "long" });
    const yearNum = dateObj.getFullYear();

    return `${dayWithOrdinal} ${monthName}, ${yearNum}`;
  };

  return (
    <div
      onClick={() => router.push(`/blogs/${id}`)}
      className="shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition "
    >
      <div>
        <img
          src={finalImageUrl}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>
      <div className="p-7 grid gap-2">
        <div className="flex justify-between text-[13.5px] text-[#8492A6] mt-1">
          <div className="flex gap-1 items-center">
            <SlCalender className="text-black" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex gap-1 items-center">
            <FaRegClock className="text-black" />
            <span>5 min read</span>
          </div>
        </div>

        <div className="text-[16px] text-black font-semibold">{title}</div>
        

        <div className="flex justify-between text-[15px] mt-3">
          <div className="flex gap-7 text-[#8492A6]">
            <div className="flex gap-1 items-center">
              <FaRegHeart />
              <p>33</p>
            </div>
            <div className="flex gap-1 items-center">
              <FaRegComment />
              <p>08</p>
            </div>
          </div>

          <div className="flex gap-1 items-center text-[#396cf0] font-medium">
            <span>Read more</span>
            <MdKeyboardArrowRight className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCards;
