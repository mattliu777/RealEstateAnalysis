'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/LanguageProvider'
import { buildMetrics } from '@/lib/metrics'
import type { Dataset, DatasetMetrics, ListingRecord } from '@/types/data'

type UploadResponse = Dataset & { metrics: DatasetMetrics }

const palette = ['#2563eb', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4', '#ef4444']

const demoRecords: ListingRecord[] = [
  {
    id: 'demo-1',
    month: '2025-01',
    city: '西安',
    district: '桥东区',
    project: '星河湾',
    productType: '高层',
    avgPrice: 14500,
    unitsSold: 120,
    area: 14500,
    revenue: 14500 * 120,
  },
  {
    id: 'demo-2',
    month: '2025-01',
    city: '西安',
    district: '桥西区',
    project: '曲江壹号',
    productType: '洋房',
    avgPrice: 19800,
    unitsSold: 68,
    area: 9800,
    revenue: 19800 * 68,
  },
  {
    id: 'demo-3',
    month: '2025-02',
    city: '西安',
    district: '高新区',
    project: '科技新城',
    productType: '写字楼',
    avgPrice: 16800,
    unitsSold: 54,
    area: 15000,
    revenue: 16800 * 54,
  },
  {
    id: 'demo-4',
    month: '2025-02',
    city: '西安',
    district: '经开区',
    project: '浐灞生态城',
    productType: '别墅',
    avgPrice: 32000,
    unitsSold: 12,
    area: 4600,
    revenue: 32000 * 12,
  },
  {
    id: 'demo-5',
    month: '2025-03',
    city: '西安',
    district: '桥东区',
    project: '未来里',
    productType: '公寓',
    avgPrice: 12500,
    unitsSold: 140,
    area: 16200,
    revenue: 12500 * 140,
  },
  {
    id: 'demo-6',
    month: '2025-03',
    city: '西安',
    district: '桥西区',
    project: '浐灞新岸',
    productType: '高层',
    avgPrice: 14200,
    unitsSold: 96,
    area: 11000,
    revenue: 14200 * 96,
  },
]

const demoDataset: UploadResponse = {
  records: demoRecords,
  sheets: [
    { name: '2025.01', month: '2025-01', rows: 2 },
    { name: '2025.02', month: '2025-02', rows: 2 },
    { name: '2025.03', month: '2025-03', rows: 2 },
  ],
  metrics: buildMetrics(demoRecords),
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '-'
  if (value >= 100000000) return `¥${(value / 100000000).toFixed(2)}亿`
  if (value >= 10000) return `¥${(value / 10000).toFixed(2)}万`
  return `¥${value.toLocaleString('zh-CN')}`
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString('zh-CN')
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint ? <div className="text-xs text-[var(--muted)]">{hint}</div> : null}
    </div>
  )
}

