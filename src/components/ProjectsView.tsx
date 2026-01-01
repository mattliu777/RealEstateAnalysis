'use client'

import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import type { Project } from '@/types/project'
import { useLanguage } from './LanguageProvider'

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.15 },
  },
}

type Props = {
  projects: Project[]
}

// 项目列表：读取 JSON 数据并配合动效展示
export default function ProjectsView({ projects }: Props) {
  const { copy } = useLanguage()

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mx-auto max-w-6xl px-4 py-16 text-[var(--foreground)]"
    >
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">{copy.projects.subtitle}</p>
        <h1 className="text-4xl font-bold">{copy.projects.title}</h1>
        <p className="text-[var(--muted)]">{copy.projects.description}</p>
      </div>

      <motion.div
        variants={containerVariants}
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} p={project} />
        ))}
      </motion.div>
    </motion.section>
  )
}
