import React from 'react'
import Link from 'next/link'

const HomeMeet = () => {
  return (
    <div className="relative overflow-hidden pt-10 pb-24 lg:pt-20 lg:pb-32 perspective-1000 transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Decorative Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] blur-xl animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-tr from-cyan-400/30 to-blue-600/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] rounded-full blur-[120px] opacity-40" style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent)' }} />
      
      <div className="mx-auto max-w-[1440px] px-8 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md shadow-lg text-[13px] font-bold tracking-wide mb-10 transition-all hover:scale-105 active:scale-95" style={{ 
              background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
              border: '1px solid var(--border)'
            }}>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              </div>
              <span style={{ color: 'var(--text-muted)' }} className="uppercase">Powered by Next-Gen AI</span>
            </div>

            <h1 className="text-[48px] lg:text-[60px] font-extrabold leading-[1.1] tracking-tight mb-8" style={{ color: 'var(--text)' }}>
              Your Intelligent <br />
              <span className="gradient-text">Healthcare Assistant</span>
            </h1>

            <p className="text-[18px] leading-relaxed mb-12 max-w-xl" style={{ color: 'var(--text-muted)' }}>
              Upload medical scans and get instant, AI-driven diagnostic insights. Secure, Fast, and designed to help you make informed health decisions alongside your doctor.
            </p>
            
            <div className="flex flex-wrap items-center gap-8">
              <Link href="/scan-upload" className="group relative overflow-hidden rounded-xl">
                <button className="btn-primary py-4 px-10 text-base shadow-xl active:scale-95 flex items-center gap-3 relative overflow-hidden">
                  <div className="scan-line" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg shadow-inner group-hover:rotate-180 transition-transform duration-500 ease-in-out">
                      <svg className="w-5 h-5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                    </div>
                    Upload Scan Now
                  </div>
                </button>
              </Link>
              <Link href="/results" className="text-[15px] font-bold transition-colors group" style={{ color: 'var(--text)' }}>
                View Past Results <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:scale-110">→</span>
              </Link>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-2 gap-6 perspective-1000 relative">
            <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            
            <div className="glass-3d p-8 lg:p-10 rounded-[32px] lg:rounded-[40px] tilt-3d transition-all duration-500 hover:shadow-cyan-500/20">
              <h2 className="text-[32px] lg:text-[40px] font-black text-cyan-400 mb-1 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">98%</h2>
              <p className="text-[12px] lg:text-[14px] font-bold leading-tight" style={{ color: 'var(--text-muted)' }}>Diagnostic Accuracy</p>
            </div>

            <div className="glass-3d p-8 lg:p-10 rounded-[32px] lg:rounded-[40px] tilt-3d mt-8 lg:mt-12 transition-all duration-500 hover:shadow-blue-500/20">
              <h2 className="text-[32px] lg:text-[40px] font-black text-blue-500 mb-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">4</h2>
              <p className="text-[12px] lg:text-[14px] font-bold leading-tight" style={{ color: 'var(--text-muted)' }}>AI Agents</p>
            </div>

            <div className="glass-3d p-8 lg:p-10 rounded-[32px] lg:rounded-[40px] tilt-3d -mt-8 lg:-mt-12 transition-all duration-500 hover:shadow-blue-500/20">
              <h2 className="text-[32px] lg:text-[40px] font-black text-blue-500 mb-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">13+</h2>
              <p className="text-[12px] lg:text-[14px] font-bold leading-tight" style={{ color: 'var(--text-muted)' }}>Specialists</p>
            </div>

            <div className="glass-3d p-8 lg:p-10 rounded-[32px] lg:rounded-[40px] tilt-3d transition-all duration-500 hover:shadow-cyan-500/20">
              <h2 className="text-[32px] lg:text-[40px] font-black text-cyan-400 mb-1 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">&lt;30s</h2>
              <p className="text-[12px] lg:text-[14px] font-bold leading-tight" style={{ color: 'var(--text-muted)' }}>Analysis Time</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HomeMeet;
