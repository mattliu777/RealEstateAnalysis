import OpenAI from 'openai'
import type { AnalysisPayload } from '@/types/data'

function buildPrompt({ metrics, samples, locale = 'zh' }: AnalysisPayload) {
  const topDistricts = metrics.districts.slice(0, 4)
  const topProducts = metrics.productTypes.slice(0, 4)
  const sampleProjects = samples.slice(0, 5).map((r) => r.project || r.district || '未命名项目')

  const baseIntro =
    locale === 'zh'
      ? '你是地产研究分析师，请基于提供的月度成交数据给出中文市场解读。避免夸张语气，保持简洁。'
      : 'You are a real-estate research analyst. Write a concise market summary in Chinese based on the provided monthly transaction data.'

  return [
    { role: 'system' as const, content: baseIntro },
    {
      role: 'user' as const,
      content: [
        `时间范围：${metrics.months.join(' / ') || '未标注'}`,
        `累计成交套数：${metrics.totalUnits.toFixed(0)}，预估成交额：¥${metrics.totalRevenue.toFixed(0)}`,
        `均价（去极值后简化平均）：¥${metrics.avgPrice.toFixed(0)} / ㎡`,
        `主力板块：${topDistricts.map((d) => `${d.name}（¥${d.revenue.toFixed(0)}）`).join('，') || '未标注'}`,
        `主力产品：${topProducts.map((p) => `${p.name}（${p.units} 套）`).join('，') || '未标注'}`,
        `样本项目：${sampleProjects.join('，')}`,
        '请输出三部分：1) 市场总体走势与节奏；2) 区域/产品表现亮点与风险；3) 下一步建议（如价格策略、推盘节奏、去化建议）。',
      ].join('\n'),
    },
  ]
}

export async function generateMarketNarrative(payload: AnalysisPayload): Promise<string> {
  const prompt = buildPrompt(payload)

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

  if (!apiKey) {
    return [
      '未检测到 DEEPSEEK_API_KEY，使用本地占位分析：',
      `• 时间覆盖：${payload.metrics.months.join(' / ') || '未标注'}`,
      `• 预估成交额：¥${payload.metrics.totalRevenue.toFixed(0)}，均价约 ¥${payload.metrics.avgPrice.toFixed(0)} / ㎡`,
      '• 请在 .env.local 填写 DEEPSEEK_API_KEY 后重试，将得到更完整的中文分析。',
    ].join('\n')
  }

  const client = new OpenAI({ apiKey, baseURL })
  const completion = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: prompt,
    temperature: 0.4,
  })

  return completion.choices[0]?.message?.content?.trim() || '未能生成分析，请稍后重试。'
}