function DataTable({ rows }: { rows: ListingRecord[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-color)]">
      <div className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr_0.8fr] gap-3 bg-[var(--card-bg)] px-4 py-3 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
        <span>项目 / 区域</span>
        <span>月度</span>
        <span>产品</span>
        <span>均价</span>
        <span>套数</span>
      </div>
      <div className="divide-y divide-[var(--border-color)] bg-[var(--card-bg)]">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr_0.8fr] items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)]/90"
          >
            <div>
              <div className="font-semibold">{row.project || row.district || '未命名项目'}</div>
              <div className="text-xs text-[var(--muted)]">
                {[row.district, row.city].filter(Boolean).join(' · ')}
              </div>
            </div>
            <div className="text-[var(--muted)]">{row.month}</div>
            <div>{row.productType || '未标注'}</div>
            <div>{row.avgPrice ? `¥${row.avgPrice.toLocaleString('zh-CN')}` : '-'}</div>
            <div>{row.unitsSold ? `${row.unitsSold} 套` : '-'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Charts({
  metrics,
  dataset,
}: {
  metrics: DatasetMetrics
  dataset: Dataset
}) {
  const districtTop = metrics.districts.slice(0, 6)
  const priceBands = metrics.priceBands
  const productTypes = metrics.productTypes.slice(0, 6)

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Card title="月度走势">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.monthly}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={palette[0]} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={palette[0]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="成交额"
                stroke={palette[0]}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="价格带分布">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceBands}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="band" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Bar dataKey="count" name="项目数" radius={[6, 6, 0, 0]} fill={palette[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="重点板块（成交额）">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtTop} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--muted)" tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
              <YAxis dataKey="name" type="category" stroke="var(--muted)" />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="revenue" name="成交额" barSize={18} radius={[0, 8, 8, 0]}>
                {districtTop.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="产品结构">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productTypes}
                dataKey="units"
                nameKey="name"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
              >
                {productTypes.map((item, index) => (
                  <Cell key={item.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v} 套`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="数据来源">
        <div className="space-y-3">
          {dataset.sheets.map((sheet) => (
            <div
              key={sheet.name}
              className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] px-4 py-3"
            >
              <div>
                <div className="text-sm font-semibold">{sheet.name}</div>
                <div className="text-xs text-[var(--muted)]">推断月份：{sheet.month}</div>
              </div>
              <div className="rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-3 py-1 text-xs text-[var(--accent)]">
                {sheet.rows} 行
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function AnalysisPanel({
  analysis,
  onGenerate,
  generating,
  canGenerate,
}: {
  analysis: string
  generating: boolean
  canGenerate: boolean
  onGenerate: () => void
}) {
  return (
    <Card title="AI 市场研判">
      <div className="space-y-3">
        <p className="text-[var(--muted)] text-sm">
          自动汇总月度成交、板块表现与价格段结构，并产出中文市场研判。默认使用 OpenAI gpt-4o-mini，需在
          <code className="mx-1 rounded bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-2 py-1 text-xs">.env.local</code>
          配置 <code className="mx-1 rounded bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-2 py-1 text-xs">OPENAI_API_KEY</code>。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate || generating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? '生成中…' : '生成中文分析'}
          </button>
        </div>
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 text-sm leading-relaxed text-[var(--foreground)]/90 whitespace-pre-wrap">
          {analysis || '上传数据后，一键生成中文市场分析。'}
        </div>
      </div>
    </Card>
  )
}

export default function HomePage() {
  const { copy, language } = useLanguage()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasData = dataset && metrics
  const sampleRows = useMemo(() => (dataset ? dataset.records.slice(0, 8) : []), [dataset])

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const message = (await res.json().catch(() => ({}))).error || '上传失败'
        throw new Error(message)
      }
      const data = (await res.json()) as UploadResponse
      setDataset({ records: data.records, sheets: data.sheets })
      setMetrics(data.metrics)
      setAnalysis('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败')
    } finally {
      setUploading(false)
    }
  }

  async function runAnalysis() {
    if (!dataset || !metrics) return
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: language,
          metrics,
          samples: dataset.records.slice(0, 50),
        }),
      })
      if (!res.ok) {
        const message = (await res.json().catch(() => ({}))).error || '生成失败'
        throw new Error(message)
      }
      const data = (await res.json()) as { analysis: string }
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成分析失败')
    } finally {
      setAnalyzing(false)
    }
  }

  function loadDemo() {
    setDataset({ records: demoDataset.records, sheets: demoDataset.sheets })
    setMetrics(demoDataset.metrics)
    setAnalysis('')
    setError(null)
  }

  return (
    <div className="bg-[radial-gradient(circle_at_10%_20%,#dbeafe_0,transparent_24%),radial-gradient(circle_at_90%_10%,#e0f2fe_0,transparent_18%),var(--background)] text-[var(--foreground)]">
      <section id="upload" className="mx-auto max-w-6xl px-4 pb-10 pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              {copy.dashboard.badge}
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{copy.dashboard.title}</h1>
            <p className="max-w-2xl text-lg text-[var(--muted)]">{copy.dashboard.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('file-input')?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-hover)]"
              >
                {uploading ? '解析中…' : copy.dashboard.primaryCta}
              </button>
              <button
                type="button"
                onClick={loadDemo}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
              >
                {copy.dashboard.secondaryCta}
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                label="数据表"
                value={hasData ? `${dataset!.sheets.length} 张` : '—'}
                hint={hasData ? '自动探测月份与行数' : '支持一个 Excel 多张月度 sheet'}
              />
              <StatCard
                label="累计套数"
                value={hasData ? `${formatNumber(metrics!.totalUnits)} 套` : '—'}
                hint={hasData ? '汇总所有 sheet 套数' : '自动识别“套数/销量”列'}
              />
              <StatCard
                label="预估成交额"
                value={hasData ? formatCurrency(metrics!.totalRevenue) : '—'}
                hint={hasData ? '套数 × 均价快速估算' : '自动识别“均价”列'}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Excel 上传</div>
                <div className="text-lg font-semibold">.xlsx 或 .xls</div>
              </div>
              <div className="rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-3 py-1 text-xs text-[var(--accent)]">
                支持中文表头
              </div>
            </div>
            <label
              htmlFor="file-input"
              className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border-color)] bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] px-4 py-8 text-center transition hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]"
            >
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
              <div className="text-5xl">📊</div>
              <div className="text-base font-semibold text-[var(--foreground)]">
                拖拽或点击上传 Excel
              </div>
              <p className="max-w-sm text-sm text-[var(--muted)]">
                自动解析多张月度 Sheet，识别“项目/案名、区域、均价、套数、产品类型、面积”等常见中文表头。
              </p>
            </label>
            {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          </motion.div>
        </div>
      </section>

      {hasData ? (
        <section id="analysis" className="mx-auto max-w-6xl space-y-6 px-4 pb-16">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card title="指标快照">
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="平均价格" value={`¥${metrics!.avgPrice.toFixed(0)} / ㎡`} hint="去极值后的均值" />
                <StatCard
                  label="月度覆盖"
                  value={`${metrics!.months.length} 个月`}
                  hint={metrics!.months.join(' / ')}
                />
                <StatCard
                  label="最多成交板块"
                  value={metrics!.districts[0]?.name || '未标注'}
                  hint={formatCurrency(metrics!.districts[0]?.revenue || 0)}
                />
                <StatCard
                  label="主力产品"
                  value={metrics!.productTypes[0]?.name || '未标注'}
                  hint={`${metrics!.productTypes[0]?.units || 0} 套`}
                />
              </div>
            </Card>
            <AnalysisPanel
              analysis={analysis}
              onGenerate={runAnalysis}
              generating={analyzing}
              canGenerate={Boolean(hasData)}
            />
          </div>

          <Charts metrics={metrics!} dataset={dataset!} />

          <Card title="样本项目">
            <DataTable rows={sampleRows} />
          </Card>
        </section>
      ) : (
        <section id="analysis" className="mx-auto max-w-6xl px-4 pb-16">
          <Card title="如何使用">
            <ul className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
              <li>1) 上传含多个月份的 Excel，sheet 名如 “经开区市调2025.12.2”。</li>
              <li>2) 表头建议包含：项目/案名、区域/板块、均价、套数、产品类型、面积。</li>
              <li>3) 解析后自动生成成交额、价格带、板块/产品表现。</li>
              <li>4) 一键调用 AI 输出中文市场分析。</li>
            </ul>
          </Card>
        </section>
      )}

      <section id="how-to" className="mx-auto max-w-6xl px-4 pb-16">
        <Card title="导入与安全提示">
          <ul className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
            <li>• Excel 在服务器侧解析，字段未持久化；如需断网环境，可改为本地解析。</li>
            <li>• 支持常见中文表头：项目/案名、区域/板块、均价、套数、产品类型、面积。</li>
            <li>• Sheet 名含年月（如 2025.12）会自动推断月份；表内“月份/日期”列会覆盖推断值。</li>
            <li>• AI 文本生成调用 OpenAI；未配置密钥时会返回本地占位分析，便于联调。</li>
          </ul>
        </Card>
      </section>
    </div>
  )
}
