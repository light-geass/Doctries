'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { loginPatient } from '@/features/patients/patientsSlice'
import { addNotification } from '@/features/ui/uiSlice'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await dispatch(loginPatient({
      email: formData.email,
      password: formData.password,
    }))

    if (loginPatient.rejected.match(result)) {
      dispatch(addNotification({ type: 'error', message: result.payload || 'Login failed' }))
      setLoading(false)
      return
    }

    dispatch(addNotification({ type: 'success', message: 'Welcome back! Redirecting...' }))
    setTimeout(() => router.push('/profile'), 1200)

    setLoading(false)
  }


  return (
    <div className='min-h-screen flex flex-col md:flex-row' style={{ backgroundColor: 'var(--bg)' }}>
      
      {/* Left visual panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <img src="/logo-icon.png" alt="Doctris" className="h-5 w-5 object-contain brightness-0 invert" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Doctris</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">Your Health,<br/>Powered by AI.</h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Upload medical scans and receive instant AI-powered diagnostic insights alongside certified specialist care.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: "AI Accuracy", value: "99.2%" },
              { label: "Patients Served", value: "50K+" },
              { label: "Specialists", value: "200+" },
              { label: "Avg. Report Time", value: "<60s" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-xs relative z-10">© 2025 Doctris AI. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className='md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 fade-in'>
        
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-12 md:hidden">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <img src="/logo-icon.png" alt="Doctris" className="h-5 w-5 object-contain brightness-0 invert" />
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>Doctris</span>
        </Link>

        <div className="mb-10">
          <h2 className='text-3xl font-extrabold tracking-tight' style={{ color: 'var(--text)' }}>Welcome back</h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Sign in to access your health dashboard.</p>
        </div>


        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 text-slate-400 pointer-events-none" />
              <input
                type='email'
                name='email'
                value={formData.email}
                placeholder='you@example.com'
                onChange={handleChange}
                required
                className='input-field input-with-icon'
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 text-slate-400 pointer-events-none" />
              <input
                type='password'
                name='password'
                value={formData.password}
                placeholder='Your secure password'
                onChange={handleChange}
                required
                className='input-field input-with-icon'
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link href='/forgot-password' className='text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline'>
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            className='btn-primary w-full h-13 text-base justify-center mt-2'
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner w-5 h-5 border-[3px] border-white/30 border-t-white"></div> Signing in...</>
            ) : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className='mt-8 text-center text-sm text-slate-500'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='font-bold text-blue-600 hover:underline'>
            Create one free
          </Link>
        </p>

        <div className="mt-12 pt-8 flex justify-center items-center gap-2 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-light)' }}>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <span>Secured & powered by</span>
          <span className="font-bold text-slate-500">InsForge</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
