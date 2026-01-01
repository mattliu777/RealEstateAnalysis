// 公用项目类型，项目数据来自 JSON 文件
export type Project = {
  id: string
  slug: string
  title: string
  summary: string
  tech: string[]
  year: number
  repo?: string
  demo?: string
  thumbnail?: string
}
