'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { logoutPatientAction } from '@/features/patients/patientsSlice'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state) => state.patients.user)
  const patient = useSelector((state) => state.patients.patient)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutPatientAction())
    router.push('/')
  }

  const displayName = patient?.first_name || user?.profile?.name || user?.email?.split('@')[0] || ''

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-blue-200 transition-shadow">
            <img src="/logo-icon.png" alt="Doctris" className="h-5 w-5 object-contain brightness-0 invert" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Doctris</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/results">
                <span className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer px-3 py-2">
                  Results
                </span>
              </Link>
              <Link href="/scan-upload">
                <button className="btn-primary text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  AI Scan
                </button>
              </Link>
              <Link href="/profile">
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{displayName}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors ml-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50">
                  Sign in
                </button>
              </Link>
              <Link href="/scan-upload">
                <button className="btn-primary text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Try AI Scan
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setMobileMenuOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-slate-900">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <XMarkIcon className="h-5 w-5 text-slate-600" />
            </button>
          </div>
          <div className="space-y-1">
            {navLinks.map((l) => (
              <Link key={l.name} href={l.href} className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {l.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/scan-upload" className="block px-4 py-3 rounded-xl text-blue-600 font-semibold hover:bg-blue-50" onClick={() => setMobileMenuOpen(false)}>AI Scan</Link>
                <Link href="/results" className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50" onClick={() => setMobileMenuOpen(false)}>Results</Link>
                <Link href="/profile" className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors mt-2">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="block px-4 py-3 rounded-xl text-blue-600 font-semibold hover:bg-blue-50" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
