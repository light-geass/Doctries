'use client'

import { useEffect, useState } from 'react'

const THEME_KEY = 'doctris-theme'

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

export default function ThemeToggle({ mobile = false }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
      applyTheme(stored)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = prefersDark ? 'dark' : 'light'
    setTheme(initial)
    applyTheme(initial)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
  }

  const isDark = theme === 'dark'

  if (mobile) {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className="w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3"
        style={{ color: 'var(--text)' }}
      >
        <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 active:scale-90"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(99, 102, 241, 0.15))'
          : 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(139, 92, 246, 0.08))',
        border: `1px solid var(--border)`,
        boxShadow: isDark ? '0 0 20px rgba(34, 211, 238, 0.1)' : 'var(--shadow-sm)',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}