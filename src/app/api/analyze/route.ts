import { NextResponse, type NextRequest } from 'next/server'
import { generateMarketNarrative } from '@/lib/ai'
import type { AnalysisPayload } from '@/types/data'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as AnalysisPayload
    if (!payload?.metrics || !payload?.samples) {
      return NextResponse.json({ error: '缺少必要字段 metrics / samples' }, { status: 400 })
    }

    const analysis = await generateMarketNarrative(payload)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('AI analysis failed', error)
    return NextResponse.json({ error: '生成分析失败，请稍后再试。' }, { status: 500 })
  }
}
