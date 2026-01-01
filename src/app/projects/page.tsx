// src/app/projects/page.tsx
import ProjectsView from '@/components/ProjectsView'
import { getAllProjects } from '@/lib/projects'

export const dynamic = 'force-static'
export const revalidate = false

export default function ProjectsPage() {
  const projects = getAllProjects()
  return <ProjectsView projects={projects} />
}
