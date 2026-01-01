'use client'

import Link from 'next/link'
import React from 'react'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { useLanguage } from './LanguageProvider'

// 站点外壳：包含导航、主体插槽、页脚
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const { copy } = useLanguage()

  const navItems = [
    { href: '/#upload', label: copy.nav.home },
    { href: '/#analysis', label: copy.nav.projects },
    { href: '/#how-to', label: copy.nav.about },
  ]

  return (
    <>
      {/* 顶部导航，粘性定位方便移动端访问 */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[color-mix(in_oklab,var(--card-bg)_92%,transparent)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-[var(--accent)]">
            Real Estate Market Lab
          </Link>

          <nav className="flex flex-1 flex-wrap items-center justify-end gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-[var(--foreground)]/85 transition hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
              >
                {item.label}
              </Link>
            ))}

            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* 主体内容区域 */}
      <main className="flex-1">{children}</main>

      {/* 页脚 */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-[var(--muted)]">
          {copy.footer}
        </div>
      </footer>
    </>
  )
}
