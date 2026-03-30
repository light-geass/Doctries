'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { addNotification } from '@/features/ui/uiSlice'
import { useRouter } from 'next/navigation'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const RegisterPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await dispatch(registerPatient({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    }))

    if (registerPatient.rejected.match(result)) {
      dispatch(addNotification({ type: 'error', message: result.payload || 'Registration failed' }))
      setLoading(false)
      return
    }

    const { payload } = result
    if (payload?.requireEmailVerification) {
      dispatch(addNotification({ type: 'success', message: 'Account created! Please verify your email.' }))
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      }, 1500)
    } else {
      dispatch(addNotification({ type: 'success', message: 'Account created successfully!' }))
      setTimeout(() => router.push('/login'), 1500)
    }

    setLoading(false)
  }


  return (
    <div className='min-h-screen bg-slate-50 flex flex-col md:flex-row'>

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
          <h1 className="text-4xl font-extrabold leading-tight">Join Thousands of<br/>Healthy Patients.</h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Create your free account today and get instant access to AI-powered medical scan analysis and specialist consultations.
          </p>
          <div className="space-y-4 pt-4">
            {[
              { icon: "✅", text: "Free AI scan analysis included" },
              { icon: "🔒", text: "End-to-end encrypted health data" },
              { icon: "🩺", text: "Connect with certified specialists" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-blue-100 font-medium">{item.text}</span>
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
          <span className="text-xl font-bold text-slate-900">Doctris</span>
        </Link>

        <div className="mb-10">
          <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight'>Create your account</h2>
          <p className="text-slate-500 mt-2">Start your journey to better health in seconds.</p>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-medium border fade-in ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input type="text" name="firstName" value={formData.firstName} placeholder='First' onChange={handleChange} required className="input-field pl-11" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} placeholder='Last' onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input type="email" name="email" value={formData.email} placeholder='you@example.com' onChange={handleChange} required className="input-field pl-11" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input type="password" name="password" value={formData.password} placeholder='Minimum 6 characters' onChange={handleChange} required minLength={6} className="input-field pl-11" />
            </div>
          </div>

          <button
            type='submit'
            className="btn-primary w-full h-13 text-base justify-center mt-2"
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner w-5 h-5 border-[3px] border-white/30 border-t-white"></div> Creating Account...</>
            ) : 'Create Free Account'}
          </button>
        </form>

        <p className='mt-8 text-center text-sm text-slate-500'>
          Already have an account?{' '}
          <Link href="/login" className='font-bold text-blue-600 hover:underline'>
            Sign in →
          </Link>
        </p>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center items-center gap-2 text-xs text-slate-400">
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <span>Secured & powered by</span>
          <span className="font-bold text-slate-500">InsForge</span>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
