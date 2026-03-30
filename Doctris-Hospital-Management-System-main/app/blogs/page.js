'use client'

import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "@/features/blogs/blogsSlice";
import Skeleton from "@/components/Skeleton";
import HomeSectionHeader from "@/components/HomeSectionHeader";
import HomeBlogsCard from "@/components/HomeBlogsCard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomeBlogs = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: blogs, status, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [status, dispatch]);

  const loading = status === "loading" || status === "idle";

  return (
    <div className="px-4 md:px-10 lg:px-20 py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <HomeSectionHeader
          tag="Health Insights"
          title="Latest News & Medical Blogs"
          description="Stay informed with expert opinions and the latest breakthroughs in healthcare technology."
        />

        {error && (
            <div className="mt-8 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-sm font-medium">
                Error loading blogs: {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm space-y-4">
                <Skeleton className="w-full h-56 rounded-2xl" />
                <div className="p-4 space-y-3">
                  <Skeleton className="w-1/4 h-3" />
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-full h-12" />
                </div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => router.push(`/blogs/${blog.id}`)}
                className="cursor-pointer group"
              >
                <HomeBlogsCard
                  image={blog.image_url}
                  date={blog.date}
                  time={blog.time}
                  desc={blog.description}
                  title={blog.title}
                  author={blog.author}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium italic">No blogs available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeBlogs;
