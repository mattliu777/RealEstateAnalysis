'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/types/project'
import { useLanguage } from './LanguageProvider'

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type Props = {
  project: Project
}

// 单个项目详情视图：展示年份、标签、外链
export default function ProjectDetail({ project }: Props) {
  const { copy } = useLanguage()

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={fade}
      className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-[var(--foreground)]"
    >
      <Link href="/projects" className="inline-flex items-center text-sm font-semibold text-[var(--accent)]">
        {'<-'} {copy.projectDetails.back}
      </Link>

      <div className="space-y-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-lg">
        {project.thumbnail && (
          <div className="relative overflow-hidden rounded-2xl [aspect-ratio:16/9]">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 800px"
            />
          </div>
        )}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
            <span>
              {copy.projectDetails.year}: {project.year}
            </span>
            <span>•</span>
            <span>{project.tech.join(' · ')}</span>
          </div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="text-lg text-[var(--muted)]">{project.summary}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            {copy.projectDetails.techStack}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {(project.repo || project.demo) && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              {copy.projectDetails.links}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {project.demo && project.demo !== '#' && (
                <a
                  className="text-[var(--accent)] underline"
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {copy.projects.links.demo}
                </a>
              )}
              {project.repo && (
                <a
                  className="text-[var(--accent)] underline"
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {copy.projects.links.repo}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  )
}
