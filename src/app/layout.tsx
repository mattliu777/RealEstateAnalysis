// src/app/layout.tsx
import './globals.css'
import Script from 'next/script'
import type { Metadata } from 'next'
import React from 'react'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from '@/components/LanguageProvider'
import SiteChrome from '@/components/SiteChrome'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://real-estate-market-lab.example.com'),
  title: {
    template: '%s | Real Estate Market Lab',
    default: '房地产市调仪表盘',
  },
  description:
    'Upload Chinese Excel survey files, normalize multi-sheet monthly data, visualize with Recharts, and auto-generate Chinese market insights via OpenAI.',
  keywords: ['Real estate', 'Excel parsing', 'Next.js', 'Recharts', 'OpenAI', '市场研判'],
  authors: [{ name: 'Market Intelligence' }],
  creator: 'Market Intelligence',
  openGraph: {
    title: '房地产市调仪表盘',
    description:
      'Upload Excel survey files, visualize monthly performance, and get AI-generated Chinese analysis.',
    url: 'https://real-estate-market-lab.example.com',
    siteName: 'Real Estate Market Lab',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Real estate market lab preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@market-lab',
    title: '房地产市调仪表盘',
    description:
      'Upload Excel survey files, visualize monthly performance, and get AI-generated Chinese analysis.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      zh: '/?lang=zh',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 初始化主题，避免首次渲染闪烁 */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            var theme = localStorage.getItem('theme');
            if (theme === 'light' || theme === 'dark') {
              document.documentElement.setAttribute('data-theme', theme);
            }
          } catch (error) {}
        `}</Script>
      </head>

      <body
        suppressHydrationWarning
        className={`${sans.variable} ${mono.variable} flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)]`}
      >
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  )
}
