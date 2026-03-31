'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { logoutPatientAction } from '@/features/patients/patientsSlice'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const user = useSelector((state) => state.patients.user)
  const patient = useSelector((state) => state.patients.patient)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutPatientAction())
    router.push('/')
  }

  const displayName = patient?.first_name || user?.profile?.name || user?.email?.split('@')[0] || ''

  return (
    <header className="sticky top-0 z-50 border-b transition-colors duration-300" style={{ 
      backgroundColor: 'var(--bg)', 
      borderColor: 'var(--border)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      background: 'color-mix(in srgb, var(--bg) 85%, transparent)'
    }}>
      <nav className="max-w-[1440px] mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.05] active:scale-95 group">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.716 4 2.015C12.454 3.716 13.943 3 15.5 3c2.786 0 5.25 2.322 5.25 5.25 0 3.924-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter transition-all" style={{ color: 'var(--text)' }}>Doctris</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.name}
                href={l.href}
                className={`px-5 py-2 text-[15px] font-black transition-all duration-300 relative group`}
                style={{ color: isActive ? 'var(--text)' : 'var(--text-muted)' }}
              >
                <span className="relative z-10">{l.name}</span>
                {isActive && (
                  <div 
                    className="absolute inset-0 rounded-xl shadow-lg"
                    style={{ 
                      background: 'var(--surface)', 
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  ></div>
                )}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-1/2"></div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-6 text-[15px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {user && (
              <Link href="/results" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text)' }}>
                Results
              </Link>
            )}
            <Link href="/scan-upload">
              <button className="btn-primary py-2.5 px-6 shadow-md hover:shadow-lg">
                <svg className="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
                AI Scan
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 pl-6 transition-transform" style={{ borderLeft: '1px solid var(--border)' }}>
            <ThemeToggle />
            {user ? (
              <Link href="/profile">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-md hover:scale-[1.05] active:scale-95 transition-all">
                  {displayName?.substring(0, 2).toUpperCase() || 'AM'}
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <button className="text-[15px] font-bold px-2 transition-colors" style={{ color: 'var(--text)' }}>
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button className="lg:hidden p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-80 shadow-2xl p-6 overflow-y-auto" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-1">
            {navLinks.map((l) => (
              <Link 
                key={l.name} 
                href={l.href} 
                className="block px-4 py-3 rounded-xl font-medium transition-colors"
                style={{ color: 'var(--text)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.name}
              </Link>
            ))}
            <ThemeToggle mobile />
            {user ? (
              <>
                <Link href="/scan-upload" className="block px-4 py-3 rounded-xl font-semibold" style={{ color: 'var(--accent)' }} onClick={() => setMobileMenuOpen(false)}>AI Scan</Link>
                <Link href="/results" className="block px-4 py-3 rounded-xl font-medium" style={{ color: 'var(--text)' }} onClick={() => setMobileMenuOpen(false)}>Results</Link>
                <Link href="/profile" className="block px-4 py-3 rounded-xl font-medium" style={{ color: 'var(--text)' }} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-500 font-medium transition-colors mt-2">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-3 rounded-xl font-medium" style={{ color: 'var(--text)' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="block px-4 py-3 rounded-xl font-semibold" style={{ color: 'var(--accent)' }} onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
