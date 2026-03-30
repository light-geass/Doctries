import React from 'react'
import Link from 'next/link'
import { ArrowRightIcon, ShieldCheckIcon, BeakerIcon, DocumentMagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline'

const HomeMeet = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50 pt-16 sm:pt-24 lg:pt-32 pb-20">
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-300 to-cyan-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-600 mb-8 fade-in">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 pulse"></span>
            Powered by Next-Gen AI
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
            Your Intelligent <br className="hidden sm:block" />
            <span className="gradient-text">Healthcare Assistant</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
            Upload medical scans and get instant, AI-driven diagnostic insights. Secure, fast, and designed to help you make informed health decisions alongside your doctor.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6 fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/scan-upload">
              <button className="btn-primary text-base px-6 py-3">
                Upload Scan Now
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/results" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1">
              View Past Results <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mx-auto mt-24 max-w-2xl sm:mt-32 lg:mt-40 lg:max-w-none fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-4">
            
            <div className="card p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <DocumentMagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Scan Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Advanced AI models analyze your X-rays and MRIs to detect potential anomalies in seconds.</p>
            </div>

            <div className="card p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Your medical data and history are encrypted and securely stored using InsForge infrastructure.</p>
            </div>

            <div className="card p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <BeakerIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Diagnosis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Our AI considers your personal medical history alongside scans to provide highly contextual insights.</p>
            </div>

            <div className="card p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connect with Doctors</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Easily share your AI-generated reports with certified professionals for a confirmed diagnosis.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeMeet;
