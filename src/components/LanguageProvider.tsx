'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// 所有页面可复用的中英文本
const translations = {
  en: {
    nav: {
      home: 'Dashboard',
      projects: 'AI Analysis',
      about: 'How to Use',
      contact: 'Support',
      languageLabel: 'Language',
      themeLabel: 'Theme',
    },
    dashboard: {
      badge: 'Excel → Insight',
      title: 'Real-estate market intelligence workspace',
      subtitle: 'Upload a multi-sheet Chinese Excel（如“经开区市调2025.12.2.xlsx”），auto-parse monthly data, visualize with Recharts, and let AI draft a Chinese market readout.',
      primaryCta: 'Upload Excel',
      secondaryCta: 'Load demo data',
    },
    hero: {
      badge: 'Frontend · Product-minded',
      title: 'Crafting immersive web experiences',
      subtitle: 'I ship modern interfaces with Next.js 16, React 19, TypeScript, and Tailwind CSS.',
      primaryCta: 'View Projects',
      secondaryCta: 'Get in Touch',
      highlights: ['7+ years in web engineering', '1B+ combined page views', 'Design systems advocate'],
    },
    homeStack: {
      title: 'Stack in focus',
      description: 'All UI is responsive, theme-aware, localized, and animated with Framer Motion.',
      items: [
        { title: 'Next.js 16', desc: 'Server + Client harmony' },
        { title: 'TypeScript', desc: 'End-to-end safety' },
        { title: 'Tailwind CSS', desc: 'Design tokens-first' },
      ],
    },
    about: {
      title: 'About Me',
      paragraphs: [
        'I am a product-focused frontend engineer who loves turning complex workflows into delightful journeys.',
        'From responsive marketing sites to data-heavy dashboards, I prototype quickly, iterate with design, and deliver polished experiences.',
      ],
      skillsTitle: 'Key focus areas',
      skills: ['Design systems', 'Accessibility', 'Performance tuning', 'Animations'],
    },
    projects: {
      title: 'Projects',
      description: 'Projects are sourced from src/data/projects.json so you can plug in your real work easily.',
      links: {
        details: 'Details',
        demo: 'Live demo',
        repo: 'Source code',
      },
      subtitle: 'Recent client & side projects',
    },
    projectDetails: {
      back: 'Back to projects',
      techStack: 'Tech stack',
      year: 'Year',
      links: 'Links',
    },
    contact: {
      title: 'Contact',
      description: 'Drop a line and I will respond within two business days.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      placeholderName: 'Your name',
      placeholderMessage: 'What would you like to build together?',
      submit: 'Send message',
      submitting: 'Sending…',
      reset: 'Send another message',
      successTitle: 'Thanks for reaching out!',
      successBody: 'Your note has been sent successfully. I will get back to you soon.',
    },
    footer: 'Designed and coded in Next.js · Hosted on Vercel',
    badges: {
      projects: 'Projects shipped',
      communities: 'Communities mentored',
      uptime: 'Availability',
    },
  },
  zh: {
    nav: {
      home: '首页',
      projects: 'AI 研判',
      about: '使用说明',
      contact: '支持',
      languageLabel: '语言',
      themeLabel: '主题',
    },
    dashboard: {
      badge: '市场研判 · 自动化',
      title: '地产月度市调智能分析台',
      subtitle:
        '上传多 Sheet 的中文 Excel（如“经开区市调2025.12.2.xlsx”），自动解析月度数据、可视化，并调用 AI 输出中文市场分析。',
      primaryCta: '上传 Excel',
      secondaryCta: '加载示例数据',
    },
    hero: {
      badge: '前端 · 体验设计',
      title: '打造沉浸式 Web 体验',
      subtitle: '熟练使用 Next.js 16、React 19、TypeScript 与 Tailwind CSS 构建现代界面。',
      primaryCta: '查看项目',
      secondaryCta: '联系我',
      highlights: ['7 年+ Web 经验', '累计访问量超 10 亿', '热爱设计系统'],
    },
    homeStack: {
      title: '核心技术栈',
      description: '界面全面适配暗/亮模式、移动端与多语言，并通过 Framer Motion 提供顺滑动效。',
      items: [
        { title: 'Next.js 16', desc: 'Server + Client 一体化' },
        { title: 'TypeScript', desc: '类型安全端到端' },
        { title: 'Tailwind CSS', desc: '设计令牌驱动' },
      ],
    },
    about: {
      title: '关于我',
      paragraphs: [
        '我是一名注重产品体验的前端工程师，擅长把复杂流程打磨成令人愉悦的交互。',
        '无论是品牌官网还是数据密集的后台系统，我都能高效原型、与设计协作并交付高质量成品。',
      ],
      skillsTitle: '持续打磨的能力',
      skills: ['设计系统', '可访问性', '性能优化', '动效实现'],
    },
    projects: {
      title: '项目案例',
      description: '项目数据来自 src/data/projects.json，方便替换成你的真实案例。',
      links: {
        details: '详情',
        demo: '线上演示',
        repo: '源码',
      },
      subtitle: '最近的客户与个人项目',
    },
    projectDetails: {
      back: '返回项目列表',
      techStack: '技术栈',
      year: '年份',
      links: '链接',
    },
    contact: {
      title: '联系我',
      description: '欢迎留言，我会在两个工作日内回复。',
      name: '姓名',
      email: '邮箱',
      message: '留言内容',
      placeholderName: '请填写姓名',
      placeholderMessage: '想一起打造怎样的产品？',
      submit: '发送留言',
      submitting: '发送中…',
      reset: '再次发送',
      successTitle: '感谢你的来信！',
      successBody: '信息已成功发送，我会尽快与你联系。',
    },
    footer: '基于 Next.js 构建 · 部署在 Vercel',
    badges: {
      projects: '累计项目',
      communities: '指导社群',
      uptime: '可用性',
    },
  },
} as const

// 支持的语言类型与可复用副本类型
export type Language = keyof typeof translations
export type Copy = (typeof translations)[Language]

interface LanguageContextValue {
  language: Language
  copy: Copy
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const STORAGE_KEY = 'portfolio-language'
const LanguageContext = createContext<LanguageContextValue | null>(null)

function resolvePreferredLanguage(): Language {
  if (typeof window === 'undefined') return 'zh'
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null
  if (stored === 'en' || stored === 'zh') return stored
  return window.navigator.language.startsWith('zh') ? 'zh' : 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Hydration-safe default; update to preferred language after mount.
  const [language, setLanguage] = useState<Language>('zh')

  useEffect(() => {
    const preferred = resolvePreferredLanguage()
    setLanguage(preferred)
  }, [])

  // 每次切换语言时同步 html lang 与 LocalStorage
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return
    }
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hans'
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      copy: translations[language],
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === 'en' ? 'zh' : 'en')),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
