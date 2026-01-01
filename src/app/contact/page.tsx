'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SubmitButton } from '@/components/SubmitButton'
import { useLanguage } from '@/components/LanguageProvider'

// 各模块共享的动效配置
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { copy, language } = useLanguage()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLoading(false)
    setSent(true)
  }

  // 联系方式统计卡片
  const infoBlocks = [
    { label: copy.badges.projects, value: '28+' },
    { label: copy.badges.communities, value: '12' },
    { label: copy.badges.uptime, value: language === 'en' ? '48h SLA' : '48 小时响应' },
  ]

  return (
    <motion.section
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.12 }}
      className="mx-auto grid max-w-6xl gap-8 px-4 py-16 text-[var(--foreground)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      {/* 左侧简介 */}
      <motion.div variants={cardVariants} className="space-y-6">
        <p className="inline-flex items-center rounded-full border border-[var(--border-color)] px-3 py-1 text-xs uppercase tracking-widest text-[var(--muted)]">
          {copy.contact.description}
        </p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{copy.contact.title}</h1>
        <p className="text-lg text-[var(--muted)]">
          {copy.hero.subtitle}
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {infoBlocks.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-5 text-center shadow-sm"
            >
              <div className="text-2xl font-semibold text-[var(--accent)]">{item.value}</div>
              <div className="text-xs text-[var(--muted)]">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 右侧表单 */}
      <motion.div
        variants={cardVariants}
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-lg"
      >
        {sent ? (
          // 提交成功状态
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] p-4 text-3xl">
              ✅
            </div>
            <h2 className="text-2xl font-semibold">{copy.contact.successTitle}</h2>
            <p className="text-[var(--muted)]">{copy.contact.successBody}</p>
            <button
              onClick={() => setSent(false)}
              className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)]"
            >
              {copy.contact.reset}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold">{copy.contact.name}</label>
              <input
                type="text"
                name="name"
                required
                placeholder={copy.contact.placeholderName}
                className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">{copy.contact.email}</label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">{copy.contact.message}</label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder={copy.contact.placeholderMessage}
                className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
              />
            </div>

            <SubmitButton
              idleLabel={copy.contact.submit}
              loadingLabel={copy.contact.submitting}
              isLoading={loading}
            />
          </form>
        )}
      </motion.div>
    </motion.section>
  )
}
