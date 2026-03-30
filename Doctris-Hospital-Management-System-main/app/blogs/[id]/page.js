"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaUser, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import insforge from "@/utils/insforge";
import Skeleton from "@/components/Skeleton";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/ui/uiSlice";

const BlogPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data, error } = await insforge.database
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setBlog(data);
      } catch (err) {
        dispatch(addNotification({ type: "error", message: "Failed to load blog post." }));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, dispatch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      // Handle both DD-MM-YYYY and YYYY-MM-DD
      let dateObj;
      if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts[0].length === 4) {
          dateObj = new Date(dateStr);
        } else {
          const [day, month, year] = parts;
          dateObj = new Date(`${year}-${month}-${day}`);
        }
      } else {
        dateObj = new Date(dateStr);
      }

      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      return `${getOrdinal(dateObj.getDate())} ${dateObj.toLocaleString("default", { month: "long" })}, ${dateObj.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-10 space-y-8">
        <Skeleton className="w-24 h-6 rounded-md" />
        <Skeleton className="w-3/4 h-12 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="w-32 h-5 rounded-md" />
          <Skeleton className="w-32 h-5 rounded-md" />
        </div>
        <Skeleton className="w-full h-[400px] rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Blog Post Not Found</h2>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowLeft /> Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-4 md:px-12 fade-in">
        {/* Navigation */}
        <button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Blogs
        </button>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
              <FaUser className="text-blue-500" />
              <span className="font-semibold text-slate-700">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
              <FaCalendarAlt className="text-cyan-500" />
              <span>{formatDate(blog.date)}</span>
            </div>
          </div>

          <div className="pt-4">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100"
            />
          </div>

          <div className="prose prose-lg max-w-none pt-10">
            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
              {blog.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
