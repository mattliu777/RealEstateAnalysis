'use client'

import { useLanguage } from './LanguageProvider'

// 简洁的语言切换按钮，显示当前语言并可一键切换
export default function LanguageToggle() {
  const { language, toggleLanguage, copy } = useLanguage()

  return (
    <button
      type="button"
      aria-label={copy.nav.languageLabel}
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)]"
    >
      <span className="font-semibold uppercase tracking-wide">{language === 'en' ? 'EN' : '中文'}</span>
    </button>
  )
}
