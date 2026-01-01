import raw from '@/data/projects.json'
import type { Project } from '@/types/project'

// 将 JSON 数据转成 Project 数组并做轻量校验
export function getAllProjects(): Project[] {
  const data = raw as Project[]
  return data
    .filter((project) => project.id && project.slug && project.title)
    .sort((a, b) => b.year - a.year)
}

// 根据 slug 获取单个项目（可扩展到动态路由）
export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug)
}

// 提供所有 slug，方便生成静态路径
export function getAllSlugs(): string[] {
  return getAllProjects().map((project) => project.slug)
}
