import { NextResponse, type NextRequest } from 'next/server'
import { parseWorkbook } from '@/lib/excel'
import { buildMetrics } from '@/lib/metrics'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: '缺少文件，请上传 Excel。' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const dataset = parseWorkbook(buffer)
    const metrics = buildMetrics(dataset.records)

    return NextResponse.json({ ...dataset, metrics })
  } catch (error) {
    console.error('Upload parsing failed', error)
    return NextResponse.json({ error: '解析失败，请确认 Excel 格式后重试。' }, { status: 500 })
  }
}
