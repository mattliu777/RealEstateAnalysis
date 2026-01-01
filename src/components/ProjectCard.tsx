'use client'
// src/components/ProjectCard.tsx

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Project } from '@/types/project'
import { useLanguage } from './LanguageProvider'

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

// 单个项目卡片：包含缩略图、简介、标签以及外部链接
export default function ProjectCard({ p }: { p: Project }) {
  const { copy } = useLanguage()

  return (
    <motion.article
      variants={cardVariants}
      className="w-full max-w-xl justify-self-center rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* 缩略图区域：保持 16:9 比例 */}
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-[var(--background)] [aspect-ratio:16/9]">
        {p.thumbnail ? (
          <Image
            src={p.thumbnail}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-[var(--muted)]">
            No Image
          </div>
        )}
      </div>

      {/* 文案区域 */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <span className="text-xs text-[var(--muted)]">{p.year}</span>
        </div>

        <p className="leading-relaxed text-[var(--foreground)]/80">{p.summary}</p>

        <div className="flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)] px-2 py-0.5 text-xs text-[var(--foreground)]/85"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link className="font-medium text-[var(--accent)] underline" href={`/projects/${p.slug}`}>
            {copy.projects.links.details}
          </Link>
          {p.demo && p.demo !== '#' && (
            <a
              className="text-[var(--foreground)]/80 underline"
              href={p.demo}
              target="_blank"
              rel="noreferrer noopener"
            >
              {copy.projects.links.demo}
            </a>
          )}
          {p.repo && (
            <a
              className="text-[var(--foreground)]/80 underline"
              href={p.repo}
              target="_blank"
              rel="noreferrer noopener"
            >
              {copy.projects.links.repo}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
