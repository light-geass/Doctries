'use client'

export const dynamic = "force-dynamic"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchScanResults } from '@/features/results/resultsSlice'
import { addNotification } from "@/features/ui/uiSlice"
import { 
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
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 rounded-3xl space-y-4">
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text)' }}>AI Diagnostic History</h1>
            <p className="mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>Manage and review your AI-powered medical scan reports.</p>
          </div>
          <Link 
            href="/scan-upload" 
            className="btn-primary h-12 px-6 rounded-2xl shadow-xl shadow-blue-200 justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Scan Analysis
          </Link>
        </div>

        {/* Results Grid */}
        {items.length === 0 ? (
          <div className="card rounded-[32px] p-24 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--surface-2)' }}>
              <DocumentMagnifyingGlassIcon className="h-10 w-10" style={{ color: 'var(--text-light)' }} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>No reports found</h2>
            <p className="mt-2 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              You haven&apos;t uploaded any medical scans for analysis yet. Start by uploading your first scan.
            </p>
            <Link 
              href="/scan-upload" 
              className="mt-8 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Analyze your first scan <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
            {items.map((result) => (
              <Link 
                key={result.id} 
                href={`/results/${result.id}`}
                className="group glass-3d rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 transform tilt-3d"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-colors" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#60a5fa' }}>
                    <BeakerIcon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full animate-float" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Confidence {Math.round(result.confidence)}%</span>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-1" style={{ color: 'var(--text)' }}>
                    {result.diagnosis}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-light)' }}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {dayjs(result.created_at).format('MMM DD, YYYY')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={result.scans?.file_url} 
                      alt="Scan Thumbnail" 
                      className="w-10 h-10 rounded-xl object-cover" 
                      style={{ border: '1px solid var(--border)' }}
                    />
                    <div className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: 'var(--text-light)' }}>
                      SCAN TYPE<br/>
                      <span className="text-xs" style={{ color: 'var(--text)' }}>{result.scans?.file_type?.toUpperCase() || 'IMAGE'}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:text-blue-600 transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--text-light)' }}>
                    <ChevronRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-light)' }}>
                Trusted by 50,000+ patients and verified by 200+ specialist doctors.
            </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
