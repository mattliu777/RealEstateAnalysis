// src/components/ThemeToggle.tsx
'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'

type Theme = 'light' | 'dark'

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }
  const saved = window.localStorage.getItem('theme') as Theme | null
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

// 主题切换按钮：同步 data-theme + localStorage
function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme())
  const { language, copy } = useLanguage()

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return
    }
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  function toggle() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const themeText =
    theme === 'dark'
      ? language === 'en'
        ? 'Dark'
        : '深色'
      : language === 'en'
        ? 'Light'
        : '浅色'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={copy.nav.themeLabel}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)]"
    >
      <span
        aria-hidden="true"
        className="text-lg"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
      {themeText}
    </button>
  )
}

export default ThemeToggle
export { ThemeToggle }
