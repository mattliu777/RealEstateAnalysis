import { notFound } from 'next/navigation'
import ProjectDetail from '@/components/ProjectDetail'
import { getAllSlugs, getProjectBySlug } from '@/lib/projects'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
