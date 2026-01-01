'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/components/LanguageProvider'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

const experiences = [
  {
    period: '2021 — Present',
    title: { en: 'Lead Frontend · Remote Fintech', zh: '前端负责人 · 远程金融科技' },
    summary: {
      en: 'Scaled a design system used by seven product teams and migrated dashboards to React Server Components.',
      zh: '主导统一设计系统，服务 7 个产品团队，并将核心后台迁移到 React 服务器组件架构。',
    },
  },
  {
    period: '2018 — 2021',
    title: { en: 'Senior Engineer · SaaS Startup', zh: '高级工程师 · SaaS 创业公司' },
    summary: {
      en: 'Built marketing experiences, analytics surfaces, and growth experiments powered by Next.js.',
      zh: '负责官网、分析看板与增长实验，打造高性能的 Next.js 体验。',
    },
  },
]

export default function AboutPage() {
  const { copy, language } = useLanguage()

  return (
    <motion.section
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.15 }}
      className="mx-auto max-w-5xl space-y-12 px-4 py-16 text-[var(--foreground)]"
    >
      <motion.div variants={fadeUp} className="space-y-5">
        <p className="inline-flex items-center rounded-full border border-[var(--border-color)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          {copy.about.title}
        </p>
        {copy.about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg text-[var(--muted)]">
            {paragraph}
          </p>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid gap-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 md:grid-cols-2"
      >
        <div>
          <h2 className="text-2xl font-semibold">{copy.about.skillsTitle}</h2>
          <ul className="mt-4 space-y-3">
            {copy.about.skills.map((skill) => (
              <li key={skill} className="rounded-2xl border border-dashed border-[var(--border-color)] px-4 py-3">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Timeline
          </h3>
          <ol className="space-y-4 border-l border-[var(--border-color)] pl-5">
            {experiences.map((exp) => (
              <li key={exp.period} className="relative">
                <span className="absolute -left-5 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                <p className="text-xs uppercase text-[var(--muted)]">{exp.period}</p>
                <p className="text-lg font-semibold">
                  {language === 'en' ? exp.title.en : exp.title.zh}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {language === 'en' ? exp.summary.en : exp.summary.zh}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </motion.section>
  )
}
