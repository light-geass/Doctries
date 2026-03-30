'use client'

export const dynamic = "force-dynamic"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchScanResults } from '@/features/results/resultsSlice'
import { addNotification } from "@/features/ui/uiSlice"
import { 
  ClipboardDocumentCheckIcon, 
  CalendarIcon, 
  ChevronRightIcon,
  BeakerIcon,
  DocumentMagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import Skeleton from "@/components/Skeleton"

const ResultsPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.patients)
  const { items, status, error } = useSelector((state) => state.results)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchScanResults(user.id))
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    if (error) {
      dispatch(addNotification({ type: "error", message: error }))
    }
  }, [error, dispatch])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="w-20 h-6 rounded-full" />
              </div>
              <Skeleton className="w-3/4 h-6 rounded-md" />
              <Skeleton className="w-1/2 h-4 rounded-md" />
              <Skeleton className="w-full h-24 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Diagnostic History</h1>
            <p className="mt-2 text-slate-500 font-medium">Manage and review your AI-powered medical scan reports.</p>
          </div>
          <Link 
            href="/scan-upload" 
            className="btn-primary h-12 px-6 rounded-2xl shadow-xl shadow-blue-200 justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Scan Analysis
          </Link>
        </div>

        {/* Results Grid / List */}
        {items.length === 0 ? (
          <div className="bg-white rounded-[32px] p-24 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <DocumentMagnifyingGlassIcon className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No reports found</h2>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              You haven't uploaded any medical scans for analysis yet. Start by uploading your first scan.
            </p>
            <Link 
              href="/scan-upload" 
              className="mt-8 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Analyze your first scan <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((result) => (
              <Link 
                key={result.id} 
                href={`/results/${result.id}`}
                className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-colors">
                    <BeakerIcon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Confidence {Math.round(result.confidence)}%</span>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {result.diagnosis}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {dayjs(result.created_at).format('MMM DD, YYYY')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <img 
                      src={result.scans?.file_url} 
                      alt="Scan Thumbnail" 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100" 
                    />
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      SCAN TYPE<br/>
                      <span className="text-slate-900 text-xs">{result.scans?.file_type?.toUpperCase() || 'IMAGE'}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <ChevronRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-16 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Trusted by 50,000+ patients and verified by 200+ specialist doctors.
            </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
