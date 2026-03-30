"use client";
import React from "react";
import HomeSectionHeader from "./HomeSectionHeader";
import Link from "next/link";

const featuredArticles = [
  {
    tag: "AI Research",
    title: "How AI is Revolutionizing Medical Imaging Diagnostics",
    excerpt: "Large language models and vision AI are now capable of analyzing X-rays, CT scans, and MRIs with radiologist-level accuracy...",
    date: "March 15, 2025",
    readTime: "5 min read",
    color: "from-blue-600 to-indigo-600",
  },
  {
    tag: "Patient Care",
    title: "The Benefits of Remote Health Monitoring for Chronic Patients",
    excerpt: "Continuous remote monitoring allows physicians to detect anomalies early, reducing hospital readmissions by up to 35%...",
    date: "March 10, 2025",
    readTime: "4 min read",
    color: "from-cyan-500 to-blue-600",
  },
  {
    tag: "Technology",
    title: "Secure Medical Data: How InsForge Powers Doctris",
    excerpt: "Patient data security is at the core of our platform. We use end-to-end encryption backed by InsForge's enterprise-grade BaaS...",
    date: "March 5, 2025",
    readTime: "3 min read",
    color: "from-emerald-500 to-teal-600",
  },
];

const HomeBlogs = () => {
  return (
    <div className="px-6 md:px-12 lg:px-24 pb-24 bg-white">
      <HomeSectionHeader
        tag="Insights"
        title="Latest Health Articles"
        description="Stay updated with the latest advancements in AI-powered healthcare, medical research, and patient wellness."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {featuredArticles.map((blog, index) => (
          <div
            key={index}
            className="card group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient visual banner */}
            <div className={`h-44 bg-gradient-to-br ${blog.color} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <span className="text-white font-extrabold text-4xl opacity-30 select-none rotate-[-8deg]">{blog.tag}</span>
              <div className="absolute top-4 left-4">
                <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30">
                  {blog.tag}
                </span>
              </div>
            </div>

            <div className="p-7 flex flex-col flex-grow">
              <div className="flex items-center gap-3 mb-4 text-xs text-slate-400 font-medium">
                <span>{blog.date}</span>
                <span>·</span>
                <span>{blog.readTime}</span>
              </div>
              <h3 className="font-bold text-xl text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                {blog.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 cursor-pointer group/link w-fit">
                <span className="border-b-2 border-transparent group-hover/link:border-blue-600 transition-all">Read article</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBlogs;
